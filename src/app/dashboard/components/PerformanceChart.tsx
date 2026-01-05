'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartDataPoint {
  month: string;
  visits: number;
  conversions: number;
}

interface PerformanceChartProps {
  data: ChartDataPoint[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="w-full h-80" aria-label="Monthly Performance Bar Chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis 
            dataKey="month" 
            stroke="rgba(148, 163, 184, 0.5)"
            style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
          />
          <YAxis 
            stroke="rgba(148, 163, 184, 0.5)"
            style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.95)', 
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '12px'
            }}
            labelStyle={{ color: '#f1f5f9', fontWeight: 600 }}
            itemStyle={{ color: '#cbd5e1' }}
          />
          <Legend 
            wrapperStyle={{ 
              fontSize: '12px', 
              fontFamily: 'Inter, sans-serif',
              paddingTop: '20px'
            }}
          />
          <Bar 
            dataKey="visits" 
            fill="url(#colorVisits)" 
            radius={[8, 8, 0, 0]}
            name="Visites"
          />
          <Bar 
            dataKey="conversions" 
            fill="url(#colorConversions)" 
            radius={[8, 8, 0, 0]}
            name="Conversions"
          />
          <defs>
            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
              <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}