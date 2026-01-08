
import React from 'react';
import { Language, User } from '../types';
import { TRANSLATIONS, formatCurrency } from '../constants';

interface AdminDashboardProps {
  lang: Language;
  users: User[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onSimulateTime: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang, users, onUpdateUser, onSimulateTime }) => {
  const t = TRANSLATIONS[lang];

  const toggleStatus = (user: User) => {
    const nextStatus = user.subscriptionStatus === 'active' ? 'paused' : 'active';
    onUpdateUser(user.id, { subscriptionStatus: nextStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'paused': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'expired': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return t.statusActive;
      case 'paused': return t.statusPaused;
      case 'expired': return t.statusExpired;
      default: return status;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">{t.adminTitle}</h2>
        <button 
          onClick={onSimulateTime}
          className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t.adminSimulateTime}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">{t.adminUsers}</p>
          <p className="text-2xl font-bold text-slate-800">{users.filter(u => u.role === 'user').length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">{t.statusActive}</p>
          <p className="text-2xl font-bold text-emerald-600">{users.filter(u => u.subscriptionStatus === 'active').length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">{t.statusPaused}</p>
          <p className="text-2xl font-bold text-amber-600">{users.filter(u => u.subscriptionStatus !== 'active').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-600 text-sm">Utilisateur</th>
                <th className="p-4 font-bold text-slate-600 text-sm">Statut</th>
                <th className="p-4 font-bold text-slate-600 text-sm">Expiration</th>
                <th className="p-4 font-bold text-slate-600 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.filter(u => u.role === 'user').map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getStatusColor(user.subscriptionStatus)}`}>
                      {getStatusLabel(user.subscriptionStatus)}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-500 font-medium">
                    {t.expiryDate} {new Date(user.subscriptionExpiry).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'ar-DZ')}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(user)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        user.subscriptionStatus === 'active' 
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {user.subscriptionStatus === 'active' ? t.adminActionPause : t.adminActionActivate}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
