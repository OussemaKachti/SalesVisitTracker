'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PerformanceData {
  month: string;
  visits: number;
  conversions: number;
  revenue: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  // Provide fallback data if empty
  const chartData = data && data.length > 0 ? data : [
    { month: 'Jan', visits: 0, conversions: 0, revenue: 0 },
    { month: 'Fév', visits: 0, conversions: 0, revenue: 0 },
  ];

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <p className="text-sm text-muted-foreground font-body">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80" aria-label="Performance mensuelle - Graphique en barres">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF" 
            style={{ fontSize: '12px', fontFamily: 'var(--font-body)' }}
          />
          <YAxis 
            stroke="#9CA3AF" 
            style={{ fontSize: '12px', fontFamily: 'var(--font-body)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '12px',
              padding: '12px',
              fontFamily: 'var(--font-body)'
            }}
            labelStyle={{ color: '#F9FAFB', fontWeight: 600 }}
          />
          <Legend 
            wrapperStyle={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '12px'
            }}
          />
          <Bar dataKey="visits" fill="#6366F1" radius={[8, 8, 0, 0]} name="Visites" />
          <Bar dataKey="conversions" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Conversions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}