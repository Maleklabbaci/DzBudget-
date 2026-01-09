
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
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

  const theme = userData.gender === 'woman' ? 'pink' : 'emerald';
  const themeText = theme === 'pink' ? 'text-pink-600' : 'text-emerald-600';
  const themeBg = theme === 'pink' ? 'bg-pink-600' : 'bg-emerald-600';
  const themeBgLight = theme === 'pink' ? 'bg-pink-50' : 'bg-emerald-50';

  const askAI = async (customQuery?: string) => {
    const textToAsk = customQuery || query;
    if (!textToAsk.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      // Correct initialization according to rules
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Tu es DzAdvisor, un coach financier expert pour les Algériens.
        L'utilisateur est un(e) ${userData.gender === 'woman' ? 'femme' : 'homme'}.
        REVENU: ${formatCurrency(userData.salary + userData.otherIncome, 'fr')}
        DEPENSES: ${userData.budgetPlan.map(c => `${c.name.fr}: ${c.budgeted} DZD`).join(', ')}

        RÈGLES:
        1. Sois très concret (vie en Algérie, prix, coutumes).
        2. Réponds en ${lang === 'fr' ? 'français' : 'arabe algérien'}.
        3. Max 4 phrases. Emojis autorisés.

        QUESTION: ${textToAsk}
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      // result.text is the property, not a function
      setResponse(result.text || "Désolé, je ne peux pas répondre.");
      setQuery('');
    } catch (error) {
      console.error(error);
      setResponse("Erreur de connexion avec l'IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 ${themeBgLight} rounded-lg flex items-center justify-center ${themeText}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h3 className="font-black text-slate-900 text-sm">{t.aiCoachTitle}</h3>
      </div>

      <div className="space-y-3">
        {response && (
          <div className="bg-slate-50 p-4 rounded-2xl text-xs font-medium text-slate-700 leading-relaxed border border-slate-100 animate-pop-in">
            {response}
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[t.aiSuggest1, t.aiSuggest2].map((s, i) => (
            <button key={i} onClick={() => askAI(s)} disabled={loading} className="whitespace-nowrap px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-tighter disabled:opacity-50">{s}</button>
          ))}
        </div>

        <div className="relative">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askAI()}
            placeholder={t.aiPlaceholder}
            className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 text-xs font-bold focus:outline-none transition-all"
          />
          <button onClick={() => askAI()} disabled={loading || !query.trim()} className={`absolute ${lang === 'ar' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 w-8 h-8 ${themeBg} text-white rounded-xl flex items-center justify-center shadow-lg disabled:opacity-50`}>
            {loading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "→"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
