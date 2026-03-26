import styles from "../CSS/MiddleSectionCSS/MessageList.module.css";
import { messages } from "../Data/conversationMessage";
import MessageBubble from "./MessageBubble";

const MessageList = ()=>{
    return(
        <div className={styles.container}>
            {
                messages.map((message)=>(
                    <MessageBubble
                    key={message.id}
                    message={message}
                    />
                ))
            }
            
        </div>
    )
}
export default MessageList;