import styles from "./PatientDetailsPage.module.css";
import { PatientData, vitals, medications, problems } from "./PatientData";
import { MdAccountCircle } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useState } from "react";
function PatientDetailsPage() {
  return (
    <div>

      {/* FIXED SECTION */}
      <div className={styles.fixedTop}>
        <PatientInfoCard />
        <Buttons />
      </div>

      {/* SCROLLABLE SECTION */}
      <div className={styles.scrollableContent}>
        <Grid1 />
        <Grid2 />
      </div>
    </div>
  );
}

export function PatientInfoCard() {
  const { id } = useParams<{ id: string }>();
  const patient = PatientData.find((p) => p.id === Number(id));
  if (!patient) {
    return <h2>Patient Not Found</h2>;
  }
  return (
    <div className={styles.PatientDetails}>
      <div className={styles.PatientDetailsHeader}>
        <div className={styles.PatientMainDetails}>
          <MdAccountCircle className={styles.MdAccountCircle} />
          <span>{patient.name}</span>
        </div>
        <div className={styles.PatientDemographics}>
          <span>MRN: {patient.MRN}</span>
          <span>DOB: {patient.DOB}</span>
          <span>Gender: {patient.gender}</span>
          <span>Age: {patient.age}</span>
        </div>
      </div>
      <div className={styles.container}>
        <span className={styles.rpm}>{patient.RPM}</span>
        <span className={styles.hypertension}>{patient.condition}</span>
        <span className={styles.diabetes}>{patient.disease}</span>
      </div>
    </div>
  );
}

export function Buttons() {
  const [activeTab, setActiveTab] = useState("Summary");
  return (
    <div className={styles.container2}>
      {["Summary", "Vitals", "Medications", "Labs", "Documents", "Orders"].map(
        (tab) => (
          <button
            key={tab}
            className={activeTab === tab ? styles.active : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ),
      )}
    </div>
  );
}

export function Grid1() {
  return (
    <div className={styles.wrapper}>
      {/* LEFT - VITALS */}
      <div className={styles.card}>
        <h3>Recent Vitals (from RPM)</h3>

        {vitals.map((item, index) => (
          <div key={index} className={styles.vitalRow}>
            <span>{item.label}</span>
            <span className={styles.value}>{item.value}</span>
            <span className={styles.time}>{item.time}</span>
          </div>
        ))}
      </div>

      {/* RIGHT - MEDICATIONS */}
      <div className={styles.card}>
        <h3>Active Medications</h3>

        {medications.map((med, index) => (
          <div key={index} className={styles.medRow}>
            <div className={styles.medLeft}>
              <span className={styles.icon}>💊</span>

              <div>
                <div className={styles.medName}>{med.name}</div>
                <div className={styles.medDetail}>{med.detail}</div>
              </div>
            </div>

            <span className={styles.activeBadge}>Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Grid2() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3>Problem List</h3>

        {problems.map((item, index) => (
          <div key={index} className={styles.problemRow}>
            <span className={styles.icdCode}>{item.code}</span>
            <span className={styles.problemName}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default PatientDetailsPage;
