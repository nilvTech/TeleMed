export type MessageSender = "me" | "other";

export interface Message{
    id:number;
    conversationId:number;
    sender:MessageSender;
    text:string;
    timestamp:string;
    type: "text" | "file";
    fileName?:string;
    isRead:boolean;
}