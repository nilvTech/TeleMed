import MessageSearch from "./MessageSearch";
import MesssageFilterTabs from "./MessageFilterTabs";
import ConversationItem from "./ConversationItem";
import { useState } from "react";
import { conversations } from "../Data/conversationListMessage";
import styles from '../CSS/LeftSectionCSS/ConversationList.module.css'

const ConversationList = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = conversations.filter((c) => {
    const matchSearch = c.participantName
      .toLowerCase()
      .includes(search.toLowerCase());

    if (activeTab === "Unread") {
      return matchSearch && c.unreadCount > 0;
    }

    if (activeTab === "Patients") {
      return matchSearch && c.participantRole === "Patient";
    }

    if (activeTab === "Provider") {
      return matchSearch && c.participantRole === "Provider";
    }
  });

  return (
    <div className={styles.container}>
      <MessageSearch search={search} setSearch={setSearch} />
      <MesssageFilterTabs active={activeTab} setActive={setActiveTab} />

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>No conversations found</div>
        ) : (
          filtered.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              onSelect={setSelectedId}
              selectedId={selectedId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
