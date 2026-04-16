import React, { useState, useRef, useEffect } from "react";
import styles from "./PatientMessage.module.css";
import { Send, Paperclip, Video, Phone, Calendar, FileText, MoreVertical, Search, X } from "lucide-react";

// ---------------- Types ----------------

interface MessageFile {
  name: string;
  size: string;
}

interface Message {
  id: number;
  sender: "patient" | "provider";
  text: string;
  time: string;
  file?: MessageFile | null;
}

interface Attachment {
  id: number;
  fileName: string;
  size: string;
}

interface Conversation {
  id: number;
  providerName: string;
  specialty: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  online: boolean;
  responseTime: string;
  rating: number;
  messages: Message[];
  attachments: Attachment[];
}

// ---------------- Mock Data ----------------

const conversationsData: Conversation[] = [
  {
    id: 1,
    providerName: "Dr. Michael Chen",
    specialty: "Cardiologist",
    lastMessage: "Your lab results look good.",
    time: "10:30 AM",
    unread: true,
    online: true,
    responseTime: "~15 min",
    rating: 5,
    messages: [
      {
        id: 1,
        sender: "provider",
        text: "Hello John, I've reviewed your recent lab results and everything looks good. Your cholesterol levels have improved significantly since your last visit.",
        time: "10:00 AM",
      },
      {
        id: 2,
        sender: "provider",
        text: "I've also attached the full lab report and your updated prescription below.",
        time: "10:02 AM",
        file: { name: "Lab_Report.pdf", size: "2.4 MB" },
      },
      {
        id: 3,
        sender: "patient",
        text: "Thank you doctor! That's great to hear. Should I continue with the same medication?",
        time: "10:05 AM",
      },
      {
        id: 4,
        sender: "provider",
        text: "Yes, continue the current regimen. Let's schedule a follow-up in 3 months. Would you like me to book that now?",
        time: "10:08 AM",
      },
      {
        id: 5,
        sender: "patient",
        text: "Yes please, that would be great!",
        time: "10:10 AM",
      },
    ],
    attachments: [
      { id: 1, fileName: "Lab_Report.pdf", size: "2.4 MB" },
      { id: 2, fileName: "Prescription.pdf", size: "1.1 MB" },
    ],
  },
  {
    id: 2,
    providerName: "Dr. Sarah Wilson",
    specialty: "General Physician",
    lastMessage: "Please schedule a follow-up visit.",
    time: "Yesterday",
    unread: false,
    online: false,
    responseTime: "~1 hr",
    rating: 4,
    messages: [
      {
        id: 1,
        sender: "provider",
        text: "Hi John, hope you're feeling better. Please schedule a follow-up visit so we can monitor your recovery.",
        time: "Yesterday",
      },
    ],
    attachments: [
      { id: 1, fileName: "Visit_Summary.pdf", size: "1.2 MB" },
    ],
  },
  {
    id: 3,
    providerName: "Dr. Ana Rodrigueze",
    specialty: "Neurologist",
    lastMessage: "Your prescription is ready for pickup.",
    time: "Monday",
    unread: false,
    online: true,
    responseTime: "~30 min",
    rating: 5,
    messages: [
      {
        id: 1,
        sender: "provider",
        text: "Your prescription is ready for pickup at the pharmacy.",
        time: "Monday",
      },
    ],
    attachments: [
      { id: 1, fileName: "Prescription.pdf", size: "0.8 MB" },
    ],
  },
];

// ---------------- Helpers ----------------

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((p) => p.length > 0)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = ["av-blue", "av-teal", "av-purple", "av-amber"];

function getAvatarColor(id: number): string {
  return avatarColors[id % avatarColors.length];
}

// ---------------- Component ----------------

export default function PatientMessage() {
  const [conversations, setConversations] = useState<Conversation[]>(conversationsData);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversationsData[0]);
  const [newMessage, setNewMessage] = useState("");
  const [showDetails, setShowDetails] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "unread">("all");
  const [isTyping, setIsTyping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [selectedConversation.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedFile) return;

    const message: Message = {
      id: Date.now(),
      sender: "patient",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      file: selectedFile
        ? { name: selectedFile.name, size: `${(selectedFile.size / 1024).toFixed(1)} KB` }
        : null,
    };

    const updatedConversations = conversations.map((conv) =>
      conv.id === selectedConversation.id
        ? {
            ...conv,
            lastMessage: message.text || message.file?.name || "File sent",
            time: message.time,
            messages: [...conv.messages, message],
          }
        : conv
    );

    setConversations(updatedConversations);
    setSelectedConversation(
      updatedConversations.find((c) => c.id === selectedConversation.id)!
    );
    setNewMessage("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Simulate provider typing indicator
    setIsTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => setIsTyping(false), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDownloadFile = (fileName: string) => {
    const blob = new Blob([`Mock content for ${fileName}`], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleQuickReply = (text: string) => {
    setNewMessage(text);
  };

  const filteredList = conversations.filter((conv) => {
    const matchesSearch = conv.providerName.toLowerCase().includes(search.toLowerCase());
    if (filterTab === "unread") return matchesSearch && conv.unread;
    return matchesSearch;
  });

  const quickReplies = ["Schedule follow-up", "Request prescription refill", "Ask about results"];

  return (
    <div className={styles.container}>

      {/* ── Left: Conversation List ── */}
      <div className={styles.leftSection}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Messages</h2>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search conversations..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch("")}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.filterTabs}>
          {(["all", "unread"] as const).map((tab) => (
            <button
              key={tab}
              className={`${styles.filterTab} ${filterTab === tab ? styles.filterTabActive : ""}`}
              onClick={() => setFilterTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.conversationList}>
          {filteredList.map((conv) => (
            <div
              key={conv.id}
              className={`${styles.conversationItem} ${
                selectedConversation?.id === conv.id ? styles.activeConversation : ""
              }`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className={styles.avatarWrapper}>
                <div className={`${styles.avatarCircle} ${styles[getAvatarColor(conv.id)]}`}>
                  {getInitials(conv.providerName)}
                </div>
                {conv.online && <span className={styles.onlineBadge} />}
              </div>
              <div className={styles.conversationContent}>
                <div className={styles.contentHeader}>
                  <span className={styles.providerName}>{conv.providerName}</span>
                  <span className={styles.messageTime}>{conv.time}</span>
                </div>
                <div className={styles.contentFooter}>
                  <p className={styles.messagePreview}>{conv.lastMessage}</p>
                  {conv.unread && <span className={styles.unreadDot} />}
                </div>
              </div>
            </div>
          ))}

          {filteredList.length === 0 && (
            <div className={styles.emptyList}>No conversations found</div>
          )}
        </div>
      </div>

      {/* ── Middle: Chat ── */}
      <div className={styles.middleSection}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderLeft}>
                <div className={`${styles.avatarCircle} ${styles[getAvatarColor(selectedConversation.id)]} ${styles.avatarMd}`}>
                  {getInitials(selectedConversation.providerName)}
                </div>
                <div>
                  <div className={styles.chatDocName}>{selectedConversation.providerName}</div>
                  <div className={styles.chatDocSub}>
                    <span className={styles.onlineDot} />
                    {selectedConversation.online ? "Online" : "Offline"} · {selectedConversation.specialty}
                  </div>
                </div>
              </div>
              <div className={styles.chatHeaderActions}>
                {/* <button className={styles.headerBtn} title="Call">
                  <Phone size={16} />
                </button>
                <button className={`${styles.headerBtn} ${styles.headerBtnPrimary}`} title="Video Call">
                  <Video size={16} />
                </button> */}
                <button
                  className={styles.headerBtn}
                  title="Toggle details"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messageArea}>
              <div className={styles.dateSeparator}>
                <span>Today, {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span>
              </div>

              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.messageRow} ${
                    msg.sender === "patient" ? styles.patientMessage : styles.providerMessage
                  }`}
                >
                  {msg.sender === "provider" && (
                    <div className={`${styles.msgAvatar} ${styles[getAvatarColor(selectedConversation.id)]}`}>
                      {getInitials(selectedConversation.providerName)}
                    </div>
                  )}
                  <div className={styles.bubbleGroup}>
                    <div className={`${styles.messageBubble} ${msg.sender === "patient" ? styles.bubblePatient : styles.bubbleProvider}`}>
                      {msg.text}
                      {msg.file && (
                        <div
                          className={styles.fileAttachmentBubble}
                          onClick={() => handleDownloadFile(msg.file!.name)}
                        >
                          <FileText size={13} />
                          <span>{msg.file.name}</span>
                          <span className={styles.fileSize}>{msg.file.size}</span>
                        </div>
                      )}
                    </div>
                    <div className={`${styles.msgTime} ${msg.sender === "patient" ? styles.msgTimeRight : ""}`}>
                      {msg.time}
                    </div>
                  </div>
                  {/* {msg.sender === "patient" && (
                    <div className={`${styles.msgAvatar} ${styles.avPatient}`}>JC</div>
                  )} */}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className={`${styles.messageRow} ${styles.providerMessage}`}>
                  <div className={`${styles.msgAvatar} ${styles[getAvatarColor(selectedConversation.id)]}`}>
                    {getInitials(selectedConversation.providerName)}
                  </div>
                  <div className={styles.typingBubble}>
                    <span /><span /><span />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <div className={styles.messageInputArea}>
              <div className={styles.quickReplies}>
                {quickReplies.map((qr) => (
                  <button key={qr} className={styles.quickReplyChip} onClick={() => handleQuickReply(qr)}>
                    {qr}
                  </button>
                ))}
              </div>

              <div className={styles.composerRow}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
                <button className={styles.composerIcon} onClick={() => fileInputRef.current?.click()}>
                  <Paperclip size={17} />
                </button>

                <div className={styles.composerInputWrapper}>
                  {selectedFile && (
                    <div className={styles.filePreviewChip}>
                      <FileText size={12} />
                      <span>{selectedFile.name}</span>
                      <button onClick={() => setSelectedFile(null)}><X size={13} /></button>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className={styles.messageInput}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                  />
                </div>

                <button
                  className={`${styles.sendButton} ${(!newMessage.trim() && !selectedFile) ? styles.sendButtonDisabled : ""}`}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() && !selectedFile}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>Select a conversation to start messaging</div>
        )}
      </div>

      {/* ── Right: Provider Details ── */}
      {showDetails && selectedConversation && (
        <div className={styles.rightSection}>

          {/* Provider card */}
          <div className={styles.rpSection}>
            <p className={styles.rpLabel}>Provider</p>
            <div className={styles.providerCard}>
              <div className={`${styles.avatarCircle} ${styles[getAvatarColor(selectedConversation.id)]} ${styles.avatarLg}`}>
                {getInitials(selectedConversation.providerName)}
              </div>
              <div className={styles.providerCardName}>{selectedConversation.providerName}</div>
              <div className={styles.providerCardRole}>{selectedConversation.specialty}</div>
              <div className={styles.starRating}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < selectedConversation.rating ? styles.starFilled : styles.starEmpty}>★</span>
                ))}
              </div>
            </div>
          </div>

          {/* Response time */}
          <div className={styles.rpSection}>
            <div className={styles.responseTimeBar}>
              <Phone size={13} />
              <span>Responds in {selectedConversation.responseTime}</span>
            </div>
          </div>

          {/* Attachments */}
          <div className={styles.rpSection}>
            <p className={styles.rpLabel}>Attachments</p>
            {selectedConversation.attachments.length === 0 ? (
              <p className={styles.noFiles}>No attachments</p>
            ) : (
              selectedConversation.attachments.map((file) => (
                <div
                  key={file.id}
                  className={styles.fileRow}
                  onClick={() => handleDownloadFile(file.fileName)}
                >
                  <div className={`${styles.fileIcon} ${file.fileName.includes("Lab") ? styles.fileIconRed : styles.fileIconBlue}`}>
                    <FileText size={14} />
                  </div>
                  <div className={styles.fileInfo}>
                    <div className={styles.fileName}>{file.fileName}</div>
                    <div className={styles.fileSize}>{file.size}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div className={styles.rpSection}>
            <p className={styles.rpLabel}>Quick actions</p>
            <button className={`${styles.quickActionBtn} ${styles.qabBlue}`}>
              <Calendar size={14} /> Schedule appointment
            </button>
            <button className={`${styles.quickActionBtn} ${styles.qabGreen}`}>
              <Video size={14} /> Start video call
            </button>
            <button className={`${styles.quickActionBtn} ${styles.qabPurple}`}>
              <FileText size={14} /> Request records
            </button>
          </div>
        </div>
      )}
    </div>
  );
}