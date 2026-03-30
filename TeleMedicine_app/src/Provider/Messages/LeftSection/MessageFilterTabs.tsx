import styles from "../CSS/LeftSectionCSS/MessageFilterTabs.module.css";
import { useMessageStore } from "../Store/MessageStore";

const tabs = ["All", "Unread"];

const MesssageFilterTabs: React.FC = () => {
  const activeTab = useMessageStore((state) => state.activeTab);
  const setActiveTab = useMessageStore((state) => state.setActiveTab);
  const totalUnreadCount = useMessageStore((state)=>state.getTotalUndreadCount());
  return (
    <>
      <div className={styles.container} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
          >
            {tab}
            {tab === "Unread" && totalUnreadCount > 0 && (
              <span className={styles.badge}>{totalUnreadCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.radioGroup}>
          <input
            type="radio"
            name="filter"
            id="Patients"
            className={styles.radioInput}
            onChange={() => setActiveTab("Patients")}
            defaultChecked
          />
          <label htmlFor="Patients" className={styles.radioLabel}>
            Patients
          </label>

          <input
            type="radio"
            name="filter"
            id="Provider"
            className={styles.radioInput}
            onChange={() => setActiveTab("Provider")}
          />
          <label htmlFor="Provider" className={styles.radioLabel}>
            Provider
          </label>

          <input
            type="radio"
            name="filter"
            id="Admin"
            className={styles.radioInput}
            onChange={() => setActiveTab("Admin")}
          />
          <label htmlFor="Admin" className={styles.radioLabel}>
            Admin
          </label>
        </div>
      </div>
    </>
  );
};
export default MesssageFilterTabs;
