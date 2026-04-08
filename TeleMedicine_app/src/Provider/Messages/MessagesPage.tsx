import ConversationList from "./LeftSection/ConversationList";
import MessageThread from "./MiddleSection/MessageThread";
import PatientDetailsPanel from "./RightSection/PatientDetailsPanel";
import styles from "./MessagesPage.module.css";
import { useMessageStore } from "./Store/MessageStore";

function MessagesPage() {
  const selectedPatient = useMessageStore((state) => state.selectedPatient);

  return (
    <div
      className={styles.container}
    >
      <ConversationList />
      {!selectedPatient && (
        <div className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <h3>Select a conversation</h3>
            <p>Choose a chat from the list to view details</p>
          </div>
        </div>
      )}
      {selectedPatient && (
        <>
          <div className={styles.messageSection}>
            <MessageThread />
          </div>
          <PatientDetailsPanel />
        </>
      )}
    </div>
  );
}
export default MessagesPage;
