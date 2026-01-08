
import React, { useState, useEffect } from 'react';
import { BudgetCategory, Language } from '../types';
import { TRANSLATIONS, formatCurrency } from '../constants';

interface ExpenseTrackerProps {
  categories: BudgetCategory[];
  lang: Language;
  onAddExpense: (categoryId: string, amount: number) => void;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ categories, lang, onAddExpense }) => {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const t = TRANSLATIONS[lang];

  const quickAmounts = [10, 50, 200, 500, 1000, 2000];

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1000);
  };

  const handleQuickAdd = (val: number) => {
    if (categoryId) {
      onAddExpense(categoryId, val);
      triggerSuccess();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && categoryId) {
      onAddExpense(categoryId, Number(amount));
      setAmount('');
      triggerSuccess();
    }
  };

  return (
    <div className={`bg-emerald-600 text-white p-5 sm:p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group border border-emerald-500/30 transition-all duration-300 ${showSuccess ? 'success-pulse' : 'shadow-emerald-200'}`}>
      {/* Success Overlay */}
      <div className={`absolute inset-0 z-50 bg-emerald-500 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${showSuccess ? 'opacity-90' : 'opacity-0'}`}>
        <div className="animate-pop-in">
          <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-emerald-500 rounded-full opacity-40 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-emerald-400 rounded-full opacity-20 blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            {t.addExpense}
          </h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100/70">Rapide & Facile</span>
        </div>

        {/* Category Selection - More prominent */}
        <div className="mb-6">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-emerald-700/40 border-2 border-emerald-400/30 rounded-2xl p-3.5 text-white focus:outline-none focus:border-white focus:bg-emerald-700/60 transition-all font-bold appearance-none cursor-pointer text-sm"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-emerald-800 text-white">
                {cat.name[lang]}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {quickAmounts.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleQuickAdd(val)}
              className="bg-white/10 hover:bg-white/20 border border-white/10 active:scale-90 transition-all py-3 rounded-2xl flex flex-col items-center justify-center gap-0.5 backdrop-blur-sm"
            >
              <span className="text-lg font-black leading-none">{val}</span>
              <span className="text-[8px] font-bold uppercase tracking-tighter opacity-70">DZD</span>
            </button>
          ))}
        </div>

        <div className="relative flex items-center gap-2 mb-4">
          <div className="h-px flex-grow bg-white/10"></div>
          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">ou montant précis</span>
          <div className="h-px flex-grow bg-white/10"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-emerald-700/40 border-2 border-emerald-400/20 rounded-2xl p-4 text-white placeholder:text-emerald-300/40 focus:outline-none focus:border-white focus:bg-emerald-700/60 transition-all font-black text-xl"
              placeholder="0.00"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xs text-emerald-300">DZD</span>
          </div>
          <button
            type="submit"
            disabled={!amount}
            className="w-16 bg-white text-emerald-700 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseTracker;
