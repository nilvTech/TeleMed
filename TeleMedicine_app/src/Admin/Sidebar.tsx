import { NavLink } from "react-router-dom";
import styles from "../Provider/DashboardContent/SideBar.module.css";
import { MdDashboard, MdCalendarToday, MdPeopleAlt,MdReceiptLong,MdMedicalServices } from "react-icons/md";
import { AiOutlineControl } from "react-icons/ai";
import { IoMdAnalytics } from "react-icons/io";
import { GrSystem } from "react-icons/gr";
import {} from "react-icons/md";
import {} from "react-icons/md";
function SideBar() {
  return (
    <>
      <div className={styles.sidebar}>
        <h3>TeleMed</h3>

        <div className={styles.content}>
          <NavLink
            to="/Admin/Dashboard"
            className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
          >
            <MdDashboard className={styles.SectionIcon} />
            Dashboard
          </NavLink>
          <NavLink
            to="/Admin/Providers"
            className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
          >
            <MdPeopleAlt className={styles.SectionIcon} />
            Providers
          </NavLink>
          <NavLink
            to="/Admin/Appointments"
            className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
          >
            <MdCalendarToday className={styles.SectionIcon} />
            Appointments
          </NavLink>
          <NavLink
            to="/Admin/Billing&Claims"
            className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
          >
            <MdReceiptLong className={styles.SectionIcon} />
            Billing & Claims
          </NavLink>
          <NavLink
            to="/Admin/ClinicalOverview"
            className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
          >
            <MdMedicalServices className={styles.SectionIcon} />
            Clinical Oversight
          </NavLink>
          <NavLink
            to="/Admin/Users&AccessControl"
            className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
          >
            <AiOutlineControl className={styles.SectionIcon} />
            Users & Access Control
          </NavLink>
          <NavLink
            to="/Admin/Reports&Analytics"
            className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
          >
            <IoMdAnalytics className={styles.SectionIcon} />
            Analytics
          </NavLink>
          {/* <NavLink to="#">
            <MdCalendarToday className={styles.SectionIcon} />
            Notifications
          </NavLink>
          <NavLink to="#">
            <MdCalendarToday className={styles.SectionIcon} />
            Support & Helpdesk
          </NavLink>
          <NavLink to="#">
            <MdCalendarToday className={styles.SectionIcon} />
            Compliance & Security
          </NavLink> */}
          <NavLink to="/Admin/Settings"  className={({ isActive }) => ` ${isActive ? styles.active : ""}`}>
            <GrSystem className={styles.SectionIcon} />
            System Settings
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default SideBar;
