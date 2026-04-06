import { useState } from "react";
import styles from "./VisitNotes.module.css";

type VisitNote = {
  id: string;
  patientId: string;

  date: string;
  provider: string;

  diagnosis: string;

  subjective: string;
  objective: string;
  assessment: string;
  plan: string;

  status: "Draft" | "Completed";
};

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
};

const patients: Patient[] = [
  { id: "PAT-001", name: "John Smith", age: 45, gender: "Male" },
  { id: "PAT-003", name: "Michael Chen", age: 58, gender: "Male" },
  { id: "PAT-004", name: "Sarah Williams", age: 27, gender: "Female" },
  { id: "PAT-005", name: "Robert Brown", age: 71, gender: "Male" },
  { id: "PAT-006", name: "Lisa Garcia", age: 39, gender: "Female" },
  { id: "PAT-007", name: "James Wilson", age: 52, gender: "Male" },
  { id: "PAT-008", name: "Maria Rodriguez", age: 44, gender: "Female" },
  { id: "PAT-009", name: "David Taylor", age: 31, gender: "Male" },
  { id: "PAT-010", name: "Jennifer Lee", age: 63, gender: "Female" },
  { id: "PAT-011", name: "Thomas Anderson", age: 48, gender: "Male" },
  { id: "PAT-012", name: "Karen Martinez", age: 55, gender: "Female" },
  { id: "PAT-013", name: "Daniel White", age: 22, gender: "Male" },
  { id: "PAT-014", name: "Patricia Moore", age: 67, gender: "Female" },
  { id: "PAT-015", name: "Christopher Harris", age: 36, gender: "Male" },
  { id: "PAT-016", name: "Susan Clark", age: 41, gender: "Female" },
  { id: "PAT-017", name: "Matthew Lewis", age: 29, gender: "Male" },
  { id: "PAT-018", name: "Barbara Young", age: 75, gender: "Female" },
  { id: "PAT-019", name: "Anthony Hall", age: 50, gender: "Male" },
  { id: "PAT-020", name: "Elizabeth King", age: 34, gender: "Female" },
];

export default function VisitNotes() {
  const [visitNotes, setVisitNotes] = useState<VisitNote[]>([
    {
      id: "VN-001",
      patientId: "PAT-001",
      date: "04/05/2026",
      provider: "Dr. Sarah Wilson",
      diagnosis: "Hypertension",
      subjective: "Patient reports frequent headaches and dizziness.",
      objective: "BP 150/95, HR 82",
      assessment: "New onset hypertension",
      plan: "Start Lisinopril 10mg; lifestyle counseling",
      status: "Completed",
    },
    {
      id: "VN-002",
      patientId: "PAT-001",
      date: "04/12/2026",
      provider: "Dr. Sarah Wilson",
      diagnosis: "Hypertension Follow-up",
      subjective: "Headaches improved, tolerating medication well.",
      objective: "BP 128/82",
      assessment: "Controlled hypertension",
      plan: "Continue current dosage; recheck in 3 months",
      status: "Draft",
    },
    {
      id: "VN-003",
      patientId: "PAT-002",
      date: "04/01/2026",
      provider: "Dr. Emily Blunt",
      diagnosis: "Acute Sinusitis",
      subjective: "Facial pain and green nasal discharge for 10 days.",
      objective: "Tenderness over maxillary sinuses.",
      assessment: "Bacterial sinusitis",
      plan: "Amoxicillin 500mg TID for 7 days",
      status: "Completed",
    },
    {
      id: "VN-004",
      patientId: "PAT-002",
      date: "04/15/2026",
      provider: "Dr. Emily Blunt",
      diagnosis: "Follow-up Sinusitis",
      subjective: "Symptoms resolved but now reporting mild stomach upset.",
      objective: "Sinus tenderness resolved.",
      assessment: "Resolved sinusitis; antibiotic-related GI upset",
      plan: "Probiotics; no further antibiotics needed",
      status: "Completed",
    },
    {
      id: "VN-005",
      patientId: "PAT-003",
      date: "04/06/2026",
      provider: "Dr. Mark Thorne",
      diagnosis: "Type 2 Diabetes",
      subjective: "Increased thirst and fatigue.",
      objective: "A1C: 8.2%, Glucose: 190",
      assessment: "Uncontrolled DM2",
      plan: "Increase Metformin to 1000mg BID",
      status: "Completed",
    },
    {
      id: "VN-006",
      patientId: "PAT-004",
      date: "04/10/2026",
      provider: "Dr. Sarah Wilson",
      diagnosis: "Contact Dermatitis",
      subjective: "Itchy rash on left wrist after wearing new watch.",
      objective: "Erythematous papules in a circular distribution.",
      assessment: "Allergic contact dermatitis",
      plan: "Hydrocortisone cream 1% twice daily",
      status: "Draft",
    },
    {
      id: "VN-007",
      patientId: "PAT-005",
      date: "03/20/2026",
      provider: "Dr. Mark Thorne",
      diagnosis: "Knee Osteoarthritis",
      subjective: "Chronic pain in right knee.",
      objective: "Limited ROM in R knee.",
      assessment: "Stage 2 Osteoarthritis",
      plan: "Referral to Physical Therapy",
      status: "Completed",
    },
    {
      id: "VN-008",
      patientId: "PAT-005",
      date: "04/12/2026",
      provider: "Dr. Mark Thorne",
      diagnosis: "Knee Pain Follow-up",
      subjective: "PT helping slightly, but pain persists at night.",
      objective: "Slight improvement in gait.",
      assessment: "Ongoing OA pain",
      plan: "Discussing intra-articular injection options",
      status: "Draft",
    },
    {
      id: "VN-009",
      patientId: "PAT-006",
      date: "04/08/2026",
      provider: "Dr. Emily Blunt",
      diagnosis: "General Anxiety",
      subjective: "Difficulty concentrating and palpitations.",
      objective: "Physical exam normal; anxious affect.",
      assessment: "Anxiety disorder",
      plan: "Start SSRI trial; therapy referral",
      status: "Completed",
    },
    {
      id: "VN-010",
      patientId: "PAT-007",
      date: "04/11/2026",
      provider: "Dr. Sarah Wilson",
      diagnosis: "Annual Physical",
      subjective: "Feeling well overall.",
      objective: "All vitals within normal limits.",
      assessment: "Healthy adult male",
      plan: "Routine screening labs ordered",
      status: "Completed",
    },
    {
      id: "VN-011",
      patientId: "PAT-008",
      date: "04/02/2026",
      provider: "Dr. Mark Thorne",
      diagnosis: "Hypothyroidism",
      subjective: "Fatigue and weight gain.",
      objective: "TSH 7.5 (High)",
      assessment: "Subclinical hypothyroidism",
      plan: "Start Levothyroxine 25mcg",
      status: "Completed",
    },
    {
      id: "VN-012",
      patientId: "PAT-008",
      date: "04/16/2026",
      provider: "Dr. Mark Thorne",
      diagnosis: "Thyroid Check",
      subjective: "Energy levels improving.",
      objective: "Weight stable.",
      assessment: "Early response to treatment",
      plan: "Repeat TSH in 4 weeks",
      status: "Draft",
    },
    {
      id: "VN-013",
      patientId: "PAT-009",
      date: "04/14/2026",
      provider: "Dr. Emily Blunt",
      diagnosis: "Ankle Sprain",
      subjective: "Twisted ankle during soccer.",
      objective: "Swelling and ecchymosis over lateral malleolus.",
      assessment: "Grade 1 ankle sprain",
      plan: "RICE protocol; weight bearing as tolerated",
      status: "Completed",
    },
    {
      id: "VN-014",
      patientId: "PAT-010",
      date: "04/05/2026",
      provider: "Dr. Sarah Wilson",
      diagnosis: "GERD",
      subjective: "Waking up with acid taste in mouth.",
      objective: "Normal abdominal exam.",
      assessment: "Gastroesophageal reflux",
      plan: "Famotidine 20mg at bedtime",
      status: "Completed",
    },
    {
      id: "VN-015",
      patientId: "PAT-011",
      date: "04/13/2026",
      provider: "Dr. Mark Thorne",
      diagnosis: "Insomnia",
      subjective: "Trouble falling asleep 3-4 nights a week.",
      objective: "No signs of sleep apnea.",
      assessment: "Primary insomnia",
      plan: "Sleep hygiene education",
      status: "Draft",
    },
    {
      id: "VN-016",
      patientId: "PAT-012",
      date: "04/09/2026",
      provider: "Dr. Emily Blunt",
      diagnosis: "Vitamin D Deficiency",
      subjective: "Muscle aches and low mood.",
      objective: "Serum 25-OH Vit D: 12 ng/mL",
      assessment: "Severe Vit D deficiency",
      plan: "Vitamin D3 50,000 IU weekly for 8 weeks",
      status: "Completed",
    },
    {
      id: "VN-017",
      patientId: "PAT-013",
      date: "04/15/2026",
      provider: "Dr. Sarah Wilson",
      diagnosis: "Asthma Exacerbation",
      subjective: "Increased inhaler use due to pollen.",
      objective: "Mild expiratory wheeze.",
      assessment: "Asthma flare-up",
      plan: "Add Prednisone burst for 5 days",
      status: "Completed",
    },
    {
      id: "VN-018",
      patientId: "PAT-014",
      date: "04/10/2026",
      provider: "Dr. Mark Thorne",
      diagnosis: "Iron Deficiency",
      subjective: "Pica (craving ice) and pale skin.",
      objective: "Hgb: 9.8",
      assessment: "Iron deficiency anemia",
      plan: "Ferrous Sulfate 325mg daily",
      status: "Completed",
    },
    {
      id: "VN-019",
      patientId: "PAT-015",
      date: "04/16/2026",
      provider: "Dr. Emily Blunt",
      diagnosis: "Tension Headache",
      subjective: "Pressure across forehead for 3 days.",
      objective: "Neck muscle tension noted.",
      assessment: "Tension-type headache",
      plan: "NSAIDs and stress reduction",
      status: "Draft",
    },
    {
      id: "VN-020",
      patientId: "PAT-016",
      date: "04/11/2026",
      provider: "Dr. Sarah Wilson",
      diagnosis: "Bursitis",
      subjective: "Shoulder pain when reaching overhead.",
      objective: "Positive painful arc test.",
      assessment: "Subacromial bursitis",
      plan: "Modified activity and Naproxen",
      status: "Completed",
    },
  ]);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const patientNotes = visitNotes.filter(
    (n) => n.patientId === selectedPatientId,
  );
  const selectedNote = visitNotes.find((n) => n.id === selectedNoteId);

  // Edit Notes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<VisitNote | null>(null);

  const handlePatientChange = (event:React.ChangeEvent<HTMLSelectElement>)=>{
    setSelectedPatientId(event.target.value);
    setSelectedNoteId(null);
  }

  const handleEditNote = (noteId: string) => {
    const note = visitNotes.find((n) => n.id === noteId);
    if (note) {
      setEditingNote(note);
      setIsModalOpen(true);
    }
  };

  const handleSaveDraft = () => {
    if (!editingNote) return;

    const updatedNotes: VisitNote[] = visitNotes.map((note) =>
      note.id === editingNote.id
        ? {
            ...editingNote,
            status: "Draft",
          }
        : note,
    );

    setVisitNotes(updatedNotes);

    setIsModalOpen(false);

    console.log("Draft saved");
  };

  const handleCompleteNote = () => {
    if (!editingNote) return;

    const updatedNotes: VisitNote[] = visitNotes.map((note) =>
      note.id === editingNote.id
        ? {
            ...editingNote,
            status: "Completed",
          }
        : note,
    );

    setVisitNotes(updatedNotes);

    setIsModalOpen(false);

    console.log("Note completed");
  };
  return (
    <div className={styles.container}>
      {/* Sticky Header */}

      <div className={styles.header}>
        <h2 className={styles.title}>Visit Notes</h2>

        <div className={styles.topRow}>
          <div className={styles.patientSelector}>
            <label>Select Patient:</label>

            <select
              value={selectedPatientId}
              onChange={handlePatientChange}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* <button className={styles.addButton}>
            + New Visit Note
          </button> */}
        </div>
      </div>

      {/* Scrollable Content */}

      <div className={styles.content}>
        {/* Patient Card */}

        {selectedPatient && (
          <div className={styles.patientCard}>
            <div>
              <strong>Name:</strong> {selectedPatient.name}
            </div>

            <div>
              <strong>Age:</strong> {selectedPatient.age}
            </div>

            <div>
              <strong>Gender:</strong> {selectedPatient.gender}
            </div>

            <div>
              <strong>Patient ID:</strong> {selectedPatient.id}
            </div>
          </div>
        )}

        {/* Visit Notes List */}

        <div className={styles.card}>
          <h3>Visits</h3>
          {patientNotes?.length === 0 ? (
            <div className={styles.empty}>No visits found</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Provider</th>
                  <th>Diagnosis</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {patientNotes.map((note) => (
                  <tr
                    key={note.id}
                    className={
                      selectedNoteId === note.id ? styles.selectedRow : ""
                    }
                  >
                    <td>{note.date}</td>

                    <td>{note.provider}</td>

                    <td>{note.diagnosis}</td>

                    <td>
                      <span
                        className={
                          note.status === "Completed"
                            ? styles.completed
                            : styles.draft
                        }
                      >
                        {note.status}
                      </span>
                    </td>

                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.viewButton}
                          onClick={() => setSelectedNoteId(note.id)}
                        >
                          View SOAP
                        </button>

                        {note.status === "Draft" ? (
                          <button
                            className={
                              note.status === "Draft"
                                ? styles.editButton
                                : styles.disabledButton
                            }
                            disabled={note.status !== "Draft"}
                            onClick={() => handleEditNote(note.id)}
                          >
                            Edit
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Visit Note Details */}

        {selectedNote && (
          <div className={styles.card}>
            <div className={styles.detailHeader}>
              <h3>Visit Notes</h3>
              {/* <span className={styles.noteDate}>{selectedNote.date}</span> */}
            </div>

            {/* Subjective */}
            <div className={`${styles.soapSection} ${styles.subjective}`}>
              <h4>Subjective</h4>
              <p>{selectedNote.subjective}</p>
            </div>

            {/* Objective */}
            <div className={`${styles.soapSection} ${styles.objective}`}>
              <h4>Objective</h4>
              <p>{selectedNote.objective}</p>
            </div>

            {/* Assessment */}
            <div className={`${styles.soapSection} ${styles.assessment}`}>
              <h4>Assessment</h4>
              <p>{selectedNote.assessment}</p>
            </div>

            {/* Plan */}
            <div className={`${styles.soapSection} ${styles.plan}`}>
              <h4>Plan</h4>
              <p>{selectedNote.plan}</p>
            </div>
          </div>
        )}
      </div>
      {isModalOpen && editingNote && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Edit Visit Note (SOAP)</h3>

            <div className={styles.formGroup}>
              <label>Subjective</label>

              <textarea
                value={editingNote.subjective}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    subjective: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Objective</label>

              <textarea
                value={editingNote.objective}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    objective: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Assessment</label>

              <textarea
                value={editingNote.assessment}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    assessment: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Plan</label>

              <textarea
                value={editingNote.plan}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    plan: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className={styles.saveDraftButton}
                onClick={handleSaveDraft}
              >
                Save Draft
              </button>

              <button
                className={styles.completeButton}
                onClick={handleCompleteNote}
              >
                Complete Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
