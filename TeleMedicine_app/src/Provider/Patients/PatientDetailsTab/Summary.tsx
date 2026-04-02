import { vitals, medications, problems } from "../PatientData";
import styles from "../PatientDetailsPage.module.css";
function Summary(){
    return(
        <>
        <Grid1/>
        <Grid2/>
        </>
    )
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
export default Summary;