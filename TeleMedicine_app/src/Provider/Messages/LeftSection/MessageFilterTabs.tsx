import styles from "../CSS/LeftSectionCSS/MessageFilterTabs.module.css";
interface Props {
  active: string;
  setActive: (value: string) => void;
}

const tabs = ["All", "Unread", "Patients", "Providers", "Admin"];

const MesssageFilterTabs: React.FC<Props> = ({ active, setActive }) => {
  return (
    <div className={styles.container}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`${styles.tab} ${active === tab ? styles.active : ""}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
export default MesssageFilterTabs;
