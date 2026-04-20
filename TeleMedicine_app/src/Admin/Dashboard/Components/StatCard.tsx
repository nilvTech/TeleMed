import React from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  change?: number;
  changeLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  change,
  changeLabel,
}) => {
  const isPositive = change ? change >= 0 : false;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>{icon}</div>
        <h3 className={styles.title}>{title}</h3>
      </div>

      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        <p className={styles.description}>{description}</p>

        {change !== undefined && (
          <div className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
            <span className={styles.changeIcon}>{isPositive ? '↑' : '↓'}</span>
            <span className={styles.changeValue}>{Math.abs(change)}%</span>
            {changeLabel && <span className={styles.changeLabel}>{changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;    