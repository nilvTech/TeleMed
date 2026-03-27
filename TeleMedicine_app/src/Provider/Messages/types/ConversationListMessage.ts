export type Role = "Patient" | "Provider" | "Admin" | "All";
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