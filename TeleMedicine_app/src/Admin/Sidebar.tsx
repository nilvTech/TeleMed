import { NavLink } from "react-router-dom";
import styles from "../Provider/DashboardContent/SideBar.module.css";
import { MdDashboard, MdCalendarToday, MdPeopleAlt } from "react-icons/md";
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
          <NavLink to="#">
            <MdCalendarToday className={styles.SectionIcon} />
            Appointments
          </NavLink>
          <NavLink to="#">
            <MdCalendarToday className={styles.SectionIcon} />
            Billing & Finance
          </NavLink>
          <NavLink to="#">
            <MdCalendarToday className={styles.SectionIcon} />
            Clinical Oversight
          </NavLink>
          <NavLink to="#">
            <MdCalendarToday className={styles.SectionIcon} />
            Users & Access Control
          </NavLink>
          <NavLink to="#">
            <MdCalendarToday className={styles.SectionIcon} />
            Reports & Analytics
          </NavLink>
          <NavLink to="#">
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
          </NavLink>
          <NavLink to="#">
            <MdCalendarToday className={styles.SectionIcon} />
            System Settings
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default SideBar;
