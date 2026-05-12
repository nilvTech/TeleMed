/**
 * Remote Patient Monitoring (RPM) Module
 * Provider Portal — US Healthcare Telemedicine Application
 *
 * Tabs: Overview | Patients | Alerts
 * Device management is patient-scoped inside Patient Details.
 * Uses mock static data, React hooks, CSS Modules, Recharts
 */

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "./RPM.module.css";

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────

type TabId = "overview" | "patients" | "alerts";

type VitalStatus = "Stable" | "Warning" | "Critical" | "No Recent Data";
type AlertSeverity = "Critical" | "Warning";
type AlertStatus = "Pending" | "Reviewed";
type DeviceStatus = "Connected" | "Offline";
type FilterOption = "All Patients" | "High Alert" | "Stable" | "Missed Readings";

interface StatCard {
  id: string;
  icon: string;
  title: string;
  count: number;
  subtitle: string;
  accentClass: string;
}

interface RecentVital {
  id: string;
  patient: string;
  device: string;
  latestReading: string;
  status: VitalStatus;
  lastUpdated: string;
}

interface RPMPatient {
  id: string;
  name: string;
  age: number;
  condition: string;
  device: string;
  latestReading: string;
  status: VitalStatus;
  lastSync: string;
  monitoringSince: string;
  avatar: string;
  /** Patient-specific RPM devices */
  devices: PatientDevice[];
}

interface VitalCard {
  label: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  status: VitalStatus;
  icon: string;
}

interface TrendDataPoint {
  date: string;
  systolic: number;
  diastolic: number;
  spo2: number;
  heartRate: number;
}

interface RPMAlert {
  id: string;
  patient: string;
  alert: string;
  severity: AlertSeverity;
  time: string;
  status: AlertStatus;
}

// Per-patient device — device management is now patient-scoped
interface PatientDevice {
  id: string;
  deviceName: string;
  status: DeviceStatus;
  lastSync: string;
  deviceIcon: string;
}

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const STAT_CARDS: StatCard[] = [
  {
    id: "enrolled",
    icon: "👥",
    title: "Patients Enrolled",
    count: 142,
    subtitle: "+8 this month",
    accentClass: "accentBlue",
  },
  {
    id: "critical",
    icon: "🚨",
    title: "Critical Alerts",
    count: 5,
    subtitle: "Requires immediate review",
    accentClass: "accentRed",
  },
  {
    id: "pending",
    icon: "⏳",
    title: "Pending Reviews",
    count: 18,
    subtitle: "Awaiting provider action",
    accentClass: "accentAmber",
  },
  {
    id: "devices",
    icon: "📡",
    title: "Devices Connected",
    count: 137,
    subtitle: "5 offline",
    accentClass: "accentGreen",
  },
];

const RECENT_VITALS: RecentVital[] = [
  {
    id: "rv1",
    patient: "John Doe",
    device: "Blood Pressure Monitor",
    latestReading: "165/100 mmHg",
    status: "Critical",
    lastUpdated: "10 mins ago",
  },
  {
    id: "rv2",
    patient: "Sarah Wilson",
    device: "Pulse Oximeter",
    latestReading: "96%",
    status: "Stable",
    lastUpdated: "15 mins ago",
  },
  {
    id: "rv3",
    patient: "Michael Chen",
    device: "Glucose Monitor",
    latestReading: "210 mg/dL",
    status: "Warning",
    lastUpdated: "22 mins ago",
  },
  {
    id: "rv4",
    patient: "Linda Martinez",
    device: "Smart Weight Scale",
    latestReading: "192 lbs",
    status: "Stable",
    lastUpdated: "1 hr ago",
  },
  {
    id: "rv5",
    patient: "Robert Taylor",
    device: "Blood Pressure Monitor",
    latestReading: "—",
    status: "No Recent Data",
    lastUpdated: "2 days ago",
  },
];

const RPM_PATIENTS: RPMPatient[] = [
  {
    id: "p1",
    name: "John Doe",
    age: 67,
    condition: "Hypertension",
    device: "Blood Pressure Monitor",
    latestReading: "165/100 mmHg",
    status: "Critical",
    lastSync: "10 mins ago",
    monitoringSince: "Jan 12, 2024",
    avatar: "JD",
    devices: [
      { id: "d-p1-1", deviceName: "Blood Pressure Monitor", status: "Connected", lastSync: "10 mins ago", deviceIcon: "🩺" },
      { id: "d-p1-2", deviceName: "Pulse Oximeter", status: "Connected", lastSync: "10 mins ago", deviceIcon: "💊" },
    ],
  },
  {
    id: "p2",
    name: "Sarah Wilson",
    age: 54,
    condition: "COPD",
    device: "Pulse Oximeter",
    latestReading: "96%",
    status: "Stable",
    lastSync: "15 mins ago",
    monitoringSince: "Mar 3, 2024",
    avatar: "SW",
    devices: [
      { id: "d-p2-1", deviceName: "Pulse Oximeter", status: "Connected", lastSync: "15 mins ago", deviceIcon: "💊" },
    ],
  },
  {
    id: "p3",
    name: "Michael Chen",
    age: 61,
    condition: "Diabetes",
    device: "Glucose Monitor",
    latestReading: "210 mg/dL",
    status: "No Recent Data",
    lastSync: "22 mi    ns ago",
    monitoringSince: "Feb 18, 2024",
    avatar: "MC",
    devices: [
      { id: "d-p3-1", deviceName: "Glucose Monitor", status: "Connected", lastSync: "22 mins ago", deviceIcon: "🩸" },
    ],
  },
  {
    id: "p4",
    name: "Linda Martinez",
    age: 72,
    condition: "Heart Disease",
    device: "Smart Weight Scale",
    latestReading: "192 lbs",
    status: "Stable",
    lastSync: "1 hr ago",
    monitoringSince: "Dec 5, 2023",
    avatar: "LM",
    devices: [
      { id: "d-p4-1", deviceName: "Smart Weight Scale", status: "Connected", lastSync: "1 hr ago", deviceIcon: "⚖️" },
    ],
  },
  {
    id: "p5",
    name: "Robert Taylor",
    age: 58,
    condition: "Hypertension",
    device: "Blood Pressure Monitor",
    latestReading: "—",
    status: "No Recent Data",
    lastSync: "2 days ago",
    monitoringSince: "Nov 20, 2023",
    avatar: "RT",
    devices: [
      { id: "d-p5-1", deviceName: "Blood Pressure Monitor", status: "Offline", lastSync: "2 days ago", deviceIcon: "🩺" },
    ],
  },
  {
    id: "p6",
    name: "Patricia Jones",
    age: 65,
    condition: "Diabetes",
    device: "Glucose Monitor",
    latestReading: "145 mg/dL",
    status: "Stable",
    lastSync: "30 mins ago",
    monitoringSince: "Apr 10, 2024",
    avatar: "PJ",
    devices: [
      { id: "d-p6-1", deviceName: "Glucose Monitor", status: "Connected", lastSync: "30 mins ago", deviceIcon: "🩸" },
    ],
  },
];

const VITALS_7D: TrendDataPoint[] = [
  { date: "May 6", systolic: 158, diastolic: 98, spo2: 95, heartRate: 78 },
  { date: "May 7", systolic: 162, diastolic: 102, spo2: 94, heartRate: 82 },
  { date: "May 8", systolic: 155, diastolic: 96, spo2: 96, heartRate: 76 },
  { date: "May 9", systolic: 170, diastolic: 108, spo2: 93, heartRate: 88 },
  { date: "May 10", systolic: 165, diastolic: 104, spo2: 95, heartRate: 80 },
  { date: "May 11", systolic: 160, diastolic: 100, spo2: 96, heartRate: 77 },
  { date: "May 12", systolic: 165, diastolic: 100, spo2: 96, heartRate: 79 },
];

const VITALS_30D: TrendDataPoint[] = [
  { date: "May 13", systolic: 148, diastolic: 92, spo2: 97, heartRate: 72 },
  { date: "May 17", systolic: 152, diastolic: 95, spo2: 96, heartRate: 74 },
  { date: "May 21", systolic: 156, diastolic: 97, spo2: 96, heartRate: 76 },
  { date: "May 25", systolic: 160, diastolic: 99, spo2: 95, heartRate: 78 },
  { date: "May 29", systolic: 155, diastolic: 96, spo2: 96, heartRate: 75 },
  { date: "Jun 2", systolic: 163, diastolic: 101, spo2: 94, heartRate: 81 },
  { date: "Jun 6", systolic: 158, diastolic: 98, spo2: 95, heartRate: 78 },
  { date: "Jun 12", systolic: 165, diastolic: 100, spo2: 96, heartRate: 79 },
];

const PATIENT_VITALS: VitalCard[] = [
  {
    label: "Blood Pressure",
    value: "165/100",
    unit: "mmHg",
    trend: "up",
    status: "Critical",
    icon: "🫀",
  },
  {
    label: "SpO2",
    value: "96",
    unit: "%",
    trend: "stable",
    status: "Stable",
    icon: "🫁",
  },
  {
    label: "Heart Rate",
    value: "79",
    unit: "bpm",
    trend: "stable",
    status: "Stable",
    icon: "💓",
  },
  {
    label: "Blood Glucose",
    value: "142",
    unit: "mg/dL",
    trend: "down",
    status: "Warning",
    icon: "🩸",
  },
  {
    label: "Weight",
    value: "192",
    unit: "lbs",
    trend: "stable",
    status: "Stable",
    icon: "⚖️",
  },
];

const RPM_ALERTS: RPMAlert[] = [
  {
    id: "a1",
    patient: "John Doe",
    alert: "BP > 180/110 — Hypertensive Crisis",
    severity: "Critical",
    time: "10 mins ago",
    status: "Pending",
  },
  {
    id: "a2",
    patient: "Sarah Wilson",
    alert: "SpO2 dropped below 92% threshold",
    severity: "Critical",
    time: "28 mins ago",
    status: "Pending",
  },
  {
    id: "a3",
    patient: "Michael Chen",
    alert: "Blood glucose elevated > 200 mg/dL",
    severity: "Warning",
    time: "1 hr ago",
    status: "Pending",
  },
  {
    id: "a4",
    patient: "Robert Taylor",
    alert: "Missed readings — 48+ hrs no data",
    severity: "Warning",
    time: "2 days ago",
    status: "Pending",
  },
  {
    id: "a5",
    patient: "Linda Martinez",
    alert: "Weight increased 4 lbs in 2 days",
    severity: "Warning",
    time: "3 hrs ago",
    status: "Reviewed",
  },
  {
    id: "a6",
    patient: "Patricia Jones",
    alert: "Glucose trending high — 3 consecutive days",
    severity: "Warning",
    time: "5 hrs ago",
    status: "Reviewed",
  },
];



// ─────────────────────────────────────────────
// HELPER: STATUS BADGE
// ─────────────────────────────────────────────

const StatusBadge: React.FC<{ status: VitalStatus | AlertStatus | DeviceStatus }> = ({
  status,
}) => {
  const classMap: Record<string, string> = {
    Stable: styles.badgeStable,
    "Needs Review": styles.badgeWarning,
    Warning: styles.badgeWarning,
    Critical: styles.badgeCritical,
    "No Recent Data": styles.badgeMuted,
    Pending: styles.badgePending,
    Reviewed: styles.badgeReviewed,
    Connected: styles.badgeStable,
    Offline: styles.badgeMuted,
  };
  return (
    <span className={`${styles.badge} ${classMap[status] ?? styles.badgeMuted}`}>
      {status}
    </span>
  );
};

// ─────────────────────────────────────────────
// HELPER: SEVERITY BADGE
// ─────────────────────────────────────────────

const SeverityBadge: React.FC<{ severity: AlertSeverity }> = ({ severity }) => (
  <span
    className={`${styles.severityBadge} ${
      severity === "Critical" ? styles.severityCritical : styles.severityWarning
    }`}
  >
    {severity === "Critical" ? "🔴" : "🟡"} {severity}
  </span>
);

// ─────────────────────────────────────────────
// HELPER: TREND INDICATOR
// ─────────────────────────────────────────────

const TrendIndicator: React.FC<{ trend: "up" | "down" | "stable" }> = ({ trend }) => {
  const map = { up: { icon: "↑", cls: styles.trendUp }, down: { icon: "↓", cls: styles.trendDown }, stable: { icon: "→", cls: styles.trendStable } };
  return <span className={`${styles.trendIcon} ${map[trend].cls}`}>{map[trend].icon}</span>;
};

// ─────────────────────────────────────────────
// SUB-COMPONENT: PATIENT DETAILS VIEW
// ─────────────────────────────────────────────

interface PatientDetailsProps {
  patient: RPMPatient;
  onBack: () => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient, onBack }) => {
  const [chartRange, setChartRange] = useState<"7" | "30">("7");
  const chartData = chartRange === "7" ? VITALS_7D : VITALS_30D;

  return (
    <div className={styles.patientDetailsView}>
      {/* Back header */}
      <div className={styles.detailsHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Back to Patients
        </button>
        <div className={styles.detailsHeaderActions}>
          <button className={styles.btnOutline}>Message Patient</button>
          <button className={styles.btnPrimary}>Schedule Follow-up</button>
        </div>
      </div>

      {/* Patient summary card */}
      <div className={styles.patientSummaryCard}>
        <div className={styles.patientSummaryLeft}>
          <div className={styles.patientAvatarLg}>{patient.avatar}</div>
          <div>
            <h2 className={styles.patientDetailName}>{patient.name}</h2>
            <p className={styles.patientDetailMeta}>
              Age {patient.age} &nbsp;·&nbsp; {patient.condition}
            </p>
          </div>
        </div>
        <div className={styles.patientSummaryMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Monitoring Since</span>
            <span className={styles.metaValue}>{patient.monitoringSince}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Assigned Device</span>
            <span className={styles.metaValue}>{patient.device}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Last Sync</span>
            <span className={styles.metaValue}>{patient.lastSync}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Status</span>
            <StatusBadge status={patient.status as VitalStatus} />
          </div>
        </div>
      </div>

      {/* Latest vitals cards */}
      <h3 className={styles.sectionTitle}>Latest Vitals</h3>
      <div className={styles.vitalsGrid}>
        {PATIENT_VITALS.map((v) => (
          <div key={v.label} className={`${styles.vitalCard} ${v.status === "Critical" ? styles.vitalCardCritical : v.status === "Warning" ? styles.vitalCardWarning : ""}`}>
            <div className={styles.vitalCardTop}>
              <span className={styles.vitalIcon}>{v.icon}</span>
              <StatusBadge status={v.status} />
            </div>
            <div className={styles.vitalValue}>
              {v.value}
              <span className={styles.vitalUnit}>{v.unit}</span>
            </div>
            <div className={styles.vitalCardBottom}>
              <span className={styles.vitalLabel}>{v.label}</span>
              <TrendIndicator trend={v.trend} />
            </div>
          </div>
        ))}
      </div>

      {/* Vitals trend chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartCardHeader}>
          <h3 className={styles.chartTitle}>Vitals Trend</h3>
          <div className={styles.chartRangeToggle}>
            <button
              className={`${styles.rangeBtn} ${chartRange === "7" ? styles.rangeBtnActive : ""}`}
              onClick={() => setChartRange("7")}
            >
              7 Days
            </button>
            <button
              className={`${styles.rangeBtn} ${chartRange === "30" ? styles.rangeBtnActive : ""}`}
              onClick={() => setChartRange("30")}
            >
              30 Days
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8edf2" />    
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={true} tickLine={true} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={true} tickLine={true}  tickCount={5} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}
              cursor={{ stroke: "#0066cc", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Systolic (mmHg)" />
            <Line type="monotone" dataKey="diastolic" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="Diastolic (mmHg)" />
            <Line type="monotone" dataKey="heartRate" stroke="#0066cc" strokeWidth={2} dot={{ r: 3 }} name="Heart Rate (bpm)" />
            <Line type="monotone" dataKey="spo2" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} name="SpO2 (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Connected Devices ─────────────────────── */}
      <div className={styles.devicesSectionHeader}>
        <div>
          <h3 className={styles.sectionTitle}>Connected Devices</h3>
          <p className={styles.devicesSectionSubtitle}>
            {patient.devices.filter((d) => d.status === "Connected").length} connected
            {patient.devices.some((d) => d.status === "Offline") &&
              ` · ${patient.devices.filter((d) => d.status === "Offline").length} offline`}
          </p>
        </div>
        <button className={styles.btnPrimary}>+ Register Device</button>
      </div>

      {patient.devices.length === 0 ? (
        /* Empty state */
        <div className={styles.devicesEmptyState}>
          <div className={styles.devicesEmptyIcon}>📡</div>
          <p className={styles.devicesEmptyTitle}>No connected RPM devices</p>
          <p className={styles.devicesEmptySubtitle}>
            Register a device to start remote monitoring for this patient.
          </p>
          <button className={styles.btnPrimary}>Register Device</button>
        </div>
      ) : (
        /* Devices table */
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Status</th>
                  <th>Last Sync</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patient.devices.map((d) => (
                  <tr key={d.id} className={d.status === "Offline" ? styles.rowOffline : ""}>
                    <td className={styles.patientCell}>
                      <span className={styles.deviceIcon}>{d.deviceIcon}</span>
                      <span className={styles.deviceName}>{d.deviceName}</span>
                    </td>
                    <td>
                      <StatusBadge status={d.status} />
                    </td>
                    <td className={styles.timeCell}>{d.lastSync}</td>
                    <td>
                      <div className={styles.actionGroup}>
                        {d.status === "Offline" ? (
                          <button className={styles.actionBtnWarning}>Reconnect</button>
                        ) : (
                          <button className={styles.actionBtn}>Configure</button>
                        )}
                        <button className={styles.actionBtnDanger}>Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

const RPM: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All Patients");
  const [selectedPatient, setSelectedPatient] = useState<RPMPatient | null>(null);
  const [alerts, setAlerts] = useState<RPMAlert[]>(RPM_ALERTS);

  // Tab definitions
  const TABS: { id: TabId; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "patients", label: "Patients", icon: "👤" },
    { id: "alerts", label: "Alerts", icon: "🔔" },
  ];

  // Filter patients for overview table
  const getFilteredVitals = (): RecentVital[] => {
    switch (activeFilter) {
      case "High Alert":
        return RECENT_VITALS.filter((v) => v.status === "Critical" || v.status === "Warning");
      case "Stable":
        return RECENT_VITALS.filter((v) => v.status === "Stable");
      case "Missed Readings":
        return RECENT_VITALS.filter((v) => v.status === "No Recent Data");
      default:
        return RECENT_VITALS;
    }
  };

  // Mark alert as reviewed
  const handleMarkReviewed = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Reviewed" as AlertStatus } : a))
    );
  };

  // ── OVERVIEW TAB ──

  const renderOverview = () => (
    <div className={styles.tabContent}>
      {/* Stat cards */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map((card) => (
          <div key={card.id} className={`${styles.statCard} ${styles[card.accentClass]}`}>
            <div className={styles.statCardTop}>
              <span className={styles.statIcon}>{card.icon}</span>
              <span className={styles.statCount}>{card.count}</span>
            </div>
            <p className={styles.statTitle}>{card.title}</p>
            <p className={styles.statSubtitle}>{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Quick Filter:</span>
        {(["All Patients", "High Alert", "Stable", "Missed Readings"] as FilterOption[]).map(
          (f) => (
            <button
              key={f}
              className={`${styles.filterPill} ${activeFilter === f ? styles.filterPillActive : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          )
        )}
      </div>

      {/* Recent vitals table */}
      <div className={styles.tableCard}>
        <div className={styles.tableCardHeader}>
          <h3 className={styles.tableCardTitle}>Recent Vitals</h3>
          <span className={styles.tableCardCount}>{getFilteredVitals().length} records</span>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Device</th>
                <th>Latest Reading</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredVitals().map((row) => (
                <tr key={row.id} className={row.status === "Critical" ? styles.rowCritical : ""}>
                  <td className={styles.patientCell}>
                    <div className={styles.patientAvatar}>
                      {row.patient.split(" ").map((n) => n[0]).join("")}
                    </div>
                    {row.patient}
                  </td>
                  <td>{row.device}</td>
                  <td className={styles.readingCell}>{row.latestReading}</td>
                  <td><StatusBadge status={row.status} /></td>
                  <td className={styles.timeCell}>{row.lastUpdated}</td>
                  <td>
                    <button
                      className={styles.actionBtn}
                      onClick={() => {
                        const p = RPM_PATIENTS.find((p) => p.name === row.patient);
                        if (p) {
                          setSelectedPatient(p);
                          setActiveTab("patients");
                        }
                      }}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {getFilteredVitals().length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.emptyRow}>
                    No patients match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ── PATIENTS TAB ──────────────────────────────

  const renderPatients = () => {
    if (selectedPatient) {
      return (
        <PatientDetails patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
      );
    }

    return (
      <div className={styles.tabContent}>
        <div className={styles.tabPageHeader}>
          <div>
            <h2 className={styles.tabPageTitle}>RPM Patients</h2>
            <p className={styles.tabPageSubtitle}>
              {RPM_PATIENTS.length} patients currently enrolled
            </p>
          </div>
          <button className={styles.btnPrimary}>+ Enroll Patient</button>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Condition</th>
                  <th>Device</th>
                  <th>Latest Reading</th>
                  <th>Status</th>
                  <th>Last Sync</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {RPM_PATIENTS.map((p) => (
                  <tr
                    key={p.id}
                    className={p.status === "Critical" ? styles.rowCritical : ""}
                  >
                    <td className={styles.patientCell}>
                      <div className={styles.patientAvatar}>{p.avatar}</div>
                      <div>
                        <div className={styles.patientName}>{p.name}</div>
                        <div className={styles.patientAge}>Age {p.age}</div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.conditionTag}>{p.condition}</span>
                    </td>
                    <td>{p.device}</td>
                    <td className={styles.readingCell}>{p.latestReading}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td className={styles.timeCell}>{p.lastSync}</td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => setSelectedPatient(p)}
                        >
                          View Details
                        </button>
                        <button className={styles.actionBtnGhost}>Contact</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ── ALERTS TAB ──────────────────────────────

  const renderAlerts = () => {
    const pendingCount = alerts.filter((a) => a.status === "Pending").length;

    return (
      <div className={styles.tabContent}>
        <div className={styles.tabPageHeader}>
          <div>
            <h2 className={styles.tabPageTitle}>Active Alerts</h2>
            <p className={styles.tabPageSubtitle}>
              {pendingCount} pending · {alerts.length - pendingCount} reviewed
            </p>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Alert</th>
                  <th>Severity</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className={
                      alert.severity === "Critical" && alert.status === "Pending"
                        ? styles.rowCritical
                        : ""
                    }
                  >
                    <td className={styles.patientCell}>
                      <div className={styles.patientAvatar}>
                        {alert.patient.split(" ").map((n) => n[0]).join("")}
                      </div>
                      {alert.patient}
                    </td>
                    <td className={styles.alertCell}>{alert.alert}</td>
                    <td><SeverityBadge severity={alert.severity} /></td>
                    <td className={styles.timeCell}>{alert.time}</td>
                    <td>
                      <StatusBadge status={alert.status} />
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        {alert.status === "Pending" && (
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleMarkReviewed(alert.id)}
                          >
                            Mark Reviewed
                          </button>
                        )}
                        <button className={styles.actionBtnGhost}>Message</button>
                        <button className={styles.actionBtnGhost}>Schedule</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ── RENDER ──────────────────────────────────


  // Derived State
  const criticalAlertCount = alerts.filter(
    (a) => a.severity === "Critical" && a.status === "Pending"
  ).length;

  //Derived State
  const syncTime = new Date();
  syncTime.setMinutes(syncTime.getMinutes()-2);


  return (
    <div className={styles.rpmContainer}>
      {/* Module header */}
      <div className={styles.moduleHeader}>
        <div className={styles.moduleHeaderLeft}>
          <div className={styles.moduleHeaderIcon}>📡</div>
          <div>
            <h1 className={styles.moduleTitle}>Remote Patient Monitoring</h1>
            <p className={styles.moduleSubtitle}>
              Real-time vitals tracking and alert management
            </p>
          </div>
        </div>
        <div className={styles.moduleHeaderRight}>
          <div className={styles.lastUpdatedBadge}>
            <span className={styles.liveDot} />
            Live · Last synced 2 min ago ({syncTime.toLocaleTimeString()})
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <nav className={styles.tabNav} role="tablist" aria-label="RPM navigation">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id !== "patients") setSelectedPatient(null);
            }}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
            {/* Badge for alerts count */}
            {tab.id === "alerts" && criticalAlertCount > 0 && (
              <span className={styles.tabBadge}>{criticalAlertCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className={styles.tabPanel} role="tabpanel">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "patients" && renderPatients()}
        {activeTab === "alerts" && renderAlerts()}
      </div>
    </div>
  );
};

export default RPM;