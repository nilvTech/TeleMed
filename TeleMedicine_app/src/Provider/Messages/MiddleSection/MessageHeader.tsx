import styles from "../CSS/MiddleSectionCSS/MessageHeader.module.css";

interface Props{
  onToggleDetails: () => void;
}
const MessageHeader = ({onToggleDetails}:Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.avatar}></div>
        <div>
            <div className={styles.name}>
                Jhon Smith
            </div>
            <div className={styles.status}>
                Online
            </div>
        </div>
      </div>
      <div 
      className={styles.actions}
      onClick={onToggleDetails}
      >
        ⋮
      </div>
    </div>
  );
};
export default MessageHeader;