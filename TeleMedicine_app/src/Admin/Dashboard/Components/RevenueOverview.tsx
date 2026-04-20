import React from 'react';
import styles from './RevenueOverview.module.css';

interface RevenueMetric {
  label: string;
  amount: number;
  icon: string;
  trend: number;
  color: string;
}

const RevenueOverview: React.FC = () => {
  const metrics: RevenueMetric[] = [
    {
      label: 'Today',
      amount: 18750,
      icon: '📅',
      trend: 6.7,
      color: '#3B82F6',
    },
    {
      label: 'This Week',
      amount: 125430,
      icon: '📊',
      trend: 12.3,
      color: '#8B5CF6',
    },
    {
      label: 'This Month',
      amount: 425300,
      icon: '💰',
      trend: 18.5,
      color: '#EC4899',
    },
  ];

  const totalRevenue = metrics.reduce((sum, metric) => sum + metric.amount, 0);
  const avgDaily = 425300 / 30;

  return (
    <div className={styles.container}>
      <div className={styles.metricsGrid}>
        {metrics.map((metric) => (
          <div key={metric.label} className={styles.metricCard}>
            <div className={styles.header}>
              <span className={styles.icon}>{metric.icon}</span>
              <h4 className={styles.label}>{metric.label}</h4>
            </div>

            <div className={styles.amount}>
              ${metric.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>

            <div className={styles.trend}>
              <span className={styles.trendIcon}>↑</span>
              <span className={styles.trendValue}>{metric.trend}%</span>
              <span className={styles.trendLabel}>from previous period</span>
            </div>

            <div
              className={styles.progressBar}
              style={{
                background: `linear-gradient(90deg, ${metric.color}20 0%, ${metric.color}40 100%)`,
              }}
            >
              <div
                className={styles.progressFill}
                style={{
                  width: `${(metric.amount / totalRevenue) * 100}%`,
                  backgroundColor: metric.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summarySection}>
        <div className={styles.summaryCard}>
          <h4 className={styles.summaryLabel}>Total Revenue (3 periods)</h4>
          <div className={styles.summaryAmount}>
            ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className={styles.summaryCard}>
          <h4 className={styles.summaryLabel}>Average Daily</h4>
          <div className={styles.summaryAmount}>
            ${avgDaily.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;