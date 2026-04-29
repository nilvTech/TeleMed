import { useState } from "react";
import styles from "./PaymentPage.module.css";

const paymentData = [
  {
    id: "PAY-001",
    invoiceId: "INV-001",
    patient: "John Smith",
    provider: "Dr. Michael Chen",
    amount: "$50",
    method: "Insurance",
    date: "04/02/2026",
    status: "Completed",
  },
  {
    id: "PAY-002",
    invoiceId: "INV-002",
    patient: "Mary Brown",
    provider: "Dr. Sarah Lee",
    amount: "$200",
    method: "Copay",
    date: "04/01/2026",
    status: "Pending",
  },
];

function PaymentPage() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("");
  const [method, setMethod] = useState("");
  const [status, setStatus] = useState("");

  const filteredPayments = paymentData.filter((payment) => {
    const matchesSearch =
      !search ||
      payment.patient.toLowerCase().includes(search.toLowerCase()) ||
      payment.id.toLowerCase().includes(search.toLowerCase()) ||
      payment.invoiceId.toLowerCase().includes(search.toLowerCase());

    const matchesProvider =
      !provider || payment.provider.toLowerCase() === provider.toLowerCase();

    const matchesMethod =
      !method || payment.method.toLowerCase() === method.toLowerCase();

    const matchesStatus =
      !status || payment.status.toLowerCase() === status.toLowerCase();

    return matchesSearch && matchesProvider && matchesMethod && matchesStatus;
  });

  const handleClear = () => {
    setSearch("");
    setProvider("");
    setMethod("");
    setStatus("");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Payments</h2>

        {/* <button className={styles.recordButton}>Record Payment</button> */}
      </div>

      {/* Filters */}
      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search Payment ID, Invoice ID or Patient..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className={styles.select}
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          <option value="" disabled>Provider</option>
          <option value="Dr. Michael Chen">Dr. Michael Chen</option>
          <option value="Dr. Sarah Lee">Dr. Sarah Lee</option>
        </select>

        <select
          className={styles.select}
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="" disabled>Payment Method</option>
          <option value="Insurance">Insurance</option>
          <option value="Copay">Copay</option>
        </select>

        <select
          className={styles.select}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>

        <button className={styles.clearButton} onClick={handleClear}>
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Invoice ID</th>
              <th>Patient</th>
              <th>Provider</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.invoiceId}</td>
                <td>{payment.patient}</td>
                <td>{payment.provider}</td>
                <td className={styles.amount}>{payment.amount}</td>
                <td>{payment.method}</td>
                <td>{payment.date}</td>

                <td>
                  <span
                    className={`${styles.status} ${
                      styles[payment.status.toLowerCase()]
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>

                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionButton}>View</button>

                    <button className={styles.actionButton}>Receipt</button>

                    <button className={styles.refundButton}>Refund</button>
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

export default PaymentPage;
