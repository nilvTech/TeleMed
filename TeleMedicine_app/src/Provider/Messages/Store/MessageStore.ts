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
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations,

  messages,

  selectedConversationId: 1,

  selectedPatient: patients[0],

  isDetailsOpen: false,

  selectConversation: (id) =>{
    const selectedPatient = patients.find((p) => p.id) || null;

    set({
      selectedConversationId:id,
      selectedPatient
    });
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
        timestamp:
          new Date().toLocaleTimeString(),
        type: "text",
      },
    ],
  })),

  toggleDetailsPanel: () =>
    set((state) => ({
      isDetailsOpen: !state.isDetailsOpen,
    })),

  activeTab: "All",

  setActiveTab: (tab) => set({ activeTab: tab }),

  searchTerm:"",

  setSearchTerm: (value) => set({searchTerm:value})
}));
