'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function PasswordChangeForm() {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!passwords.currentPassword) {
        setMessage({ type: 'error', text: 'Veuillez saisir votre mot de passe actuel.' });
        return;
    }

    if (passwords.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
        return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentPassword: passwords.currentPassword,
          password: passwords.newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue.');
      }

      setMessage({ type: 'success', text: 'Votre mot de passe a été mis à jour avec succès.' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Une erreur est survenue.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { label: '', strength: 0, color: 'bg-slate-200' };
    if (password.length < 6) return { label: 'Faible', strength: 25, color: 'bg-red-500' };
    if (password.length < 10) return { label: 'Moyen', strength: 50, color: 'bg-amber-500' };
    if (password.length < 14) return { label: 'Bon', strength: 75, color: 'bg-blue-500' };
    return { label: 'Fort', strength: 100, color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(passwords.newPassword);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-300/50 overflow-hidden hover:shadow-2xl hover:shadow-indigo-400/20 transition-all duration-300">
      {/* Header with Gradient */}
      <div className="relative bg-gradient-to-br from-indigo-50/50 via-purple-50/40 to-pink-50/30 px-8 py-7 border-b border-slate-200/60">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/5 to-rose-400/5 rounded-full blur-2xl"></div>
        <div className="relative flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg border border-indigo-400/50">
            <Icon name="ShieldCheckIcon" size={26} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Sécurité du compte</h2>
            <p className="text-sm text-slate-600 mt-0.5">Renforcez la protection de votre compte</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <Icon name="InformationCircleIcon" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold">Conseils de sécurité</p>
              <p className="text-blue-700 text-xs mt-1">Utilisez au moins 8 caractères avec des lettres, chiffres et symboles.</p>
            </div>
          </div>

          {/* Current Password */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
              <div className="p-1.5 bg-slate-100 rounded-lg">
                <Icon name="KeyIcon" size={14} className="text-slate-600" />
              </div>
              Mot de passe actuel
            </label>
            <div className="relative group">
              <input 
                type="password" 
                name="currentPassword"
                value={passwords.currentPassword} 
                onChange={handleChange}
                placeholder="Saisissez votre mot de passe actuel"
                className="block w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none hover:border-slate-300 group-hover:shadow-md"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Icon name="ShieldExclamationIcon" size={18} className="text-slate-400" />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2"></div>

          {/* New Passwords Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
                 <div className="p-1.5 bg-emerald-100 rounded-lg">
                   <Icon name="LockClosedIcon" size={14} className="text-emerald-600" />
                 </div>
                 Nouveau mot de passe
               </label>
               <div className="relative group">
                 <input 
                   type="password" 
                   name="newPassword"
                   value={passwords.newPassword} 
                   onChange={handleChange}
                   placeholder="Minimum 8 caractères"
                   className="block w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none hover:border-slate-300 group-hover:shadow-md"
                 />
               </div>
               {/* Password Strength Indicator */}
               {passwords.newPassword && (
                 <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-xs font-bold text-slate-700">Force du mot de passe</span>
                     <span className={`text-xs font-black px-2 py-0.5 rounded-full ${strength.strength >= 75 ? 'bg-emerald-100 text-emerald-700' : strength.strength >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                       {strength.label}
                     </span>
                   </div>
                   <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                     <div 
                       className={`h-full ${strength.color} transition-all duration-500 rounded-full shadow-lg`}
                       style={{ width: `${strength.strength}%` }}
                     ></div>
                   </div>
                 </div>
               )}
             </div>

             <div className="space-y-2">
               <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
                 <div className="p-1.5 bg-blue-100 rounded-lg">
                   <Icon name="LockClosedIcon" size={14} className="text-blue-600" />
                 </div>
                 Confirmer le mot de passe
               </label>
               <div className="relative group">
                 <input 
                   type="password" 
                   name="confirmPassword"
                   value={passwords.confirmPassword} 
                   onChange={handleChange}
                   placeholder="Confirmez le nouveau mot de passe"
                   className="block w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none hover:border-slate-300 group-hover:shadow-md"
                 />
               </div>
               {passwords.confirmPassword && (
                 <div className={`mt-2 p-2.5 rounded-lg flex items-center gap-2 ${passwords.newPassword === passwords.confirmPassword ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                   <Icon 
                     name={passwords.newPassword === passwords.confirmPassword ? 'CheckCircleIcon' : 'XCircleIcon'} 
                     size={16} 
                     className={passwords.newPassword === passwords.confirmPassword ? 'text-emerald-600' : 'text-red-600'} 
                   />
                   <p className={`text-xs font-bold ${passwords.newPassword === passwords.confirmPassword ? 'text-emerald-700' : 'text-red-700'}`}>
                     {passwords.newPassword === passwords.confirmPassword ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas'}
                   </p>
                 </div>
               )}
             </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                message.type === 'success' 
                  ? 'bg-gradient-to-r from-emerald-50 to-emerald-50/50 border-2 border-emerald-200 text-emerald-900' 
                  : 'bg-gradient-to-r from-red-50 to-red-50/50 border-2 border-red-200 text-red-900'
            }`}>
                <Icon 
                    name={message.type === 'success' ? 'CheckCircleIcon' : 'ExclamationCircleIcon'} 
                    size={20} 
                    className={`flex-shrink-0 ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`} 
                />
                <div>
                  <p className="text-sm font-bold">{message.type === 'success' ? 'Succès !' : 'Erreur'}</p>
                  <p className="text-sm mt-0.5">{message.text}</p>
                </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
            <button 
                type="submit"
                disabled={isLoading || !passwords.currentPassword || !passwords.newPassword || passwords.newPassword !== passwords.confirmPassword}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 text-white rounded-xl text-sm font-black hover:from-indigo-700 hover:via-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:shadow-indigo-600/40 relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                {isLoading ? (
                  <>
                    <Icon name="ArrowPathIcon" size={18} className="animate-spin relative z-10" />
                    <span className="relative z-10">Mise à jour en cours...</span>
                  </>
                ) : (
                  <>
                    <Icon name="ShieldCheckIcon" size={18} className="relative z-10" />
                    <span className="relative z-10">Mettre à jour le mot de passe</span>
                  </>
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
