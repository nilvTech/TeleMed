import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardChartCard from './DashboardCCard';
import styles from './Charts.module.css';

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface AppointmentStatusChartProps {
  data: StatusData[];
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const percentage = ((data.value / data.payload.total) * 100).toFixed(1);
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{data.name}</p>
        <p style={{ color: data.color }}>
          {data.value} appointments ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const AppointmentStatusChart: React.FC<AppointmentStatusChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <DashboardChartCard
      title="Appointment Status Distribution"
      description="Breakdown of all appointments by status"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </DashboardChartCard>
  );
};

export default AppointmentStatusChart;