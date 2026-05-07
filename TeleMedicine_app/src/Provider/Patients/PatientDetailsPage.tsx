import styles from "./PatientDetailsPage.module.css";
import { PatientData } from "./PatientData";
import { MdAccountCircle } from "react-icons/md";
import { useParams } from "react-router-dom";
//import { useNavigate } from "react-router-dom";
import Summary from "./PatientDetailsTab/Summary";
import Orders from "./PatientDetailsTab/Orders";
// import Documents from "./PatientDetailsTab/Documents";
import Payments from "./PatientDetailsTab/Payment/Payments";

import { useEffect, useState, useRef } from "react";
//import DocumentList from "./PatientDetailsTab/DocumentList";

function PatientDetailsPage() {
    const [activeTab, setActiveTab] = useState("Summary");
  return (
    <div>

      {/* FIXED SECTION */}
      <div className={styles.fixedTop}>
        <PatientInfoCard />
        <Buttons activeTab={activeTab} setActiveTab ={setActiveTab} />
    
      </div>

      {/* SCROLLABLE SECTION */}
      <div className={styles.scrollableContent}>
           {activeTab === "Summary" ? <Summary/> :""}
           {activeTab === "Orders"?<Orders/>:""}
           {activeTab === "Documents"?<Documents/>:""}
           {activeTab === "Payments"?<Payments/>:""}

      </div>
    </div>
  );
}

export function PatientInfoCard() {
  const { id } = useParams<{ id: string }>();
  const patient = PatientData.find((p) => p.id === Number(id));
  if (!patient) {
    return <h2>Patient Not Found</h2>;
  }
  return (
    <div className={styles.PatientDetails}>
      <div className={styles.PatientDetailsHeader}>
        <div className={styles.PatientMainDetails}>
          <MdAccountCircle className={styles.MdAccountCircle} />
          <span>{patient.name}</span>
        </div>
        <div className={styles.PatientDemographics}>
          <span>MRN: {patient.MRN}</span>
          <span>DOB: {patient.DOB}</span>
          <span>Gender: {patient.gender}</span>
          <span>Age: {patient.age}</span>
        </div>
      </div>
      <div className={styles.container}>
        <span className={styles.rpm}>{patient.RPM}</span>
        <span className={styles.hypertension}>{patient.condition}</span>
        <span className={styles.diabetes}>{patient.disease}</span>
      </div>
    </div>
  );
}

export function Buttons({activeTab,setActiveTab}:any) {

  //const navigate = useNavigate();
  const handleTabClick = (tab:string)=>{
    setActiveTab(tab);
  }
  return (
    <div className={styles.container2}>
      {["Summary", "Orders","Documents" ,"Payments"].map(
        (tab) => (
          <button
            key={tab}
            className={activeTab === tab ? styles.active : ""}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ),
      )}

    
    </div>
  );
}



function Documents() {
  const [showModal, setShowModal] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("documents") || "[]");
    setDocuments(data);
  }, []);

 
  return (
    <div>
      <div className={styles.page}>
        <div className={styles.headerRow}>
          <h2>Documents</h2>

          <button
            className={styles.uploadBtn}
            onClick={() => setShowModal(true)}
          >
            + Upload Document
          </button>
        </div>

        <DocumentList documents={documents} setDocuments={setDocuments} />
      </div>

      {showModal && (
        <DocumentFormModal
          onClose={() => setShowModal(false)}
          setDocuments={setDocuments}
        />
      )}
    </div>
  );
}

// Document List -----------------------------------------
type DocListProps = {
  documents: any[];
  setDocuments: React.Dispatch<React.SetStateAction<any[]>>;
};

function DocumentList({ documents, setDocuments }: DocListProps) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("documents") || "[]");
    setDocuments(data);

    const HandleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", HandleClickOutside);
    return () => {
      document.removeEventListener("mousedown", HandleClickOutside);
    };
  }, [setDocuments]);

  const handleView = (fileData: string) => {
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(
        `<iframe src="${fileData}" frameborder="0" style="width:100%;height:100%"></iframe>`
      );
    }
  };

  const handleDownload = (fileData: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileData;
    link.download = fileName;
    link.click();
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm("Delete this document?");
    if (!confirmDelete) return;

    const updated = documents.filter((doc) => doc.id !== id);
    setDocuments(updated);
    localStorage.setItem("documents", JSON.stringify(updated));
  };

  const getFileType = (fileName: string) => {
    return fileName.split(".").pop()?.toUpperCase();
  };

  return (
    <div className={styles.tableWrapper} ref={menuRef}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Speciality</th>
            <th>Patient</th>
            <th>FileType</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((doc, index) => (
            <tr key={doc.id}>
              <td style={{ width: "50px", color: "#94a3b8" }}>{index + 1}</td>
              <td style={{ fontWeight: 600 }}>{doc.title}</td>
              <td>{doc.speciality}</td>
              <td>{doc.provider}</td>
              <td>
                <span className={styles.fileBadge}>
                  {getFileType(doc.fileName)}
                </span>
              </td>

              <td className={styles.actionCell}>
                {/* Wrap in a relative div so dropdown aligns to the button */}
                <div style={{ position: "relative", display: "inline-block" }}>
                  <button
                    className={styles.menuBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(openMenu === doc.id ? null : doc.id);
                    }}
                  >
                    ⋮
                  </button>

                  {openMenu === doc.id && (
                    <div className={styles.dropdown}>
                      <div onClick={() => handleView(doc.fileData)}>View</div>
                      <div
                        onClick={() =>
                          handleDownload(doc.fileData, doc.fileName)
                        }
                      >
                        Download
                      </div>
                      <div
                        className={styles.delete}
                        onClick={() => handleDelete(doc.id)}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {documents.length === 0 && (
            <tr>
              <td colSpan={6} className={styles.empty}>
                No documents available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

 type DocFormProps = {
    onClose: () => void;
    setDocuments: React.Dispatch<React.SetStateAction<any[]>>;
  };


function DocumentFormModal({ onClose, setDocuments }: DocFormProps) {
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

      const updatedDocs = [...existingDocs, newDoc];

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

        <div className={styles.inputs}>
          {/* Inputs */}
          <input
            type="text"
            placeholder="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.textField}
          />

          <input
            type="text"
            placeholder="Speciality"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            className={styles.textField}
          />

          <input
            type="text"
            placeholder="Provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className={styles.textField}
          />

          {/* File Upload */}
          <input type="file" onChange={HandleFileChange}  className={styles.textField}/>
        </div>

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

// export function Grid1() {
//   return (
//     <div className={styles.wrapper}>
//       {/* LEFT - VITALS */}
//       <div className={styles.card}>
//         <h3>Recent Vitals (from RPM)</h3>

//         {vitals.map((item, index) => (
//           <div key={index} className={styles.vitalRow}>
//             <span>{item.label}</span>
//             <span className={styles.value}>{item.value}</span>
//             <span className={styles.time}>{item.time}</span>
//           </div>
//         ))}
//       </div>

//       {/* RIGHT - MEDICATIONS */}
//       <div className={styles.card}>
//         <h3>Active Medications</h3>

//         {medications.map((med, index) => (
//           <div key={index} className={styles.medRow}>
//             <div className={styles.medLeft}>
//               <span className={styles.icon}>💊</span>

//               <div>
//                 <div className={styles.medName}>{med.name}</div>
//                 <div className={styles.medDetail}>{med.detail}</div>
//               </div>
//             </div>

//             <span className={styles.activeBadge}>Active</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export function Grid2() {
//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.card}>
//         <h3>Problem List</h3>

//         {problems.map((item, index) => (
//           <div key={index} className={styles.problemRow}>
//             <span className={styles.icdCode}>{item.code}</span>
//             <span className={styles.problemName}>{item.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
export default PatientDetailsPage;
