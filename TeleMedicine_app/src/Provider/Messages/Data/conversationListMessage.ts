import type { Conversation } from "../types/ConversationListMessage";
export const conversations: Conversation[] = [
  {
    id: 1,
    participantName: "Jhon Smith",
    participantRole: "Patient",
    lastMessage: "Blood Pressure Update",
    lastMessageTime: "2:30 PM",
    unreadCount: 0,
    status: "online",
  },
  {
    id: 2,
    participantName: "Emily Davis",
    participantRole: "Patient",
    lastMessage: "Prescription sent",
    lastMessageTime: "Today",
    unreadCount: 0,
    status: "offline",
  },
  {
    id: 3,
    participantName: "Dr. Michael Brown",
    participantRole: "Provider",
    lastMessage: "Discussing treatment plan",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    status: "offline",
  },
];
