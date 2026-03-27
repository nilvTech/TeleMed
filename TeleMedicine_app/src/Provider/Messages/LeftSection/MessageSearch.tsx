import styles from "../CSS/LeftSectionCSS/MessageSearch.module.css";
import { useMessageStore } from "../Store/MessageStore";

const MessageSearch: React.FC = () => {
  const searchTerm = useMessageStore((state) => state.searchTerm);
  const setSearchTerm = useMessageStore((state) => state.setSearchTerm);

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search messages"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.input}
      />
    </div>
  );
};
export default MessageSearch;
