import styles from "../CSS/RightSectionCSS/PatientInfoCard.module.css";
import { useMessageStore } from "../Store/MessageStore";

const PatientInformationCard = () => {
  const selectedPatient = useMessageStore((state) => state.selectedPatient);

  if(!selectedPatient) return null;

  return (
    <div className={styles.container}>
      <div className={styles.avatar}></div>
      <div className={styles.name}>
        {selectedPatient.name}
      </div>
      <div className={styles.meta}>
        {selectedPatient.gender} | {selectedPatient.age} years
      </div>
      <div className={styles.details}>
        <div>
            <strong>MRN:</strong>
            {selectedPatient.mrn}
        </div>
        <div>
            <strong>DOB:</strong>
            {selectedPatient.dob}
        </div>
        <div>
            <strong>Phone:</strong>
            {selectedPatient.phone}
        </div>
      </div>
    </div>
  );
};
export default PatientInformationCard;