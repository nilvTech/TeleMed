import React from 'react';
import styles from './RecentActivity.module.css';

interface ActivityItem {
  id: string;
  type: 'provider_approved' | 'appointment_completed' | 'payment_received' | 'license_expiring' | 'ticket_created';
  description: string;
  timestamp: Date;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const getActivityIcon = (type: string): string => {
  switch (type) {
    case 'provider_approved':
      return '✓';
    case 'appointment_completed':
      return '✅';
    case 'payment_received':
      return '💳';
    case 'license_expiring':
      return '⚠️';
    case 'ticket_created':
      return '🎫';
    default:
      return '•';
  }
};

const getActivityColor = (type: string): string => {
  switch (type) {
    case 'provider_approved':
      return '#10B981';
    case 'appointment_completed':
      return '#3B82F6';
    case 'payment_received':
      return '#059669';
    case 'license_expiring':
      return '#F59E0B';
    case 'ticket_created':
      return '#8B5CF6';
    default:
      return '#6B7280';
  }
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Activity</h3>
        <a href="#" className={styles.viewAll}>View All</a>
      </div>

      <div className={styles.activityList}>
        {activities.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <div className={styles.activityItem}>
              <div
                className={styles.icon}
                style={{ backgroundColor: `${getActivityColor(activity.type)}20`, color: getActivityColor(activity.type) }}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className={styles.content}>
                <p className={styles.description}>{activity.description}</p>
                <span className={styles.timestamp}>{formatTime(activity.timestamp)}</span>
              </div>
            </div>
            {index < activities.length - 1 && <div className={styles.divider} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;