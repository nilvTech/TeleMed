import { Link } from "react-router-dom";
import styles from "../Provider/DashboardContent/SideBar.module.css";
import { MdDashboard,MdCalendarToday,MdPeopleAlt} from "react-icons/md";
import {  } from "react-icons/md";
import {  } from "react-icons/md";
function SideBar() {

  return (
    <>
      <div className={styles.sidebar}>
        <h3>TeleMed</h3>

        <div className={styles.content}>
          <Link to="/Admin/Dasboard"><MdDashboard className={styles.SectionIcon}/>Dashboard</Link>
          <Link to="#"><MdPeopleAlt className={styles.SectionIcon}/>Patients</Link>
          <Link to="#"><MdCalendarToday className={styles.SectionIcon} />Appointment</Link>
        </div>
      </div>
    </>
  );
}

export default SideBar;
