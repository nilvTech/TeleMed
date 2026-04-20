import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useState } from "react";
import {
  MdDashboard,
  MdCalendarToday,
  MdMedicalServices,
  MdAssignment,
  MdMedication,
  MdNotes,
  MdSettings,
  MdHelpCenter,
  MdScience,
  MdOutlinePayment,
} from "react-icons/md";
import { LuMessageSquareDot } from "react-icons/lu";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaMoneyBills } from "react-icons/fa6";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";

function SideBar() {
  const [openMedicalRecords, setOpenClincial] = useState(false);
  const [openMessages, setOpenMessages] = useState(false);
  const [openPayments, setOpenPayments] = useState(false);
  const toggleMedicalRecords = () => {
    setOpenClincial(!openMedicalRecords);
  };
  const toggleMessages = () => {
    setOpenMessages(!openMessages);
  };
  const togglePayments = () => {
    setOpenPayments(!openPayments);
  };

  return (
    <>
      <div className={styles.sidebar}>
        <h3>TeleMed</h3>

        <div className={styles.content}>
          <NavLink
            to="/Patient/Dasboard"
            className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
          >
            <MdDashboard className={styles.SectionIcon} />
            Dashboard
          </NavLink>
          <NavLink
            to="/Patient/Appointment"
            className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
          >
            <MdCalendarToday className={styles.SectionIcon} />
            Appointment
          </NavLink>

          {/* Sub Sections */}
          <div className={styles.menuGroup}>
            {/* MedicalRecords Section */}
            <div className={styles.menuTitle} onClick={toggleMedicalRecords}>
              <MdMedicalServices className={styles.SectionIcon} />
              Medical Records{" "}
              {openMedicalRecords ? <FiChevronDown /> : <FiChevronRight />}
            </div>
            {openMedicalRecords && (
              <div className={styles.subMenu}>
                <NavLink
                  to="/MedicalRecords/VisitNotes"
                  className={({ isActive }) =>
                    ` ${isActive ? styles.active : ""}`
                  }
                >
                  <MdNotes className={styles.SubSectionIcon} />
                  Visit Notes
                </NavLink>
                <NavLink
                  to="/MedicalRecords/Prescription"
                  className={({ isActive }) =>
                    ` ${isActive ? styles.active : ""}`
                  }
                >
                  <MdMedication className={styles.SubSectionIcon} />
                  Prescriptions
                </NavLink>
                <NavLink
                  to="/MedicalRecords/LabOrders"
                  className={({ isActive }) =>
                    ` ${isActive ? styles.active : ""}`
                  }
                >
                  <MdScience className={styles.SubSectionIcon} />
                  Lab Orders
                </NavLink>
                <NavLink
                  to="/MedicalRecords/Files"
                  className={({ isActive }) =>
                    ` ${isActive ? styles.active : ""}`
                  }
                >
                  <MdAssignment className={styles.SubSectionIcon} />
                  Files
                </NavLink>
              </div>
            )}

            {/* Messages Section */}
            <div className={styles.menuTitle} onClick={toggleMessages}>
              <LuMessageSquareDot className={styles.SectionIcon} />
              Messages
              {openMessages ? <FiChevronDown /> : <FiChevronRight />}{" "}
            </div>
            {openMessages && (
              <div className={styles.subMenu}>
                <NavLink
                  to="/Messages/Chat"
                  className={({ isActive }) =>
                    ` ${isActive ? styles.active : ""}`
                  }
                >
                  <IoChatbubbleEllipsesSharp
                    className={styles.SubSectionIcon}
                  />
                  Chat
                </NavLink>
                {/* <NavLink to="/CarePlansOrExercise"><MdSelfImprovement className={styles.SubSectionIcon} />Care Plans / Exercise</NavLink> */}
              </div>
            )}

            {/* Payment Section */}
            <div className={styles.menuTitle} onClick={togglePayments}>
              <MdOutlinePayment className={styles.SectionIcon} />
              Payments
              {openPayments ? <FiChevronDown /> : <FiChevronRight />}{" "}
            </div>
            {openPayments && (
              <div className={styles.subMenu}>
                <NavLink
                  to="/Payments/Billing"
                  className={({ isActive }) =>
                    ` ${isActive ? styles.active : ""}`
                  }
                >
                  <FaMoneyBills className={styles.SubSectionIcon} />
                  Billing
                </NavLink>
              </div>
            )}
          </div>

          {/* <NavLink to="/Files"><MdAttachFile className={styles.SectionIcon}/>Files</NavLink> */}
          {/* <NavLink to="#">
            <MdHealthAndSafety  className={styles.SectionIcon}/>Insurance
          </NavLink> */}
          <NavLink
            to="/Patient/Setting"
            className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
          >
            <MdSettings className={styles.SectionIcon} />
            Settings
          </NavLink>
          <NavLink
            to="/Patient/Support"
            className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
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
