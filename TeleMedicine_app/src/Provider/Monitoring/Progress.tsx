import { useState } from "react";
import styles from "./ProgressPage.module.css";

interface Patient {
  id: string;
  name: string;
}

interface ProgressItem {
  id: string;
  patientId: string;
  date: string;
  goal: string;
  status: string;
  notes: string;
  nextReview: string;
}

// Dummy Patients
const patients: Patient[] = [
  { id: "PAT-001", name: "John Smith" },
  { id: "PAT-002", name: "Emily Johnson" },
  { id: "PAT-003", name: "Michael Brown" },
];

// Dummy Progress Data
const initialData: ProgressItem[] = [
  {
    id: "PRG-001",
    patientId: "PAT-001",
    date: "2026-04-07",
    goal: "Reduce Anxiety",
    status: "Improving",
    notes: "Patient responding well to therapy",
    nextReview: "2026-04-21",
  },
  {
    id: "PRG-002",
    patientId: "PAT-001",
    date: "2026-03-28",
    goal: "Improve Sleep",
    status: "Stable",
    notes: "Sleep duration increased",
    nextReview: "2026-04-10",
  },
];

export default function Progress() {
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [progressList, setProgressList] = useState<ProgressItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [EditModal, setEditModal] = useState(false);

  const getFormattedDate = () => {
    const now = new Date(Date.now());
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [form, setForm] = useState<ProgressItem>({
    id: "",
    patientId: "",
    date: getFormattedDate(),
    goal: "",
    status: "In Progress",
    notes: "",
    nextReview: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Edit Modal Change Handler
  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePatientChange = (patientId: string) => {
    setSelectedPatient(patientId);
  };

  const handleSave = () => {
    if (!form.date || !form.goal || !form.notes || !selectedPatient) return;

    const isEditing = progressList.some((item) => item.id === form.id);

    if (isEditing) {
      //Updating exisiting item
      setProgressList(
        progressList.map((item) => (item.id === form.id ? { ...form } : item)),
      );
    } else {
      //Adding new item

      const newItem: ProgressItem = {
        ...form,
        id: `PRG-${Date.now()}`,
        patientId: selectedPatient,
      };

      setProgressList([newItem, ...progressList]);
    }

    setForm({
      id: "",
      patientId: "",
      date: "",
      goal: "",
      status: "In Progress",
      notes: "",
      nextReview: "",
    });

    setShowModal(false);
    setEditModal(false);
  };

  const handleDelete = (id: string) => {
    setProgressList(progressList.filter((item) => item.id !== id));
  };

  // Filter progress by selected patient
  const filteredProgress = progressList.filter(
    (item) => item.patientId === selectedPatient,
  );

  const handleEdit = (id: string) => {
    setEditModal(true);
    const itemToEdit = progressList.find((item) => item.id === id);
    if (itemToEdit) {
      setForm(itemToEdit);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2>Progress Monitoring</h2>
            <p className={styles.subtitle}>
              Track patient progress and treatment outcomes
            </p>
          </div>

          <button
            className={styles.addBtn}
            onClick={() => setShowModal(true)}
            disabled={!selectedPatient}
          >
            + Add Progress
          </button>
        </div>
        {/* Patient Selection */}
        <div className={styles.patientSelection}>
          <label className={styles.label}>Select Patient</label>

          <select
            className={styles.patientDropdown}
            value={selectedPatient}
            onChange={(e) => handlePatientChange(e.target.value)}
          >
            <option value="">-- Select Patient --</option>

            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* If no patient selected */}
      {!selectedPatient ? (
        <div className={styles.empty}>
          Please select a patient to view or add progress
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Date</span>
            <span>Goal</span>
            <span>Status</span>
            <span>Next Review</span>
            <span>Notes</span>
            <span>Actions</span>
          </div>

          {filteredProgress.length === 0 ? (
            <div className={styles.empty}>
              No progress records found for this patient
            </div>
          ) : (
            filteredProgress.map((item) => (
              <div key={item.id} className={styles.row}>
                <span>{item.date}</span>
                <span>{item.goal}</span>
                <span
                  className={`${styles.status} ${
                    styles[item.status.replace(" ", "")]
                  }`}
                >
                  {item.status}
                </span>
                <span>{item.nextReview}</span>
                <span>{item.notes}</span>
                <div className={styles.actions}>
                  <button
                    className={styles.edit}
                    onClick={() => handleEdit(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.delete}
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Add Progress*/}
      {showModal && selectedPatient && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Add Progress</h3>
            <label htmlFor="goal">Goal</label>
            <input
              type="text"
              name="goal"
              placeholder="Goal"
              value={form.goal}
              onChange={handleChange}
            />

            <label htmlFor="status">Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option>In Progress</option>
              <option>Improving</option>
              <option>Stable</option>
              <option>Declining</option>
              <option>Achieved</option>
            </select>

            <label htmlFor="notes">Notes</label>
            <textarea
              name="notes"
              placeholder="Progress Notes"
              value={form.notes}
              onChange={handleChange}
            />

            <label htmlFor="nextReview">Next Review Date</label>
            <input
              type="date"
              name="nextReview"
              value={form.nextReview}
              onChange={handleChange}
            />

            <div className={styles.modalActions}>
              <button className={styles.save} onClick={handleSave}>
                Save
              </button>

              <button
                className={styles.cancel}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Progress */}
      {EditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Edit Progress</h3>

            <label htmlFor="date">Date</label>
            <input type="date" value={form.date} disabled />
            <label htmlFor="goal">Goal</label>
            <input
              type="text"
              name="goal"
              placeholder="Goal"
              value={form.goal}
              onChange={handleEditChange}
            />
            <label htmlFor="status">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleEditChange}
            >
              <option>In Progress</option>
              <option>Improving</option>
              <option>Stable</option>
              <option>Declining</option>
              <option>Achieved</option>
            </select>

            <label htmlFor="notes">Notes</label>
            <textarea
              name="notes"
              placeholder="Progress Notes"
              value={form.notes}
              onChange={handleEditChange}
            />

            <label htmlFor="nextReview">Next Review Date</label>
            <input
              type="date"
              name="nextReview"
              value={form.nextReview}
              onChange={handleEditChange}
            />
            <div className={styles.modalActions}>
              <button
                className={styles.cancel}
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>
              <button className={styles.save} onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
