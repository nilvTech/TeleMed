import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useState } from "react";
import { MdDashboard,MdCalendarToday,MdChat,MdPeopleAlt,MdVideoCall,MdMedicalServices,MdAssignment,MdMedication,MdScience,MdNotes,MdMonitorHeart ,MdInsights ,MdSelfImprovement ,MdAccountBalance,MdReceiptLong,MdVerifiedUser,MdAssessment,MdNotificationsActive,MdAttachFile,MdSettings,MdHelpCenter} from "react-icons/md";
import {  } from "react-icons/md";
import {  } from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";

function SideBar() {
  const [openClinical, setOpenClincial] = useState(false);
  const [openMonitoring, setOpenMonitoring] = useState(false);
  const [openFinance, setOpenFinance] = useState(false);
  const toggleClinical = () => {
    setOpenClincial(!openClinical);
  };
  const toggleMonitoring = () => {
    setOpenMonitoring(!openMonitoring);
  };
  const toggleFinance = () => {
    setOpenFinance(!openFinance);
  };
  return (
    <>
      <div className={styles.sidebar}>
        <h3>TeleMed</h3>

        <div className={styles.content}>
          <Link to="/Dashboard"><MdDashboard className={styles.SectionIcon}/>Dashboard</Link>
          <Link to="/Appointment"><MdCalendarToday className={styles.SectionIcon} />Appointment</Link>
          <Link to="/Patients"><MdPeopleAlt className={styles.SectionIcon}/>Patients</Link>
          <Link to="/Patients/:id"><MdVideoCall className={styles.SectionIcon} />Encounters / Video Visits</Link>
          <Link to="#"><MdChat className={styles.SectionIcon}/>Messages</Link>

          {/* Sub Sections */}
          <div className={styles.menuGroup}>
            {/* Clinical Section */}
            <div className={styles.menuTitle} onClick={toggleClinical}>
            <MdMedicalServices className={styles.SectionIcon} />Clinical  {openClinical ? <FiChevronDown /> : <FiChevronRight />} 
            </div>
            {openClinical && (
              <div className={styles.subMenu}>
                    <Link to="/MedicalRecords"><MdAssignment className={styles.SubSectionIcon} />Medical Records</Link>
                    <Link to="/Prescriptions"><MdMedication className={styles.SubSectionIcon} />Prescriptions</Link>
                    <Link to="/LabOrders"><MdScience className={styles.SubSectionIcon} />Lab Orders</Link>
                    <Link to="/VisitNotes"><MdNotes className={styles.SubSectionIcon} />Visit Notes</Link>
              </div>
            )}

            {/* Monitoring Section */}
            <div className={styles.menuTitle} onClick={toggleMonitoring}>
            <MdMonitorHeart className={styles.SectionIcon} />Monitoring  {openMonitoring ? <FiChevronDown /> : <FiChevronRight />}{" "}
             
            </div>
            {openMonitoring && (
              <div className={styles.subMenu}>
                    <Link to="/Progress"><MdInsights className={styles.SubSectionIcon}/>Progress</Link>
                    <Link to="/CarePlansOrExercise"><MdSelfImprovement className={styles.SubSectionIcon} />Care Plans / Exercise</Link>
              </div>
            )}

            {/* Finance Section */}
            <div className={styles.menuTitle} onClick={toggleFinance}>
            <MdAccountBalance className={styles.SectionIcon} />Finance {openFinance ? <FiChevronDown /> : <FiChevronRight />}  
            </div>
            {openFinance && (
                <div className={styles.subMenu}>
                  <Link to="/Billing"><MdReceiptLong className={styles.SubSectionIcon}/>Billing</Link>
                    <Link to="/Insurance"><MdVerifiedUser className={styles.SubSectionIcon}/>Insurance</Link>
              </div>
            )}
          </div>
          <Link to="/Reports"><MdAssessment className={styles.SectionIcon}/>Reports</Link>
          <Link to="/Notifications"><MdNotificationsActive className={styles.SectionIcon}/>Notifications</Link>
          <Link to="/Files"><MdAttachFile className={styles.SectionIcon}/>Files</Link>
          <Link to="/Setting"><MdSettings className={styles.SectionIcon}></MdSettings>Setting</Link>
          <Link to="/Support"><MdHelpCenter className={styles.SectionIcon}/>Support</Link>
        </div>
      </div>
    </>
  );
}

export default SideBar;
