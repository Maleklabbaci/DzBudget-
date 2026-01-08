
import React, { useState, useEffect, useCallback } from 'react';
import { AppStep, UserData, BudgetCategory, Language, User, BudgetNotification, Gender, Expense } from './types';
import Questionnaire from './components/Questionnaire';
import BudgetTable from './components/BudgetTable';
import ExpenseTracker from './components/ExpenseTracker';
import MonthSummary from './components/MonthSummary';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { calculateBudget } from './services/budgetService';
import { formatCurrency, TRANSLATIONS } from './constants';

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin Chahryti',
    email: 'admin@dz.dz',
    password: 'admin',
    role: 'admin',
    subscriptionStatus: 'active',
    subscriptionExpiry: '2099-12-31'
  },
  {
    id: '2',
    name: 'Ahmed Boudiaf',
    email: 'user@dz.dz',
    password: 'user',
    role: 'user',
    subscriptionStatus: 'active',
    subscriptionExpiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [step, setStep] = useState<AppStep>(AppStep.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [notifications, setNotifications] = useState<BudgetNotification[]>([]);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [userData, setUserData] = useState<UserData>({
    answers: {},
    salary: 0,
    otherIncome: 0,
    budgetPlan: [],
    expenses: []
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS['fr'];
  const theme = userData.gender === 'woman' ? 'pink' : 'emerald';

  const reconcileSubscriptions = useCallback((usersList: User[]) => {
    const now = new Date();
    return (usersList || []).map(u => {
      if (u.role === 'admin') return u;
      const expiry = new Date(u.subscriptionExpiry);
      if (now > expiry && u.subscriptionStatus === 'active') {
        return { ...u, subscriptionStatus: 'expired' as const };
      }
      return u;
    });
  }, []);

  useEffect(() => {
    setAllUsers(prev => reconcileSubscriptions(prev));
  }, [reconcileSubscriptions]);

  const checkSubscription = (user: User): AppStep => {
    if (user.role === 'admin') return AppStep.ADMIN;
    const now = new Date();
    const expiry = new Date(user.subscriptionExpiry);
    if (user.subscriptionStatus !== 'active' || now > expiry) {
      return AppStep.PAUSED;
    }
    return AppStep.INTRO;
  };

  const handleLogin = (loginData: { email: string, password?: string }) => {
    const user = allUsers.find(u => u.email === loginData.email && u.password === loginData.password);
    if (!user) {
      setLoginError(t.loginError);
      return;
    }
    setLoginError(null);
    setCurrentUser(user);
    setStep(checkSubscription(user));
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    setAllUsers(prev => {
      const newList = (prev || []).map(u => u.id === userId ? { ...u, ...updates } : u);
      return reconcileSubscriptions(newList);
    });
  };

  const handleCreateUser = (newUser: { name: string, email: string, password: string, durationMonths: number }) => {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + newUser.durationMonths);
    
    const user: User = {
      id: Math.random().toString(36).substring(2, 11),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: 'user',
      subscriptionStatus: 'active',
      subscriptionExpiry: expiry.toISOString()
    };

    setAllUsers(prev => [...(prev || []), user]);
  };

  const handleSimulateTime = () => {
    setAllUsers(prev => {
      const newList = (prev || []).map(u => {
        if (u.role === 'admin') return u;
        const currentExpiry = new Date(u.subscriptionExpiry);
        currentExpiry.setMonth(currentExpiry.getMonth() - 1);
        return { ...u, subscriptionExpiry: currentExpiry.toISOString() };
      });
      return reconcileSubscriptions(newList);
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setNotifications([]);
    setStep(AppStep.LOGIN);
    setUserData({
        answers: {},
        salary: 0,
        otherIncome: 0,
        budgetPlan: [],
        expenses: []
    });
  };

  const handleStart = () => {
    setStep(AppStep.QUESTIONNAIRE);
  };

  const handleQuestionnaireComplete = (answers: Record<number, any>) => {
    const salary = Number(answers[8]) || 0;
    const otherIncome = Number(answers[9]) || 0;
    const gender = answers[0] === 2 ? 'woman' : 'man';
    const initialUserData: UserData = { ...userData, answers, salary, otherIncome, gender };
    const budgetPlan = calculateBudget(initialUserData);
    setUserData({ ...initialUserData, budgetPlan });
    setStep(AppStep.BUDGET_PLAN);
  };

  const handleAddExpense = (categoryId: string, amount: number) => {
    const newExpense: Expense = {
      id: Math.random().toString(),
      categoryId,
      amount,
      date: new Date().toISOString(),
      description: ''
    };

    setUserData(prev => {
      let updatedCat: BudgetCategory | undefined;
      const updatedPlan = (prev.budgetPlan || []).map(cat => {
        if (cat.id === categoryId) {
          updatedCat = { ...cat, spent: (cat.spent || 0) + amount };
          return updatedCat;
        }
        return cat;
      });

      if (updatedCat) {
        const ratio = updatedCat.spent / (updatedCat.budgeted || 1);
        let newNotif: BudgetNotification | null = null;
        if (ratio >= 1.0) {
          newNotif = {
            id: Math.random().toString(),
            type: 'danger',
            categoryId: updatedCat.id,
            categoryName: updatedCat.name,
            message: { fr: TRANSLATIONS['fr'].notifExceeded, ar: TRANSLATIONS['ar'].notifExceeded },
            timestamp: Date.now()
          };
        } else if (ratio >= 0.8) {
          newNotif = {
            id: Math.random().toString(),
            type: 'warning',
            categoryId: updatedCat.id,
            categoryName: updatedCat.name,
            message: { fr: TRANSLATIONS['fr'].notifWarning, ar: TRANSLATIONS['ar'].notifWarning },
            timestamp: Date.now()
          };
        }
        if (newNotif) {
          setNotifications(prevNotifs => [newNotif!, ...(prevNotifs || []).filter(n => n.categoryId !== categoryId)]);
        }
      }
      return { 
        ...prev, 
        budgetPlan: updatedPlan, 
        expenses: [newExpense, ...(prev.expenses || [])] 
      };
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    setUserData(prev => {
      const expenseToDelete = (prev.expenses || []).find(e => e.id === expenseId);
      if (!expenseToDelete) return prev;

      const updatedPlan = (prev.budgetPlan || []).map(cat => {
        if (cat.id === expenseToDelete.categoryId) {
          return { ...cat, spent: Math.max(0, (cat.spent || 0) - expenseToDelete.amount) };
        }
        return cat;
      });

      const updatedExpenses = (prev.expenses || []).filter(e => e.id !== expenseId);
      return { ...prev, budgetPlan: updatedPlan, expenses: updatedExpenses };
    });
  };

  const totalIncome = (userData.salary || 0) + (userData.otherIncome || 0);
  const totalSpent = (userData.budgetPlan || []).reduce((s, c) => s + (c.spent || 0), 0);

  const themeText = theme === 'pink' ? 'text-pink-600' : 'text-emerald-600';
  const themeBg = theme === 'pink' ? 'bg-pink-600' : 'bg-emerald-600';
  const themeBgLight = theme === 'pink' ? 'bg-pink-50' : 'bg-emerald-50';
  const themeBorder = theme === 'pink' ? 'border-pink-200' : 'border-emerald-200';
  const themeShadow = theme === 'pink' ? 'shadow-pink-200' : 'shadow-emerald-200';

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-50 glass-card border-b border-slate-200/50">
        <div className="container mx-auto px-5 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className={`absolute inset-0 ${currentUser?.role === 'admin' ? 'bg-slate-800' : 'bg-emerald-600'} rounded-xl shadow-lg transition-transform group-hover:rotate-6 group-active:scale-90`}></div>
                <div className="absolute inset-0 bg-white border border-emerald-50 rounded-xl flex items-center justify-center shadow-sm -translate-x-0.5 -translate-y-0.5 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform">
                  <div className="relative">
                    <span className={`font-black text-xl leading-none ${currentUser?.role === 'admin' ? 'text-slate-800' : 'text-emerald-600'}`}>C</span>
                    <div className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm transform group-hover:scale-110 transition-transform"></div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col -space-y-1">
                <h1 className="text-sm font-black tracking-tight text-slate-900 uppercase">CHAHRYTI</h1>
                <p className={`${currentUser?.role === 'admin' ? 'text-slate-400' : themeText} text-[9px] font-black uppercase tracking-[0.1em]`}>
                  {lang === 'ar' ? 'شهريتي' : t.appSubtitle}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex bg-slate-100/80 backdrop-blur-sm p-1 rounded-xl border border-slate-200/50">
                <button onClick={() => setLang('fr')} className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${lang === 'fr' ? `bg-white ${currentUser?.role === 'admin' ? 'text-slate-800' : themeText} shadow-sm` : 'text-slate-500 hover:text-slate-700'}`}>FR</button>
                <button onClick={() => setLang('ar')} className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${lang === 'ar' ? `bg-white ${currentUser?.role === 'admin' ? 'text-slate-800' : themeText} shadow-sm` : 'text-slate-500 hover:text-slate-700'}`}>AR</button>
             </div>
             {currentUser && (
               <button onClick={handleLogout} className="w-10 h-10 bg-white border border-slate-100 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-50 transition-all shadow-sm active:scale-90">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
               </button>
             )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-5 py-6 max-w-5xl">
        <div key={`${step}-${userData.gender || 'unknown'}`} className="animate-slide-up">
          {step === AppStep.LOGIN && <Login lang={lang} onLogin={handleLogin} error={loginError} />}

          {step === AppStep.ADMIN && (
            <AdminDashboard 
              lang={lang} 
              users={allUsers} 
              onUpdateUser={handleUpdateUser} 
              onSimulateTime={handleSimulateTime} 
              onCreateUser={handleCreateUser}
            />
          )}

          {step === AppStep.PAUSED && (
            <div className="max-w-md mx-auto py-20 text-center animate-pop-in">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">{t.pausedTitle}</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">{t.pausedMessage}</p>
              <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 mb-8">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Support</p>
                 <p className="font-bold text-slate-700">{t.pausedContact}</p>
              </div>
              <button onClick={handleLogout} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95">{t.logout}</button>
            </div>
          )}
          
          {step === AppStep.INTRO && (
            <div className="max-w-md mx-auto py-12 text-center">
              <div className={`w-24 h-24 ${themeBgLight} rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 ${themeText} shadow-inner animate-pop-in`}>
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">{t.introTitle}</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-10">{t.introDesc}</p>
              <div className="space-y-4">
                <button onClick={handleStart} className={`w-full py-5 ${themeBg} text-white rounded-3xl font-black text-xl transition-all shadow-xl ${themeShadow} active:scale-95`}>{t.startBtn}</button>
                <button onClick={handleLogout} className="w-full py-5 text-slate-400 font-bold hover:text-slate-600 transition-colors">{t.laterBtn}</button>
              </div>
            </div>
          )}

          {step === AppStep.QUESTIONNAIRE && <Questionnaire lang={lang} onComplete={handleQuestionnaireComplete} />}

          {step === AppStep.BILAN && (
            <MonthSummary userData={userData} lang={lang} onBack={() => setStep(AppStep.BUDGET_PLAN)} />
          )}

          {(step === AppStep.BUDGET_PLAN || step === AppStep.TRACKER) && (
            <div className="space-y-6">
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                <div className="flex-shrink-0 px-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pop-in">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{t.income}</p>
                  <p className="font-black text-slate-900 whitespace-nowrap">{formatCurrency(totalIncome, lang)}</p>
                </div>
                <div className="flex-shrink-0 px-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pop-in">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{t.spent}</p>
                  <p className="font-black text-rose-600 whitespace-nowrap">{formatCurrency(totalSpent, lang)}</p>
                </div>
                <div className={`flex-shrink-0 px-4 py-3 ${themeBg} rounded-2xl shadow-lg ${themeShadow} animate-pop-in`}>
                  <p className={`text-[10px] font-black uppercase ${theme === 'pink' ? 'text-pink-100' : 'text-emerald-100'} tracking-widest leading-none mb-1`}>{t.remaining}</p>
                  <p className="font-black text-white whitespace-nowrap">{formatCurrency(totalIncome - totalSpent, lang)}</p>
                </div>
              </div>

              {notifications.length > 0 && (
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-4 rounded-3xl border-2 flex items-center justify-between animate-pop-in ${n.type === 'danger' ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                      <p className="text-sm font-bold flex items-center gap-2">
                        <span className="text-xl">{n.type === 'danger' ? '🚨' : '⚠️'}</span>
                        <span>{n.message?.[lang] || ''} {n.categoryName?.[lang] || ''}</span>
                      </p>
                      <button onClick={() => setNotifications(prev => (prev || []).filter(x => x.id !== n.id))} className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center">✕</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
                  <ExpenseTracker 
                    categories={userData.budgetPlan || []} 
                    expenses={userData.expenses || []}
                    lang={lang} 
                    onAddExpense={handleAddExpense} 
                    onDeleteExpense={handleDeleteExpense}
                    gender={userData.gender} 
                  />
                  
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="font-black text-slate-900 mb-6 text-xs uppercase tracking-widest text-center">{t.visualSummary}</h3>
                    <div className="space-y-5">
                      {(userData.budgetPlan || []).map(cat => {
                        const ratio = cat.budgeted > 0 ? ((cat.spent || 0) / cat.budgeted) * 100 : 0;
                        return (
                          <div key={cat.id}>
                            <div className="flex justify-between text-xs font-black mb-1.5 px-1">
                              <span className="text-slate-500 uppercase tracking-tighter">{cat.name?.[lang] || ''}</span>
                              <span className={ratio > 100 ? 'text-rose-600' : 'text-slate-900'}>{Math.round(ratio)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ${ratio > 100 ? 'bg-rose-500' : `${themeBg} shadow-[0_0_8px_rgba(16,185,129,0.3)]`}`}
                                style={{ width: `${Math.min(ratio, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{t.planTitle}</h2>
                      <p className="text-slate-500 font-medium text-sm">{t.planSubtitle}</p>
                    </div>
                    <button 
                      onClick={() => setStep(AppStep.BILAN)}
                      className="w-full sm:w-auto px-5 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                      {t.seeBilan}
                    </button>
                  </div>
                  
                  <BudgetTable categories={userData.budgetPlan || []} lang={lang} gender={userData.gender} />
                  
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden animate-pop-in">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${themeBgLight} rounded-full -mr-12 -mt-12`}></div>
                    <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2 relative z-10 uppercase text-xs tracking-widest">
                      <span className={`${themeText}`}>★</span> {t.adviceTitle}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed relative z-10 font-medium">
                      {userData.answers?.[14] === 1 
                        ? (lang === 'fr' ? "Nous avons maximisé ton épargne car tu as choisi une gestion stricte. Priorise le remplissage de ton fonds de sécurité avant les extras." : "لقد قمنا بزيادة ادخارك لأنك اخترت تسييرًا صارمًا. أعط الأولوية لملء صندوق الأمان الخاص بك قبل الكماليات.")
                        : userData.answers?.[4] === 3 
                          ? (lang === 'fr' ? "L'absence de loyer est une opportunité énorme ! On a boosté l'épargne projet et l'aide à la famille." : "عدم وجود كراء هو فرصة كبيرة! لقد عززنا ادخار المشروع ومساعدة العائلة.")
                          : (lang === 'fr' ? "Ton budget est équilibré. Garde un œil sur la catégorie Nourriture, les prix peuvent varier rapidement dans ta région." : "ميزانيتك متمتوازنة. راقب فئة الطعام، فالأسعار قد تتغير بسرعة في منطقتك.")
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="h-6 pb-safe"></div>
    </div>
  );
};

export default App;
