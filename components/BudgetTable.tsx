
import React from 'react';
import { BudgetCategory, Language } from '../types';
import { formatCurrency, TRANSLATIONS } from '../constants';

interface BudgetTableProps {
  categories: BudgetCategory[];
  lang: Language;
}

const BudgetTable: React.FC<BudgetTableProps> = ({ categories, lang }) => {
  const t = TRANSLATIONS[lang];
  const totalBudgeted = categories.reduce((sum, c) => sum + c.budgeted, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);

  return (
    <div className="space-y-4">
      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-3xl shadow-sm border border-slate-100">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-5 font-bold text-slate-600 text-[10px] uppercase tracking-wider">{t.tableCat}</th>
              <th className="p-5 font-bold text-slate-600 text-[10px] uppercase tracking-wider">{t.tablePrev}</th>
              <th className="p-5 font-bold text-slate-600 text-[10px] uppercase tracking-wider">{t.tableDep}</th>
              <th className="p-5 font-bold text-slate-600 text-[10px] uppercase tracking-wider">{t.usage}</th>
              <th className="p-5 font-bold text-slate-600 text-[10px] uppercase tracking-wider">{t.tableRest}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => {
              const remaining = cat.budgeted - cat.spent;
              const progress = (cat.spent / cat.budgeted) * 100;
              return (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-5">
                    <span className="font-black text-slate-800">{cat.name[lang]}</span>
                  </td>
                  <td className="p-5 text-slate-600 font-semibold">{formatCurrency(cat.budgeted, lang)}</td>
                  <td className="p-5 text-slate-600 font-semibold">{formatCurrency(cat.spent, lang)}</td>
                  <td className="p-5 min-w-[150px]">
                    <div className="flex items-center gap-3">
                      <div className="flex-grow bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner relative">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out ${
                            progress > 100 ? 'bg-rose-500' : progress > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} 
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-black w-8 text-right rtl:text-left ${
                        progress > 100 ? 'text-rose-600' : 'text-slate-500'
                      }`}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </td>
                  <td className={`p-5 font-black text-sm ${remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatCurrency(remaining, lang)}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-slate-900 text-white font-bold">
              <td className="p-5 rounded-bl-3xl rtl:rounded-bl-none rtl:rounded-br-3xl uppercase tracking-widest text-[10px]">{t.total}</td>
              <td className="p-5 text-sm">{formatCurrency(totalBudgeted, lang)}</td>
              <td className="p-5 text-sm">{formatCurrency(totalSpent, lang)}</td>
              <td className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex-grow bg-white/10 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-all duration-1000" 
                      style={{ width: `${Math.min((totalSpent / totalBudgeted) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className={`p-5 rounded-br-3xl rtl:rounded-br-none rtl:rounded-bl-3xl text-sm ${totalBudgeted - totalSpent < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {formatCurrency(totalBudgeted - totalSpent, lang)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile View: Cards */}
      <div className="md:hidden space-y-4">
        {categories.map((cat) => {
          const remaining = cat.budgeted - cat.spent;
          const progress = (cat.spent / cat.budgeted) * 100;
          return (
            <div key={cat.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm active:bg-slate-50 transition-all animate-pop-in">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 leading-none mb-1">{cat.name[lang]}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.usage} {Math.round(progress)}%</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-black block ${remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatCurrency(remaining, lang)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{t.tableRest}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${
                      progress > 100 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 
                      progress > 80 ? 'bg-amber-500' : 
                      'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                    }`} 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center px-1">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.tablePrev}</span>
                    <span className="text-xs font-bold text-slate-700">{formatCurrency(cat.budgeted, lang)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.tableDep}</span>
                    <span className="text-xs font-bold text-slate-700">{formatCurrency(cat.spent, lang)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Total Summary Card Mobile */}
        <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl mt-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8"></div>
           <div className="flex justify-between items-center mb-4 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.total}</span>
              <span className={`text-xl font-black ${totalBudgeted - totalSpent < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {formatCurrency(totalBudgeted - totalSpent, lang)}
              </span>
           </div>
           
           <div className="space-y-3 relative z-10">
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-1000" 
                  style={{ width: `${Math.min((totalSpent / totalBudgeted) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>{t.spent}: {formatCurrency(totalSpent, lang)}</span>
                <span>{Math.round((totalSpent / totalBudgeted) * 100)}%</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTable;
