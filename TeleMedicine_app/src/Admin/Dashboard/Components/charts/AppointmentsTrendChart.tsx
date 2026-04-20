import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import DashboardChartCard from './DashboardCCard';
import styles from './Charts.module.css';

interface AppointmentData {
  date: string;
  scheduled: number;
  completed: number;
  cancelled: number;
}

interface AppointmentsTrendChartProps {
  data: AppointmentData[];
}

const CustomTooltip: React.FC<any> = ({ active, payload,  }) => { //label
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{payload[0].payload.date}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AppointmentsTrendChart: React.FC<AppointmentsTrendChartProps> = ({ data }) => {
  return (
    <DashboardChartCard
      title="Appointments Trend"
      description="Daily appointment statistics for the past week"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="scheduled"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: '#10B981', r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="cancelled"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: '#F59E0B', r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </DashboardChartCard>
  );
};

export default AppointmentsTrendChart;