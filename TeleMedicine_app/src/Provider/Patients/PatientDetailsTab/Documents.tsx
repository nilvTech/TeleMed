import { useEffect, useState } from "react";
import styles from "./CSS/Documents.module.css";

import DocumentFormModal from "./DocumentModal";
import DocumentList from "./DocumentList";
function Documents() {
  const [showModal, setShowModal] = useState(false);
  const [documents,setDocuments] = useState<any[]>([]);

  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem("documents") || "[]");
    setDocuments(data);
  },[]);

  return (
    <div>
      <div className={styles.page}>
        <div className={styles.headerRow}>
          <h2>Documents</h2>

          <button
            className={styles.uploadBtn}
            onClick={() => setShowModal(true)}>
            + Upload Document 
          </button>
        </div>

        <DocumentList documents={documents} setDocuments={setDocuments} />
      </div>

      {showModal && 
      (
        <DocumentFormModal 
        onClose={() => setShowModal(false)}
        setDocuments ={setDocuments} 
        />
      ) }
    </div>
  );
}
export default Documents;
