import type { Message } from "../types/ConversationMessage";
export const messages: Message[] = [
  {
    id: 1,
    conversationId: 1,
    sender: "other",
    text: "Hello Doctor",
    timestamp: "10:30Am",
    type: "text",
  },
  {
    id: 2,
    conversationId: 1,
    sender: "other",
    text: "My blood pressure is high",
    timestamp: "10:31Am",
    type: "text",
  },
  {
    id: 3,
    conversationId: 1,
    sender: "me",
    text: "Please continue medication",
    timestamp: "10:32Am",
    type: "text",
  },
  
];
