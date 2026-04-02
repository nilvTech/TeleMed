import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useState } from "react";
import { MdDashboard,MdCalendarToday,MdChat,MdPeopleAlt,MdMedicalServices,MdAssignment,MdMedication,MdScience,MdNotes,MdMonitorHeart ,MdInsights ,MdReceiptLong,MdAttachFile,MdSettings,MdHelpCenter} from "react-icons/md";
import {  } from "react-icons/md";
import {  } from "react-icons/md";
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
          <Link to="/Dashboard"><MdDashboard className={styles.SectionIcon}/>Dashboard</Link>
          <Link to="/Appointment"><MdCalendarToday className={styles.SectionIcon} />Appointment</Link>
          <Link to="/Patients"><MdPeopleAlt className={styles.SectionIcon}/>Patients</Link>
          <Link to="/Message"><MdChat className={styles.SectionIcon}/>Messages</Link>
          <Link to="/Billing"><MdReceiptLong className={styles.SectionIcon}/>Billing</Link>

          {/* Sub Sections */}
          <div className={styles.menuGroup}>
            {/* Clinical Section */}
            <div className={styles.menuTitle} onClick={toggleClinical}>
            <MdMedicalServices className={styles.SectionIcon} />Clinical  {openClinical ? <FiChevronDown /> : <FiChevronRight />} 
            </div>
            {openClinical && (
              <div className={styles.subMenu}>
                    <Link to="/Clinical/MedicalRecords"><MdAssignment className={styles.SubSectionIcon} />Medical Records</Link>
                    <Link to="/Clinical/Prescriptions"><MdMedication className={styles.SubSectionIcon} />Prescriptions</Link>
                    <Link to="/Clinical/LabOrders"><MdScience className={styles.SubSectionIcon} />Lab Orders</Link>
                    <Link to="/Clinical/VisitNotes"><MdNotes className={styles.SubSectionIcon} />Visit Notes</Link>
              </div>
            )}

            {/* Monitoring Section */}
            <div className={styles.menuTitle} onClick={toggleMonitoring}>
            <MdMonitorHeart className={styles.SectionIcon} />Monitoring  {openMonitoring ? <FiChevronDown /> : <FiChevronRight />}{" "}
             
            </div>
            {openMonitoring && (
              <div className={styles.subMenu}>
                    <Link to="/Monitoring/Progress"><MdInsights className={styles.SubSectionIcon}/>Progress</Link>
                    {/* <Link to="/CarePlansOrExercise"><MdSelfImprovement className={styles.SubSectionIcon} />Care Plans / Exercise</Link> */}
              </div>
            )}

          </div>
          
          <Link to="/Files"><MdAttachFile className={styles.SectionIcon}/>Files</Link>
          <Link to="/Setting"><MdSettings className={styles.SectionIcon}></MdSettings>Setting</Link>
          <Link to="/Support"><MdHelpCenter className={styles.SectionIcon}/>Support</Link>
        </div>
      </div>
    </>
  );
}

export default SideBar;
