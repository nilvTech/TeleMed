import { useEffect, useState, useRef } from "react";
import styles from "./CSS/DocumentList.module.css";

type Props = {
  documents: any[];
  setDocuments: React.Dispatch<React.SetStateAction<any[]>>;
};

function DocumentList({ documents, setDocuments }: Props) {
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

export default DocumentList;