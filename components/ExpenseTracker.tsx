
import React, { useState } from 'react';
import { BudgetCategory, Language, Gender, Expense } from '../types';
import { TRANSLATIONS, formatCurrency } from '../constants';

interface ExpenseTrackerProps {
  categories: BudgetCategory[];
  expenses: Expense[];
  lang: Language;
  onAddExpense: (categoryId: string, amount: number) => void;
  onDeleteExpense: (expenseId: string) => void;
  gender?: Gender;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ categories, expenses, lang, onAddExpense, onDeleteExpense, gender }) => {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingAdd, setPendingAdd] = useState<{ categoryId: string; amount: number } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  
  const t = TRANSLATIONS[lang];
  const quickAmounts = [10, 50, 200, 500, 1000, 2000];
  const currencySymbol = lang === 'ar' ? 'دج' : 'DZD';

  const isWoman = gender === 'woman';
  const themeBg = isWoman ? 'bg-pink-600' : 'bg-emerald-600';
  const themeBgDark = isWoman ? 'bg-pink-700/40' : 'bg-emerald-700/40';
  const themeBgOption = isWoman ? 'bg-pink-800' : 'bg-emerald-800';
  const themeBorder = isWoman ? 'border-pink-500/30' : 'border-emerald-500/30';
  const themeBorderFocus = isWoman ? 'border-pink-400/20' : 'border-emerald-400/20';
  const themeShadow = isWoman ? 'shadow-pink-200' : 'shadow-emerald-200';
  const themeAccent = isWoman ? 'bg-pink-500' : 'bg-emerald-500';
  const themeTextAccent = isWoman ? 'text-pink-200' : 'text-emerald-200';
  const themeTextBtn = isWoman ? 'text-pink-700' : 'text-emerald-700';

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1000);
  };

  const handleConfirmAdd = () => {
    if (pendingAdd) {
      onAddExpense(pendingAdd.categoryId, pendingAdd.amount);
      setPendingAdd(null);
      setAmount('');
      triggerSuccess();
    }
  };

  const handleConfirmDelete = () => {
    if (pendingDelete) {
      onDeleteExpense(pendingDelete);
      setPendingDelete(null);
    }
  };

  const handleQuickAdd = (val: number) => {
    if (categoryId) {
      setPendingAdd({ categoryId, amount: val });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && categoryId) {
      setPendingAdd({ categoryId, amount: Number(amount) });
    }
  };

  return (
    <div className="space-y-6">
      {pendingAdd && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-pop-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 text-center shadow-2xl">
            <div className={`w-16 h-16 ${isWoman ? 'bg-pink-50 text-pink-500' : 'bg-emerald-50 text-emerald-500'} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">
              {lang === 'ar' ? 'تأكيد إضافة مصاريف' : 'Confirmer la dépense'}
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl mb-8">
              <p className={`text-3xl font-black ${isWoman ? 'text-pink-600' : 'text-emerald-600'} mb-1`}>
                {formatCurrency(pendingAdd.amount, lang)}
              </p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {categories.find(c => c.id === pendingAdd.categoryId)?.name?.[lang] || ''}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setPendingAdd(null)} className="py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                {lang === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
              <button onClick={handleConfirmAdd} className={`py-4 ${themeBg} text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all active:scale-95`}>
                {lang === 'ar' ? 'تأكيد' : 'Valider'}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-pop-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 text-center shadow-2xl border-2 border-rose-50">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">
              {lang === 'ar' ? 'حذف هذه المصاريف؟' : 'Supprimer la dépense ?'}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setPendingDelete(null)} className="py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                {lang === 'ar' ? 'تراجع' : 'Annuler'}
              </button>
              <button onClick={handleConfirmDelete} className="py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-100 transition-all active:scale-95">
                {lang === 'ar' ? 'تأكيد الحذف' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`${themeBg} text-white p-5 sm:p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group border ${themeBorder} transition-all duration-300 ${showSuccess ? 'success-pulse' : themeShadow}`}>
        <div className={`absolute inset-0 z-50 ${themeAccent} flex items-center justify-center transition-opacity duration-300 pointer-events-none ${showSuccess ? 'opacity-90' : 'opacity-0'}`}>
          <div className="animate-pop-in"><svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              {t.addExpense}
            </h3>
          </div>
          <div className="mb-6">
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={`w-full ${themeBgDark} border-2 ${themeBorderFocus} rounded-2xl p-3.5 text-white focus:outline-none focus:border-white transition-all font-bold appearance-none cursor-pointer text-sm`}>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className={`${themeBgOption} text-white`}>{cat.name?.[lang] || ''}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {quickAmounts.map((val) => (
              <button key={val} type="button" onClick={() => handleQuickAdd(val)} className="bg-white/10 hover:bg-white/20 border border-white/10 active:scale-90 transition-all py-3 rounded-2xl flex flex-col items-center justify-center gap-0.5 backdrop-blur-sm">
                <span className="text-lg font-black leading-none">{val}</span>
                <span className="text-[8px] font-bold uppercase tracking-tighter opacity-70">{currencySymbol}</span>
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-grow">
              <input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={`w-full ${themeBgDark} border-2 ${themeBorderFocus} rounded-2xl p-4 ${lang === 'ar' ? 'pl-14' : 'pr-14'} text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-all font-black text-xl`} placeholder="0.00" />
              <span className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 font-black text-xs uppercase ${themeTextAccent} pointer-events-none`}>{currencySymbol}</span>
            </div>
            <button type="submit" disabled={!amount} className={`w-16 bg-white ${themeTextBtn} rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform disabled:opacity-50`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </button>
          </form>
        </div>
      </div>

      {expenses.length > 0 && (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4">{lang === 'ar' ? 'المصاريف الأخيرة' : 'Dépenses Récentes'}</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 no-scrollbar">
            {expenses.map((exp) => {
              const category = categories.find(c => c.id === exp.categoryId);
              return (
                <div key={exp.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all group">
                  <div>
                    <p className="font-black text-slate-900 text-sm leading-none mb-1">{formatCurrency(exp.amount, lang)}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{category?.name?.[lang] || ''} • {new Date(exp.date).toLocaleTimeString(lang === 'ar' ? 'ar-DZ' : 'fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <button onClick={() => setPendingDelete(exp.id)} className="w-8 h-8 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-100 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;
