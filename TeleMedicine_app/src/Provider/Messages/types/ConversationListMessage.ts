export type Role = "Patient" | "Provider" | "Admin";
export interface Conversation{
    id:number;
    participantName:string;
    participantRole:Role;
    lastMessage:string;
    lastMessageTime:string;
    unreadCount:number;
    profileImage?:string;
    status:"online" | "offline";
}