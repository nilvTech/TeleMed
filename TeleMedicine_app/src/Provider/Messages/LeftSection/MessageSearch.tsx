import styles from "../CSS/LeftSectionCSS/MessageSearch.module.css";
interface Props {
  search: string;
  setSearch: (value: string) => void;
}
const MessageSearch: React.FC<Props> = ({ search, setSearch }) => {
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search messages"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.input}
      />
    </div>
  );
};
export default MessageSearch;
