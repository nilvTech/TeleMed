export interface Patient{
    id:number;
    name:string;
    gender:string;
    age:number;
    mrn:string;
    dob:string;
    phone:string;
    avatar?:string;

    attachments: Attachment[];
}
export interface Attachment {
  id: number;
  fileName: string;
  type: "pdf" | "image" | "doc";
  size: string;
}