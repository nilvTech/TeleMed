import { useEffect, useState } from "react";
import styles from "./ChargesPage.module.css";

interface Charge {
  id: string;
  patient: string;
  provider: string;
  date: string;
  icd: string;
  cpt:string;
  amount: string;
  insurance: string;
  status: "Submitted" | "Pending" | "Paid";
}

const chargesData: Charge[] = [
  {
    id: "CHG-001",
    patient: "John Smith",
    provider: "Dr. Michael Chen",
    date: "03/31/2026",
    icd: "F41.1",
    cpt: "90834",
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
    cpt: "90837",
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
    cpt: "99213",
    amount: "$95",
    insurance: "Copay",
    status: "Paid",
  },
  {
    id: "CHG-001",
    patient: "John Smith",
    provider: "Dr. Michael Chen",
    date: "03/31/2026",
    icd: "F41.1",
    cpt: "90834",
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
    cpt: "90837",
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
    cpt: "99213",
    amount: "$95",
    insurance: "Copay",
    status: "Paid",
  },
  {
    id: "CHG-001",
    patient: "John Smith",
    provider: "Dr. Michael Chen",
    date: "03/31/2026",
    icd: "F41.1",
    cpt: "90834",
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
    cpt: "90837",
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
    cpt: "99213",
    amount: "$95",
    insurance: "Copay",
    status: "Paid",
  },
];

function ChargesPage() {
  const [filterData, setFilteredData] = useState(chargesData);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Charges</h2>
      </div>
      <ChargesFilters setFilteredData={setFilteredData} />
      <ChargesTable data={filterData} />
    </div>
  );
}
const ChargesFilters = ({ setFilteredData }: any) => {
  const [provider, setProvider] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [Insurance, setInsurance] = useState<string>();

  // Searching filter
  const [search, setSearch] = useState("");

  useEffect(() => {
    const result = chargesData.filter((charge) => {
      return (
        (!search ||
          charge.patient.toLowerCase().includes(search.toLowerCase()) ||
          charge.id.toLowerCase().includes(search.toLowerCase())) &&
        (!provider ||
          charge.provider.toLowerCase() === provider.toLowerCase()) &&
        (!status || charge.status.toLowerCase() === status.toLowerCase()) &&
        (!Insurance ||
          charge.insurance.toLowerCase() === Insurance.toLowerCase())
      );
    });
    setFilteredData(result);
  }, [search, provider, status, Insurance]);

  const handleClear = () => {
    setSearch("");
    setProvider("");
    setStatus("");
    setInsurance("");
    setFilteredData(chargesData);
  };
  return (
    <div className={styles.filterContainer}>
      <input
        type="text"
        placeholder="Search Patient or charge ID..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className={styles.searchInput}
      />
      <select
        value={provider}
        className={styles.select}
        name="Provider"
        id="pate"
        onChange={(event) => setProvider(event.target.value)}
      >
        <option value="" hidden>
          Provider
        </option>
        <option value="dr. michael chen">Dr. Michael Chen</option>
        <option value="dr. sarah lee">Dr. Sarah Lee</option>
        <option value="dr. john doe">Dr. John Doe</option>
      </select>

      <select
        value={status}
        className={styles.select}
        name="Status"
        id="status"
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="" hidden>
          Status
        </option>
        <option value="submitted">Submitted</option>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
      </select>

      <select
        value={Insurance}
        className={styles.select}
        name="Insurance"
        id="insurance"
        onChange={(event) => setInsurance(event.target.value)}
      >
        <option value="" hidden>
          Insurance
        </option>
        <option value="blue cross">Blue Cross</option>
        <option value="aetna">Aetna</option>
        <option value="copay">Copay</option>
      </select>
      <button className={styles.clearButton} onClick={handleClear}>
        Clear Filter
      </button>
    </div>
  );
};

const ChargesTable = ({ data }: any) => {
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
            <th>CPT</th>
            <th>Amount</th>
            <th>Insurance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((charge: Charge) => (
            <tr key={charge.id}>
              <td>{charge.id}</td>
              <td>{charge.patient}</td>
              <td>{charge.provider}</td>
              <td>{charge.date}</td>
              <td>{charge.icd}</td>
              <td>{charge.cpt}</td>
              <td>{charge.amount}</td>
              <td>{charge.insurance}</td>

              <td>
                <span
                  className={`${styles.status} ${styles[charge.status.toLocaleLowerCase()]}`}
                >
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
