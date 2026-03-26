import styles from "./Dashboard.module.css";
import MainContent from "./Maincontent";
function Dashboard() {
  return (
    <div className={styles.layout}>
      <MainContent />
    </div>
  );
}

export default Dashboard;
