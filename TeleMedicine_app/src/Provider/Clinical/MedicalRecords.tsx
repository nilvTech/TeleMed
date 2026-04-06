import { useState } from "react";
import styles from "./MedicalHistory.module.css";

const MedicalHistory = () => {
  /* ---------------- Patients (same as Patients tab) ---------------- */

  const patients = [
    {
      id: "PAT-001",
      name: "John Smith",
      age: 45,
      gender: "Male",
    },
    {
      id: "PAT-002",
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
    },
  ];

  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  /* ---------------- Patient Medical Records ---------------- */

  const patientRecords: any = {
    "PAT-001": {
      medicalHistory: [
        {
          id: 1,
          condition: "Diabetes",
          diagnosedDate: "01/02/2020",
          status: "Active",
          encounterId: "ENC-1001",
          recordedBy: "Dr. Smith",
          lastUpdated: "03/04/2026",
          notes: "Controlled with medication",
        },
      ],

      surgicalHistory: [
        {
          id: 1,
          procedure: "Appendectomy",
          date: "05/08/2019",
          hospital: "City Hospital",
          recordedBy: "Dr. Smith",
        },
      ],

      allergies: [
        {
          id: 1,
          allergen: "Penicillin",
          reaction: "Skin rash",
          severity: "High",
          status: "Active",
        },
      ],

      medications: [
        {
          id: 1,
          medication: "Metformin",
          dosage: "500 mg",
          frequency: "Twice daily",
          startDate: "01/01/2025",
        },
      ],

      familyHistory: [
        {
          id: 1,
          relation: "Father",
          condition: "Hypertension",
        },
      ],

      socialHistory: [
        {
          id: 1,
          smoking: "Never",
          alcohol: "Occasional",
          occupation: "Engineer",
          exercise: "3 times/week",
        },
      ],

      immunizations: [
        {
          id: 1,
          vaccine: "COVID-19",
          date: "10/10/2023",
          status: "Completed",
        },
      ],
    },

    "PAT-002": {
      medicalHistory: [],
      surgicalHistory: [],
      allergies: [],
      medications: [],
      familyHistory: [],
      socialHistory: [],
      immunizations: [],
    },
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const records = patientRecords[selectedPatientId] || {};

  /* ---------------- Handlers ---------------- */

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPatientId(e.target.value);
  };

  //   const handleEdit = (id: number) => {
  //     console.log("Edit", id);
  //   };

  //   const handleDelete = (id: number) => {
  //     console.log("Delete", id);
  //   };

  /* ---------------- Empty State ---------------- */

  if (!selectedPatientId) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Medical Records</h2>
          <div className={styles.patientSelector}>
            <label>Select Patient</label>
            <select value={selectedPatientId} onChange={handlePatientChange}>
              <option value="">-- Select Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.empty}>
          <h3>No Patient Selected</h3>
          <p>
            Please select a patient from the dropdown above to view their
            clinical history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Medical Records</h2>

        {/* Patient Selector */}

        <div className={styles.patientSelector}>
          <label>Select Patient</label>

          <select value={selectedPatientId} onChange={handlePatientChange}>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.patientCard}>
          <div>
            <strong>Name:</strong> {selectedPatient?.name}
          </div>

          <div>
            <strong>ID:</strong> {selectedPatient?.id}
          </div>

          <div>
            <strong>Age:</strong> {selectedPatient?.age}
          </div>

          <div>
            <strong>Gender:</strong> {selectedPatient?.gender}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Patient Info */}

        {/* ---------------- Medical History ---------------- */}

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Medical History</h3>

            {/* <button className={styles.primaryButton}>
            + Add Condition
          </button> */}
          </div>

          {records.medicalHistory?.length === 0 ? (
            <div className={styles.empty}>No medical history found</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>Status</th>
                  <th>Encounter</th>
                  <th>Recorded By</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>

              <tbody>
                {records.medicalHistory?.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.condition}</td>

                    <td>
                      <span
                        className={
                          item.status === "Active"
                            ? styles.active
                            : styles.resolved
                        }
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>{item.encounterId}</td>

                    <td>{item.recordedBy}</td>

                    {/* <td>
                      <div
                        className={
                          styles.actions
                        }
                      >
                        <button
                          className={
                            styles.editButton
                          }
                          onClick={() =>
                            handleEdit(
                              item.id
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className={
                            styles.deleteButton
                          }
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* ---------------- Surgical History ---------------- */}

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Surgical History</h3>

            {/* <button className={styles.primaryButton}>
            + Add Surgery
          </button> */}
          </div>

          {records.surgicalHistory?.length === 0 ? (
            <div className={styles.empty}>No surgical history found</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Procedure</th>
                  <th>Date</th>
                  <th>Hospital</th>
                </tr>
              </thead>

              <tbody>
                {records.surgicalHistory?.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.procedure}</td>

                    <td>{item.date}</td>

                    <td>{item.hospital}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* ---------------- Allergies ---------------- */}

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Allergies</h3>

            {/* <button className={styles.primaryButton}>
            + Add Allergy
          </button> */}
          </div>

          {records.allergies?.length === 0 ? (
            <div className={styles.empty}>No allergies found</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Allergen</th>
                  <th>Reaction</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {records.allergies?.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.allergen}</td>

                    <td>{item.reaction}</td>

                    <td>
                      <span className={styles.severity}>{item.severity}</span>
                    </td>

                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* ---------------- Medications ---------------- */}

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Medications</h3>

            {/* <button className={styles.primaryButton}>
            + Add Medication
          </button> */}
          </div>

          {records.medications?.length === 0 ? (
            <div className={styles.empty}>No medications found</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                </tr>
              </thead>

              <tbody>
                {records.medications?.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.medication}</td>

                    <td>{item.dosage}</td>

                    <td>{item.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
};

export default MedicalHistory;
