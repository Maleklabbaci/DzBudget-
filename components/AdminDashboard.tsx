
import React, { useState } from 'react';
import { Language, User } from '../types';
import { TRANSLATIONS } from '../constants';

interface AdminDashboardProps {
  lang: Language;
  users: User[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onSimulateTime: () => void;
  onCreateUser: (newUser: { name: string, email: string, password: string, durationMonths: number }) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang, users, onUpdateUser, onSimulateTime, onCreateUser }) => {
  const t = TRANSLATIONS[lang];
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', duration: 1 });
  
  // Confirmation state
  const [confirmAction, setConfirmAction] = useState<{ type: string; payload: any; message: string } | null>(null);

  const toggleStatus = (user: User) => {
    const nextStatus = user.subscriptionStatus === 'active' ? 'paused' : 'active';
    const msg = nextStatus === 'active' 
      ? `Activer le compte de ${user.name} ?` 
      : `Désactiver le compte de ${user.name} ?`;
      
    setConfirmAction({
      type: 'TOGGLE_STATUS',
      payload: { userId: user.id, status: nextStatus },
      message: msg
    });
  };

  const handleExtendRequest = (user: User, months: number) => {
    const msg = `Prolonger l'abonnement de ${user.name} de ${months} mois ?`;
    setConfirmAction({
      type: 'EXTEND',
      payload: { user, months },
      message: msg
    });
  };

  const processConfirm = () => {
    if (!confirmAction) return;

    if (confirmAction.type === 'TOGGLE_STATUS') {
      onUpdateUser(confirmAction.payload.userId, { subscriptionStatus: confirmAction.payload.status });
    } else if (confirmAction.type === 'EXTEND') {
      const { user, months } = confirmAction.payload;
      const currentExpiry = new Date(user.subscriptionExpiry);
      const now = new Date();
      const baseDate = currentExpiry < now ? now : currentExpiry;
      baseDate.setMonth(baseDate.getMonth() + months);
      onUpdateUser(user.id, { subscriptionExpiry: baseDate.toISOString(), subscriptionStatus: 'active' });
    } else if (confirmAction.type === 'CREATE') {
      onCreateUser(confirmAction.payload);
      setShowCreateForm(false);
      setFormData({ name: '', email: '', password: '', duration: 1 });
    }

    setConfirmAction(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmAction({
      type: 'CREATE',
      payload: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        durationMonths: formData.duration
      },
      message: `Créer le compte pour ${formData.name} (${formData.duration} mois) ?`
    });
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

  const regularUsers = users.filter(u => u.role === 'user');

  return (
    <div className="space-y-8 animate-slide-up pb-12">
      {/* Global Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-pop-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-6">{confirmAction.message}</h4>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setConfirmAction(null)} className="py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase">Annuler</button>
              <button onClick={processConfirm} className="py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase shadow-lg active:scale-95">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight">{t.adminTitle}</h2>
          <p className="text-slate-500 font-medium">{lang === 'ar' ? 'لوحة التحكم في المستخدمين والاشتراكات' : 'Gestion des accès et abonnements'}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex-grow sm:flex-none px-6 py-4 bg-emerald-600 text-white text-xs font-black rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 active:scale-95"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                {lang === 'ar' ? 'إضافة حساب' : 'Nouveau Compte'}
            </button>
            <button 
                onClick={onSimulateTime}
                className="px-6 py-4 bg-slate-900 text-white text-xs font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {t.adminSimulateTime}
            </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-emerald-100 shadow-xl animate-pop-in">
          <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
            <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">👤</span>
            {lang === 'ar' ? 'معلومات الحساب الجديد' : 'Créer un nouvel utilisateur'}
          </h3>
          <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nom Complet</label>
              <input type="text" required placeholder="Ex: Karim Bensmail" className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold text-sm transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
              <input type="email" required placeholder="karim@mail.com" className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold text-sm transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mot de passe</label>
              <input type="text" required placeholder="••••••••" className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold text-sm transition-all" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Durée initiale</label>
              <select className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold text-sm transition-all appearance-none cursor-pointer" value={formData.duration} onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}>
                <option value={1}>1 Mois</option>
                <option value={3}>3 Mois</option>
                <option value={6}>6 Mois</option>
                <option value={12}>1 An (12 Mois)</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowCreateForm(false)} className="px-8 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Annuler</button>
              <button type="submit" className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">Valider la création</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">{t.adminUsers}</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-black text-slate-900">{regularUsers.length}</p>
            <span className="text-xs font-bold text-slate-400 mb-1.5">{lang === 'ar' ? 'مستخدم' : 'total'}</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-full -mr-8 -mt-8"></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">{t.statusActive}</p>
          <div className="flex items-end gap-2 relative z-10">
            <p className="text-4xl font-black text-emerald-600">{users.filter(u => u.subscriptionStatus === 'active').length}</p>
            <div className="w-2 h-2 bg-emerald-500 rounded-full mb-3 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-full -mr-8 -mt-8"></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">{lang === 'ar' ? 'المتوقفين' : 'Non-actifs'}</p>
          <p className="text-4xl font-black text-rose-500 relative z-10">{users.filter(u => u.subscriptionStatus !== 'active').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Utilisateur</th>
                <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Statut</th>
                <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Expiration</th>
                <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest">Actions de Validité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {regularUsers.length === 0 ? (
                <tr><td colSpan={4} className="p-12 text-center text-slate-400 font-bold">Aucun utilisateur enregistré</td></tr>
              ) : regularUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xl shadow-inner group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors uppercase">{user.name[0]}</div>
                      <div>
                        <p className="font-black text-slate-900 text-sm">{user.name}</p>
                        <p className="text-[10px] font-bold text-emerald-600 lowercase bg-emerald-50 px-1.5 py-0.5 rounded-lg border border-emerald-100 inline-block mt-0.5">PWD: {user.password}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border tracking-widest shadow-sm ${getStatusColor(user.subscriptionStatus)}`}>{getStatusLabel(user.subscriptionStatus)}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-700">{new Date(user.subscriptionExpiry).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'ar-DZ')}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(user.subscriptionExpiry) < new Date() ? 'Expiré' : 'Date d\'échéance'}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-1.5">
                            {[1, 3, 6, 12].map(m => (
                                <button key={m} onClick={() => handleExtendRequest(user, m)} className="px-2 py-1.5 bg-white border border-slate-200 text-[9px] font-black rounded-lg hover:bg-emerald-50 hover:border-emerald-200 transition-all">+{m === 12 ? '1A' : m+'M'}</button>
                            ))}
                        </div>
                        <button onClick={() => toggleStatus(user)} className={`w-full px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${user.subscriptionStatus === 'active' ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white'}`}>
                          {user.subscriptionStatus === 'active' ? t.adminActionPause : t.adminActionActivate}
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-8 bg-slate-100 rounded-[2rem] border border-slate-200">
        <p className="text-xs text-slate-500 font-bold leading-relaxed flex items-center gap-3">
          <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg">🔒</span>
          <span>{lang === 'ar' ? 'تنبيه: أنت وحدك من يمكنه إنشاء الحسابات وتفعيلها.' : 'Sécurité : Vous êtes le seul à pouvoir créer et activer les comptes.'}</span>
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
