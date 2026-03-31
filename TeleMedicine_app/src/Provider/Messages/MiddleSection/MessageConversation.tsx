import { useState } from "react";
import { useMessageStore } from "../Store/MessageStore";
import styles from "../CSS/MiddleSectionCSS/MessageConversation.module.css";

const MessageConversation = () => {
  const toggleDetailsPanel = useMessageStore(
    (state) => state.toggleDetailsPanel,
  );
  const conversations = useMessageStore((state) => state.conversations);
  const selectedConversationId = useMessageStore(
    (state) => state.selectedConversationId,
  );
  const conversation = conversations.find(
    (c) => c.id === selectedConversationId,
  );

  const messages = useMessageStore((state) => state.messages);
  const filteredMessages = messages
    .filter((msg) => msg.conversationId === selectedConversationId)
    .sort((a, b) => a.id - b.id);

  //   Input section
  const sendMessage = useMessageStore((state) => state.sendMessage);

  const [text, setText] = useState("");
  const handlesend = () => {
    if (!text.trim()) return;

    if (!selectedConversationId) return;

    sendMessage(selectedConversationId, text);

    setText("");
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.Header}>
        <div className={styles.left}>
          <div className={styles.avatar}></div>
          <div>
            <div className={styles.name}>{conversation?.participantName}</div>
            <div
              className={`${styles.status} ${conversation?.status === "online" ? styles.online : styles.offline}`}
            >
              {conversation?.status}
            </div>
          </div>
        </div>
        <div className={styles.actions} onClick={toggleDetailsPanel}>
          ⋮
        </div>
      </div>

      {/* Messages Section */}
      <div className={styles.Messsages}>
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${message.sender === "me" ? styles.me : styles.other}`}
          >
            <div className={styles.bubble}>
              {message.text}
              <div className={styles.time}>{message.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className={styles.InputContainer}>
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
    </div>
  );
};

export default MessageConversation;
