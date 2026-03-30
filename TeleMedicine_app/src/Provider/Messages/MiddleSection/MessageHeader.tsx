import styles from "../CSS/MiddleSectionCSS/MessageHeader.module.css";
import { useMessageStore } from "../Store/MessageStore";

const MessageHeader = () => {
  const toggleDetailsPanel = useMessageStore((state)=>state.toggleDetailsPanel);
  const conversations = useMessageStore((state)=>state.conversations);
  const selectedConversationId = useMessageStore((state) => state.selectedConversationId);
  const conversation = conversations.find((c)=>c.id === selectedConversationId);
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.avatar}></div>
        <div>
            <div className={styles.name}>
                {conversation?.participantName}
            </div>
            <div className={styles.status}>
                {conversation?.status}
            </div>
        </div>
      </div>
      <div 
        className={styles.actions}
        onClick={toggleDetailsPanel}
      >
        ⋮
      </div>
    </div>
  );
};

export default MessageHeader;