import { useState } from "react";
import styles from "./InvoicePage.module.css";
// import ViewInvoicePDF from "./ViewInvoicePdf";
import { handleViewInvoice } from "./ViewInvoicePdf";
const invoiceData = [
  {
    invoiceNumber: "INV-001",
    patient: "John Smith",
    encounterId: "ENC-1001",
    provider: "Dr. Michael Chen",
    invoiceDate: "04/02/2026",
    dueDate: "04/12/2026",
    total: "$150",
    patientDue: "$50",
    status: "Sent",
    paymentStatus: "Unpaid",
  },
  {
    invoiceNumber: "INV-002",
    patient: "Mary Brown",
    encounterId: "ENC-1002",
    provider: "Dr. Sarah Lee",
    invoiceDate: "04/01/2026",
    dueDate: "04/11/2026",
    total: "$200",
    patientDue: "$0",
    status: "Generated",
    paymentStatus: "Paid",
  },
];

function InvoicePage() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const filteredInvoices = invoiceData.filter((invoice) => {
    const matchesSearch =
      !search ||
      invoice.patient.toLowerCase().includes(search.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase());

    const matchesProvider =
      !provider ||
      invoice.provider.toLowerCase() === provider.toLowerCase();

    const matchesStatus =
      !status || invoice.status.toLowerCase() === status.toLowerCase();

    const matchesPaymentStatus =
      !paymentStatus ||
      invoice.paymentStatus.toLowerCase() === paymentStatus.toLowerCase();

    return (
      matchesSearch &&
      matchesProvider &&
      matchesStatus &&
      matchesPaymentStatus
    );
  });

  const handleClear = () => {
    setSearch("");
    setProvider("");
    setStatus("");
    setPaymentStatus("");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Invoices</h2>

        {/* <button className={styles.createButton}>
          Create Invoice
        </button> */}
      </div>

      {/* Filters */}
      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search Invoice ID or Patient..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className={styles.select}
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          <option value="">Provider</option>
          <option value="Dr. Michael Chen">Dr. Michael Chen</option>
          <option value="Dr. Sarah Lee">Dr. Sarah Lee</option>
        </select>

        <select
          className={styles.select}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Generated">Generated</option>
          <option value="Sent">Sent</option>
          <option value="Overdue">Overdue</option>
        </select>

        <select
          className={styles.select}
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
        >
          <option value="">Payment Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Partial">Partial</option>
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
              <th>Invoice ID</th>
              <th>Patient</th>
              <th>Encounter</th>
              <th>Provider</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Total</th>
              <th>Patient Due</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.invoiceNumber}>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.patient}</td>
                <td>{invoice.encounterId}</td>
                <td>{invoice.provider}</td>
                <td>{invoice.invoiceDate}</td>
                <td>{invoice.dueDate}</td>
                <td>{invoice.total}</td>
                <td className={styles.amount}>
                  {invoice.patientDue}
                </td>

                <td>
                  <span
                    className={`${styles.status} ${
                      styles[
                        invoice.paymentStatus
                          .toLowerCase()
                          .replace(" ", "")
                      ]
                    }`}
                  >
                    {invoice.paymentStatus}
                  </span>
                </td>

                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionButton} onClick={()=>handleViewInvoice(invoice,"View")}>
                      View
                    </button>

                    <button className={styles.actionButton} onClick={()=>handleViewInvoice(invoice,"Download")}>
                      Download
                    </button>

                    <button className={styles.sendButton}>
                      Send
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

export default InvoicePage;