import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardChartCard from './DashboardCCard';
import styles from './Charts.module.css';

interface DiagnosisData {
  name: string;
  value: number;
  color: string;
  total?: number;
}

interface DiagnosisDistributionChartProps {
  data: DiagnosisData[];
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const percentage = ((data.value / data.payload.total) * 100).toFixed(1);

    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{data.name}</p>
        <p style={{ color: data.payload.color }}>
          {percentage}% 
        </p>
      </div>
    );
  }
  return null;
};

const DiagnosisDistributionChart: React.FC<DiagnosisDistributionChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <DashboardChartCard
      title="Diagnosis Distribution"
      description="Breakdown of patient diagnoses"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            labelLine={true}
            label={({ name, percent }) =>
              `${name} ${(percent! * 100).toFixed(1)}%`
            }
            animationDuration={800}
          >
            {dataWithTotal.map((entry, index) => (
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

export default DiagnosisDistributionChart;