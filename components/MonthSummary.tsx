
import React from 'react';
import { UserData, Language } from '../types';
import { TRANSLATIONS, formatCurrency } from '../constants';

interface MonthSummaryProps {
  userData: UserData;
  lang: Language;
  onBack: () => void;
}

const MonthSummary: React.FC<MonthSummaryProps> = ({ userData, lang, onBack }) => {
  const t = TRANSLATIONS[lang];
  const totalIncome = userData.salary + userData.otherIncome;
  const totalSpent = userData.budgetPlan.reduce((sum, cat) => sum + cat.spent, 0);
  const realSavings = totalIncome - totalSpent;

  const savingsCat = userData.budgetPlan.find(c => c.id === 'epargne');
  const plannedSavings = savingsCat ? savingsCat.budgeted : 0;
  const savingsRatio = plannedSavings > 0 ? (realSavings / plannedSavings) * 100 : 100;

  const getCategoryScore = (budgeted: number, spent: number) => {
    if (budgeted === 0) return 100;
    const overspendRatio = Math.max(0, (spent - budgeted) / budgeted);
    return Math.max(0, 100 - overspendRatio * 200);
  };

  const calculateGlobalScore = () => {
    let totalScore = 0;
    let totalWeight = 0;
    userData.budgetPlan.forEach(cat => {
      const isEssential = ['logement', 'nourriture', 'factures', 'sante'].includes(cat.id);
      const weight = isEssential ? 2 : 1;
      const score = getCategoryScore(cat.budgeted, cat.spent);
      totalScore += score * weight;
      totalWeight += weight;
    });
    return Math.round(totalScore / totalWeight);
  };

  const globalScore = calculateGlobalScore();

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const generateAdvice = () => {
    const overspentCats = userData.budgetPlan.filter(c => c.spent > c.budgeted);
    if (overspentCats.length === 0) {
      return lang === 'fr' 
        ? "Excellent travail ! Tu as respecté chaque catégorie de ton plan. Ton épargne est sur la bonne voie."
        : "عمل ممتاز! لقد احترمت كل فئات خطتك. ادخارك في المسار الصحيح.";
    }
    const worstCat = overspentCats.sort((a, b) => (b.spent - b.budgeted) - (a.spent - a.budgeted))[0];
    const diff = worstCat.spent - worstCat.budgeted;
    return lang === 'fr'
      ? `Attention à la catégorie "${worstCat.name.fr}". Tu as dépassé de ${formatCurrency(diff, 'fr')}. Essaie de limiter tes achats impulsifs le mois prochain.`
      : `انتبه لفئة "${worstCat.name.ar}". لقد تجاوزت الميزانية بـ ${formatCurrency(diff, 'ar')}. حاول الحد من المشتريات غير الضرورية الشهر المقبل.`;
  };

  return (
    <div className="space-y-8 pb-12 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight">{t.bilanTitle}</h2>
          <p className="text-slate-500 font-medium">{t.bilanSubtitle}</p>
        </div>
        <button 
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          {t.backToTracker}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-xl">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t.globalScore}</p>
          <div className={`text-6xl font-black mb-2 ${getGradeColor(globalScore)}`}>
            {globalScore}
          </div>
          <p className="font-black text-xl">{TRANSLATIONS[lang][`grade${globalScore >= 90 ? 'Excellent' : globalScore >= 70 ? 'Good' : globalScore >= 50 ? 'Average' : 'Poor'}`]}</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t.plannedSavings}</p>
          <p className="text-2xl font-black text-slate-900 mb-4">{formatCurrency(plannedSavings, lang)}</p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t.realSavings}</p>
          <p className={`text-2xl font-black mb-4 ${realSavings >= plannedSavings ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatCurrency(realSavings, lang)}
          </p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full transition-all duration-1000 ${savingsRatio >= 100 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
              style={{ width: `${Math.min(savingsRatio, 100)}%` }} 
            />
          </div>
          <span className="text-xs font-black text-slate-400">{Math.round(savingsRatio)}% {t.savingsGoalRatio}</span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">{t.tableCat}</th>
                <th className="p-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">{t.tablePrev}</th>
                <th className="p-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">{t.tableDep}</th>
                <th className="p-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">{t.gap}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userData.budgetPlan.map(cat => {
                const gap = cat.budgeted - cat.spent;
                const ratio = (cat.spent / cat.budgeted) * 100;
                return (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black text-slate-800">{cat.name[lang]}</td>
                    <td className="p-4 text-xs font-bold text-slate-500">{formatCurrency(cat.budgeted, lang)}</td>
                    <td className="p-4 text-xs font-bold text-slate-500">{formatCurrency(cat.spent, lang)}</td>
                    <td className={`p-4 font-black text-sm ${gap >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {gap > 0 ? '+' : ''}{formatCurrency(gap, lang)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-emerald-700 text-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 bg-emerald-600 rounded-full opacity-40 blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            {t.advicePattern}
          </h3>
          <p className="text-emerald-50 leading-relaxed text-xl font-bold italic opacity-95">
            "{generateAdvice()}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthSummary;
