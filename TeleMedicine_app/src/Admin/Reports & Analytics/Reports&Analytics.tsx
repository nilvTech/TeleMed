import AppointmentStatusChart from "./charts/AppointmentStatusChart";
import AppointmentsTrendChart from "./charts/AppointmentsTrendChart";
import DiagnosisDistributionChart from "./charts/DiagnosisDistributionChart";
import ProviderActivityChart from "./charts/ProviderActivityChart";
import RevenueTrendChart from "./charts/RevenueTrendChart";
import styles from "./ReportsAnalytics.module.css";

/** Provider performance leaderboard row */
interface ProviderRow {
  rank: number;
  name: string;
  specialty: string;
  patients: number;
  satisfaction: number;
  sessions: number;
  revenue: string;
}
/** Wrapper for a logical subsection within a tab */
interface SectionContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}
interface ColDef<T> {
  key: keyof T & string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (val: unknown, row: T) => React.ReactNode;
}

const COLORS = {
  cyan: "#00d4ff",
  emerald: "#10b981",
  violet: "#a78bfa",
  amber: "#f59e0b",
  rose: "#f43f5e",
  blue: "#38bdf8",
  indigo: "#6366f1",
  slate: "#64748b",
} as const;

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

const PROVIDER_LEADERBOARD: ProviderRow[] = [
  {
    rank: 1,
    name: "Dr. Sarah Chen",
    specialty: "Internal Medicine",
    patients: 412,
    satisfaction: 4.9,
    sessions: 1842,
    revenue: "$284,400",
  },
  {
    rank: 2,
    name: "Dr. Raj Patel",
    specialty: "Cardiology",
    patients: 388,
    satisfaction: 4.8,
    sessions: 1698,
    revenue: "$312,800",
  },
  {
    rank: 3,
    name: "Dr. James Smith",
    specialty: "Family Medicine",
    patients: 445,
    satisfaction: 4.7,
    sessions: 1924,
    revenue: "$256,200",
  },
  {
    rank: 4,
    name: "Dr. Emily Williams",
    specialty: "Psychiatry",
    patients: 356,
    satisfaction: 4.7,
    sessions: 1512,
    revenue: "$241,600",
  },
  {
    rank: 5,
    name: "Dr. Carlos Martinez",
    specialty: "Endocrinology",
    patients: 321,
    satisfaction: 4.6,
    sessions: 1388,
    revenue: "$228,400",
  },
  {
    rank: 6,
    name: "Dr. Lisa Johnson",
    specialty: "Dermatology",
    patients: 298,
    satisfaction: 4.5,
    sessions: 1241,
    revenue: "$198,900",
  },
];

const DIAGNOSIS_DIST = [
  { name: "Hypertension", value: 22.4, color: "#3B82F6" }, // Blue
  { name: "Type 2 Diabetes", value: 18.7, color: "#EF4444" }, // Red
  { name: "Anxiety/Depression", value: 15.3, color: "#8B5CF6" }, // Purple
  { name: "Upper Respiratory", value: 12.8, color: "#10B981" }, // Green
  { name: "Musculoskeletal", value: 10.2, color: "#F59E0B" }, // Amber
  { name: "Cardiovascular", value: 9.1, color: "#EC4899" }, // Pink
  { name: "Other", value: 11.5, color: "#6B7280" }, // Gray
];
const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  subtitle,
  children,
}) => (
  <div className={styles.sectionContainer}>
    <div className={styles.sectionHeader}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
    </div>
    {children}
  </div>
);

/**
 * TableComponent<T>
 * Fully typed, generic data table.
 * Columns are defined via ColDef<T>; render functions receive cell value + full row.
 */

function TableComponent<T extends object>({
  columns,
  data,
  title,
}: {
  columns: ColDef<T>[];
  data: T[];
  title?: string;
}) {
  return (
    <div className={styles.tableWrapper}>
      {title && <h4 className={styles.tableTitle}>{title}</h4>}
      <div className={styles.tableScroll}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ textAlign: col.align ?? "left" }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} style={{ textAlign: col.align ?? "left" }}>
                    {col.render
                      ? col.render(row[col.key as keyof T], row)
                      : String(row[col.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * ChartCard
 * Uniform card chrome (title, subtitle, fixed height) wrapping a Recharts
 * ResponsiveContainer. height prop defaults to 280.
 */
// const ChartCard: React.FC<ChartCardProps> = ({
//   title, subtitle, height = 280, children,
// }) => (
//   <div className={styles.chartCard}>
//     <div className={styles.chartCardHeader}>
//       <h4 className={styles.chartTitle}>{title}</h4>
//       {subtitle && <span className={styles.chartSubtitle}>{subtitle}</span>}
//     </div>
//     <div style={{ height }}>{children}</div>
//   </div>
// );

export default function ReportsAnalytics() {
  const providerColumns: ColDef<ProviderRow>[] = [
    {
      key: "rank",
      label: "#",
      align: "center",
      render: (v) => <span className={styles.rankBadge}>#{String(v)}</span>,
    },
    {
      key: "name",
      label: "Provider",
      render: (v) => (
        <strong style={{ color: COLORS.cyan }}>{String(v)}</strong>
      ),
    },
    { key: "specialty", label: "Specialty" },
    { key: "patients", label: "Patients", align: "right" },
    { key: "sessions", label: "Sessions", align: "right" },
    {
      key: "satisfaction",
      label: "Rating",
      align: "center",
      render: (v) => (
        <span
          style={{
            color:
              Number(v) >= 4.7
                ? COLORS.emerald
                : Number(v) >= 4.5
                  ? COLORS.amber
                  : COLORS.rose,
          }}
        >
          ★ {String(v)}
        </span>
      ),
    },
    {
      key: "revenue",
      label: "Revenue",
      align: "right",
      render: (v) => (
        <strong style={{ color: COLORS.emerald }}>{String(v)}</strong>
      ),
    },
  ];
  return (
    <div className={styles.className}>
      {/* Charts Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Analytics</h2>

        <div className={styles.leaderboardSection}>
          <SectionContainer
            title="Provider Leaderboard"
            subtitle="Ranked by composite performance score"
          >
            <TableComponent<ProviderRow>
              columns={providerColumns}
              data={PROVIDER_LEADERBOARD}
            />
          </SectionContainer>
        </div>

        <div className={styles.chartsGrid}>
          <AppointmentsTrendChart data={appointmentsTrendData} />
          <RevenueTrendChart data={revenueTrendData} />
          <AppointmentStatusChart data={appointmentStatusData} />
          <DiagnosisDistributionChart data={DIAGNOSIS_DIST} />
        </div>
         <div className={styles.providerActivity}>
           <ProviderActivityChart data={providerActivityData} />
         </div>
      </section>
    </div>
  );
}
