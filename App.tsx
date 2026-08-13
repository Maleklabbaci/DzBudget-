import React, { useState, useEffect, useCallback } from 'react';
import { AppStep, UserData, BudgetCategory, Language, User, BudgetNotification, Expense } from './types';
import Questionnaire from './components/Questionnaire';
import BudgetTable from './components/BudgetTable';
import ExpenseTracker from './components/ExpenseTracker';
import MonthSummary from './components/MonthSummary';
import AICoach from './components/AICoach';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { calculateBudget } from './services/budgetService';
import { formatCurrency, TRANSLATIONS } from './constants';

const STORAGE_KEY = 'chahryti_v1_data';

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
    subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [step, setStep] = useState<AppStep>(AppStep.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [notifications, setNotifications] = useState<BudgetNotification[]>([]);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [userData, setUserData] = useState<UserData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.budgetPlan) return parsed;
      }
    } catch (e) {
      console.error("Storage load error", e);
    }
    return {
      answers: {},
      salary: 0,
      otherIncome: 0,
      budgetPlan: [],
      expenses: []
    };
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS['fr'];
  const theme = userData.gender === 'woman' ? 'pink' : 'emerald';

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

  useEffect(() => {
    if (userData.salary > 0 || userData.expenses.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }
  }, [userData]);

  const checkSubscription = (user: User): AppStep => {
    if (user.role === 'admin') return AppStep.ADMIN;
    const now = new Date();
    const expiry = new Date(user.subscriptionExpiry);
    if (user.subscriptionStatus !== 'active' || now > expiry) {
      return AppStep.PAUSED;
    }
    return userData.salary > 0 ? AppStep.TRACKER : AppStep.INTRO;
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

  const handleCreateUser = (newUser: { name: string, email: string, password: string, durationMonths: number }) => {
    if (allUsers.some(u => u.email === newUser.email)) {
      alert(lang === 'ar' ? 'هذا البريد الإلكتروني مستخدم بالفعل' : 'Cet email est déjà utilisé');
      return;
    }
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + newUser.durationMonths);
    const createdUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: 'user',
      subscriptionStatus: 'active',
      subscriptionExpiry: expiry.toISOString()
    };
    setAllUsers(prev => [...prev, createdUser]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setNotifications([]);
    setStep(AppStep.LOGIN);
  };

  const handleReset = () => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد؟ سيتم مسح كل شيء.' : 'Tout effacer ?')) {
      localStorage.removeItem(STORAGE_KEY);
      setUserData({
          answers: {},
          salary: 0,
          otherIncome: 0,
          budgetPlan: [],
          expenses: []
      });
      setStep(AppStep.INTRO);
    }
  };

  const handleQuestionnaireComplete = (answers: Record<number, any>) => {
    const salary = Number(answers[8]) || 0;
    const otherIncome = Number(answers[9]) || 0;
    const gender = answers[0] === 2 ? 'woman' : 'man';
    const initialUserData: UserData = { ...userData, answers, salary, otherIncome, gender };
    const budgetPlan = calculateBudget(initialUserData);
    setUserData({ ...initialUserData, budgetPlan });
    setStep(AppStep.TRACKER);
  };

  const handleAddExpense = (categoryId: string, amount: number) => {
    setUserData(prev => {
      const newExpense: Expense = {
        id: Math.random().toString(36).substr(2, 9),
        categoryId,
        amount,
        date: new Date().toISOString(),
        description: ''
      };

      const updatedPlan = prev.budgetPlan.map(cat => {
        if (cat.id === categoryId) {
          const newSpent = cat.spent + amount;
          const ratio = newSpent / cat.budgeted;
          
          if (ratio >= 1.0) {
            const notif: BudgetNotification = {
              id: Math.random().toString(),
              type: 'danger',
              categoryId: cat.id,
              categoryName: cat.name,
              message: { fr: TRANSLATIONS['fr'].notifExceeded, ar: TRANSLATIONS['ar'].notifExceeded },
              timestamp: Date.now()
            };
            setNotifications(prevN => [notif, ...prevN.filter(n => n.categoryId !== categoryId)]);
          } else if (ratio >= 0.8) {
            const notif: BudgetNotification = {
              id: Math.random().toString(),
              type: 'warning',
              categoryId: cat.id,
              categoryName: cat.name,
              message: { fr: TRANSLATIONS['fr'].notifWarning, ar: TRANSLATIONS['ar'].notifWarning },
              timestamp: Date.now()
            };
            setNotifications(prevN => [notif, ...prevN.filter(n => n.categoryId !== categoryId)]);
          }
          return { ...cat, spent: newSpent };
        }
        return cat;
      });

      return { 
        ...prev, 
        budgetPlan: updatedPlan, 
        expenses: [newExpense, ...prev.expenses] 
      };
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    setUserData(prev => {
      const expenseToDelete = prev.expenses.find(e => e.id === expenseId);
      if (!expenseToDelete) return prev;

      const updatedPlan = prev.budgetPlan.map(cat => {
        if (cat.id === expenseToDelete.categoryId) {
          return { ...cat, spent: Math.max(0, cat.spent - expenseToDelete.amount) };
        }
        return cat;
      });

      return { 
        ...prev, 
        budgetPlan: updatedPlan, 
        expenses: prev.expenses.filter(e => e.id !== expenseId) 
      };
    });
  };

  const totalIncome = (userData.salary || 0) + (userData.otherIncome || 0);
  const totalSpent = userData.budgetPlan?.reduce((s, c) => s + (c.spent || 0), 0) || 0;

  const themeText = theme === 'pink' ? 'text-pink-600' : 'text-emerald-600';
  const themeBg = theme === 'pink' ? 'bg-pink-600' : 'bg-emerald-600';
  const themeBgLight = theme === 'pink' ? 'bg-pink-50' : 'bg-emerald-50';

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-50 glass-card border-b border-slate-200/50">
        <div className="container mx-auto px-5 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 ${currentUser?.role === 'admin' ? 'bg-slate-800' : themeBg} rounded-xl shadow-lg flex items-center justify-center`}>
                <span className="font-black text-white text-xl">C</span>
             </div>
             <div className="hidden sm:block">
                <h1 className="text-xs font-black tracking-widest text-slate-900 uppercase">CHAHRYTI</h1>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button onClick={() => setLang('fr')} className={`px-3 py-1 text-[10px] font-black rounded-lg ${lang === 'fr' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>FR</button>
                <button onClick={() => setLang('ar')} className={`px-3 py-1 text-[10px] font-black rounded-lg ${lang === 'ar' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>AR</button>
             </div>
             {currentUser && (
               <button onClick={handleLogout} className="w-10 h-10 bg-white border border-slate-200 text-rose-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
               </button>
             )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 max-w-5xl">
        {step === AppStep.LOGIN && <Login lang={lang} onLogin={handleLogin} error={loginError} />}

        {step === AppStep.ADMIN && (
          <AdminDashboard 
            lang={lang} 
            users={allUsers} 
            onUpdateUser={(id, up) => setAllUsers(prev => prev.map(u => u.id === id ? {...u, ...up} : u))} 
            onSimulateTime={() => {}} 
            onCreateUser={handleCreateUser}
          />
        )}
        
        {step === AppStep.INTRO && (
          <div className="max-w-md mx-auto py-12 text-center animate-slide-up">
            <div className={`w-20 h-20 ${themeBgLight} rounded-[2rem] flex items-center justify-center mx-auto mb-6 ${themeText}`}>
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" /></svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">{t.introTitle}</h2>
            <p className="text-slate-500 font-medium mb-10">{t.introDesc}</p>
            <button onClick={() => setStep(AppStep.QUESTIONNAIRE)} className={`w-full py-5 ${themeBg} text-white rounded-3xl font-black text-xl shadow-xl active:scale-95`}>{t.startBtn}</button>
          </div>
        )}

        {step === AppStep.QUESTIONNAIRE && <Questionnaire lang={lang} onComplete={handleQuestionnaireComplete} />}

        {step === AppStep.TRACKER && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-5 rounded-3xl border border-slate-200">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{t.income}</p>
                <p className="font-black text-slate-900 text-lg">{formatCurrency(totalIncome, lang)}</p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-200">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{t.spent}</p>
                <p className="font-black text-rose-600 text-lg">{formatCurrency(totalSpent, lang)}</p>
              </div>
              <div className={`${themeBg} p-5 rounded-3xl text-white shadow-lg`}>
                <p className="text-[10px] font-black uppercase opacity-70 tracking-widest mb-1">{t.remaining}</p>
                <p className="font-black text-lg">{formatCurrency(totalIncome - totalSpent, lang)}</p>
              </div>
            </div>

            {notifications.length > 0 && (
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 rounded-2xl border-2 flex items-center justify-between animate-pop-in ${n.type === 'danger' ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                    <p className="text-xs font-bold">{n.message[lang]} {n.categoryName[lang]}</p>
                    <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="text-lg">✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-6">
                <ExpenseTracker 
                  categories={userData.budgetPlan} 
                  expenses={userData.expenses}
                  lang={lang} 
                  onAddExpense={handleAddExpense} 
                  onDeleteExpense={handleDeleteExpense}
                  gender={userData.gender} 
                />
                <AICoach userData={userData} lang={lang} />
              </div>
              <div className="lg:col-span-7 space-y-6">
                <div className="flex justify-between items-center px-2">
                   <h2 className="text-xl font-black">{t.planTitle}</h2>
                   <button onClick={handleReset} className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-all">Reset</button>
                </div>
                <BudgetTable categories={userData.budgetPlan} lang={lang} gender={userData.gender} />
                <button onClick={() => setStep(AppStep.BILAN)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg active:scale-95">{t.seeBilan}</button>
              </div>
            </div>
          </div>
        )}

        {step === AppStep.BILAN && <MonthSummary userData={userData} lang={lang} onBack={() => setStep(AppStep.TRACKER)} />}

        {step === AppStep.PAUSED && (
          <div className="max-w-md mx-auto py-12 text-center bg-white p-10 rounded-[3rem] shadow-xl">
            <h2 className="text-2xl font-black text-slate-900 mb-3">{t.pausedTitle}</h2>
            <p className="text-slate-500 mb-8">{t.pausedMessage}</p>
            <button onClick={handleLogout} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm">OK</button>
          </div>
        )}
      </main>

      <footer className="py-6 text-center opacity-20 select-none">
        <p className="text-[9px] font-black uppercase tracking-[0.3em]">CHAHRYTI • ALGÉRIE</p>
      </footer>
    </div>
  );
};

export default App;
