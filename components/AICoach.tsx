
import React, { useState } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserData, Language } from '../types';
import { TRANSLATIONS, formatCurrency } from '../constants';

interface AICoachProps {
  userData: UserData;
  lang: Language;
}

const AICoach: React.FC<AICoachProps> = ({ userData, lang }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[lang];

  const totalIncome = userData.salary + userData.otherIncome;
  const totalSpent = userData.budgetPlan.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalIncome - totalSpent;
  
  const theme = userData.gender === 'woman' ? 'pink' : 'emerald';
  const themeText = theme === 'pink' ? 'text-pink-600' : 'text-emerald-600';
  const themeBg = theme === 'pink' ? 'bg-pink-600' : 'bg-emerald-600';
  const themeBgLight = theme === 'pink' ? 'bg-pink-50' : 'bg-emerald-100';
  const themeBorderFocus = theme === 'pink' ? 'focus:border-pink-500' : 'focus:border-emerald-500';
  const themeBorderNotif = theme === 'pink' ? 'border-pink-100' : 'border-emerald-100';
  const themeBgNotif = theme === 'pink' ? 'bg-pink-50' : 'bg-emerald-50';
  const themeTextNotif = theme === 'pink' ? 'text-pink-900' : 'text-emerald-900';

  const askAI = async (customQuery?: string) => {
    const textToAsk = customQuery || query;
    if (!textToAsk.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Tu es DzAdvisor, un coach financier expert pour les Algériens.
        L'utilisateur te parle en ${lang === 'fr' ? 'français' : 'arabe'}.
        L'utilisateur est un(e) ${userData.gender === 'woman' ? 'femme' : 'homme'}.
        
        DONNÉES FINANCIÈRES ACTUELLES :
        - Revenu total : ${formatCurrency(totalIncome, 'fr')}
        - Déjà dépensé : ${formatCurrency(totalSpent, 'fr')}
        - Reste à vivre : ${formatCurrency(remaining, 'fr')}
        - Budget Plan détaillé : ${userData.budgetPlan.map(c => `${c.name.fr}: ${c.budgeted} DA (Dépensé: ${c.spent} DA)`).join(', ')}

        RÈGLES :
        1. Sois très concret et adapté à l'Algérie (prix du marché, contexte local, Dara, épargne projets comme voiture ou mariage).
        2. Ne donne pas de conseils génériques. Analyse les chiffres fournis.
        3. Réponds en ${lang === 'fr' ? 'français clair' : 'arabe algérien (Darja) ou arabe standard'}.
        4. Si l'utilisateur a dépassé un budget, propose une solution pour compenser.
        5. Garde une réponse courte et motivante (max 4-5 phrases).
        6. Utilise des emojis pour rendre le message amical.

        QUESTION DE L'UTILISATEUR : ${textToAsk}
      `;

      const result: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setResponse(result.text || "Désolé, je n'ai pas pu analyser cela.");
      setQuery('');
    } catch (error) {
      console.error(error);
      setResponse("Une erreur est survenue lors de la connexion avec DzAdvisor. Vérifie ta connexion internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${themeBgLight} rounded-xl flex items-center justify-center ${themeText}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="font-black text-slate-900 leading-tight">{t.aiCoachTitle}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.aiCoachSubtitle}</p>
        </div>
      </div>

      <div className="space-y-4">
        {response && (
          <div className={`${themeBgNotif} p-4 rounded-2xl text-sm font-medium ${themeTextNotif} border ${themeBorderNotif} leading-relaxed animate-pop-in relative`}>
            <button onClick={() => setResponse(null)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {response}
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button 
            onClick={() => askAI(t.aiSuggest1)}
            disabled={loading}
            className={`flex-shrink-0 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:${themeBgNotif} hover:${themeBorderNotif} transition-all uppercase tracking-tighter disabled:opacity-50`}
          >
            🔍 {t.aiSuggest1}
          </button>
          <button 
            onClick={() => askAI(t.aiSuggest2)}
            disabled={loading}
            className={`flex-shrink-0 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:${themeBgNotif} hover:${themeBorderNotif} transition-all uppercase tracking-tighter disabled:opacity-50`}
          >
            💰 {t.aiSuggest2}
          </button>
          <button 
            onClick={() => askAI(t.aiSuggest3)}
            disabled={loading}
            className={`flex-shrink-0 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:${themeBgNotif} hover:${themeBorderNotif} transition-all uppercase tracking-tighter disabled:opacity-50`}
          >
            ⚡ {t.aiSuggest3}
          </button>
        </div>

        <div className="relative">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askAI()}
            placeholder={t.aiPlaceholder}
            className={`w-full bg-slate-50 border-2 border-transparent ${themeBorderFocus} focus:bg-white rounded-2xl p-4 ${lang === 'ar' ? 'pl-12' : 'pr-12'} text-sm font-medium focus:outline-none transition-all`}
          />
          <button 
            onClick={() => askAI()}
            disabled={loading || !query.trim()}
            className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-8 h-8 ${themeBg} text-white rounded-xl flex items-center justify-center disabled:opacity-50 active:scale-90 transition-all`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
