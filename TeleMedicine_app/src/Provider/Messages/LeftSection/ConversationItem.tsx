import type { Conversation } from "../types/ConversationListMessage";
import styles from "../CSS/LeftSectionCSS/ConversationItem.module.css";
import { useMessageStore } from "../Store/MessageStore";
interface Props {
  conversation: Conversation;
}

const ConversationItem: React.FC<Props> = ({ conversation }) => {
  const selectedConversationId = useMessageStore(
    (state) => state.selectedConversationId,
  );
  const selectConversation = useMessageStore(
    (state) => state.selectConversation,
  );
  const isSelected = selectedConversationId === conversation.id;

  //Unread Count data from store
  const getUndreadCount = useMessageStore((state) => state.getUnreadCount);

  const unreadCount = getUndreadCount(conversation.id);



  return (
    <div
      onClick={() => selectConversation(conversation.id)}
      className={`${styles.container} ${isSelected ? styles.selected : ""}`}
    >
      <div className={styles.avatar}></div>
      <div className={styles.content}>
        <div className={styles.name}>{conversation.participantName}</div>

        <div className={styles.message}>{conversation.lastMessage}</div>

        <div className={styles.time}>{conversation.lastMessageTime}</div>
      </div>

      {unreadCount > 0 && (
        <span className={styles.unread}>{unreadCount}</span>
      )}
    </div>
  );
};

export default ConversationItem;
