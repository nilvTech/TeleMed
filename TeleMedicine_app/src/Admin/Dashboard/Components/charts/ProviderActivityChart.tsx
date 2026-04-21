import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DashboardChartCard from './DashboardCCard';
import styles from './Charts.module.css';

interface ProviderData {
  name: string;
  appointments: number;
  color: string;
}

interface ProviderActivityChartProps {
  data: ProviderData[];
}

const CustomTooltip: React.FC<any> = ({ active, payload}) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{payload[0].payload.name}</p>
        <p style={{ color: payload[0].color }}>
          Appointments: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const ProviderActivityChart: React.FC<ProviderActivityChartProps> = ({ data }) => {
  return (
    <DashboardChartCard
      title="Provider Activity Overview"
      description="Appointments handled by top providers"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            tick={{ angle: -40, textAnchor: 'end', height: 80 }}
            />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px' }}

          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="appointments"
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </DashboardChartCard>
  );
};

export default ProviderActivityChart;