import { useEffect, useState } from "react";
import styles from "./PatientList.module.css";
import { useNavigate } from "react-router-dom";
function PatientList() {
  const [Patients, setPatients] = useState<PatientList[]>([]);
  const Navigate = useNavigate();

  interface PatientList {
    id: number;
    name: string;
    age: number;
  }
  useEffect(() => {
    setPatients([
      { id: 1, name: "Liam", age: 49 },
      { id: 2, name: "Noah", age: 59 },
      { id: 3, name: "James", age: 39 },
      { id: 4, name: "Olivia", age: 30 },
      { id: 5, name: "Mia", age: 42 },
    ]);
  }, []);
  return (
    <div className={styles.PatientsList}>
      <h2>Patient List</h2>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Age</td>
          </tr>
        </thead>
        <tbody>
          {Patients.map((p) => (
            <tr key={p.id} onClick={() => Navigate(`/Patients/${p.id}`)}>
              <td>{p.name}</td>
              <td>{p.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default PatientList;
