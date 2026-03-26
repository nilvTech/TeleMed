import styles from "../CSS/RightSectionCSS/PatientInfoCard.module.css";
import { patient } from "../Data/patientDetails";

const PatientInformationCard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.avatar}></div>
      <div className={styles.name}>
        {patient.name}
      </div>
      <div className={styles.meta}>
        {patient.gender} | {patient.age} years
      </div>
      <div className={styles.details}>
        <div>
            <strong>MRN:</strong>
            {patient.mrn}
        </div>
        <div>
            <strong>DOB:</strong>
            {patient.dob}
        </div>
        <div>
            <strong>Phone:</strong>
            {patient.phone}
        </div>
      </div>
    </div>
  );
};
export default PatientInformationCard;