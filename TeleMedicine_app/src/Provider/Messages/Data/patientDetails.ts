import type { Patient } from "../types/Patient";

export const patients: Patient[] = [
  {
    id: 1,
    name: "John Smith",
    gender: "Male",
    age: 34,
    mrn: "MRN12345",
    dob: "12 May 1990",
    phone: "+1 555-123-4567",

    attachments: [
      {
        id: 1,
        fileName: "Lab_Report.pdf",
        type: "pdf",
        size: "2.4 MB",
      },
    ],
  },

  {
    id: 2,
    name: "Emily Davis",
    gender: "Female",
    age: 29,
    mrn: "MRN67890",
    dob: "03 Mar 1995",
    phone: "+1 555-987-6543",

    attachments: [
      {
        id: 2,
        fileName: "Prescription.pdf",
        type: "pdf",
        size: "1.1 MB",
      },
    ],
  },
];