import { useState } from "react";
import styles from "./Files.module.css";
import jsPDF from "jspdf";

interface PatientFile {
  id: number;
  fileName: string;
  category:
    | "Lab Result"
    | "Prescription"
    | "Insurance Document"
    | "Consent Form"
    | "Medical Record"
    | "Imaging Report";
  fileType: "PDF" | "Image" | "Document";
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  status: "Available" | "Pending" | "Archived";
}

const files: PatientFile[] = [
  {
    id: 1,
    fileName: "CBC Lab Result",
    category: "Lab Result",
    fileType: "PDF",
    uploadedBy: "Dr. Sarah Miller",
    uploadDate: "April 12, 2026",
    fileSize: "1.2 MB",
    status: "Available",
  },
  {
    id: 2,
    fileName: "Insurance Card",
    category: "Insurance Document",
    fileType: "Image",
    uploadedBy: "Patient",
    uploadDate: "April 10, 2026",
    fileSize: "850 KB",
    status: "Available",
  },
];

function Files() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PatientFile>();
  const [category, setCategory] = useState("All Categories");
  const [fileType, setFileType] = useState("All File Types");
  const [filterdate, setFilterDate] = useState("");

  const handleFilterByDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;

    if (!date) {
      setFilterDate("");
      return;
    }

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

    setFilterDate(formattedDate);
  };

  const handleViewFile = (id: number) => {
    const file = files.find((f) => f.id === id);
    setSelectedFile(file);
    setShowModal(true);
  };

  const filteredFiles = files.filter((f) => {
    const matchCategory =
      category === "All Categories" || f.category === category;
    const matchFileType =
      fileType === "All File Types" || f.fileType === fileType;
    const matchDate = filterdate === "" || f.uploadDate === filterdate;

    return matchCategory && matchFileType && matchDate;
  });

  // Download File as PDF
const handleDownloadFile = (file: PatientFile) => {
    const doc = new jsPDF();
    const slateTheme = [71, 85, 105]; 

    //  Header Area  
    doc.setFillColor(slateTheme[0], slateTheme[1], slateTheme[2]);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("TeleMed", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Patient Document Repository", 20, 32);

    //  Title & Timestamp
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Document Summary", 20, 60);

    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 140, 60);

    // Divider 
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65);

    // Content Grid 
    const startY = 80;
    const rowHeight = 12;

    const drawRow = (label:string, value:string, y:number) => {
      doc.setFontSize(11);
      doc.setTextColor(107, 114, 128); // Label color
      doc.setFont("helvetica", "normal");
      doc.text(label, 20, y);

      doc.setTextColor(17, 24, 39); // Value color
      doc.setFont("helvetica", "bold");
      doc.text(value, 70, y);
    };

    drawRow("File Name", file.fileName, startY);
    drawRow("Category", file.category, startY + rowHeight);
    drawRow("Uploaded By", file.uploadedBy, startY + (rowHeight * 2));
    drawRow("Upload Date", file.uploadDate, startY + (rowHeight * 3));
    drawRow("File Status", file.status.toUpperCase(), startY + (rowHeight * 4));

    // Document Verification Box 
    doc.setDrawColor(71, 85, 105);
    doc.setLineWidth(0.2);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(20, 145, 170, 35, 2, 2, "FD");

    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.setFont("helvetica", "bold");
    doc.text("Security & Verification", 28, 155);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const verificationText = [
      "This document serves as a summary of a digital file stored in your TeleMed medical records.",
      "Integrity of the original file is maintained in our encrypted cloud storage.",
      "Access to this document is logged for patient privacy and security compliance."
    ];
    doc.text(verificationText, 28, 162);

    //  Footer 
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 275, 190, 275);
    
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("Official Digital Record • TeleMed Health Systems", 105, 282, { align: "center" });

    doc.save(`${file.fileName}.pdf`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Files & Documents</h1>
      </div>

      {/* Filter Section */}
      <div className={styles.filterContainer}>
        <select
          className={styles.filterSelect}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All Categories</option>
          <option>Lab Result</option>
          <option>Prescription</option>
          <option>Insurance Document</option>
          <option>Consent Form</option>
          <option>Medical Record</option>
          <option>Imaging Report</option>
        </select>

        <select
          className={styles.filterSelect}
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <option>All File Types</option>
          <option>PDF</option>
          <option>Image</option>
          <option>Document</option>
        </select>

        <input
          type="date"
          className={styles.dateFilter}
          placeholder="Filter by date"
          onChange={handleFilterByDate}
        />
      </div>

      {/* Files List */}
      <div className={styles.listContainer}>
        {filteredFiles.map((file) => (
          <div key={file.id} className={styles.card}>
            <div className={styles.cardLeft}>
              <span className={styles.fileName}>{file.fileName}</span>

              <span className={styles.category}>{file.category}</span>
            </div>

            <div className={styles.cardCenter}>
              <span className={styles.uploadedBy}>
                Uploaded By: {file.uploadedBy}
              </span>

              <span className={styles.date}>{file.uploadDate}</span>
            </div>

            <div className={styles.cardRight}>
              <span className={styles.status}>{file.status}</span>

              <div className={styles.actions}>
                <button
                  className={styles.primaryButton}
                  onClick={() => handleViewFile(file.id)}
                >
                  View
                </button>

                <button className={styles.secondaryButton} onClick={()=>handleDownloadFile(file)}>Download</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedFile && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>File Details</h2>

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
                <span className={styles.label}>File Name:</span>
                <span className={styles.value}>{selectedFile.fileName}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Category:</span>
                <span className={styles.value}>{selectedFile.category}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>File Type:</span>
                <span className={styles.value}>{selectedFile.fileType}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Uploaded By:</span>
                <span className={styles.value}>{selectedFile.uploadedBy}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Upload Date:</span>
                <span className={styles.value}>{selectedFile.uploadDate}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>File Size:</span>
                <span className={styles.value}>{selectedFile.fileSize}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Files;
