import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useState } from "react";
import {
  MdDashboard,
  MdCalendarToday,
  MdChat,
  MdPeopleAlt,
  MdMedicalServices,
  MdAssignment,
  MdMedication,
  MdNotes,
  MdMonitorHeart,
  MdInsights,
  MdReceiptLong,
  MdSettings,
  MdHelpCenter,
} from "react-icons/md";
import {} from "react-icons/md";
import {} from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";

function SideBar() {
  const [openClinical, setOpenClincial] = useState(false);
  const [openMonitoring, setOpenMonitoring] = useState(false);
  const toggleClinical = () => {
    setOpenClincial(!openClinical);
  };
  const toggleMonitoring = () => {
    setOpenMonitoring(!openMonitoring);
  };

  return (
    <>
      <div className={styles.sidebar}>
        <h3>TeleMed</h3>

        <div className={styles.content}>
          <NavLink
            to="/Dashboard"
            className={({ isActive }) => `${isActive ? styles.active : ""}`}
          >
            <MdDashboard className={styles.SectionIcon} />
            Dashboard
          </NavLink>
          <NavLink
            to="/Appointment"
            className={({ isActive }) => `${isActive ? styles.active : ""}`}
          >
            <MdCalendarToday className={styles.SectionIcon} />
            Appointment
          </NavLink>
          <NavLink
            to="/Patients"
            className={({ isActive }) => `${isActive ? styles.active : ""}`}
          >
            <MdPeopleAlt className={styles.SectionIcon} />
            Patients
          </NavLink>
          <NavLink
            to="/Message"
            className={({ isActive }) => `${isActive ? styles.active : ""}`}
          >
            <MdChat className={styles.SectionIcon} />
            Messages
          </NavLink>
          <NavLink
            to="/Billing"
            className={({ isActive }) => `${isActive ? styles.active : ""}`}
          >
            <MdReceiptLong className={styles.SectionIcon} />
            Billing
          </NavLink>

          {/* Sub Sections */}
          <div className={styles.menuGroup}>
            {/* Clinical Section */}
            <div className={styles.menuTitle} onClick={toggleClinical}>
              <MdMedicalServices className={styles.SectionIcon} />
              Clinical {openClinical ? <FiChevronDown /> : <FiChevronRight />}
            </div>
            {openClinical && (
              <div className={styles.subMenu}>
                <NavLink
                  to="/Clinical/MedicalRecords"
                  className={({ isActive }) =>
                    `${isActive ? styles.active : ""}`
                  }
                >
                  <MdAssignment className={styles.SubSectionIcon} />
                  Medical Records
                </NavLink>
                <NavLink
                  to="/Clinical/Prescriptions"
                  className={({ isActive }) =>
                    `${isActive ? styles.active : ""}`
                  }
                >
                  <MdMedication className={styles.SubSectionIcon} />
                  Prescriptions
                </NavLink>
                {/* <NavLink to="/Clinical/LabOrders"><MdScience className={styles.SubSectionIcon} />Lab Orders</NavLink> */}
                <NavLink
                  to="/Clinical/VisitNotes"
                  className={({ isActive }) =>
                    `${isActive ? styles.active : ""}`
                  }
                >
                  <MdNotes className={styles.SubSectionIcon} />
                  Visit Notes
                </NavLink>
              </div>
            )}

            {/* Monitoring Section */}
            <div className={styles.menuTitle} onClick={toggleMonitoring}>
              <MdMonitorHeart className={styles.SectionIcon} />
              Monitoring{" "}
              {openMonitoring ? <FiChevronDown /> : <FiChevronRight />}{" "}
            </div>
            {openMonitoring && (
              <div className={styles.subMenu}>
                <NavLink
                  to="/Monitoring/Progress"
                  className={({ isActive }) =>
                    `${isActive ? styles.active : ""}`
                  }
                >
                  <MdInsights className={styles.SubSectionIcon} />
                  Progress
                </NavLink>
                {/* <NavLink to="/CarePlansOrExercise"><MdSelfImprovement className={styles.SubSectionIcon} />Care Plans / Exercise</NavLink> */}
              </div>
            )}
          </div>

          {/* <NavLink to="/Files"><MdAttachFile className={styles.SectionIcon}/>Files</NavLink> */}
          <NavLink
            to="/Setting/Profile"
            className={({ isActive }) => `${isActive ? styles.active : ""}`}
          >
            <MdSettings className={styles.SectionIcon}></MdSettings>Setting
          </NavLink>
          <NavLink
            to="/Support"
            className={({ isActive }) => `${isActive ? styles.active : ""}`}
          >
            <MdHelpCenter className={styles.SectionIcon} />
            Support
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default SideBar;
