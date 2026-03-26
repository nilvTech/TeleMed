import { useState } from "react";
import styles from "../CSS/MiddleSectionCSS/MessageInput.module.css";

const MessageInput = ()=>{
    const [text,setText] = useState("");
    const handlesend = ()=>{ 
        if(!text.trim()) return;

        console.log("Send:",text);
        
        setText("");
    };

    return(
        <div className={styles.container}>
            <input 
            type="text"
            placeholder="Type message..."
            value={text}
            onChange={(e)=>{
                setText(e.target.value);
            }}
            className={styles.input}
            />
            <button onClick={handlesend} className={styles.button}>Send</button>
        </div>
    );
};
export default MessageInput;