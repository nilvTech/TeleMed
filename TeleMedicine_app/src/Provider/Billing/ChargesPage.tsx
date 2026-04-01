import styles from "./ChargesPage.module.css";
const chargesData = [
  {
    id: "CHG-001",
    patient: "John Smith",
    provider: "Dr. Michael Chen",
    date: "03/31/2026",
    icd: "F41.1",
    amount: "$120",
    insurance: "Blue Cross",
    status: "Submitted",
  },
  {
    id: "CHG-002",
    patient: "Mary Brown",
    provider: "Dr. Sarah Lee",
    date: "03/30/2026",
    icd: "F32.9",
    amount: "$150",
    insurance: "Aetna",
    status: "Pending",
  },
  {
    id: "CHG-003",
    patient: "David Wilson",
    provider: "Dr. John Doe",
    date: "03/29/2026",
    icd: "J06.9",
    amount: "$95",
    insurance: "Copay",
    status: "Paid",
  },
];

function ChargesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Charges</h2>
      </div>
      <ChargesFilters />
      <ChargesTable/>
    </div>
  );
}
const ChargesFilters = () => {
  return (
    <div className={styles.filterContainer}>
      <input
        type="text"
        placeholder="Search Patient or charge ID..."
        className={styles.searchInput}
      />
      <select className={styles.select} name="Provider" id="pate">
        <option value="date">Provider</option>
      </select>

      <select className={styles.select} name="Status" id="status">
        <option value="date">Status</option>
      </select>

      <select className={styles.select} name="Insurance" id="insurance">
        <option value="date">Insurance</option>
      </select>

      <button className={styles.filterButton}>Filter</button>

      <button className={styles.clearButton}>Clear Filter</button>
    </div>
  );
};

const ChargesTable = () => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Charge ID</th>
            <th>Patient</th>
            <th>Provider</th>
            <th>Date</th>
            <th>ICD</th>
            <th>Amount</th>
            <th>Insurance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {chargesData.map((charge) => (
            <tr key={charge.id}>
              <td>{charge.id}</td>
              <td>{charge.patient}</td>
              <td>{charge.provider}</td>
              <td>{charge.date}</td>
              <td>{charge.icd}</td>
              <td>{charge.amount}</td>
              <td>{charge.insurance}</td>

              <td>
                <span className={`${styles.status} ${styles[charge.status.toLocaleLowerCase()]}`}>
                    {charge.status}
                </span>
              </td>
              <td>
                <button className={styles.actionButton}>View</button>
                <button className={styles.actionButton}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChargesPage;
