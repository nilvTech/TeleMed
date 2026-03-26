import ConversationList from "./LeftSection/ConversationList";
import MessageThread from "./MiddleSection/MessageThread";
import PatientDetailsPanel from "./RightSection/PatientDetailsPanel";
import MessageHeader from "./MiddleSection/MessageHeader";

import styles from "./MessagesPage.module.css";
import { useState } from "react";

function MessagesPage() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const toggleDetailsPanel = () => {
    setIsDetailsOpen((prev) => !prev);
  };

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <ConversationList />
      <div className={styles.messageSection}>
        <MessageHeader onToggleDetails={toggleDetailsPanel} />
        <MessageThread />
      </div>
      <PatientDetailsPanel isOpen={isDetailsOpen} />
    </div>
  );
}
export default MessagesPage;
