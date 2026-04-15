import styles from "./PatientDashboard.module.css";

function PatientDashboard() {
  return (
    <div className={styles.dashboardContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Welcome, Jhon Chen</h1>
        <p className={styles.subtitle}>
          Here is a quick overview of your health and activity
        </p>
      </div>

      {/* Summary Cards Section */}
      <div className={styles.cardsGrid}>
        {/* Next Appointment Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Next Appointment</h3>
          <p className={styles.cardPrimary}>April 12, 2026</p>
          <p className={styles.cardSecondary}>Dr. Sharma — Video Visit</p>
        </div>

        {/* Last Visit Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Last Visit</h3>
          <p className={styles.cardPrimary}>March 28, 2026</p>
          <p className={styles.cardSecondary}>Completed</p>
        </div>

        {/* Outstanding Balance Card
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Outstanding Balance</h3>
          <p className={styles.cardPrimary}>₹1,200</p>
          <p className={styles.cardSecondary}>Pending Payment</p>
        </div> */}

        {/* Messages / Notifications Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>New Messages</h3>
          <p className={styles.cardPrimary}>2 Unread</p>
          <p className={styles.cardSecondary}>Check your inbox</p>
        </div>
      </div>

      {/* Upcoming Appointment Section */}
      <div className={styles.upcomingSection}>
        <h2 className={styles.sectionTitle}>Upcoming Appointment</h2>
        <div className={styles.upcomingCard}>
          <div className={styles.upcomingInfo}>
            <span className={styles.upcomingDate}>April 12, 2026</span>
            <span className={styles.upcomingProvider}>
              Dr. Sharma — Video Visit
            </span>
          </div>
          <div className={styles.upcomingActions}>
            <button className={styles.joinButton}>Join Visit</button>
            <button className={styles.secondaryButton}>View Details</button>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      {/* <div className={styles.quickActionsSection}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.quickActionsGrid}>
          <button className={styles.actionButton}>Book Appointment</button>
          <button className={styles.actionButton}>Join Visit</button>
          <button className={styles.actionButton}>Send Message</button>
          <button className={styles.actionButton}>View Records</button>
          <button className={styles.actionButton}>View Billing</button>
        </div>
      </div> */}

      <div className={styles.className}>
        {/* Recent Activity Section */}
        <div className={styles.activitySection}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>

          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <span className={styles.activityText}>Prescription updated</span>
              <span className={styles.activityDate}>02 Apr 2026</span>
            </div>

            <div className={styles.activityItem}>
              <span className={styles.activityText}>Lab report uploaded</span>
              <span className={styles.activityDate}>30 Mar 2026</span>
            </div>

            <div className={styles.activityItem}>
              <span className={styles.activityText}>Appointment scheduled</span>
              <span className={styles.activityDate}>28 Mar 2026</span>
            </div>
          </div>
        </div>

        {/* Prescription Reminder Section */}
        <div className={styles.prescriptionSection}>
          <h2 className={styles.sectionTitle}>Prescription Reminder</h2>
          <div className={styles.prescriptionCard}>
            <div className={styles.prescriptionInfo}>
              <span className={styles.medicineName}>Paracetamol</span>
              <span className={styles.medicineDose}>Take 2 times daily</span>
            </div>
            <div className={styles.nextDose}>Next Dose: 8:00 PM</div>
          </div>
        </div>
      </div>

      {/* Health Summary Section */}
      <div className={styles.healthSummarySection}>
        <h2 className={styles.sectionTitle}>Health Summary</h2>
        <div className={styles.healthGrid}>
          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>Blood Pressure</span>
            <span className={styles.healthValue}>120/80 mmHg</span>
          </div>
          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>Weight</span>
            <span className={styles.healthValue}>70 kg</span>
          </div>
          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>Heart Rate</span>
            <span className={styles.healthValue}>72 bpm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
