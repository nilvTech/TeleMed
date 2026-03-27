import MessageSearch from "./MessageSearch";
import MesssageFilterTabs from "./MessageFilterTabs";
import ConversationItem from "./ConversationItem";
import styles from "../CSS/LeftSectionCSS/ConversationList.module.css";
import { useMessageStore } from "../Store/MessageStore";

const ConversationList = () => {
  // Zustand State
  const conversations = useMessageStore((state) => state.conversations);
  const activeTab = useMessageStore((state) => state.activeTab);
  const searchTerm = useMessageStore((state) => state.searchTerm);


  const filtered = conversations.filter((c) => {
    const matchSearch = c.participantName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (activeTab === "Unread") {
      return matchSearch && c.unreadCount > 0;
    }

    if (activeTab === "Patients") {
      return matchSearch && c.participantRole === "Patient";
    }

    if (activeTab === "Provider") {
      return matchSearch && c.participantRole === "Provider";
    }

    if (activeTab === "Admin") {
      return matchSearch && c.participantRole === "Admin";
    }

    if (activeTab === "All") {
      return matchSearch;
    }
  });

  return (
    <div className={styles.container}>
      <MessageSearch/>
      <MesssageFilterTabs />

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>No conversations found</div>
        ) : (
          filtered.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
