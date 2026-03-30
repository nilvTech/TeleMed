import styles from "../CSS/MiddleSectionCSS/MessageBubble.module.css";
import type { Message } from "../types/ConversationMessage";
interface Props {
  message: Message;
}

const MessageBubble: React.FC<Props> = ({ message }) => {
  const isMe = message.sender === "me";
  return (
    <div className={`${styles.container} ${isMe ? styles.me : styles.other}`}>
      <div className={styles.time}>
        <strong> {message.text}</strong>
        <br />
        {message.timestamp}
      </div>
    </div>
  );
};

export default MessageBubble;
