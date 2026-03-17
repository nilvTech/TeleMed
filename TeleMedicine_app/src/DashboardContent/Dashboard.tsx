import Header from "./Header";
//import MainContent from "./Maincontent";
import SideBar from "./SideBar";
import styles from "./Dashboard.module.css";
import MainContent from "./Maincontent";
function Dashboard() {
  return (
    <div>
      <Header />
      <div className={styles.layout}>
        <SideBar />
        <MainContent />
      </div>
    </div>
  );
}

export default Dashboard;
