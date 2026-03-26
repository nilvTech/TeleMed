import styles from "../CSS/MiddleSectionCSS/MessageThread.module.css";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const MessageThread = () =>{
    return(
        <div className={styles.container}>
            <MessageList/>
            <MessageInput/>
        </div>
    )
}   

export default MessageThread;