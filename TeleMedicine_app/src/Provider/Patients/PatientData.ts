export interface PatientList {
    id: number;
    name: string;
    MRN:string;
    age: number;
    DOB:string;
    gender:string;
    phone:string;
    lastVisit:string;
    nextAppointment:string;
    status:string;
    RPM:string;
    condition:string;
    disease:string;
  }
export const PatientData : PatientList[] = [
  { "id": 1, "name": "Liam Miller", "MRN": "MRN-8821", "age": 49, "DOB": "1977-05-12", "gender": "Male", "phone": "555-0101", "lastVisit": "2026-01-15", "nextAppointment": "2026-04-10", "status": "Active", "RPM": "Active", "condition": "Hypertension", "disease": "Essential Hypertension" },
  { "id": 2, "name": "Noah Smith", "MRN": "MRN-4490", "age": 59, "DOB": "1966-11-20", "gender": "Male", "phone": "555-0102", "lastVisit": "2025-11-20", "nextAppointment": "2026-03-25", "status": "Follow-up", "RPM": "Inactive", "condition": "T2 Diabetes", "disease": "Type 2 Diabetes Mellitus" },
  { "id": 3, "name": "James Anderson", "MRN": "MRN-3312", "age": 39, "DOB": "1986-08-14", "gender": "Male", "phone": "555-0103", "lastVisit": "2026-02-10", "nextAppointment": "2026-05-15", "status": "Active", "RPM": "Active", "condition": "Respiratory", "disease": "Chronic Bronchitis" },
  { "id": 4, "name": "Olivia Taylor", "MRN": "MRN-9904", "age": 30, "DOB": "1995-12-05", "gender": "Female", "phone": "555-0104", "lastVisit": "2026-03-01", "nextAppointment": "2026-03-20", "status": "Urgent", "RPM": "Active", "condition": "Hypertension", "disease": "Gestational Hypertension" },
  { "id": 5, "name": "Mia Garcia", "MRN": "MRN-7725", "age": 42, "DOB": "1983-04-22", "gender": "Female", "phone": "555-0105", "lastVisit": "2025-12-12", "nextAppointment": "2026-06-12", "status": "In-active", "RPM": "Inactive", "condition": "T2 Diabetes", "disease": "Insulin-Resistant T2D" },
  { "id": 6, "name": "Ethan Clark", "MRN": "MRN-1256", "age": 28, "DOB": "1997-09-30", "gender": "Male", "phone": "555-0106", "lastVisit": "2026-01-30", "nextAppointment": "2026-04-05", "status": "Active", "RPM": "Pending", "condition": "Hyperlipidemia", "disease": "High Cholesterol" },
  { "id": 7, "name": "Ava Martinez", "MRN": "MRN-6632", "age": 52, "DOB": "1973-02-14", "gender": "Female", "phone": "555-0107", "lastVisit": "2026-02-14", "nextAppointment": "2026-03-22", "status": "Follow-up", "RPM": "Active", "condition": "Hypertension", "disease": "Pulmonary Hypertension" },
  { "id": 8, "name": "Lucas Wright", "MRN": "MRN-4418", "age": 65, "DOB": "1960-07-08", "gender": "Male", "phone": "555-0108", "lastVisit": "2025-10-05", "nextAppointment": "2026-03-19", "status": "Active", "RPM": "Active", "condition": "T2 Diabetes", "disease": "T2D with Neuropathy" },
  { "id": 9, "name": "Sophia Robinson", "MRN": "MRN-2290", "age": 24, "DOB": "2002-01-19", "gender": "Female", "phone": "555-0109", "lastVisit": "2026-03-10", "nextAppointment": "2026-09-10", "status": "Active", "RPM": "Inactive", "condition": "Respiratory", "disease": "Asthma" },
  { "id": 10, "name": "Benjamin Lee", "MRN": "MRN-5581", "age": 71, "DOB": "1954-10-11", "gender": "Male", "phone": "555-0110", "lastVisit": "2026-02-28", "nextAppointment": "2026-03-18", "status": "Urgent", "RPM": "Active", "condition": "Cardiovascular", "disease": "Atrial Fibrillation" },
  { "id": 11, "name": "Isabella Walker", "MRN": "MRN-9012", "age": 45, "DOB": "1980-06-25", "gender": "Female", "phone": "555-0111", "lastVisit": "2026-01-20", "nextAppointment": "2026-04-20", "status": "Follow-up", "RPM": "Pending", "condition": "Hypertension", "disease": "Secondary Hypertension" },
  { "id": 12, "name": "Mason Hall", "MRN": "MRN-3345", "age": 33, "DOB": "1992-03-03", "gender": "Male", "phone": "555-0112", "lastVisit": "2025-12-01", "nextAppointment": "2026-05-01", "status": "Active", "RPM": "Active", "condition": "T2 Diabetes", "disease": "Early Onset T2D" },
  { "id": 13, "name": "Emma Young", "MRN": "MRN-1123", "age": 29, "DOB": "1996-11-15", "gender": "Female", "phone": "555-0113", "lastVisit": "2026-03-05", "nextAppointment": "2026-03-25", "status": "Active", "RPM": "Inactive", "condition": "Respiratory", "disease": "Exercise-Induced Asthma" },
  { "id": 14, "name": "Alexander King", "MRN": "MRN-6678", "age": 50, "DOB": "1975-08-29", "gender": "Male", "phone": "555-0114", "lastVisit": "2026-02-18", "nextAppointment": "2026-08-18", "status": "In-active", "RPM": "Inactive", "condition": "Endocrine", "disease": "Hypothyroidism" },
  { "id": 15, "name": "Charlotte Scott", "MRN": "MRN-8844", "age": 37, "DOB": "1988-12-12", "gender": "Female", "phone": "555-0115", "lastVisit": "2026-03-12", "nextAppointment": "2026-04-12", "status": "Active", "RPM": "Active", "condition": "Hypertension", "disease": "White Coat Hypertension" }
];


export const vitals = [
  { label: "Blood Pressure", value: "128/82 mmHg", time: "Jun 15, 8:00 AM" },
  { label: "Heart Rate", value: "76 bpm", time: "Jun 15, 8:00 AM" },
  { label: "SpO2", value: "97%", time: "Jun 14, 9:00 PM" },
  { label: "Weight", value: "165.2 lbs", time: "Jun 15, 7:30 AM" },
  { label: "Blood Glucose", value: "118 mg/dL", time: "Jun 15, 7:00 AM" },
];

export const medications = [
  {
    name: "Amlodipine 5mg",
    detail: "Once daily • Dr. Patel • Jun 1",
  },
  {
    name: "Metformin 500mg",
    detail: "Twice daily • Dr. Lee • May 15",
  },
  {
    name: "Lisinopril 10mg",
    detail: "Once daily • Dr. Patel • Apr 20",
  },
];

export const problems = [
  { code: "I10", name: "Essential Hypertension" },
  { code: "E11.9", name: "Type 2 Diabetes" },
  { code: "Z87.39", name: "Hx High Cholesterol" },
];