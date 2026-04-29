import { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  Wallet,
  
  TrendingUp,
  AlertCircle,
} from "lucide-react"; //ShieldCheck,
  //BarChart3,
import styles from "./BillingDashboard.module.css";
import ChargesPage from "./ChargesPage";
import InvoicePage from "./Invoice";
import PaymentPage from "./Payment";
import InsurancePage from "./Insurance";
import ReportsPage from "./Reports";

const tabs = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { name: "Charges", icon: <CreditCard size={18} /> },
  { name: "Invoices", icon: <Receipt size={18} /> },
  { name: "Payments", icon: <Wallet size={18} /> },
  // { name: "Insurance", icon: <ShieldCheck size={18} /> },
  // { name: "Reports", icon: <BarChart3 size={18} /> },
];

function BillingDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <>
      {" "}
      <header className={styles.header}>
        <div className={styles.TopHeader}>
          <div>
            <h2 className={styles.title}>Billing Overview</h2>
            <p className={styles.subtitle}>
              Manage your revenue and claims in real-time.
            </p>
          </div>
          <button className={styles.primaryBtn}>+ Create Claim</button>
        </div>

        {/* Modern Tabs */}
        <nav className={styles.tabsContainer}>
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`${styles.tabButton} ${activeTab === tab.name ? styles.activeTab : ""}`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </header>
      <div className={styles.container}>
        {/* Main Content Area */}
        <main className={styles.dashboardContent}>
          {activeTab === "Dashboard" ? (
            <>
              <SummaryCards />

              <div className={styles.chartRow}>
                <RevenueChart />
                <ClaimsStatusChart />
              </div>

              <RecentActivityTable />
            </>
          ) : (
            ""
          )}
          {activeTab === "Charges" ? <ChargesPage /> : ""}
          {activeTab === "Invoices" ? <InvoicePage /> : ""}
          {activeTab === "Payments" ? <PaymentPage /> : ""}
          {activeTab === "Insurance" ? <InsurancePage /> : ""}
          {activeTab === "Reports" ? <ReportsPage /> : ""}
        </main>
      </div>
    </>
  );
}

const SummaryCards = () => {
  const cards = [
    { title: "Total Revenue", value: "$45,320", trend: "+12%", type: "blue" },
    {
      title: "Pending Claims",
      value: "18",
      trend: "Action Required",
      type: "orange",
    },
    { title: "Paid Today", value: "$2,300", trend: "+5%", type: "green" },
    { title: "Denied Claims", value: "4", trend: "-2%", type: "red" },
  ];

  return (
    <div className={styles.cardGrid}>
      {cards.map((card, i) => (
        <div key={i} className={`${styles.card} ${styles[card.type]}`}>
          <span className={styles.cardTitle}>{card.title}</span>
          <div className={styles.cardFlex}>
            <h2 className={styles.cardValue}>{card.value}</h2>
            <span className={styles.cardTrend}>{card.trend}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const RevenueChart = () => {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3>Revenue Growth</h3>
        <TrendingUp size={20} className={styles.iconBlue} />
      </div>
      <div className={styles.chartPlaceholder}>[Line Chart Visualization]</div>
    </div>
  );
};
const ClaimsStatusChart = () => {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3>Claims Status</h3>
        <AlertCircle size={20} className={styles.iconOrange} />
      </div>
      <div className={styles.chartPlaceholder}>[Donut Chart Visualization]</div>
    </div>
  );
};
const RecentActivityTable = () => {
  const data = [
    {
      patient: "John Smith",
      service: "Video Visit",
      status: "Paid",
      amount: "$120",
      date: "Oct 24",
    },
    {
      patient: "Mary Brown",
      service: "Consultation",
      status: "Pending",
      amount: "$95",
      date: "Oct 23",
    },
    {
      patient: "David Wilson",
      service: "Therapy",
      status: "Denied",
      amount: "$150",
      date: "Oct 22",
    },
  ];

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <h3>Recent Transactions</h3>
        <button className={styles.secondaryBtn}>View All</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Service</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className={styles.patientName}>{item.patient}</td>
              <td>{item.service}</td>
              <td>{item.date}</td>
              <td className={styles.amount}>{item.amount}</td>
              <td>
                <span
                  className={`${styles.statusBadge} ${styles[item.status.toLowerCase()]}`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillingDashboard;
