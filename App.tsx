
import React, { useState, useEffect, useCallback } from 'react';
import { AppStep, UserData, BudgetCategory, Language, User, BudgetNotification } from './types';
import Questionnaire from './components/Questionnaire';
import BudgetTable from './components/BudgetTable';
import ExpenseTracker from './components/ExpenseTracker';
import MonthSummary from './components/MonthSummary';
import AICoach from './components/AICoach';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { calculateBudget } from './services/budgetService';
import { formatCurrency, TRANSLATIONS } from './constants';

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@dz.dz',
    role: 'admin',
    subscriptionStatus: 'active',
    subscriptionExpiry: '2099-12-31'
  },
  {
    id: '2',
    name: 'Ahmed Boudiaf',
    email: 'user@dz.dz',
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
  
  const [userData, setUserData] = useState<UserData>({
    answers: {},
    salary: 0,
    otherIncome: 0,
    budgetPlan: [],
    expenses: []
  });

  const t = TRANSLATIONS[lang];

  const reconcileSubscriptions = useCallback((usersList: User[]) => {
    const now = new Date();
    return usersList.map(u => {
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

  const handleLogin = (loginData: { email: string }) => {
    let user = allUsers.find(u => u.email === loginData.email);
    if (!user) {
      user = {
        id: Math.random().toString(),
        name: loginData.email.split('@')[0],
        email: loginData.email,
        role: 'user',
        subscriptionStatus: 'active',
        subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      setAllUsers(prev => [...prev, user!]);
    }
    setCurrentUser(user);
    setStep(checkSubscription(user));
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    setAllUsers(prev => {
      const newList = prev.map(u => u.id === userId ? { ...u, ...updates } : u);
      return reconcileSubscriptions(newList);
    });
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setNotifications([]);
    setStep(AppStep.LOGIN);
  };

  const handleStart = () => {
    setStep(AppStep.QUESTIONNAIRE);
  };

  const handleQuestionnaireComplete = (answers: Record<number, any>) => {
    const salary = Number(answers[8]) || 0;
    const otherIncome = Number(answers[9]) || 0;
    const initialUserData: UserData = { ...userData, answers, salary, otherIncome };
    const budgetPlan = calculateBudget(initialUserData);
    setUserData({ ...initialUserData, budgetPlan });
    setStep(AppStep.BUDGET_PLAN);
  };

  const handleAddExpense = (categoryId: string, amount: number) => {
    setUserData(prev => {
      let updatedCat: BudgetCategory | undefined;
      const updatedPlan = prev.budgetPlan.map(cat => {
        if (cat.id === categoryId) {
          updatedCat = { ...cat, spent: cat.spent + amount };
          return updatedCat;
        }
        return cat;
      });

      if (updatedCat) {
        const ratio = updatedCat.spent / updatedCat.budgeted;
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
          setNotifications(prevNotifs => [newNotif!, ...prevNotifs.filter(n => n.categoryId !== categoryId)]);
        }
      }
      return { ...prev, budgetPlan: updatedPlan };
    });
  };

  const totalIncome = userData.salary + userData.otherIncome;
  const totalSpent = userData.budgetPlan.reduce((s, c) => s + c.spent, 0);

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Premium Navigation Bar with Modern Logo */}
      <header className="sticky top-0 z-50 glass-card border-b border-slate-200/50">
        <div className="container mx-auto px-5 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Modern Minimalist Logo with Algerian Flag Colors */}
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 bg-white border border-slate-100 rounded-[14px] shadow-sm flex items-center justify-center overflow-hidden transition-transform active:scale-95">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 h-full bg-emerald-600/10"></div>
                  <div className="w-1/2 h-full bg-slate-50"></div>
                </div>
                <div className="relative z-10 flex items-baseline">
                  <span className="text-emerald-700 font-black text-xl leading-none">D</span>
                  <span className="text-slate-800 font-black text-xl leading-none">Z</span>
                  <div className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white shadow-sm"></div>
                </div>
              </div>
              <div className="absolute -inset-1 bg-emerald-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-black tracking-tight leading-none text-slate-900">{t.appTitle}</h1>
              <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">{t.appSubtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex bg-slate-100/80 backdrop-blur-sm p-1 rounded-xl border border-slate-200/50">
                <button onClick={() => setLang('fr')} className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${lang === 'fr' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>FR</button>
                <button onClick={() => setLang('ar')} className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${lang === 'ar' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>AR</button>
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
        <div key={step} className="animate-slide-up">
          {step === AppStep.LOGIN && <Login lang={lang} onLogin={handleLogin} />}
          
          {step === AppStep.INTRO && (
            <div className="max-w-md mx-auto py-12 text-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-inner animate-pop-in">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">{t.introTitle}</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-10">{t.introDesc}</p>
              <div className="space-y-4">
                <button onClick={handleStart} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95">{t.startBtn}</button>
                <button className="w-full py-5 text-slate-400 font-bold hover:text-slate-600 transition-colors">{t.laterBtn}</button>
              </div>
            </div>
          )}

          {step === AppStep.QUESTIONNAIRE && <Questionnaire lang={lang} onComplete={handleQuestionnaireComplete} />}

          {step === AppStep.BILAN && (
            <MonthSummary userData={userData} lang={lang} onBack={() => setStep(AppStep.BUDGET_PLAN)} />
          )}

          {(step === AppStep.BUDGET_PLAN || step === AppStep.TRACKER) && (
            <div className="space-y-6">
              {/* Quick Summary Sticky-ready */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                <div className="flex-shrink-0 px-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pop-in" style={{animationDelay: '0s'}}>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{t.income}</p>
                  <p className="font-black text-slate-900 whitespace-nowrap">{formatCurrency(totalIncome, lang)}</p>
                </div>
                <div className="flex-shrink-0 px-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pop-in" style={{animationDelay: '0.1s'}}>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{t.spent}</p>
                  <p className="font-black text-rose-600 whitespace-nowrap">{formatCurrency(totalSpent, lang)}</p>
                </div>
                <div className="flex-shrink-0 px-4 py-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-100 animate-pop-in" style={{animationDelay: '0.2s'}}>
                  <p className="text-[10px] font-black uppercase text-emerald-100 tracking-widest leading-none mb-1">{t.remaining}</p>
                  <p className="font-black text-white whitespace-nowrap">{formatCurrency(totalIncome - totalSpent, lang)}</p>
                </div>
              </div>

              {/* Notifications */}
              {notifications.length > 0 && (
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-4 rounded-3xl border-2 flex items-center justify-between animate-pop-in ${n.type === 'danger' ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                      <p className="text-sm font-bold flex items-center gap-2">
                        <span className="text-xl">{n.type === 'danger' ? '🚨' : '⚠️'}</span>
                        <span>{n.message[lang]} {n.categoryName[lang]}</span>
                      </p>
                      <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center">✕</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* PRIMARY MOBILE AREA: ADD EXPENSE IS NOW TOP ON MOBILE */}
                <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
                  <ExpenseTracker categories={userData.budgetPlan} lang={lang} onAddExpense={handleAddExpense} />
                  
                  {/* AI COACH INTEGRATION */}
                  <AICoach userData={userData} lang={lang} />
                  
                  <div className="hidden lg:block bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="font-black text-slate-900 mb-6 text-xs uppercase tracking-widest text-center">{t.visualSummary}</h3>
                    <div className="space-y-5">
                      {userData.budgetPlan.map(cat => {
                        const ratio = (cat.spent / cat.budgeted) * 100;
                        return (
                          <div key={cat.id}>
                            <div className="flex justify-between text-xs font-black mb-1.5 px-1">
                              <span className="text-slate-500 uppercase tracking-tighter">{cat.name[lang]}</span>
                              <span className={ratio > 100 ? 'text-rose-600' : 'text-slate-900'}>{Math.round(ratio)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ${ratio > 100 ? 'bg-rose-500' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]'}`}
                                style={{ width: `${Math.min(ratio, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* SECONDARY AREA: PLAN & TABLE */}
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
                  
                  <BudgetTable categories={userData.budgetPlan} lang={lang} />
                  
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden animate-pop-in">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12"></div>
                    <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2 relative z-10 uppercase text-xs tracking-widest">
                      <span className="text-emerald-600">★</span> {t.adviceTitle}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed relative z-10 font-medium">
                      {userData.answers[14] === 1 
                        ? (lang === 'fr' ? "Nous avons maximisé ton épargne car tu as choisi une gestion stricte. Priorise le remplissage de ton fonds de sécurité avant les extras." : "لقد قمنا بزيادة ادخارك لأنك اخترت تسييرًا صارمًا. أعط الأولوية لملء صندوق الأمان الخاص بك قبل الكماليات.")
                        : userData.answers[4] === 3 
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

      {/* Bottom padding for mobile bar */}
      <div className="h-6 pb-safe"></div>
    </div>
  );
};

export default App;
