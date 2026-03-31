//import { useNavigate } from "react-router-dom";
import styles from "../Provider/DashboardContent/Header.module.css";
//import { Bell } from "lucide-react";
import { MdAccountCircle, MdNotificationsNone } from "react-icons/md";

function Header() {


  return (
    <header>
      <div className={styles.header}>
        <div className={styles.searchcontainer}>
          <input
            type="text"
            placeholder="Search patients, appointments..."
            className={styles.searchInput}
            style={{ width: "400px" }}
          />
        </div>
        <div className={styles.headerRight}>
          <MdNotificationsNone className={styles.notificationIcon} />
          <div className={styles.profileArea}>
            <MdAccountCircle className={styles.profileLogo} />
            <span className={styles.profile}>Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
