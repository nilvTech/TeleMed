import React, { useMemo } from "react";
import styles from "./AdminDashboard.module.css";
import StatCard from "./Components/StatCard.tsx";
import AppointmentsOverview from "./Components/AppointmentsOverview.tsx";
import RecentActivity from "./Components/RecentActivity.tsx";
import SystemAlerts from "./Components/SystemAlerts.tsx";
//import RevenueOverview from "./Components/RevenueOverview.tsx";
import AppointmentsTrendChart from "./Components/charts/AppointmentsTrendChart.tsx";
import RevenueTrendChart from "./Components/charts/RevenueTrendChart.tsx";
import AppointmentStatusChart from "./Components/charts/AppointmentStatusChart.tsx";
import ProviderActivityChart from "./Components/charts/ProviderActivityChart.tsx";
//import { Icon } from "lucide-react";

// Mock Data Types
interface DashboardStats {
  totalProviders: number;
  activeProviders: number;
  pendingApprovals: number;
  suspendedProviders: number;
  totalAppointments: number;
  totalCompletedAppointments: number;
  totalCancelledNoshow: number;
  revenueToday: number;
  revenueMonth: number;
}

interface RecentActivityItem {
  id: string;
  type:
    | "provider_approved"
    | "appointment_completed"
    | "payment_received"
    | "license_expiring"
    | "ticket_created";
  description: string;
  timestamp: Date;
}

interface SystemAlert {
  id: string;
  type: "warning" | "error" | "info";
  title: string;
  message: string;
}

// Mock Data
const dashboardStats: DashboardStats = {
  totalProviders: 247,
  activeProviders: 198,
  pendingApprovals: 12,
  suspendedProviders: 8,
  totalAppointments: 156,
  totalCompletedAppointments: 98,
  totalCancelledNoshow: 8,
  revenueToday: 18750,
  revenueMonth: 425300,
};

const claimsOverviewData = [
  {
    label: "Total Claims",
    value: "122",
    sub: "This month",
    accent: styles.accentBlue,
  },
  {
    label: "Collected Revenue",
    value: "$8,940",
    sub: "72% collection rate",
    accent: styles.accentGreen,
  },
  {
    label: "Outstanding Balance",
    value: "$3,540",
    sub: "Pending collection",
    accent: styles.accentYellow,
  },
  {
    label: "Denial Rate",
    value: "12%",
    sub: "↓ 2% vs last month",
    accent: styles.accentRed,
  },
];

const recentActivityData: RecentActivityItem[] = [
  {
    id: "1",
    type: "provider_approved",
    description: "Dr. Sarah Mitchell approved for psychiatry specialization",
    timestamp: new Date(Date.now() - 15 * 60000),
  },
  {
    id: "2",
    type: "appointment_completed",
    description: "Appointment #4521 completed - Patient satisfaction: 5/5",
    timestamp: new Date(Date.now() - 32 * 60000),
  },
  {
    id: "3",
    type: "payment_received",
    description: "Payment of $2,450 received from patient John Doe",
    timestamp: new Date(Date.now() - 1 * 3600000),
  },
  {
    id: "4",
    type: "license_expiring",
    description: "License expiring soon for Dr. James Wilson (45 days)",
    timestamp: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: "5",
    type: "appointment_completed",
    description: "Appointment #4508 completed - Telehealth session",
    timestamp: new Date(Date.now() - 3 * 3600000),
  },
  {
    id: "6",
    type: "ticket_created",
    description: "Support ticket #892 created - Video quality issue",
    timestamp: new Date(Date.now() - 4 * 3600000),
  },
];

const systemAlertsData: SystemAlert[] = [
  {
    id: "1",
    type: "warning",
    title: "High No-Show Rate",
    message: "Dr. Johnson has 18% no-show rate this month. Recommend outreach.",
  },
  {
    id: "2",
    type: "error",
    title: "Payment Processing Failed",
    message:
      "Payment gateway error occurred at 2:15 PM. 3 transactions affected.",
  },
  {
    id: "3",
    type: "info",
    title: "License Expiration Alert",
    message: "5 provider licenses expiring within 30 days. Review required.",
  },
  {
    id: "4",
    type: "warning",
    title: "Server Load High",
    message: "API response time increased to 2.4s. Monitor ongoing.",
  },
];

const appointmentsTrendData = [
  { date: "Mon", scheduled: 32, completed: 28, cancelled: 4 },
  { date: "Tue", scheduled: 38, completed: 15, cancelled: 3 },
  { date: "Wed", scheduled: 45, completed: 22, cancelled: 4 },
  { date: "Thu", scheduled: 42, completed: 39, cancelled: 3 },
  { date: "Fri", scheduled: 48, completed: 45, cancelled: 3 },
  { date: "Sat", scheduled: 28, completed: 26, cancelled: 2 },
  { date: "Sun", scheduled: 22, completed: 20, cancelled: 2 },
];

const revenueTrendData = [
  { date: "Mon", daily: 15200, weekly: 50200, monthly: 100200 },
  { date: "Tue", daily: 16800, weekly: 70300, monthly: 120300 },
  { date: "Wed", daily: 18500, weekly: 80500, monthly: 95500 },
  { date: "Thu", daily: 17200, weekly: 67700, monthly: 110700 },
  { date: "Fri", daily: 19300, weekly: 87000, monthly: 164000 },
  { date: "Sat", daily: 12400, weekly: 99400, monthly: 114400 },
  { date: "Sun", daily: 10800, weekly: 110200, monthly: 150200 },
];

const appointmentStatusData = [
  { name: "Scheduled", value: 487, color: "#3B82F6" },
  { name: "Completed", value: 1243, color: "#10B981" },
  { name: "Cancelled", value: 156, color: "#F59E0B" },
  { name: "No-Show", value: 92, color: "#EF4444" },
];

const providerActivityData = [
  { name: "Dr. Sarah Mitchell", appointments: 42, color: "#3B82F6" },
  { name: "Dr. James Wilson", appointments: 38, color: "#8B5CF6" },
  { name: "Dr. Emily Chen", appointments: 35, color: "#EC4899" },
  { name: "Dr. Michael Rodriguez", appointments: 31, color: "#14B8A6" },
  { name: "Dr. Patricia Brown", appointments: 28, color: "#F59E0B" },
  { name: "Dr. David Lee", appointments: 24, color: "#06B6D4" },
];

const AdminDashboard: React.FC = () => {
  const currentDateTime = useMemo(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return now.toLocaleDateString("en-US", options);
  }, []);

  return (
    <div className={styles.dashboard}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Admin Dashboard</h1>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.dateTime}>{currentDateTime}</div>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        {/* Appointments Overview */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Today's Appointments Summary</h2>
          <AppointmentsOverview />
        </section>
        {/* Provider Grid */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Provider Statistics</h2>
          <div className={styles.statsGrid}>
            <StatCard
              title="Total Providers"
              value={dashboardStats.totalProviders}
              description="Active providers in system"
              icon="👥"
              change={2.5}
              changeLabel="vs last month"
            />
            <StatCard
              title="Active Providers"
              value={dashboardStats.activeProviders}
              description="Available for appointments"
              icon="✓"
              change={4.2}
              changeLabel="vs last month"
            />
            <StatCard
              title="Provider Pending Approvals"
              value={dashboardStats.pendingApprovals}
              description="Awaiting verification"
              icon="⏳"
              change={-1.5}
              changeLabel="vs last week"
            />
            <StatCard
              title="Suspended Providers"
              value={dashboardStats.suspendedProviders}
              description="Awaiting verification"
              icon="🚫"
              change={-1.5}
              changeLabel="vs last week"
            />
          </div>
        </section>

        {/* Appointments Statistics */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Appointments Statistics</h2>
          <div className={styles.statsGrid}>
            <StatCard
              title="Total Appointments"
              value={dashboardStats.totalAppointments}
              description="Scheduled for today"
              icon="📅"
              change={8.3}
              changeLabel="vs yesterday"
            />
            <StatCard
              title="Total Completed Appointments"
              value={dashboardStats.totalCompletedAppointments}
              description="Successfully finished"
              icon="✅"
              change={12.1}
              changeLabel="vs yesterday"
            />
            <StatCard
              title="Total Cancelled / No-Show"
              value={dashboardStats.totalCancelledNoshow}
              description="This week"
              icon="❌"
              change={-5.8}
              changeLabel="vs last week"
            />
          </div>
        </section>

        {/*Claims Overview */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Claims Statistics</h2>
          <div className={styles.statsGrid}>
            <StatCard
              title="Total Claims"
              value={`${claimsOverviewData[0].value}`}
              description="This month"
              icon='📄'
            />
            <StatCard
              title="Collected Revenue"
              value={`${claimsOverviewData[1].value}`}
              description=""
              icon="💲"
            />
            <StatCard
              title="Outstanding Balance"
              value={`${claimsOverviewData[2].value}`}
              description=""
              icon="⚠️"
            />
            <StatCard
              title="Denial Rate"
              value={`${claimsOverviewData[3].value}`}
              description=""
              icon="📉"
            />
          </div>
        </section>

        {/*Revenue Overview */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Revenue Statistics</h2>
          <div className={styles.statsGrid}>
            <StatCard
              title="Revenue Today"
              value={`$${dashboardStats.revenueToday.toLocaleString()}`}
              description="Total earnings"
              icon="💰"
              change={6.7}
              changeLabel="vs yesterday"
            />
            <StatCard
              title="Revenue This Month"
              value={`$${dashboardStats.revenueMonth.toLocaleString()}`}
              description="Month-to-date"
              icon="📊"
              change={15.3}
              changeLabel="vs last month"
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Analytics & Trends</h2>
          <div className={styles.chartsGrid}>
            <AppointmentsTrendChart data={appointmentsTrendData} />
            <RevenueTrendChart data={revenueTrendData} />
            <AppointmentStatusChart data={appointmentStatusData} />
            <ProviderActivityChart data={providerActivityData} />
          </div>
        </section>

        {/* Bottom Row: Alerts and Activity */}
        <section className={styles.bottomSection}>
          <div className={styles.bottomRow}>
            <SystemAlerts alerts={systemAlertsData} />
            <RecentActivity activities={recentActivityData} />
          </div>
        </section>

        {/* Revenue Overview */}
        {/* <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Revenue Breakdown</h2>
          <RevenueOverview />
        </section> */}
      </main>
    </div>
  );
};

export default AdminDashboard;
