import { useState } from "react";
import styles from "./SupportPage.module.css";

import { useMessageStore } from "../Messages/Store/MessageStore";

type Ticket = {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  date: string;
  description: string;
};

const initialTickets: Ticket[] = [
  {
    id: "TCK-001",
    subject: "Unable to upload prescription",
    category: "Technical Issue",
    priority: "High",
    status: "Open",
    date: "04/07/2026",
    description: "",
  },
  {
    id: "TCK-002",
    subject: "Payment not reflected",
    category: "Billing Issue",
    priority: "Medium",
    status: "Resolved",
    date: "04/05/2026",
    description: "",
  },
];

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("Create Ticket");
  const [adminChat, setAdminChat] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  // const [filter, setFilter] = useState("All");

  const getFormattedDate = () => {
    const now = new Date(Date.now());
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const [form, setForm] = useState<Ticket>({
    id: "",
    subject: "",
    category: "",
    priority: "",
    status: "Open",
    date: getFormattedDate(),
    description: "",
  });

  const faqs = [
    "How to create a prescription?",
    "How to schedule an appointment?",
    "How to download invoice?",
    "How to upload files?",
    "How to reset password?",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const newTicket: Ticket = {
      ...form,
      id: `TCK-${Date.now()}`,
    };

    setTickets([newTicket, ...tickets]);
    setForm({
      id: "",
      subject: "",
      category: "",
      priority: "",
      status: "closed",
      date: Date.now().toString(),
      description: "",
    });
  };

  const handleClear = () => {
    setForm({
      id: "",
      subject: "",
      category: "",
      priority: "",
      status: "closed",
      date: Date.now().toString(),
      description: "",
    });
  };
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStatus = e.target.value;

    if (selectedStatus === "All") {
      setTickets(initialTickets);
    } else {
      const filteredTickets = initialTickets.filter(
        (t) => t.status === selectedStatus,
      );
      setTickets(filteredTickets);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Create Ticket":
        return (
          <div className={styles.section}>
            <h2>Create Ticket</h2>

            <div className={styles.formGrid}>
              <input
                name="subject"
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>Select Category</option>
                <option>Technical Issue</option>
                <option>Billing Issue</option>
                <option>Account Issue</option>
                <option>Appointment Issue</option>
                <option>Prescription Issue</option>
                <option>Other</option>
              </select>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option>Select Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>

              <textarea
                className={styles.textarea}
                placeholder="Describe your issue..."
                name="description"
                value={form.description}
                onChange={handleChange}
              />

              <div className={styles.attachmentcontainer}>
                <span className={styles.label}>Attachment</span>

                <label className={styles.fileInputWrapper}>
                  <span>Click to upload or drag and drop</span>
                  <input
                    type="file"
                    className={styles.hiddenInput}
                    onChange={(e) => console.log(e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>

            <div className={styles.buttonRow}>
              <button className={styles.submitBtn} onClick={handleSubmit}>
                Submit Ticket
              </button>
              <button className={styles.clearBtn} onClick={handleClear}>
                Clear
              </button>
            </div>
          </div>
        );

      case "My Tickets":
        return (
          <div className={styles.section}>
            <h2>My Support Tickets</h2>

            <div className={styles.filters}>
              <label htmlFor="all">
                <input
                  type="radio"
                  id="all"
                  name="status"
                  value="All"
                  onChange={handleFilter}
                  defaultChecked
                />
                All
              </label>
              <label htmlFor="open">
                <input
                  type="radio"
                  id="open"
                  name="status"
                  value="Open"
                  onChange={handleFilter}
                />
                Open
              </label>
              <label htmlFor="resolved">
                <input
                  type="radio"
                  id="resolved"
                  name="status"
                  value="Resolved"
                  onChange={handleFilter}
                />
                Resolved
              </label>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{ticket.subject}</td>
                    <td>{ticket.category}</td>
                    <td>{ticket.priority}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          ticket.status === "Open"
                            ? styles.open
                            : styles.resolved
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td>{ticket.date}</td>
                    <td>
                      <button className={styles.actionBtn}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "FAQ":
        return (
          <div className={styles.section}>
            <h2>Frequently Asked Questions</h2>

            <div className={styles.faqList}>
              {faqs.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  {faq}
                </div>
              ))}
            </div>
          </div>
        );

      case "Contact Support":
        return (
          <div className={styles.section}>
            <h2>Contact Support</h2>

            <div className={styles.contactBox}>
              {!adminChat && (
                <button
                  className={styles.chatButton}
                  onClick={() => setAdminChat(true)}
                >
                  Chat With Admin
                </button>
              )}
              {adminChat && <MesaageSection />}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.title}>Support</h2>

        {["Create Ticket", "My Tickets", "FAQ", "Contact Support"].map(
          (tab) => (
            <button
              key={tab}
              className={`${styles.tabButton} ${
                activeTab === tab ? styles.activeTab : styles.inactiveTab
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ),
        )}
      </div>

      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

const MesaageSection = () => {
  const selectedConversationId = useMessageStore(
    (state) => state.selectedConversationId,
  );
  const selectedConversation = {
    id: selectedConversationId,
    participantName: "Jhon Smith",
  };
  return (
    <div className={styles.messageSection}>
      <ConversationList />
      {!selectedConversationId ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <h3>Select a conversation</h3>
            <p>Choose a chat from the list to view details</p>
          </div>
        </div>
      ) : (
        <MessageThread conversation={selectedConversation} />
      )}
    </div>
  );
};

const ConversationList = () => {
  const conversations: Conversation[] = [
    {
      id: 1,
      participantName: "Jhon Smith",
      participantRole: "Admin",
      lastMessage: "Blood Pressure Update",
      lastMessageTime: "2:30 PM",
      unreadCount: 0,
      status: "online",
    },
    {
      id: 2,
      participantName: "Emily Davis",
      participantRole: "Admin",
      lastMessage: "Prescription sent",
      lastMessageTime: "Today",
      unreadCount: 0,
      status: "offline",
    },
    {
      id: 3,
      participantName: "Dr. Michael Brown",
      participantRole: "Admin",
      lastMessage: "Discussing treatment plan",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      status: "offline",
    },
  ];

  const filtered = conversations.filter((c) => {
    return c.participantRole === "Admin";
  });

  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <div className={styles.headerTop}>
          <h3>Admin</h3>
          <span className={styles.onlineCount}>{filtered.length} Active</span>
        </div>
        <div className={styles.searchPlaceholder}>
          <input type="text" placeholder="Search chats..." />
        </div>
      </div>

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>No conversations found</div>
        ) : (
          filtered.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversations={conversation}
            />
          ))
        )}
      </div>
    </div>
  );
};

type Conversation = {
  id: number;

  participantName: string;

  participantRole: "Admin";

  lastMessage: string;

  lastMessageTime: string;

  unreadCount: number;

  profileImage?: string;

  status: "online" | "offline";
};

interface Props {
  conversations: Conversation;
}

const ConversationItem: React.FC<Props> = ({ conversations }) => {
  const selectedConversationId = useMessageStore(
    (state) => state.selectedConversationId,
  );
  const selectConversation = useMessageStore(
    (state) => state.selectConversation,
  );
  const isSelected = selectedConversationId === conversations.id;

  return (
    <div
      onClick={() => selectConversation(conversations.id)}
      className={`${styles.conversationCard} ${isSelected ? styles.selectedCard : ""}`}
    >
      <div className={styles.avatar}></div>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <span className={styles.name}>{conversations.participantName}</span>
          <span className={styles.time}>{conversations.lastMessageTime}</span>
        </div>

        <div className={styles.lastMsg}>{conversations.lastMessage}</div>
      </div>

      {conversations.unreadCount > 0 && (
        <span className={styles.unreadBadge}>{conversations.unreadCount}</span>
      )}
    </div>
  );
};

const MessageThread = ({ conversation }: { conversation: any }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "admin",
      time: "10:30 AM",
    },
    {
      id: 2,
      text: "I'm having trouble with my prescription upload.",
      sender: "user",
      time: "10:31 AM",
    },
    {
      id: 3,
      text: "I see. Let me check your account status.",
      sender: "admin",
      time: "10:32 AM",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  return (
    <div className={styles.threadContainer}>
      {/* Thread Header */}
      <div className={styles.threadHeader}>
        <div className={styles.headerInfo}>
          <div className={styles.statusDot}></div>
          <h4>{conversation.participantName}</h4>
          <span className={styles.roleTag}>Support Agent</span>
        </div>
      </div>

      {/* Message Area */}
      <div className={styles.messageList}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageWrapper} ${msg.sender === "user" ? styles.ownMessage : ""}`}
          >
            <div className={styles.messageBubble}>
              <p>{msg.text}</p>
              <span className={styles.messageTime}>{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Write your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className={styles.sendBtn}>
          Send
        </button>
      </div>
    </div>
  );
};
export default SupportPage;
