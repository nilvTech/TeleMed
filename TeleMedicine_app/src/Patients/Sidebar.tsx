import { Link } from "react-router-dom";
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
  MdHealthAndSafety,
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
  const togglePayments = ()=>{
    setOpenPayments(!openPayments);
  }

  return (
    <>
      <div className={styles.sidebar}>
        <h3>TeleMed</h3>

        <div className={styles.content}>
          <Link to="/Patient/Dasboard">
            <MdDashboard className={styles.SectionIcon} />
            Dashboard
          </Link>
          <Link to="/Patient/Appointment">
            <MdCalendarToday className={styles.SectionIcon} />
            Appointment
          </Link>

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
                <Link to="/MedicalRecords/VisitNotes">
                  <MdNotes className={styles.SubSectionIcon} />
                  Visit Notes
                </Link>
                <Link to="/MedicalRecords/Prescription">
                  <MdMedication className={styles.SubSectionIcon} />
                  Prescriptions
                </Link>
                <Link to="/MedicalRecords/LabOrders">
                  <MdScience className={styles.SubSectionIcon} />
                  Lab Orders
                </Link>
                <Link to="#">
                  <MdAssignment className={styles.SubSectionIcon} />
                  Files
                </Link>
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
                <Link to="#">
                  <IoChatbubbleEllipsesSharp className={styles.SubSectionIcon} />
                  Chat
                </Link>
                {/* <Link to="/CarePlansOrExercise"><MdSelfImprovement className={styles.SubSectionIcon} />Care Plans / Exercise</Link> */}
              </div>
            )}

              {/* Payment Section */}
            <div className={styles.menuTitle} onClick={togglePayments}>
              <MdOutlinePayment    className={styles.SectionIcon} />
              Payments
              {openPayments ? <FiChevronDown /> : <FiChevronRight />}{" "}
            </div>
            {openPayments && (
              <div className={styles.subMenu}>
                <Link to="#">
                  <FaMoneyBills className={styles.SubSectionIcon} />
                  Billing
                </Link>
              </div>
            )}
          </div>

          {/* <Link to="/Files"><MdAttachFile className={styles.SectionIcon}/>Files</Link> */}
          <Link to="#">
            <MdHealthAndSafety  className={styles.SectionIcon}/>Insurance
          </Link>
          <Link to="#">
            <MdSettings className={styles.SectionIcon} />
            Settings
          </Link>
          <Link to="#">
            <MdHelpCenter className={styles.SectionIcon} />
            Support
          </Link>
        </div>
      </div>
    </>
  );
}

export default SideBar;
