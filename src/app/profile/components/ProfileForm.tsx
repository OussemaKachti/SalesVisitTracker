'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/hooks/useAuth';

interface ProfileFormProps {
  user: any;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: user?.prenom || '',
    lastName: user?.nom || '',
    email: user?.email || '',
    phone: user?.telephone || '',
    role: user?.role || '',
    avatar: '/assets/images/user.png',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Update failed:', error);
      // Optional: Add error state/toast here
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: any = {
      admin: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30',
      commercial: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30',
      consultant: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30',
    };
    return colors[role?.toLowerCase()] || 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/30';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-300/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-400/50 transition-all duration-300">
      {/* Header with Gradient */}
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 px-8 py-7 border-b border-slate-200/60">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/5 to-pink-400/5 rounded-full blur-2xl"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-lg border border-slate-200/50 group-hover:scale-105 transition-transform">
              <Icon name="UserCircleIcon" size={26} className="text-slate-700" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Informations Personnelles</h2>
              <p className="text-sm text-slate-600 mt-0.5">Gérez votre identité professionnelle</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${getRoleBadgeColor(formData.role)} animate-in fade-in slide-in-from-right-2 duration-500`}>
            {formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : 'User'}
          </div>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section - Enhanced */}
          <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-50/50 to-blue-50/30 rounded-2xl border border-slate-200/60 shadow-inner">
             <div className="relative group">
               <div className="h-24 w-24 rounded-2xl border-2 border-white shadow-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 ring-4 ring-slate-200/50 group-hover:ring-blue-400/50 transition-all duration-300">
                 <AppImage
                   src={formData.avatar}
                   alt="Profile"
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                 />
               </div>
               <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg border-2 border-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110">
                 <Icon name="CameraIcon" size={16} className="text-white" />
               </div>
             </div>
             <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Photo de profil</h3>
                    <p className="text-xs text-slate-500 mt-1">Format JPG ou PNG. Taille maximale 2MB.</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                   <button type="button" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
                      <Icon name="ArrowUpTrayIcon" size={14} />
                      Changer
                   </button>
                   <button type="button" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Icon name="TrashIcon" size={14} />
                      Supprimer
                   </button>
                </div>
             </div>
          </div>

          {/* Form Fields - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2 group">
               <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                 <Icon name="UserIcon" size={14} className="text-slate-400" />
                 Prénom
               </label>
               <input 
                 type="text" 
                 name="firstName"
                 value={formData.firstName} 
                 onChange={handleChange}
                 className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none hover:border-slate-300"
               />
             </div>

             <div className="space-y-2 group">
               <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                 <Icon name="UserIcon" size={14} className="text-slate-400" />
                 Nom
               </label>
               <input 
                 type="text" 
                 name="lastName"
                 value={formData.lastName} 
                 onChange={handleChange}
                 className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none hover:border-slate-300"
               />
             </div>

             <div className="space-y-2 group">
               <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                 <Icon name="EnvelopeIcon" size={14} className="text-slate-400" />
                 Email
                 <span className="ml-auto flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                   <Icon name="LockClosedIcon" size={12} />
                   Verrouillé
                 </span>
               </label>
               <input 
                 type="email" 
                 name="email"
                 value={formData.email} 
                 disabled
                 className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
               />
             </div>

             <div className="space-y-2 group">
               <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                 <Icon name="PhoneIcon" size={14} className="text-slate-400" />
                 Téléphone
               </label>
               <input 
                 type="tel" 
                 name="phone"
                 value={formData.phone} 
                 onChange={handleChange}
                 placeholder="+216 XX XXX XXX"
                 className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none hover:border-slate-300"
               />
             </div>
          </div>

          {/* Action Bar */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Icon name="InformationCircleIcon" size={14} className="text-slate-400" />
              Les modifications seront appliquées immédiatement
            </p>
            <button 
               type="submit"
               disabled={isLoading}
               className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all shadow-xl relative overflow-hidden group
                ${isSuccess 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40' 
                  : 'bg-gradient-to-r from-slate-800 via-slate-900 to-black text-white shadow-slate-900/30 hover:shadow-2xl hover:shadow-slate-900/50'
                }
               `}
            >
               <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
               {isLoading ? (
                 <>
                   <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
                   <span className="relative">Enregistrement...</span>
                 </>
               ) : isSuccess ? (
                 <>
                   <Icon name="CheckCircleIcon" size={18} />
                   <span className="relative">Enregistré avec succès !</span>
                 </>
               ) : (
                 <>
                   <Icon name="CheckIcon" size={18} />
                   <span className="relative">Enregistrer les modifications</span>
                 </>
               )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
