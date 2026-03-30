import { create } from "zustand";

import type { Conversation } from "../types/ConversationListMessage";
import type { Message } from "../types/ConversationMessage";
import type { Patient } from "../types/Patient";

import { conversations } from "../Data/conversationListMessage";
import { messages } from "../Data/conversationMessage";
import { patients } from "../Data/patientDetails";

interface MessageState {
  conversations: Conversation[];

  messages: Message[];

  selectedConversationId: number;

  selectedPatient: Patient | null;

  isDetailsOpen: boolean;

  selectConversation: (id: number) => void;

  sendMessage: (conversationId: number, text: string) => void;

  toggleDetailsPanel: () => void;

  activeTab: string;

  setActiveTab: (tab: string) => void;

  searchTerm: string;

  setSearchTerm: (value: string) => void;

  getUnreadCount: (conversationId: number) => number;

  getTotalUndreadCount: ()=>number;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations,

  messages,

  selectedConversationId: 1,

  selectedPatient: null,

  isDetailsOpen: false,

  selectConversation: (id) => {
    const selectedPatient = patients.find((p) => p.id == id) || null;

    set((state) => ({
      selectedConversationId: id,
      selectedPatient,
      // mark messages as read for this conversation
      messages:state.messages.map((msg) => msg.conversationId == id ? {...msg,isRead:true}:msg),
    }));
  },

  sendMessage: (conversationId, text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now(),
          conversationId: conversationId,
          text: text,
          sender: "me",
          timestamp: new Date().toLocaleTimeString(),
          type: "text",
          isRead: false,
        },
      ],
    })),

  toggleDetailsPanel: () =>
    set((state) => ({
      isDetailsOpen: !state.isDetailsOpen,
    })),

  activeTab: "All",

  setActiveTab: (tab) => set({ activeTab: tab }),

  searchTerm: "",

  setSearchTerm: (value) => set({ searchTerm: value }),

  getUnreadCount: (conversationId: number) => {
    const messages = get().messages;

    return messages.filter(
      (msg) =>
        msg.conversationId === conversationId &&
        msg.sender === "other" &&
        !msg.isRead,
    ).length;
  },

  getTotalUndreadCount: ()=>{
    const messages = get().messages;

    return messages.filter(
      (msg)=>
        msg.sender === "other" &&
        !msg.isRead,
    ).length;
  },
  
}));
