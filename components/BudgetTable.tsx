
import React from 'react';
import { BudgetCategory, Language, Gender } from '../types';
import { TRANSLATIONS, formatCurrency } from '../constants';

interface BudgetTableProps {
  categories: BudgetCategory[];
  lang: Language;
  gender?: Gender;
}

const BudgetTable: React.FC<BudgetTableProps> = ({ categories, lang, gender }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['fr'];
  const totalBudget = (categories || []).reduce((sum, cat) => sum + (cat.budgeted || 0), 0);
  const totalSpent = (categories || []).reduce((sum, cat) => sum + (cat.spent || 0), 0);
  const totalRemaining = totalBudget - totalSpent;

  const isWoman = gender === 'woman';
  const themeText = isWoman ? 'text-pink-600' : 'text-emerald-600';
  const themeBg = isWoman ? 'bg-pink-600' : 'bg-emerald-600';
  const themeBgLight = isWoman ? 'bg-pink-50' : 'bg-emerald-50';

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-pop-in">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">{t.tableCat}</th>
              <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">{t.tablePrev}</th>
              <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">{t.tableDep}</th>
              <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">{t.tableRest}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(categories || []).map((cat) => {
              const remaining = (cat.budgeted || 0) - (cat.spent || 0);
              const ratio = (cat.budgeted || 0) > 0 ? (cat.spent / cat.budgeted) * 100 : 0;
              
              return (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-sm group-hover:text-emerald-600 transition-colors">{cat.name?.[lang] || ''}</span>
                      <div className="w-24 bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${ratio > 100 ? 'bg-rose-500' : themeBg}`} 
                          style={{ width: `${Math.min(ratio, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-xs font-bold text-slate-500">{formatCurrency(cat.budgeted, lang)}</span>
                  </td>
                  <td className="p-5">
                    <span className={`text-xs font-black ${cat.spent > cat.budgeted ? 'text-rose-500' : 'text-slate-700'}`}>
                      {formatCurrency(cat.spent, lang)}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border shadow-sm ${remaining >= 0 ? `${themeBgLight} ${themeText} border-emerald-100` : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      {formatCurrency(remaining, lang)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-900 text-white">
              <td className="p-5 font-black text-xs uppercase tracking-widest">{t.total}</td>
              <td className="p-5 font-black text-xs">{formatCurrency(totalBudget, lang)}</td>
              <td className="p-5 font-black text-xs">{formatCurrency(totalSpent, lang)}</td>
              <td className="p-5">
                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${totalRemaining >= 0 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-rose-500/20 border-rose-400 text-rose-300'}`}>
                   {formatCurrency(totalRemaining, lang)}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default BudgetTable;
