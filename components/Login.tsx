
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LoginProps {
  lang: Language;
  onLogin: (loginData: { email: string, password?: string }) => void;
  error?: string | null;
}

const Login: React.FC<LoginProps> = ({ lang, onLogin, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const t = TRANSLATIONS[lang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-1 animate-pop-in">
      <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-50 rounded-br-full -ml-8 -mt-8 opacity-60"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-emerald-200 rotate-3">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2 uppercase tracking-tighter">{t.loginTitle}</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{lang === 'ar' ? 'مرحباً بك مجدداً' : 'Content de vous revoir'}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-600 text-xs font-black text-center animate-pop-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t.loginEmail}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
              placeholder="user@chahryti.dz"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t.loginPass}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95 text-lg"
          >
            {t.loginBtn}
          </button>
        </form>

        <div className="mt-12 p-5 bg-slate-50 rounded-2xl border border-slate-200/60 relative z-10">
          <p className="text-[11px] font-bold text-slate-500 italic leading-relaxed text-center">
            {t.loginHint}
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2024 CHAHRYTI ALGÉRIE</p>
      </div>
    </div>
  );
};

export default Login;
