import styles from "../CSS/MiddleSectionCSS/MessageThread.module.css";
import MessageConversation from "./MessageConversation";


const MessageThread = () =>{
    return(
        <div className={styles.container}>
            <MessageConversation/>
        </div>
    )
}   

export default MessageThread;