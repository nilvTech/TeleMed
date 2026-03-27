import { useState } from "react";
import styles from "../CSS/MiddleSectionCSS/MessageInput.module.css";
import { useMessageStore } from "../Store/MessageStore";

const MessageInput = () => {

  const sendMessage = useMessageStore((state) => state.sendMessage);
  const selectedConversationId = useMessageStore(
    (state) => state.selectedConversationId,
  );
  const [text, setText] = useState("");
  const handlesend = () => {
    if (!text.trim()) return;

    if (!selectedConversationId) return;

    sendMessage(selectedConversationId, text);

    setText("");
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Type message..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        className={styles.input}
      />
      <button onClick={handlesend} className={styles.button}>
        Send
      </button>
    </div>
  );
};
export default MessageInput;
