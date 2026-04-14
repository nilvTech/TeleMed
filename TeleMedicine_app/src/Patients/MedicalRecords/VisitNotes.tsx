import React, { useState } from "react";
import styles from "./VisitNotes.module.css";

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}
type visitNotes = {
  id: number;
  date: string;
  provider: string;
  visitType: "In-Person" | "Video Visit";
  status: "Completed" | "Pending" | "Cancelled";
  soapNote: SoapNote;
};
const VisitNotes: visitNotes[] = [
  {
    id: 1,
    date: "April 02, 2026",
    provider: "Dr. Sarah Miller",
    visitType: "Video Visit",
    status: "Completed",
    soapNote: {
      subjective:
        "Patient reports persistent dry cough and nasal congestion for 5 days. Denies fever or shortness of breath.",
      objective:
        "Visual assessment via video: Patient appears non-distressed. Mild erythematous throat noted on self-examination.",
      assessment: "Acute Upper Respiratory Infection.",
      plan: "Increase fluid intake. Over-the-counter decongestants. Follow up if symptoms worsen.",
    },
  },
  {
    id: 2,
    date: "March 18, 2026",
    provider: "Dr. James Wilson",
    visitType: "In-Person",
    status: "Completed",
    soapNote: {
      subjective:
        "Follow-up for hypertension management. Patient reports occasional dizziness when standing up quickly.",
      objective:
        "BP: 142/90 mmHg. Heart rate: 72 bpm. Lungs clear to auscultation.",
      assessment: "Essential Hypertension, sub-optimally controlled.",
      plan: "Adjust Lisinopril dosage to 20mg daily. Patient to maintain a BP log for 2 weeks.",
    },
  },
  {
    id: 3,
    date: "March 10, 2026",
    provider: "Dr. Emily Rodriguez",
    visitType: "In-Person",
    status: "Completed",
    soapNote: {
      subjective:
        "Patient presents with sharp pain in the lower right back radiating to the hip. Started after lifting heavy boxes.",
      objective:
        "Positive straight leg raise on right side. Reduced range of motion in lumbar spine.",
      assessment: "Acute Lumbar Strain.",
      plan: "Prescribed NSAIDs and physical therapy referral. Advised on proper lifting techniques.",
    },
  },
  {
    id: 4,
    date: "February 25, 2026",
    provider: "Dr. Michael Thompson",
    visitType: "Video Visit",
    status: "Completed",
    soapNote: {
      subjective:
        "Requesting refill for Sertraline. Reports stable mood and improved sleep patterns.",
      objective:
        "Patient is alert, oriented, and demonstrates a congruent affect. Speech is normal rate and tone.",
      assessment: "Generalized Anxiety Disorder, stable.",
      plan: "Refilled Sertraline 50mg for 6 months. Continue monthly tele-health therapy sessions.",
    },
  },
];
function PatientVisitNotes() {
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<visitNotes | undefined>();
  const [visitType, setVisitType] = useState("All Visits");
  const [filteredDate, setFilteredDate] = useState("");

  const handleViewNotes = (id: number) => {
    setShowModal(true);
    const note = VisitNotes.find((n) => n.id === id);
    setSelectedNote(note);
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

  const filteredVisits = VisitNotes.filter((note) => {
    const matchVisitType =
      visitType === "All Visits" || note.visitType === visitType;

    const matchDate = filteredDate === "" || note.date === filteredDate;

    return matchVisitType && matchDate;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Visit Notes</h1>
      </div>

      {/* Filter Section */}
      <div className={styles.filterContainer}>
        <select
          className={styles.filterSelect}
          value={visitType}
          onChange={(e) => setVisitType(e.target.value)}
        >
          <option>All Visits</option>
          <option>Video Visit</option>
          <option>In-Person</option>
        </select>

        <input
          type="date"
          className={styles.dateFilter}
          onChange={handleFilterByDate}
          placeholder="Filter by date"
        />
      </div>

      {/* Visit Notes List */}
      <div className={styles.listContainer}>
        {filteredVisits.map((note) => (
          <div key={note.id} className={styles.card}>
            <div className={styles.cardLeft}>
              <span className={styles.date}>{note.date}</span>
              <span className={styles.visitType}>{note.visitType}</span>
            </div>

            <div className={styles.cardCenter}>
              <span className={styles.provider}>{note.provider}</span>
              <span className={styles.status}>{note.status}</span>
            </div>

            <div className={styles.cardRight}>
              <button
                className={styles.viewButton}
                onClick={() => handleViewNotes(note.id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* View Visit Note Modal Structure */}
      {showModal && selectedNote && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Visit Note Details</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            {/* SOAP Sections */}
            <div className={styles.modalBody}>
              <div className={styles.visitInfo}>
                <span>
                  <strong>Date: </strong> {selectedNote.date}
                </span>

                <span>
                  <strong>Provider: </strong>
                  {selectedNote.provider}
                </span>
              </div>

              {/* Subjective */}
              <div className={styles.soapSection}>
                <h3 className={styles.soapTitle}>Subjective</h3>

                <p className={styles.soapContent}>
                  {selectedNote.soapNote.subjective}
                </p>
              </div>

              {/* Objective */}
              <div className={styles.soapSection}>
                <h3 className={styles.soapTitle}>Objective</h3>

                <p className={styles.soapContent}>
                  {selectedNote.soapNote.objective}
                </p>
              </div>

              {/* Assessment */}
              <div className={styles.soapSection}>
                <h3 className={styles.soapTitle}>Assessment</h3>

                <p className={styles.soapContent}>
                  {selectedNote.soapNote.assessment}
                </p>
              </div>

              {/* Plan */}
              <div className={styles.soapSection}>
                <h3 className={styles.soapTitle}>Plan</h3>

                <p className={styles.soapContent}>
                  {selectedNote.soapNote.plan}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default PatientVisitNotes;
