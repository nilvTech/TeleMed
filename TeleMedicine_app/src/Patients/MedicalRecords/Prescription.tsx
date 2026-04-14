import React, { useState } from "react";
import styles from "./Prescription.module.css";
import jsPDF from "jspdf";

type prescriptions = {
  id: number;
  medication: string;
  provider: string;
  prescribedDate: string;
  dosage: string;
  duration: string;
  status: string;
};

const Prescriptions: prescriptions[] = [
  {
    id: 1,
    medication: "Amoxicillin 500mg",
    provider: "Dr. Sarah Miller",
    prescribedDate: "April 05, 2026",
    dosage: "1 capsule twice daily",
    duration: "7 days",
    status: "Active",
  },
  {
    id: 2,
    medication: "Lisinopril 10mg",
    provider: "Dr. James Wilson",
    prescribedDate: "March 20, 2026",
    dosage: "1 tablet daily",
    duration: "30 days",
    status: "Completed",
  },
];

function PatientPrescription() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] =
    useState<prescriptions>();
  const [status, setStatus] = useState("All Prescriptions");
  const [filteredDate, setFilteredDate] = useState("");

  const handleViewDetails = (id: number) => {
    const prescription = Prescriptions.find((pre) => pre.id === id);
    setShowModal(true);
    setSelectedPrescription(prescription);
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

  const filteredPrescription = Prescriptions.filter((pres) => {
    const matchPrescriptionType =
      status === "All Prescriptions" || pres.status === status;
    const matchDate =
      filteredDate === "" || pres.prescribedDate === filteredDate;

    return matchPrescriptionType && matchDate;
  });

  const handlePrescriptionDownload = (prescription: prescriptions) => {
    const doc = new jsPDF();

    // 1. Header Area (Branding)
    doc.setFillColor(37, 99, 235); // Royal Blue from your UI
    doc.rect(0, 0, 210, 40, "F"); // Header background

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("TeleMed", 20, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Official Digital Prescription", 20, 32);

    // 2. Prescription Title
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Prescription", 20, 60);

    // 3. Info Section (The "Card" look)
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65); // Horizontal divider

    // Left Column Labels
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128); // Gray text
    doc.setFont("helvetica", "normal");
    doc.text("Medication", 20, 80);
    doc.text("Provider", 20, 95);
    doc.text("Prescribed Date", 20, 110);
    doc.text("Dosage", 20, 125);
    doc.text("Duration", 20, 140);
    doc.text("Status", 20, 155);

    // Right Column Values
    doc.setTextColor(17, 24, 39); // Dark text
    doc.setFont("helvetica", "bold");
    doc.text(`${prescription.medication}`, 70, 80);
    doc.text(`${prescription.provider}`, 70, 95);
    doc.text(`${prescription.prescribedDate}`, 70, 110);
    doc.text(`${prescription.dosage}`, 70, 125);
    doc.text(`${prescription.duration}`, 70, 140);

    // Status Badge Logic
    if (prescription.status === "Active") {
      doc.setTextColor(16, 185, 129); // Emerald Green
    } else {
      doc.setTextColor(100, 116, 139); // Slate Gray
    }
    doc.text(`${prescription.status.toUpperCase()}`, 70, 155);

    // 4. Footer / Disclaimer
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 260, 190, 260);

    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    doc.setFont("helvetica", "italic");
    const footerText =
      "This is a computer-generated document. No signature is required.";
    const center = doc.internal.pageSize.getWidth() / 2;
    doc.text(footerText, center, 270, { align: "center" });

    doc.save(`Prescription-${prescription.provider}.pdf`);
  };
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Prescriptions</h1>
      </div>

      {/* Filter Section */}
      <div className={styles.filterContainer}>
        <select
          className={styles.filterSelect}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All Prescriptions</option>
          <option>Active</option>
          <option>Completed</option>
        </select>

        <input
          type="date"
          className={styles.dateFilter}
          onChange={handleFilterByDate}
          placeholder="Filter by date"
        />
      </div>

      {/* Prescription List */}
      <div className={styles.listContainer}>
        {filteredPrescription.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardLeft}>
              <span className={styles.medication}>{item.medication}</span>
              <span className={styles.date}>{item.prescribedDate}</span>
            </div>

            <div className={styles.cardCenter}>
              <span className={styles.provider}>{item.provider}</span>
              <span className={styles.dosage}>{item.dosage}</span>
            </div>

            <div className={styles.cardRight}>
              <span
                className={`${styles.status} 
        ${item.status === "Active" ? styles.statusActive : ""} 
        ${item.status === "Completed" ? styles.statusCompleted : ""}`}
              >
                {item.status}
              </span>

              <div className={styles.actions}>
                <button
                  className={styles.primaryButton}
                  onClick={() => handleViewDetails(item.id)}
                >
                  View Details
                </button>

                <button
                  className={styles.secondaryButton}
                  onClick={() => handlePrescriptionDownload(item)}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Details Modal Structure */}
      {showModal && selectedPrescription && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Prescription Details</h2>

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
                <span className={styles.label}>Medication:</span>
                <span className={styles.value}>
                  {selectedPrescription.medication}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Prescribed By:</span>
                <span className={styles.value}>
                  {selectedPrescription.provider}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Dosage:</span>
                <span className={styles.value}>
                  {selectedPrescription.dosage}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Duration:</span>
                <span className={styles.value}>
                  {selectedPrescription.duration}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Status:</span>
                <span className={styles.value}>
                  {selectedPrescription.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientPrescription;
