import styles from "../CSS/MiddleSectionCSS/MessageThread.module.css";
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const MessageThread = () =>{
    return(
        <div className={styles.container}>
            <MessageHeader />
            <MessageList/>
            <MessageInput/>
        </div>
    )
}   

export default MessageThread;