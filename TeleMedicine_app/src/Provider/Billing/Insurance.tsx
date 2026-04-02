import { useState } from "react";
import styles from "./InsurancePage.module.css";

const insuranceData = [
  {
    id: "INS-001",
    name: "Blue Cross",
    payerId: "BC001",
    phone: "9876543210",
    email: "support@bluecross.com",
    address: "New York, USA",
    status: "Active",
  },
  {
    id: "INS-002",
    name: "Aetna",
    payerId: "AE002",
    phone: "9123456780",
    email: "help@aetna.com",
    address: "California, USA",
    status: "Inactive",
  },
];

function InsurancePage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filteredInsurance = insuranceData.filter((insurance) => {
    const matchesSearch =
      !search ||
      insurance.name.toLowerCase().includes(search.toLowerCase()) ||
      insurance.payerId.toLowerCase().includes(search.toLowerCase()) ||
      insurance.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      !status ||
      insurance.status.toLowerCase() === status.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleClear = () => {
    setSearch("");
    setStatus("");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Insurance</h2>

        <button className={styles.addButton}>
          Add Insurance
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search Insurance Name, Payer ID or Insurance ID..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className={styles.select}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          className={styles.clearButton}
          onClick={handleClear}
        >
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Insurance ID</th>
              <th>Insurance Name</th>
              <th>Payer ID</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInsurance.map((insurance) => (
              <tr key={insurance.id}>
                <td>{insurance.id}</td>
                <td>{insurance.name}</td>
                <td>{insurance.payerId}</td>
                <td>{insurance.phone}</td>
                <td>{insurance.email}</td>
                <td>{insurance.address}</td>

                <td>
                  <span
                    className={`${styles.status} ${
                      styles[insurance.status.toLowerCase()]
                    }`}
                  >
                    {insurance.status}
                  </span>
                </td>

                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionButton}>
                      View
                    </button>

                    <button className={styles.actionButton}>
                      Edit
                    </button>

                    <button className={styles.deactivateButton}>
                      Deactivate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InsurancePage;