import { useState } from "react";
import styles from "./Prescriptions.module.css";

type Prescription = {
  id: string;
  patientId: string;

  medication: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;

  startDate: string;
  endDate?: string;

  prescribedBy: string;

  status: "Active" | "Completed" | "Discontinued";

  instructions: string;
  refills: number;
};

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
};

/* Dummy Patients */

const patients: Patient[] = [
  {
    id: "PAT-001",
    name: "John Smith",
    age: 45,
    gender: "Male",
  },
  {
    id: "PAT-002",
    name: "Emma Johnson",
    age: 32,
    gender: "Female",
  },
  {
    id: "PAT-003",
    name: "Michael Brown",
    age: 58,
    gender: "Male",
  },
];

/* Dummy Prescriptions */

const prescriptionsData: Prescription[] = [
  {
    id: "RX-001",
    patientId: "PAT-001",

    medication: "Paracetamol",
    dosage: "500 mg",
    frequency: "Twice Daily",
    route: "Oral",
    duration: "5 Days",

    startDate: "04/01/2026",

    prescribedBy: "Dr. Sarah Wilson",

    status: "Active",

    instructions: "Take after meals",
    refills: 1,
  },
  {
    id: "RX-002",
    patientId: "PAT-001",

    medication: "Amoxicillin",
    dosage: "250 mg",
    frequency: "Three Times Daily",
    route: "Oral",
    duration: "7 Days",

    startDate: "03/20/2026",
    endDate: "03/27/2026",

    prescribedBy: "Dr. Sarah Wilson",

    status: "Completed",

    instructions: "Complete full course",
    refills: 0,
  },
];

export default function Prescriptions() {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPatientId(e.target.value);
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const activePrescriptions = prescriptionsData.filter(
    (p) => p.patientId === selectedPatientId && p.status === "Active",
  );

  const pastPrescriptions = prescriptionsData.filter(
    (p) => p.patientId === selectedPatientId && p.status !== "Active",
  );

  return (
    <div className={styles.container}>
      {/* Sticky Header */}

      <div className={styles.header}>
        <h2 className={styles.title}>Prescriptions</h2>

        <div className={styles.topRow}>
          <div className={styles.patientSelector}>
            <label>Select Patient:</label>

            <select value={selectedPatientId} onChange={handlePatientChange}>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* <button className={styles.addButton}>+ New Prescription</button> */}

          {/* Patient Card */}
        </div>
        <div className={styles.patientCard}>
          {selectedPatient && (
            <>
              <div>
                <strong>Name:</strong> {selectedPatient.name}
              </div>

              <div>
                <strong>Age:</strong> {selectedPatient.age}
              </div>

              <div>
                <strong>Gender:</strong> {selectedPatient.gender}
              </div>

              <div>
                <strong>Patient ID:</strong> {selectedPatient.id}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scrollable Content */}

      <div className={styles.content}>
        {/* Active Prescriptions */}

        <div className={styles.card}>
          <h3>Active Prescriptions</h3>

          {activePrescriptions.length === 0 ? (
            <div className={styles.empty}>No active prescriptions found</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Route</th>
                  <th>Duration</th>
                  <th>Start Date</th>
                  <th>Refills</th>
                  <th>Status</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>

              <tbody>
                {activePrescriptions.map((rx) => (
                  <tr key={rx.id}>
                    <td>{rx.medication}</td>

                    <td>{rx.dosage}</td>

                    <td>{rx.frequency}</td>

                    <td>{rx.route}</td>

                    <td>{rx.duration}</td>

                    <td>{rx.startDate}</td>

                    <td>{rx.refills}</td>

                    <td>
                      <span className={styles.active}>Active</span>
                    </td>

                    {/* <td>
                      <div className={styles.actions}>
                        <button className={styles.editButton}>Edit</button>

                        <button className={styles.deleteButton}>
                          Discontinue
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Past Prescriptions */}

        <div className={styles.card}>
          <h3>Past Prescriptions</h3>

          {pastPrescriptions.length === 0 ? (
            <div className={styles.empty}>No past prescriptions found</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Prescribed By</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {pastPrescriptions.map((rx) => (
                  <tr key={rx.id}>
                    <td>{rx.medication}</td>

                    <td>{rx.dosage}</td>

                    <td>{rx.startDate}</td>

                    <td>{rx.endDate}</td>

                    <td>{rx.prescribedBy}</td>

                    <td>
                      <span
                        className={
                          rx.status === "Discontinued"
                            ? styles.deleteButton
                            : styles.resolved
                        }
                      >
                        {rx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
