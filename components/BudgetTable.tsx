
import React from 'react';
import { BudgetCategory, Language, Gender } from '../types';
import { formatCurrency, TRANSLATIONS } from '../constants';

interface BudgetTableProps {
  categories: BudgetCategory[];
  lang: Language;
  gender?: Gender;
}

const BudgetTable: React.FC<BudgetTableProps> = ({ categories, lang, gender }) => {
  const t = TRANSLATIONS[lang];
  const totalBudgeted = categories.reduce((sum, c) => sum + c.budgeted, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  
  const isWoman = gender === 'woman';
  const themeBg = isWoman ? 'bg-pink-600' : 'bg-emerald-600';
  const themeText = isWoman ? 'text-pink-600' : 'text-emerald-600';
  const themeGradient = isWoman 
    ? 'bg-gradient-to-r from-pink-500 to-pink-600' 
    : 'bg-gradient-to-r from-emerald-500 to-emerald-600';
  const themeBgAccent = isWoman ? 'bg-pink-400' : 'bg-emerald-400';

  return (
    <div className="space-y-4">
      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">{t.tableCat}</th>
              <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">{t.tablePrev}</th>
              <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">{t.tableDep}</th>
              <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest w-[200px]">{t.usage}</th>
              <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">{t.tableRest}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => {
              const remaining = cat.budgeted - cat.spent;
              const progress = (cat.spent / cat.budgeted) * 100;
              const isOver = progress > 100;
              const isNear = progress > 80;

              return (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isOver ? 'bg-rose-500 animate-pulse' : isNear ? 'bg-amber-500' : themeBg}`}></div>
                        <span className="font-black text-slate-800 text-sm">{cat.name[lang]}</span>
                    </div>
                  </td>
                  <td className="p-6 text-slate-500 font-bold text-sm">{formatCurrency(cat.budgeted, lang)}</td>
                  <td className="p-6 text-slate-900 font-black text-sm">{formatCurrency(cat.spent, lang)}</td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner relative">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out shadow-sm ${
                            isOver ? 'bg-gradient-to-r from-rose-500 to-rose-600 shadow-rose-200' : 
                            isNear ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-amber-100' : 
                            themeGradient + ' shadow-emerald-100'
                          }`} 
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center px-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-tighter ${isOver ? 'text-rose-600' : 'text-slate-400'}`}>
                            {isOver ? (lang === 'ar' ? 'تجاوزت!' : 'Dépassement!') : ''}
                        </span>
                        <span className={`text-[10px] font-black ${isOver ? 'text-rose-600' : isNear ? 'text-amber-600' : 'text-slate-500'}`}>
                            {Math.round(progress)}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className={`p-6 font-black text-sm ${remaining < 0 ? 'text-rose-600' : themeText}`}>
                    {formatCurrency(remaining, lang)}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-slate-900 text-white font-bold">
              <td className="p-6 rounded-bl-[2.5rem] rtl:rounded-bl-none rtl:rounded-br-[2.5rem] uppercase tracking-widest text-[10px] font-black text-slate-400">{t.total}</td>
              <td className="p-6 text-sm">{formatCurrency(totalBudgeted, lang)}</td>
              <td className="p-6 text-sm">{formatCurrency(totalSpent, lang)}</td>
              <td className="p-6">
                <div className="flex flex-col gap-1.5">
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`${isWoman ? 'bg-pink-400' : 'bg-emerald-400'} h-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.3)]`} 
                      style={{ width: `${Math.min((totalSpent / totalBudgeted) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <span className="text-[10px] font-black text-slate-400">{Math.round((totalSpent / totalBudgeted) * 100)}%</span>
                  </div>
                </div>
              </td>
              <td className={`p-6 rounded-br-[2.5rem] rtl:rounded-br-none rtl:rounded-bl-[2.5rem] text-sm font-black ${totalBudgeted - totalSpent < 0 ? 'text-rose-400' : (isWoman ? 'text-pink-400' : 'text-emerald-400')}`}>
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
          const isOver = progress > 100;
          const isNear = progress > 80;

          return (
            <div key={cat.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm active:scale-[0.98] transition-all animate-pop-in">
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                   <div className={`w-3 h-3 rounded-full ${isOver ? 'bg-rose-500 animate-pulse' : isNear ? 'bg-amber-500' : themeBg}`}></div>
                   <div className="flex flex-col">
                      <span className="font-black text-slate-900 leading-none mb-1">{cat.name[lang]}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isOver ? 'text-rose-500' : isNear ? 'text-amber-500' : 'text-slate-400'}`}>
                        {Math.round(progress)}% {lang === 'ar' ? 'مستهلك' : 'utilisé'}
                      </span>
                   </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-black block ${remaining < 0 ? 'text-rose-600' : themeText}`}>
                    {formatCurrency(remaining, lang)}
                  </span>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{t.tableRest}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden shadow-inner relative">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out shadow-sm ${
                      isOver ? 'bg-gradient-to-r from-rose-500 to-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.3)]' : 
                      isNear ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                      themeGradient + ' shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    }`} 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
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
        <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl mt-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12 transition-transform duration-1000 group-hover:scale-150"></div>
           <div className="flex justify-between items-center mb-6 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.total}</span>
              <span className={`text-2xl font-black ${totalBudgeted - totalSpent < 0 ? 'text-rose-400' : (isWoman ? 'text-pink-400' : 'text-emerald-400')}`}>
                {formatCurrency(totalBudgeted - totalSpent, lang)}
              </span>
           </div>
           
           <div className="space-y-4 relative z-10">
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`${isWoman ? 'bg-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.4)]' : 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]'} transition-all duration-1000 h-full`} 
                  style={{ width: `${Math.min((totalSpent / totalBudgeted) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <span>{t.spent}: {formatCurrency(totalSpent, lang)}</span>
                <span className="text-white">{Math.round((totalSpent / totalBudgeted) * 100)}%</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTable;
