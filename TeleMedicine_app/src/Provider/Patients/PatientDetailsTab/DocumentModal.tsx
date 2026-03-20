import { useState } from "react";
import styles from "./CSS/DocumentModel.module.css";

type props = {
  onClose: () => void;
  setDocuments:React.Dispatch<React.SetStateAction<any[]>>;
};
function DocumentFormModal({ onClose,setDocuments }: props) {
  const [title, setTitle] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [provider, setProvider] = useState("");
  const [file, setFile] = useState<File | null>(null);

  //Handle File Upload
  const HandleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  //Convert file -> base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // save data
  const handleSave = async () => {
    if (!title || !speciality || !provider) {
      alert("Please fill all fields");
      return;
    }
    if (!file) {
      alert("Please Upload file");
      return; 
    }

    try {
      const base64 = await convertToBase64(file);
      const newDoc = {
        id: Date.now(),
        title,
        speciality,
        provider,
        fileName: file.name,
        fileData: base64,
      };
      const existingDocs = JSON.parse(
        localStorage.getItem("documents") || "[]",
      );

      const updatedDocs = [...existingDocs,newDoc];

      localStorage.setItem(
        "documents",
        JSON.stringify([...existingDocs, newDoc]),
      );

      setDocuments(updatedDocs);

      onClose(); //Close the model after save
    } catch (error) {
      console.error("File conversion error:", error);
    }
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h3>Upload Document</h3>
          <span className={styles.close} onClick={onClose}>
            ✖
          </span>
        </div>

        {/* Inputs */}
        <input
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Speciality"
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
        />

        <input
          type="text"
          placeholder="Provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        />

        {/* File Upload */}
        <input type="file" onChange={HandleFileChange} />

        {/* Footer Buttons */}
        <div className={styles.footer}>
          <button className={styles.saveBtn} onClick={handleSave}>
            Save
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
export default DocumentFormModal;
