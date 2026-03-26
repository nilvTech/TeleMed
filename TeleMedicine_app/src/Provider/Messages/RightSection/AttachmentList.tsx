import styles from "../CSS/RightSectionCSS/AttachmentsList.module.css";

import {
  FileText,
  Image,
  File,
} from "lucide-react";

interface Attachment {
  id: number;
  fileName: string;
  type: "pdf" | "image" | "doc";
  size: string;
}

const files: Attachment[] = [
  {
    id: 1,
    fileName: "Lab_Report.pdf",
    type: "pdf",
    size: "2.4 MB",
  },
  {
    id: 2,
    fileName: "Chest_Xray.png",
    type: "image",
    size: "5.1 MB",
  },
  {
    id: 3,
    fileName: "Prescription.pdf",
    type: "pdf",
    size: "1.2 MB",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText size={20} />;

    case "image":
      return <Image size={20} />;

    default:
      return <File size={20} />;
  }
};

const AttachmentsList = () => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        Attachments
      </div>

      <div className={styles.list}>
        {files.map((file) => (
          <div
            key={file.id}
            className={styles.fileRow}
          >
            <div className={styles.icon}>
              {getIcon(file.type)}
            </div>

            <div className={styles.fileInfo}>
              <div
                className={styles.fileName}
              >
                {file.fileName}
              </div>

              <div
                className={styles.meta}
              >
                {file.type.toUpperCase()} •{" "}
                {file.size}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentsList;