import { useRef, useState } from "react";
import styles from "./FilesPage.module.css";

// Interfaces remain the same...
interface Patient { id: string; name: string; }
interface FileItem {
  id: string;
  patientId: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  date: string;
}

const patients: Patient[] = [
  { id: "PAT-001", name: "John Smith" },
  { id: "PAT-002", name: "Emily Johnson" },
  { id: "PAT-003", name: "Michael Brown" },
];

const initialFiles: FileItem[] = [
  {
    id: "FILE-001",
    patientId: "PAT-001",
    name: "Lab_Report_April.pdf",
    type: "PDF",
    size: "1.2 MB",
    uploadedBy: "Dr. Michael Chen",
    date: "07/04/2026",
  },
];

export default function FilesPage() {
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredFiles = files.filter(f => f.patientId === selectedPatient);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !selectedPatient) return;

    const newFile: FileItem = {
      id: `FILE-${Date.now()}`,
      patientId: selectedPatient,
      name: selectedFile.name,
      type: selectedFile.name.split('.').pop()?.toUpperCase() || "FILE",
      size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedBy: "Dr. Michael Chen",
      date: new Date().toLocaleDateString(),
    };
    setFiles([newFile, ...files]);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2>Vault</h2>
          <p className={styles.subtitle}>Upload and manage patient-related documents</p>
        </div>
        <button 
          className={styles.uploadBtn} 
          onClick={() => fileInputRef.current?.click()}
          disabled={!selectedPatient}
        >
          Add Document
        </button>
        <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
      </header>

      <section className={styles.patientSelection}>
        <span style={{ fontWeight: 600 }}>Active Patient:</span>
        <select 
          className={styles.patientDropdown}
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="">Select a patient to begin...</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </section>

      {!selectedPatient ? (
        <div className={styles.emptyState}>
          <h3>No Patient Selected</h3>
          <p>Please choose a patient from the dropdown above to manage their files.</p>
        </div>
      ) : (
        <div className={styles.fileGrid}>
          {filteredFiles.length === 0 ? (
            <div className={styles.emptyState} style={{ gridColumn: '1/-1' }}>
              <h3>Archive is empty</h3>
              <p>No documents have been uploaded for this patient yet.</p>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div key={file.id} className={styles.fileCard}>
                <span className={styles.fileTypeBadge}>{file.type}</span>
                <span className={styles.fileName}>{file.name}</span>
                
                <div className={styles.fileMeta}>
                  <span>Size: <strong>{file.size}</strong></span>
                  <span>By: <strong>{file.uploadedBy}</strong></span>
                  <span>Added: <strong>{file.date}</strong></span>
                </div>

                <div className={styles.actions}>
                  <button className={styles.download} onClick={() => alert('Downloading...')}>View</button>
                  <button className={styles.delete} onClick={() => setFiles(files.filter(f => f.id !== file.id))}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}