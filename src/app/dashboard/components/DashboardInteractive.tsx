'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '../../../components/ui/AppIcon';

import KPICard from './KPICard';
import ActivityItem from './ActivityItem';
import UpcomingVisitCard from './UpcomingVisitCard';
import QuickActionButton from './QuickActionButton';
import PerformanceChart from './PerformanceChart';
import TeamMemberCard from './TeamMemberCard';

interface KPIData {
  title: string;
  value: string;
  change: number;
  icon: string;
  trend: 'up' | 'down';
  color: string;
}

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
  avatar: string;
  avatarAlt: string;
  type: 'visit' | 'client' | 'report';
}

interface UpcomingVisit {
  id: number;
  clientName: string;
  clientImage: string;
  clientImageAlt: string;
  time: string;
  location: string;
  priority: 'high' | 'medium' | 'low';
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  avatarAlt: string;
  visitsToday: number;
  status: 'active' | 'away' | 'offline';
}

interface ChartDataPoint {
  month: string;
  visits: number;
  conversions: number;
}

export default function DashboardInteractive() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const kpiData: KPIData[] = [
  {
    title: "Visites Totales",
    value: "1,247",
    change: 12.5,
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    trend: 'up',
    color: 'from-primary to-secondary'
  },
  {
    title: "Taux de Conversion",
    value: "68.4%",
    change: 8.2,
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    trend: 'up',
    color: 'from-secondary to-accent'
  },
  {
    title: "Nouveaux Clients",
    value: "342",
    change: 15.3,
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    trend: 'up',
    color: 'from-accent to-primary'
  },
  {
    title: "Revenu Mensuel",
    value: "€89,420",
    change: -3.1,
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    trend: 'down',
    color: 'from-primary to-accent'
  }];


  const recentActivities: Activity[] = [
  {
    id: 1,
    user: "Sophie Martin",
    action: "a complété une visite chez TechCorp Solutions",
    time: "Il y a 5 minutes",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a9e8814c-1763296696290.png",
    avatarAlt: "Professional headshot of woman with long brown hair in business attire smiling at camera",
    type: 'visit'
  },
  {
    id: 2,
    user: "Marc Dubois",
    action: "a ajouté un nouveau client: Innovation Labs",
    time: "Il y a 12 minutes",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_196174460-1763296831663.png",
    avatarAlt: "Professional portrait of man with short dark hair in navy suit with confident expression",
    type: 'client'
  },
  {
    id: 3,
    user: "Julie Rousseau",
    action: "a généré un rapport de performance trimestriel",
    time: "Il y a 28 minutes",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ab364902-1763296135947.png",
    avatarAlt: "Business portrait of woman with blonde hair in professional attire with warm smile",
    type: 'report'
  },
  {
    id: 4,
    user: "Thomas Bernard",
    action: "a planifié 3 nouvelles visites pour demain",
    time: "Il y a 1 heure",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d4ab3fb5-1763296572207.png",
    avatarAlt: "Professional headshot of man with beard in gray blazer looking at camera",
    type: 'visit'
  }];


  const upcomingVisits: UpcomingVisit[] = [
  {
    id: 1,
    clientName: "Global Enterprises",
    clientImage: "https://images.unsplash.com/photo-1721240608299-cdf5ee26c235",
    clientImageAlt: "Modern glass office building exterior with blue sky reflection",
    time: "Aujourd'hui, 14:30",
    location: "15 Avenue des Champs-Élysées, Paris",
    priority: 'high'
  },
  {
    id: 2,
    clientName: "Digital Innovations",
    clientImage: "https://images.unsplash.com/photo-1623488368032-0c5d1a718e33",
    clientImageAlt: "Contemporary office building with geometric glass facade at sunset",
    time: "Aujourd'hui, 16:00",
    location: "42 Rue de la République, Lyon",
    priority: 'medium'
  },
  {
    id: 3,
    clientName: "Future Systems",
    clientImage: "https://img.rocket.new/generatedImages/rocket_gen_img_12e085d6c-1765477590528.png",
    clientImageAlt: "Sleek modern office interior with open workspace and natural lighting",
    time: "Demain, 10:00",
    location: "8 Boulevard Victor Hugo, Marseille",
    priority: 'low'
  }];


  const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Sophie Martin",
    role: "Responsable Commercial",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a9e8814c-1763296696290.png",
    avatarAlt: "Professional headshot of woman with long brown hair in business attire smiling at camera",
    visitsToday: 8,
    status: 'active'
  },
  {
    id: 2,
    name: "Marc Dubois",
    role: "Représentant Senior",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_196174460-1763296831663.png",
    avatarAlt: "Professional portrait of man with short dark hair in navy suit with confident expression",
    visitsToday: 6,
    status: 'active'
  },
  {
    id: 3,
    name: "Julie Rousseau",
    role: "Analyste Commercial",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ab364902-1763296135947.png",
    avatarAlt: "Business portrait of woman with blonde hair in professional attire with warm smile",
    visitsToday: 4,
    status: 'away'
  },
  {
    id: 4,
    name: "Thomas Bernard",
    role: "Représentant",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d4ab3fb5-1763296572207.png",
    avatarAlt: "Professional headshot of man with beard in gray blazer looking at camera",
    visitsToday: 5,
    status: 'active'
  }];


  const chartData: ChartDataPoint[] = [
  { month: 'Jan', visits: 145, conversions: 98 },
  { month: 'Fév', visits: 178, conversions: 121 },
  { month: 'Mar', visits: 203, conversions: 138 },
  { month: 'Avr', visits: 189, conversions: 129 },
  { month: 'Mai', visits: 221, conversions: 151 },
  { month: 'Juin', visits: 247, conversions: 169 }];


  const quickActions = [
  { icon: 'PlusCircleIcon', label: 'Nouvelle Visite', color: 'from-primary to-secondary', route: '/visit-form' },
  { icon: 'UserPlusIcon', label: 'Ajouter Client', color: 'from-secondary to-accent', route: '/dashboard' },
  { icon: 'ChartBarIcon', label: 'Voir Rapports', color: 'from-accent to-primary', route: '/analytics-center' },
  { icon: 'CalendarIcon', label: 'Planifier', color: 'from-primary to-accent', route: '/dashboard' }];


  const handleQuickAction = (route: string) => {
    router.push(route);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative">
        {/* Main Content */}
        <main className="pt-24 pb-12 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-display font-bold text-foreground mb-2">
                    Tableau de Bord
                  </h1>
                  <p className="text-muted-foreground font-body">
                    Vue d'ensemble de vos performances commerciales
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-card border border-border text-foreground font-cta focus:outline-none focus:ring-2 focus:ring-primary transition-smooth">

                    <option value="week">Cette Semaine</option>
                    <option value="month">Ce Mois</option>
                    <option value="quarter">Ce Trimestre</option>
                    <option value="year">Cette Année</option>
                  </select>
                  <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-cta font-semibold hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300">
                    Exporter
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpiData.map((kpi, index) =>
              <KPICard key={index} {...kpi} />
              )}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">Actions Rapides</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) =>
                <QuickActionButton
                  key={index}
                  icon={action.icon}
                  label={action.label}
                  color={action.color}
                  onClick={() => handleQuickAction(action.route)} />

                )}
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Performance Chart & Upcoming Visits */}
              <div className="lg:col-span-2 space-y-8">
                {/* Performance Chart */}
                <div className="bg-card rounded-2xl p-6 shadow-elevated border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold text-foreground">Performance Mensuelle</h2>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg hover:bg-muted transition-smooth">
                        <Icon name="ArrowDownTrayIcon" size={20} className="text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted transition-smooth">
                        <Icon name="EllipsisHorizontalIcon" size={20} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <PerformanceChart data={chartData} />
                </div>

                {/* Upcoming Visits */}
                <div className="bg-card rounded-2xl p-6 shadow-elevated border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold text-foreground">Visites à Venir</h2>
                    <button className="text-sm font-cta font-semibold text-primary hover:text-secondary transition-smooth">
                      Voir Tout
                    </button>
                  </div>
                  <div className="space-y-4">
                    {upcomingVisits.map((visit) =>
                    <UpcomingVisitCard key={visit.id} {...visit} />
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Recent Activity & Team */}
              <div className="space-y-8">
                {/* Recent Activity */}
                <div className="bg-card rounded-2xl p-6 shadow-elevated border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold text-foreground">Activité Récente</h2>
                    <button className="p-2 rounded-lg hover:bg-muted transition-smooth">
                      <Icon name="ArrowPathIcon" size={20} className="text-muted-foreground" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentActivities.map((activity) =>
                    <ActivityItem key={activity.id} {...activity} />
                    )}
                  </div>
                </div>

                {/* Team Performance */}
                <div className="bg-card rounded-2xl p-6 shadow-elevated border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold text-foreground">Équipe</h2>
                    <button className="text-sm font-cta font-semibold text-primary hover:text-secondary transition-smooth">
                      Voir Tout
                    </button>
                  </div>
                  <div className="space-y-4">
                    {teamMembers.map((member) =>
                    <TeamMemberCard key={member.id} {...member} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="mt-8 bg-card rounded-2xl p-6 shadow-elevated border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-foreground">Carte des Visites</h2>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 rounded-lg bg-muted text-foreground font-cta text-sm hover:bg-primary hover:text-white transition-smooth">
                    Aujourd'hui
                  </button>
                  <button className="px-4 py-2 rounded-lg text-muted-foreground font-cta text-sm hover:bg-muted transition-smooth">
                    Cette Semaine
                  </button>
                  <button className="px-4 py-2 rounded-lg text-muted-foreground font-cta text-sm hover:bg-muted transition-smooth">
                    Ce Mois
                  </button>
                </div>
              </div>
              <div className="w-full h-96 rounded-xl overflow-hidden border border-border">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title="Carte des Visites Commerciales"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=48.8566,2.3522&z=12&output=embed"
                  className="w-full h-full">
                </iframe>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>);

}