'use client';

import { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';
import MetricCard from './MetricCard';
import ChartCard from './ChartCard';
import FilterButton from './FilterButton';
import PerformanceChart from './PerformanceChart';
import RevenueChart from './RevenueChart';
import TeamPerformanceTable from './TeamPerformanceTable';
import ExportButton from './ExportButton';
import type { StatsVisites } from '@/types/database';

interface PerformanceData {
  month: string;
  visits: number;
  conversions: number;
  revenue: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  target: number;
}

interface TeamMember {
  id: string;
  name: string;
  visits: number;
  conversions: number;
  revenue: number;
  performance: number;
}

export default function AnalyticsInteractive() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [stats, setStats] = useState<StatsVisites | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  
  // Role and filters
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<'commercial' | 'admin' | 'consultant' | null>(null);
  const [selectedCommercial, setSelectedCommercial] = useState<string>('');
  const [selectedSociete, setSelectedSociete] = useState<string>('');
  const [societes, setSocietes] = useState<string[]>([]);
  const [commercials, setCommercials] = useState<Array<{ id: string; name: string }>>([]);
  
  // Data
  const [performanceDataState, setPerformanceDataState] = useState<PerformanceData[]>([]);
  const [revenueDataState, setRevenueDataState] = useState<RevenueData[]>([]);
  const [teamData, setTeamData] = useState<TeamMember[]>([]);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);

  // Initialize hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Get user info from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const raw = window.localStorage.getItem('stpro_user');
      if (!raw) return;

      const stored = JSON.parse(raw) as {
        id?: string | null;
        role?: string | null;
      };

      if (stored.id) {
        setCurrentUserId(stored.id);
      }

      if (stored.role === 'admin') {
        setCurrentUserRole('admin');
      } else if (stored.role === 'commercial') {
        setCurrentUserRole('commercial');
      } else if (stored.role === 'consultant') {
        setCurrentUserRole('consultant');
      }
    } catch {
      // ignore malformed localStorage
    }
  }, []);

  // Fetch stats
  useEffect(() => {
    if (!isHydrated) return;

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);

        const response = await fetch('/api/visites/stats');
        if (!response.ok) {
          console.error('Erreur lors du chargement des statistiques:', await response.text());
          setStatsError("Impossible de charger les statistiques de vos visites.");
          return;
        }

        const data = (await response.json()) as StatsVisites;
        setStats(data);
      } catch (error) {
        console.error('Erreur réseau:', error);
        setStatsError("Erreur réseau lors du chargement des statistiques.");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [isHydrated, timeFilter]);

  // Fetch companies and commercials
  useEffect(() => {
    if (!isHydrated || !currentUserRole) return;

    const fetchFilters = async () => {
      try {
        // Fetch companies
        const societesRes = await fetch('/api/analytics/societes');
        if (societesRes.ok) {
          const { data } = await societesRes.json();
          setSocietes(data || []);
        }

        // Fetch commercials if admin or consultant
        if (currentUserRole === 'admin' || currentUserRole === 'consultant') {
          const commercialsRes = await fetch('/api/equipe');
          if (commercialsRes.ok) {
            const { data } = await commercialsRes.json();
            if (data) {
              setCommercials(
                data.map((m: any) => ({
                  id: m.id,
                  name: `${m.prenom || ''} ${m.nom || ''}`.trim() || m.email,
                }))
              );
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des filtres:', error);
      }
    };

    fetchFilters();
  }, [isHydrated, currentUserRole]);

  // Fetch performance data
  useEffect(() => {
    if (!isHydrated) return;

    const fetchPerformance = async () => {
      try {
        setPerformanceLoading(true);
        const params = new URLSearchParams();
        
        if (currentUserRole === 'commercial' && currentUserId) {
          params.set('commercialId', currentUserId);
        } else if (selectedCommercial) {
          params.set('commercialId', selectedCommercial);
        }
        
        if (selectedSociete) {
          params.set('societe', selectedSociete);
        }

        console.log('Fetching performance with params:', params.toString());
        const response = await fetch(`/api/analytics/performance?${params.toString()}`);
        console.log('Performance response status:', response.status);
        
        if (response.ok) {
          const json = await response.json();
          console.log('Performance data received:', json);
          setPerformanceDataState(json.data || []);
        } else {
          console.error('Performance fetch failed:', response.status, await response.text());
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la performance:', error);
      } finally {
        setPerformanceLoading(false);
      }
    };

    fetchPerformance();
  }, [isHydrated, currentUserRole, currentUserId, selectedCommercial, selectedSociete, timeFilter]);

  // Fetch revenue data
  useEffect(() => {
    if (!isHydrated) return;

    const fetchRevenue = async () => {
      try {
        setRevenueLoading(true);
        const params = new URLSearchParams();
        
        if (currentUserRole === 'commercial' && currentUserId) {
          params.set('commercialId', currentUserId);
        } else if (selectedCommercial) {
          params.set('commercialId', selectedCommercial);
        }
        
        if (selectedSociete) {
          params.set('societe', selectedSociete);
        }

        console.log('Fetching revenue with params:', params.toString());
        const response = await fetch(`/api/analytics/revenue?${params.toString()}`);
        console.log('Revenue response status:', response.status);
        
        if (response.ok) {
          const json = await response.json();
          console.log('Revenue data received:', json);
          setRevenueDataState(json.data || []);
        } else {
          console.error('Revenue fetch failed:', response.status, await response.text());
        }
      } catch (error) {
        console.error('Erreur lors du chargement du chiffre d\'affaires:', error);
      } finally {
        setRevenueLoading(false);
      }
    };

    fetchRevenue();
  }, [isHydrated, currentUserRole, currentUserId, selectedCommercial, selectedSociete, timeFilter]);

  // Fetch team data (only for admin/consultant)
  useEffect(() => {
    if (!isHydrated || currentUserRole === 'commercial') return;

    const fetchTeam = async () => {
      try {
        setTeamLoading(true);
        const params = new URLSearchParams();
        
        if (selectedSociete) {
          params.set('societe', selectedSociete);
        }

        console.log('Fetching team with params:', params.toString());
        const response = await fetch(`/api/analytics/team?${params.toString()}`);
        console.log('Team response status:', response.status);
        
        if (response.ok) {
          const json = await response.json();
          console.log('Team data received:', json);
          setTeamData(json.data || []);
        } else {
          console.error('Team fetch failed:', response.status, await response.text());
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'équipe:', error);
      } finally {
        setTeamLoading(false);
      }
    };

    fetchTeam();
  }, [isHydrated, currentUserRole, selectedSociete]);

  // Calculate metrics
  const getMetrics = () => {
    const perfData = performanceDataState;
    const revData = revenueDataState;

    const totalVisits = perfData.reduce((sum, d) => sum + d.visits, 0);
    const totalConversions = perfData.reduce((sum, d) => sum + d.conversions, 0);
    const conversionRate = totalVisits > 0 ? (totalConversions / totalVisits) * 100 : 0;
    const totalRevenue = revData.reduce((sum, d) => sum + d.revenue, 0);

    return [
      {
        title: currentUserRole === 'commercial' ? 'Mes visites' : 'Total des visites',
        value: totalVisits.toLocaleString('fr-FR'),
        change: 12.5,
        trend: 'up' as const,
        icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z'
      },
      {
        title: 'Taux de conversion',
        value: `${conversionRate.toFixed(1)}%`,
        change: 8.3,
        trend: 'up' as const,
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        title: 'Chiffre d\'affaires',
        value: `${(totalRevenue / 1000).toFixed(1)}k DT`,
        change: 15.7,
        trend: 'up' as const,
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      ...(currentUserRole !== 'commercial' ? [{
        title: 'Clients actifs',
        value: '847',
        change: -3.2,
        trend: 'down' as const,
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
      }] : []),
    ];
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    if (!isHydrated) return;
    console.log(`Exportation en format: ${format}`);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) =>
                <div key={i} className="h-40 bg-muted rounded-2xl"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">
              Centre d'Analyse
            </h1>
            <p className="text-muted-foreground font-body">
              {currentUserRole === 'commercial' 
                ? 'Votre performance commerciale en temps réel'
                : 'Visualisations avancées et rapports de performance en temps réel'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <ExportButton onExport={handleExport} />
          </div>
        </div>

        {/* Filters - Only for admin/consultant */}
        {(currentUserRole === 'admin' || currentUserRole === 'consultant') && (
          <div className="bg-card rounded-xl p-6 border border-border mb-8">
            <h3 className="text-sm font-cta font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="AdjustmentsHorizontalIcon" size={18} />
              Filtres avancés
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-cta text-muted-foreground mb-2">
                  Par commercial
                </label>
                <select
                  value={selectedCommercial}
                  onChange={(e) => setSelectedCommercial(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Tous les commerciaux</option>
                  {commercials.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-cta text-muted-foreground mb-2">
                  Par société
                </label>
                <select
                  value={selectedSociete}
                  onChange={(e) => setSelectedSociete(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Toutes les sociétés</option>
                  {societes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Time Filter */}
        <div className="flex items-center space-x-3 mb-8 overflow-x-auto pb-2">
          <FilterButton
            label="Cette semaine"
            active={timeFilter === 'week'}
            onClick={() => setTimeFilter('week')} />

          <FilterButton
            label="Ce mois"
            active={timeFilter === 'month'}
            onClick={() => setTimeFilter('month')} />

          <FilterButton
            label="Ce trimestre"
            active={timeFilter === 'quarter'}
            onClick={() => setTimeFilter('quarter')} />

          <FilterButton
            label="Cette année"
            active={timeFilter === 'year'}
            onClick={() => setTimeFilter('year')} />
        </div>

        {/* Metrics Grid */}
        <div className={`grid gap-6 mb-8 ${currentUserRole === 'commercial' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
          {getMetrics().map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {statsError && !statsLoading && (
          <p className="mb-6 text-sm text-destructive font-body">
            {statsError}
          </p>
        )}

        {/* Charts Section */}
        <div className={`grid gap-8 mb-8 ${currentUserRole === 'commercial' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          <ChartCard
            title="Performance Mensuelle"
            subtitle={currentUserRole === 'commercial' ? 'Vos visites et conversions' : 'Visites et conversions par mois'}
            loading={performanceLoading}>
            <PerformanceChart data={performanceDataState} />
          </ChartCard>

          <ChartCard
            title="Évolution du Chiffre d'Affaires"
            subtitle={currentUserRole === 'commercial' ? 'Votre chiffre d\'affaires' : 'Comparaison avec les objectifs'}
            loading={revenueLoading}>
            <RevenueChart data={revenueDataState} />
          </ChartCard>
        </div>

        {/* Team Performance Table - Only for admin/consultant */}
        {(currentUserRole === 'admin' || currentUserRole === 'consultant') && (
          <ChartCard
            title="Performance de l'Équipe"
            subtitle="Classement des membres par performance"
            loading={teamLoading}>
            <TeamPerformanceTable data={teamData} />
          </ChartCard>
        )}
      </div>
    </div>
  );
}