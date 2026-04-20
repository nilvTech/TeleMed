import React from 'react';
import styles from './AppointmentsOverview.module.css';

interface AppointmentStatus {
  label: string;
  count: number;
  color: string;
  icon: string;
}

const AppointmentsOverview: React.FC = () => {
  const statuses: AppointmentStatus[] = [
    { label: 'Scheduled', count: 87, color: '#3B82F6', icon: '📅' },
    { label: 'In Progress', count: 12, color: '#8B5CF6', icon: '⏱️' },
    { label: 'Completed', count: 98, color: '#10B981', icon: '✅' },
    { label: 'Cancelled', count: 5, color: '#F59E0B', icon: '✗' },
    { label: 'No-Show', count: 3, color: '#EF4444', icon: '❌' },
  ];

  const total = statuses.reduce((sum, status) => sum + status.count, 0);

  return (
    <div className={styles.container}>
      <div className={styles.statusGrid}>
        {statuses.map((status) => {
          const percentage = (status.count / total) * 100;
          return (
            <div key={status.label} className={styles.statusCard}>
              <div className={styles.statusHeader}>
                <span className={styles.icon}>{status.icon}</span>
                <div className={styles.labelSection}>
                  <h4 className={styles.label}>{status.label}</h4>
                  <p className={styles.count}>{status.count}</p>
                </div>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: status.color,
                  }}
                />
              </div>
              <p className={styles.percentage}>{Math.round(percentage)}% of total</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentsOverview;