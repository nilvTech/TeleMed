import { useState } from "react";
import styles from "./LabOrders.module.css";
import jsPDF from "jspdf";

interface LabOrder {
  id: number;
  testName: string;
  provider: string;
  orderDate: string;
  status: "Pending" | "Completed" | "Cancelled";
  labName: string;
}

const labOrders: LabOrder[] = [
  {
    id: 1,
    testName: "Complete Blood Count (CBC)",
    provider: "Dr. Sarah Miller",
    orderDate: "April 08, 2026",
    status: "Completed",
    labName: "City Diagnostic Lab",
  },
  {
    id: 2,
    testName: "Lipid Profile",
    provider: "Dr. James Wilson",
    orderDate: "April 10, 2026",
    status: "Pending",
    labName: "HealthCare Labs",
  },
];

function PatientLabOrders() {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder>();
  const [status, setStatus] = useState("All Orders");
  const [filteredDate, setFilteredDate] = useState("");

  const handleViewDetails = (id: number) => {
    setShowModal(true);
    const Order = labOrders.find((order) => order.id === id);
    setSelectedOrder(Order);
  };

  const handleFilterByDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;

    if (!date) {
      setFilteredDate("");
      return;
    }

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

    setFilteredDate(formattedDate);
  };

  const filteredLabOrders = labOrders.filter((orders) => {
    const matchStatus = status === "All Orders" || orders.status === status;
    const matchDate = filteredDate === "" || orders.orderDate === filteredDate;
    return matchStatus && matchDate;
  });
  const handleDownloadReport = (order: LabOrder) => {
    const doc = new jsPDF();
    const indigoTheme = [99, 102, 241]; // Indigo Accent

    // --- 1. Header Area ---
    doc.setFillColor(indigoTheme[0], indigoTheme[1], indigoTheme[2]);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("TeleMed", 20, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Laboratory Services & Diagnostics", 20, 32);

    // --- 2. Report Title & Order ID ---
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Lab Order Report", 20, 60);

    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Order ID: #LAB-${order.id}`, 145, 60);

    // --- 3. Divider ---
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65);

    // --- 4. Main Details Grid ---
    const startY = 80;
    const rowHeight = 12;

    const drawRow = (
      label: string,
      value: string,
      y: number,
      isStatus = false,
    ) => {
      doc.setFontSize(11);
      doc.setTextColor(107, 114, 128);
      doc.setFont("helvetica", "normal");
      doc.text(label, 20, y);

      if (isStatus) {
        // Status Badge Styling
        const statusColor =
          order.status === "Completed" ? [16, 185, 129] : [217, 119, 6];
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      } else {
        doc.setTextColor(17, 24, 39);
      }

      doc.setFont("helvetica", "bold");
      doc.text(value, 70, y);
    };

    drawRow("Test Name", order.testName, startY);
    drawRow("Ordered By", order.provider, startY + rowHeight);
    drawRow("Lab Facility", order.labName, startY + rowHeight * 2);
    drawRow("Request Date", order.orderDate, startY + rowHeight * 3);
    drawRow(
      "Current Status",
      order.status.toUpperCase(),
      startY + rowHeight * 4,
      true,
    );

    // --- 5. Footer / Disclaimer Box ---
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(20, 150, 170, 30, 3, 3, "F");

    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Note: This document serves as an official order for diagnostic testing.",
      25,
      160,
    );
    doc.text(
      "Please present this report at the lab facility listed above.",
      25,
      166,
    );
    doc.text(
      "Results will be sent directly to your provider upon completion.",
      25,
      172,
    );

    // Bottom Line Footer
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 275, 190, 275);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("TeleMed Diagnostic Network • Secure Digital Record", 105, 282, {
      align: "center",
    });

    doc.save(`Lab-Report-${order.labName}.pdf`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Lab Orders</h1>
      </div>

      {/* Filter Section */}
      <div className={styles.filterContainer}>
        <select
          className={styles.filterSelect}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All Orders</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

        <input
          type="date"
          className={styles.dateFilter}
          onChange={handleFilterByDate}
          placeholder="Filter by date"
        />
      </div>

      {/* Orders List */}
      <div className={styles.listContainer}>
        {filteredLabOrders.map((order) => (
          <div key={order.id} className={styles.card}>
            <div className={styles.cardLeft}>
              <span className={styles.testName}>{order.testName}</span>

              <span className={styles.date}>{order.orderDate}</span>
            </div>

            <div className={styles.cardCenter}>
              <span className={styles.provider}>{order.provider}</span>

              <span className={styles.labName}>{order.labName}</span>
            </div>

            <div className={styles.cardRight}>
              <span
                className={`
  ${styles.status} 
  ${order.status === "Completed" ? styles.statusCompleted : ""} 
  ${order.status === "Pending" ? styles.statusPending : ""}
  ${order.status === "Cancelled" ? styles.statusCancelled : ""}
`}
              >
                {order.status}
              </span>

              <div className={styles.actions}>
                <button
                  className={styles.primaryButton}
                  onClick={() => handleViewDetails(order.id)}
                >
                  View Details
                </button>

                <button
                  className={styles.secondaryButton}
                  onClick={() => handleDownloadReport(order)}
                >
                  Download Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Lab Order Details</h2>

              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Test Name:</span>
                <span className={styles.value}>{selectedOrder.testName}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Ordered By:</span>
                <span className={styles.value}>{selectedOrder.provider}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Lab Name:</span>
                <span className={styles.value}>{selectedOrder.labName}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Order Date:</span>
                <span className={styles.value}>{selectedOrder.orderDate}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Status:</span>
                <span className={styles.value}>{selectedOrder.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientLabOrders;
