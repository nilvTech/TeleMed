import styles from "./PatientList.module.css";
import { useNavigate } from "react-router-dom";
import { PatientData } from "./PatientData";
function PatientList() {
  const Navigate = useNavigate();

  return (
    <>
      <div className={styles.Heading}>
        <h2>Patient List</h2>
      </div>
      <div className={styles.PatientsList}>
        <table className={styles.table}>
          <thead className={styles.TableHeading}>
            <tr>
              <td>Name</td>
              <td>MRN/Patient ID</td>
              <td>Age</td>
              <td>Gender</td>
              <td>Phone</td>
              <td>Last Visit</td>
              <td>Next Appointment</td>
              <td>Status</td>
            </tr>
          </thead>
          <tbody className={styles.TableBody}>
            {PatientData.map((p) => (
              <tr key={p.id} onClick={() => Navigate(`/Patients/${p.id}`)}>
                <td>{p.name}</td>
                <td>{p.MRN}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.phone}</td>
                <td>{p.lastVisit}</td>
                <td>{p.nextAppointment}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default PatientList;
