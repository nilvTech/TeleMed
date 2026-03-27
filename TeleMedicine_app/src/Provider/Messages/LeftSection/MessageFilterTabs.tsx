import styles from "../CSS/LeftSectionCSS/MessageFilterTabs.module.css";
import { useMessageStore } from "../Store/MessageStore";

const tabs = ["All", "Unread", "Patients", "Providers", "Admin"];

const MesssageFilterTabs: React.FC = () => {
  const activeTab = useMessageStore((state) => state.activeTab);
  const setActiveTab = useMessageStore((state) => state.setActiveTab);

  return (
    <div className={styles.container}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
export default MesssageFilterTabs;
