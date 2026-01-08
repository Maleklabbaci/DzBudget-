
import React, { useState } from 'react';
import { QUESTIONS, TRANSLATIONS } from '../constants';
import { Question, Language } from '../types';

interface QuestionnaireProps {
  lang: Language;
  onComplete: (answers: Record<number, any>) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ lang, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [numInput, setNumInput] = useState('');
  const [multiInput, setMultiInput] = useState<number[]>([]);

  const t = TRANSLATIONS[lang];
  const currentQuestion = QUESTIONS[currentIdx];
  
  // Dynamic theme detection for the questionnaire
  const isWoman = answers[0] === 2;
  const themeText = isWoman ? 'text-pink-600' : 'text-emerald-600';
  const themeBg = isWoman ? 'bg-pink-600' : 'bg-emerald-600';
  const themeBgLight = isWoman ? 'bg-pink-50' : 'bg-emerald-50';
  const themeBorder = isWoman ? 'border-pink-500' : 'border-emerald-500';
  const themeShadow = isWoman ? 'shadow-pink-100' : 'shadow-emerald-100';

  const handleNext = (val: any) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: val };
    setAnswers(updatedAnswers);
    setNumInput('');
    setMultiInput([]);

    let nextIdx = currentIdx + 1;
    while (nextIdx < QUESTIONS.length) {
      const nextQ = QUESTIONS[nextIdx];
      if (!nextQ.condition || nextQ.condition(updatedAnswers)) {
        setCurrentIdx(nextIdx);
        return;
      }
      nextIdx++;
    }

    onComplete(updatedAnswers);
  };

  const toggleMulti = (val: number) => {
    if (multiInput.includes(val)) {
      setMultiInput(multiInput.filter(v => v !== val));
    } else {
      setMultiInput([...multiInput, val]);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-slide-up">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3 px-1">
          <span className={`text-[10px] font-black uppercase tracking-widest ${themeText}`}>
            {t.stepQuestionnaire}
          </span>
          <span className="text-[10px] font-black text-slate-400">
            {currentIdx + 1} / {QUESTIONS.length}
          </span>
        </div>
        <div className="w-full bg-white h-2 rounded-full overflow-hidden shadow-inner border border-slate-100">
          <div 
            className={`${themeBg} h-full transition-all duration-700 ease-out`} 
            style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <div key={currentIdx} className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 animate-slide-in-right">
        <h2 className="text-2xl font-black text-slate-900 mb-8 leading-tight text-center sm:text-left">
          {currentQuestion.text[lang]}
        </h2>

        {currentQuestion.type === 'choice' && currentQuestion.options && (
          <div className="space-y-4">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleNext(opt.value)}
                className={`w-full text-left p-5 rounded-[1.5rem] border-2 border-slate-50 bg-slate-50 hover:${themeBorder} hover:${themeBgLight} transition-all group flex items-center gap-5 rtl:text-right`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm group-hover:${themeBg} group-hover:text-white flex items-center justify-center font-black text-slate-400 transition-all text-lg`}>
                  {i + 1}
                </div>
                <span className="text-slate-800 font-bold flex-grow text-lg leading-tight">{opt.label[lang]}</span>
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'number' && (
          <div className="space-y-6">
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={numInput}
                onChange={(e) => setNumInput(e.target.value)}
                placeholder="0"
                className={`w-full p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:${themeBorder} focus:bg-white focus:outline-none text-3xl font-black text-center`}
                autoFocus
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300 pointer-events-none">DZD</span>
            </div>
            <button
              onClick={() => handleNext(Number(numInput) || 0)}
              disabled={!numInput}
              className={`w-full py-5 ${themeBg} text-white rounded-2xl font-black text-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-xl ${themeShadow}`}
            >
              {t.valider}
            </button>
          </div>
        )}

        {currentQuestion.type === 'multi' && currentQuestion.options && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => toggleMulti(opt.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between rtl:text-right ${
                    multiInput.includes(opt.value) 
                      ? `${themeBorder} ${themeBgLight} shadow-sm` 
                      : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <span className="text-slate-700 font-bold">{opt.label[lang]}</span>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    multiInput.includes(opt.value) ? `${themeBg} ${themeBorder}` : 'border-slate-300 bg-white'
                  }`}>
                    {multiInput.includes(opt.value) && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => handleNext(multiInput)}
              className={`w-full mt-4 py-5 ${themeBg} text-white rounded-2xl font-black text-xl hover:opacity-90 transition-all shadow-xl ${themeShadow}`}
            >
              {t.suivant}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
