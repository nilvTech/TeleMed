import { useState } from "react";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { PatientData } from "./PatientData";
import styles from "./PatientList.module.css";

function PatientList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = PatientData.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.MRN.includes(searchTerm)
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Patient Directory</h1>
          <p>Manage and view all registered patients</p>
        </div>
        <button 
          className={styles.addBtn} 
          onClick={() => navigate("/Patients/Form")}
        >
          <IoMdAdd /> Add New Patient
        </button>
      </header>

      <section className={styles.controls}>
        <div className={styles.searchWrapper}>
          <IoMdSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by name or MRN..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>MRN</th>
              <th>Age/Gender</th>
              <th>Contact</th>
              <th>Last Visit</th>
              <th>Next Appointment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p) => (
              <tr key={p.id}>
                <td className={styles.patientName} onClick={() => navigate(`/Patients/${p.id}`)}>{p.name}</td>
                <td className={styles.mrn}>{p.MRN}</td>
                <td>
                  <span className={styles.ageGender}>
                    {p.age}y • {p.gender}
                  </span>
                </td>
                <td>{p.phone}</td>
                <td>{p.lastVisit}</td>
                <td>{p.nextAppointment}</td>
                <td>
                  <span className={`${styles.badge} ${styles[p.status.toLowerCase()]}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientList;