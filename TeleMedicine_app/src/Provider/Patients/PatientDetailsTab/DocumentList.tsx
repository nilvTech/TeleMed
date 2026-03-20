import { useEffect, useState } from "react";
import styles from "./CSS/DocumentList.module.css";


type Props ={
    documents:any[];
    setDocuments:React.Dispatch<React.SetStateAction<any[]>>;
}

function DocumentList({documents,setDocuments}:Props) {
 // const [documents, setDocuments] = useState<any[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);



  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("documents") || "[]");
    setDocuments(data);
  }, []);

  const handleView = (fileData: string) => {
    const newTab = window.open();
    if(newTab){
        newTab.document.write(
            `<iframe src="${fileData}" frameboarder="0" style="width:100%;height:100%"><iframe>`
        )
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
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Speciality</th>
            <th>Orders</th>
            <th>FileType</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((doc, index) => (
            <tr key={doc.id}>
              <td>{index + 1}</td>
              <td>{doc.title}</td>
              <td>{doc.speciality}</td>
              <td>{doc.provider}</td>
              <td>{getFileType(doc.fileName)}</td>

              <td className={styles.actionCell}>
                <button
                  className={styles.menuBtn}
                  onClick={() =>
                    setOpenMenu(openMenu === doc.id ? null : doc.id)
                  }
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

export default DocumentList;