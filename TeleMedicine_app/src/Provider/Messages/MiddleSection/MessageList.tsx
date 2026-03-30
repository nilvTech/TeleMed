import styles from "../CSS/MiddleSectionCSS/MessageList.module.css";
import { useMessageStore } from "../Store/MessageStore";
import MessageBubble from "./MessageBubble";

const MessageList = ()=>{
    const messages = useMessageStore((state) => state.messages);
    const selectedConversationId = useMessageStore((state) => state.selectedConversationId);
    const filteredMessages = messages.filter((msg)=>msg.conversationId === selectedConversationId).sort((a, b) => a.id - b.id);
    return(
        <div className={styles.container}>
            {
                filteredMessages.map((message)=>(
                    <MessageBubble 
                    key={message.id}
                    message={message}
                    />
                ))
            }
        </div>
    );
};
export default MessageList;