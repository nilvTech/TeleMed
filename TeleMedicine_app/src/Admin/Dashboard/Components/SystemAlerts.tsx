import React from 'react';
import styles from './SystemAlerts.module.css';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface SystemAlertsProps {
  alerts: Alert[];
}

const getAlertIcon = (type: string): string => {
  switch (type) {
    case 'error':
      return '🔴';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '•';
  }
};

const SystemAlerts: React.FC<SystemAlertsProps> = ({ alerts }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>System Alerts</h3>
        <span className={styles.badge}>{alerts.length}</span>
      </div>

      <div className={styles.alertList}>
        {alerts.map((alert, index) => (
          <React.Fragment key={alert.id}>
            <div className={`${styles.alert} ${styles[alert.type]}`}>
              <div className={styles.icon}>{getAlertIcon(alert.type)}</div>
              <div className={styles.content}>
                <h4 className={styles.title}>{alert.title}</h4>
                <p className={styles.message}>{alert.message}</p>
              </div>
              <button className={styles.dismiss} aria-label="Dismiss alert">
                ✕
              </button>
            </div>
            {index < alerts.length - 1 && <div className={styles.divider} />}
          </React.Fragment>
        ))}
      </div>

      <div className={styles.footer}>
        <a href="#" className={styles.viewAllLink}>View All Alerts</a>
      </div>
    </div>
  );
};

export default SystemAlerts;