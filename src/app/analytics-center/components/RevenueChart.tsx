'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
  target: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="w-full h-80" aria-label="Évolution du chiffre d'affaires - Graphique linéaire">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF" 
            style={{ fontSize: '12px', fontFamily: 'var(--font-body)' }}
          />
          <YAxis 
            stroke="#9CA3AF" 
            style={{ fontSize: '12px', fontFamily: 'var(--font-body)' }}
            tickFormatter={(value) => `${value}k€`}
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
            formatter={(value?: number) => [`${value ?? 0}k€`, '']}
          />
          <Legend 
            wrapperStyle={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#6366F1" 
            strokeWidth={3}
            dot={{ fill: '#6366F1', r: 5 }}
            activeDot={{ r: 7 }}
            name="Chiffre d'affaires"
          />
          <Line 
            type="monotone" 
            dataKey="target" 
            stroke="#8B5CF6" 
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: '#8B5CF6', r: 5 }}
            name="Objectif"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}