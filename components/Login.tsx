
import React, { useState } from 'react';
import { Language, User } from '../types';
import { TRANSLATIONS } from '../constants';

interface LoginProps {
  lang: Language;
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ lang, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const t = TRANSLATIONS[lang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@dz.dz' && password === 'admin') {
      onLogin({ email, role: 'admin' });
    } else {
      onLogin({ email, role: 'user' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{t.loginTitle}</h2>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">{t.loginEmail}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:outline-none transition-all"
            placeholder="email@dz.dz"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">{t.loginPass}</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
        >
          {t.loginBtn}
        </button>
      </form>

      <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-xs text-slate-500 italic leading-relaxed">
          {t.loginHint}
        </p>
      </div>
    </div>
  );
};

export default Login;
