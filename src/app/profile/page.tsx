'use client';

import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/common/Header';
import ProfileForm from './components/ProfileForm';
import PasswordChangeForm from './components/PasswordChangeForm';
import Icon from '@/components/ui/AppIcon';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/5 to-indigo-400/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-400/5 to-pink-400/10 rounded-full blur-3xl"></div>
      
      <Header />
      
      <main className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Spectacular Page Header */}
        <div className="mb-14 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <Icon name="UserCircleIcon" size={240} className="text-slate-400" />
          </div>
          
          <div className="relative inline-flex flex-col items-center">
          
            
            <h1 className="text-5xl md:text-6xl font-black mb-4 relative">
              
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent drop-shadow-sm">
                Mon Profil
              </span>
            </h1>
            
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Personnalisez votre expérience, gérez votre sécurité et restez en contrôle de vos informations.
            </p>
            
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-slate-700">Compte actif</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-full">
                <Icon name="ShieldCheckIcon" size={16} className="text-blue-600" />
                <span className="text-sm font-bold text-blue-700">Sécurisé</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-[1400px] mx-auto">
            {/* Left Column - Profile Info */}
            <div className="space-y-8">
              {user && <ProfileForm user={user} />}
              
             
            </div>

            {/* Right Column - Security & Help */}
            <div className="space-y-8">
              <PasswordChangeForm />
              
             
            </div>
        </div>
      </main>
    </div>
  );
}
