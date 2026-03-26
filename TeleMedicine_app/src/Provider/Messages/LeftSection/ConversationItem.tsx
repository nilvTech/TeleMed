import type { Conversation } from "../types/ConversationListMessage";
import styles from "../CSS/LeftSectionCSS/ConversationItem.module.css";
interface Props {
  conversation: Conversation;
  onSelect: (id: number) => void;
  selectedId: number | null;
}

const ConversationItem: React.FC<Props> = ({
  conversation,
  onSelect,
  selectedId,
}) => {
  const isSelected = selectedId === conversation.id;

  return (
    <div
      onClick={() => onSelect(conversation.id)}
      className={`${styles.container} ${isSelected ? styles.selected : ""}`}>
      <div className={styles.avatar}></div>
      <div className={styles.content}>
        <div className={styles.name}>{conversation.participantName}</div>

        <div className={styles.message}>{conversation.lastMessage}</div>

        <div className={styles.time}>{conversation.lastMessageTime}</div>
      </div>

      {conversation.unreadCount > 0 && (
            <span className={styles.unread}>
            {conversation.unreadCount}
            </span>
      )}
    </div>
  );
};

export default ConversationItem;
