import React, { useState } from "react";
import styles from "./BillingClaims.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type ClaimStatus =
  | "Draft"
  | "Submitted"
  | "Processing"
  | "Completed"
  | "Cancelled";
type BillingStatus = "Unpaid" | "Paid" | "Partial" | "Refunded" | "Cancelled";
type ActiveTab = "claims" | "billing";
type BillingSubTab = "invoices" | "charges" | "payment-posting" | "adjustments";
type ClaimsSubTab =
  | "all-claims"
  | "claim-queue"
  | "status-tracker"
  // | "eob-remittance"
  | "denial-mgmt";

interface Claim {
  id: string;
  patientName: string;
  providerName: string;
  appointmentId: string;
  visitDate: string;
  serviceType: string;
  claimAmount: number;
  status: ClaimStatus;
  createdDate: string;
  icdCode: string;
  cptCode: string;
  payer: string;
}

interface Invoice {
  id: string;
  patientName: string;
  providerName: string;
  appointmentId: string;
  service: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: BillingStatus;
  dueDate: string;
  paymentMethod: string;
}

interface Charge {
  id: string;
  patientName: string;
  cptCode: string;
  description: string;
  units: number;
  chargeAmount: number;
  allowedAmount: number;
  date: string;
  provider: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockClaims: Claim[] = [
  {
    id: "CLM-2024-0001",
    patientName: "James Whitmore",
    providerName: "Dr. Sarah Chen",
    appointmentId: "APT-1041",
    visitDate: "2024-05-10",
    serviceType: "Telehealth - Psychiatry",
    claimAmount: 285.0,
    status: "Processing",
    createdDate: "2024-05-11",
    icdCode: "F32.1",
    cptCode: "90837",
    payer: "BlueCross BlueShield",
  },
  {
    id: "CLM-2024-0002",
    patientName: "Maria Gonzalez",
    providerName: "Dr. Micahel Lee",
    appointmentId: "APT-1042",
    visitDate: "2024-05-11",
    serviceType: "Telehealth - Internal Medicine",
    claimAmount: 195.0,
    status: "Submitted",
    createdDate: "2024-05-12",
    icdCode: "E11.9",
    cptCode: "99213",
    payer: "Aetna",
  },
  {
    id: "CLM-2024-0003",
    patientName: "Robert Kline",
    providerName: "Dr. Amy Foster",
    appointmentId: "APT-1043",
    visitDate: "2024-05-09",
    serviceType: "Telehealth - Cardiology",
    claimAmount: 420.0,
    status: "Completed",
    createdDate: "2024-05-10",
    icdCode: "I10",
    cptCode: "99214",
    payer: "UnitedHealth",
  },
  {
    id: "CLM-2024-0004",
    patientName: "Tanya Brooks",
    providerName: "Dr. Kevin Liu",
    appointmentId: "APT-1044",
    visitDate: "2024-05-12",
    serviceType: "Telehealth - Dermatology",
    claimAmount: 150.0,
    status: "Draft",
    createdDate: "2024-05-12",
    icdCode: "L20.9",
    cptCode: "99212",
    payer: "Cigna",
  },
  {
    id: "CLM-2024-0005",
    patientName: "Harold Pierce",
    providerName: "Dr. Sarah Chen",
    appointmentId: "APT-1045",
    visitDate: "2024-05-08",
    serviceType: "Telehealth - Psychiatry",
    claimAmount: 310.0,
    status: "Cancelled",
    createdDate: "2024-05-09",
    icdCode: "F41.1",
    cptCode: "90834",
    payer: "Humana",
  },
  {
    id: "CLM-2024-0006",
    patientName: "Priya Sharma",
    providerName: "Dr. Michael Lee",
    appointmentId: "APT-1046",
    visitDate: "2024-05-13",
    serviceType: "Telehealth - Endocrinology",
    claimAmount: 340.0,
    status: "Submitted",
    createdDate: "2024-05-13",
    icdCode: "E03.9",
    cptCode: "99215",
    payer: "Aetna",
  },
  {
    id: "CLM-2024-0007",
    patientName: "Marcus Webb",
    providerName: "Dr. Amy Foster",
    appointmentId: "APT-1047",
    visitDate: "2024-05-07",
    serviceType: "Telehealth - Neurology",
    claimAmount: 510.0,
    status: "Completed",
    createdDate: "2024-05-08",
    icdCode: "G43.909",
    cptCode: "99215",
    payer: "BlueCross BlueShield",
  },
];

const mockInvoices: Invoice[] = [
  {
    id: "INV-2024-0091",
    patientName: "James Whitmore",
    providerName: "Dr. Sarah Chen",
    appointmentId: "APT-1041",
    service: "Psychiatry Session",
    amount: 285.0,
    paidAmount: 200.0,
    balance: 85.0,
    status: "Partial",
    dueDate: "2024-06-01",
    paymentMethod: "Insurance Billing",
  },
  {
    id: "INV-2024-0092",
    patientName: "Maria Gonzalez",
    providerName: "Dr. Michael Lee",
    appointmentId: "APT-1042",
    service: "Internal Medicine Consult",
    amount: 195.0,
    paidAmount: 195.0,
    balance: 0,
    status: "Paid",
    dueDate: "2024-05-28",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV-2024-0093",
    patientName: "Robert Kline",
    providerName: "Dr. Amy Foster",
    appointmentId: "APT-1043",
    service: "Cardiology Consult",
    amount: 420.0,
    paidAmount: 0,
    balance: 420.0,
    status: "Unpaid",
    dueDate: "2024-05-25",
    paymentMethod: "Insurance Billing",
  },
  {
    id: "INV-2024-0094",
    patientName: "Tanya Brooks",
    providerName: "Dr. Kevin Liu",
    appointmentId: "APT-1044",
    service: "Dermatology Visit",
    amount: 150.0,
    paidAmount: 150.0,
    balance: 0,
    status: "Paid",
    dueDate: "2024-05-30",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV-2024-0095",
    patientName: "Harold Pierce",
    providerName: "Dr. Sarah Chen",
    appointmentId: "APT-1045",
    service: "Psychiatry Session",
    amount: 310.0,
    paidAmount: 310.0,
    balance: 0,
    status: "Refunded",
    dueDate: "2024-05-22",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV-2024-0096",
    patientName: "Priya Sharma",
    providerName: "Dr. Michael Lee",
    appointmentId: "APT-1046",
    service: "Endocrinology Consult",
    amount: 340.0,
    paidAmount: 0,
    balance: 340.0,
    status: "Unpaid",
    dueDate: "2024-06-05",
    paymentMethod: "Insurance Billing",
  },
];

const mockCharges: Charge[] = [
  {
    id: "CHG-001",
    patientName: "James Whitmore",
    cptCode: "90837",
    description: "Psychotherapy, 60 min",
    units: 1,
    chargeAmount: 285.0,
    allowedAmount: 220.0,
    date: "2024-05-10",
    provider: "Dr. Sarah Chen",
  },
  {
    id: "CHG-002",
    patientName: "Maria Gonzalez",
    cptCode: "99213",
    description: "Office Visit, Established Patient",
    units: 1,
    chargeAmount: 195.0,
    allowedAmount: 175.0,
    date: "2024-05-11",
    provider: "Dr. Michael Lee",
  },
  {
    id: "CHG-003",
    patientName: "Robert Kline",
    cptCode: "99214",
    description: "Office Visit, Moderate Complexity",
    units: 1,
    chargeAmount: 420.0,
    allowedAmount: 380.0,
    date: "2024-05-09",
    provider: "Dr. Amy Foster",
  },
  {
    id: "CHG-004",
    patientName: "Priya Sharma",
    cptCode: "99215",
    description: "Office Visit, High Complexity",
    units: 1,
    chargeAmount: 340.0,
    allowedAmount: 310.0,
    date: "2024-05-13",
    provider: "Dr. Michael Lee",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `$${n.toFixed(2)}`;

const statusColors: Record<string, string> = {
  Draft: styles.statusDraft,
  Submitted: styles.statusSubmitted,
  Processing: styles.statusProcessing,
  Completed: styles.statusCompleted,
  Cancelled: styles.statusCancelled,
  Unpaid: styles.statusUnpaid,
  Paid: styles.statusPaid,
  Partial: styles.statusPartial,
  Refunded: styles.statusRefunded,
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`${styles.badge} ${statusColors[status] || ""}`}>
    {status}
  </span>
);

// ─── Claim Status Stepper ─────────────────────────────────────────────────────

const CLAIM_STEPS: ClaimStatus[] = [
  "Draft",
  "Submitted",
  "Processing",
  "Completed",
];

const ClaimStepper = ({ status }: { status: ClaimStatus }) => {
  const currentIdx = CLAIM_STEPS.indexOf(status);
  return (
    <div className={styles.stepper}>
      {CLAIM_STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div
            className={`${styles.stepItem} ${i <= currentIdx && status !== "Cancelled" ? styles.stepActive : ""} ${i < currentIdx && status !== "Cancelled" ? styles.stepDone : ""}`}
          >
            <div className={styles.stepCircle}>
              {i < currentIdx && status !== "Cancelled" ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7l3.5 3.5L12 3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className={styles.stepLabel}>{step}</span>
          </div>
          {i < CLAIM_STEPS.length - 1 && (
            <div
              className={`${styles.stepLine} ${i < currentIdx && status !== "Cancelled" ? styles.stepLineDone : ""}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icon = {
  search: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  plus: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  eye: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  edit: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  download: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  cancel: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  submit: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  dollar: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  clock: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  check: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  file: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  alert: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  filter: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  calendar: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  close: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  payment: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  adjust: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  ),
  trend: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
};

// ─── Modals ───────────────────────────────────────────────────────────────────

interface CreateClaimModalProps {
  onClose: () => void;
}
const CreateClaimModal = ({ onClose }: CreateClaimModalProps) => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Create New Claim</h2>
            <p className={styles.modalSubtitle}>
              CMS-1500 Claim Form — Step {step} of {totalSteps}
            </p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            {Icon.close}
          </button>
        </div>
        <div className={styles.modalStepNav}>
          {["Patient", "Provider", "Diagnosis & CPT", "Summary"].map((s, i) => (
            <button
              key={s}
              className={`${styles.modalStep} ${step === i + 1 ? styles.modalStepActive : ""} ${step > i + 1 ? styles.modalStepDone : ""}`}
              onClick={() => setStep(i + 1)}
            >
              <span className={styles.modalStepNum}>
                {step > i + 1 ? "✓" : i + 1}
              </span>
              <span>{s}</span>
            </button>
          ))}
        </div>
        <div className={styles.modalBody}>
          {step === 1 && (
            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Patient Information</h3>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label>Patient Name</label>
                  <input type="text" placeholder="Full legal name" />
                </div>
                <div className={styles.formGroup}>
                  <label>Patient ID</label>
                  <input type="text" placeholder="MRN / Patient ID" />
                </div>
                {/* <div className={styles.formGroup}><label>Date of Birth</label><input type="date" /></div> */}
                <div className={styles.formGroup}>
                  <label>Gender</label>
                  <select>
                    <option>Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                {/* <div className={`${styles.formGroup} ${styles.colSpan2}`}><label>Address</label><input type="text" placeholder="Street, City, State, ZIP" /></div> */}
                {/* <div className={styles.formGroup}><label>Phone Number</label><input type="text" placeholder="(555) 000-0000" /></div> */}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Provider Information</h3>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label>Provider Name</label>
                  <input type="text" placeholder="Dr. First Last" />
                </div>
                <div className={styles.formGroup}>
                  <label>Provider ID</label>
                  <input type="text" placeholder="Internal Provider ID" />
                </div>
                <div className={styles.formGroup}>
                  <label>NPI Number</label>
                  <input type="text" placeholder="10-digit NPI" />
                </div>
                <div className={styles.formGroup}>
                  <label>Specialty</label>
                  <select>
                    <option>Select Specialty</option>
                    <option>Internal Medicine</option>
                    <option>Psychiatry</option>
                    <option>Cardiology</option>
                    <option>Dermatology</option>
                    <option>Neurology</option>
                    <option>Endocrinology</option>
                  </select>
                </div>
                <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                  <label>Facility / Organization</label>
                  <input type="text" placeholder="Facility name" />
                </div>
              </div>
            </div>
          )}
          {/* {step === 3 && (
            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Visit Details</h3>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}><label>Appointment ID</label><input type="text" placeholder="APT-XXXX" /></div>
                <div className={styles.formGroup}><label>Visit Date</label><input type="date" /></div>
                <div className={styles.formGroup}><label>Service Type</label><select><option>Select</option><option>Telehealth - Psychiatry</option><option>Telehealth - Internal Medicine</option><option>Telehealth - Cardiology</option><option>Telehealth - Dermatology</option><option>Telehealth - Neurology</option></select></div>
                <div className={styles.formGroup}><label>Place of Service</label><select><option>02 – Telehealth</option><option>11 – Office</option><option>21 – Inpatient Hospital</option></select></div>
                <div className={styles.formGroup}><label>Telemedicine Visit Type</label><select><option>Synchronous Audio/Video</option><option>Asynchronous Store-and-Forward</option><option>Audio-Only</option></select></div>
                <div className={styles.formGroup}><label>Insurance Payer</label><input type="text" placeholder="Payer name" /></div>
              </div>
            </div>
          )} */}
          {step === 3 && (
            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>
                Diagnosis Codes (ICD-10)
              </h3>
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label>Primary Diagnosis (ICD-10)</label>
                  <input type="text" placeholder="e.g. F32.1" />
                </div>
                <div className={styles.formGroup}>
                  <label>Secondary Diagnosis</label>
                  <input type="text" placeholder="e.g. E11.9 (optional)" />
                </div>
              </div>
              <h3
                className={styles.formSectionTitle}
                style={{ marginTop: "1.5rem" }}
              >
                Procedure (CPT)
              </h3>
              <div className={styles.formGrid4}>
                <div className={styles.formGroup}>
                  <label>CPT Code</label>
                  <input type="text" placeholder="e.g. 99214" />
                </div>
                {/* <div className={styles.formGroup}><label>Modifier</label><input type="text" placeholder="e.g. GT, 95" /></div> */}
                <div className={styles.formGroup}>
                  <label>Units</label>
                  <input type="number" defaultValue={1} min={1} />
                </div>
                {/* <div className={styles.formGroup}><label>Charge Amount</label><input type="number" placeholder="0.00" /></div> */}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Claim Summary</h3>
              <div className={styles.claimSummaryBox}>
                <div className={styles.summaryRow}>
                  <span>Service Date</span>
                  <strong>—</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Patient</span>
                  <strong>—</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Provider</span>
                  <strong>—</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Payer</span>
                  <strong>—</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>ICD-10 Code</span>
                  <strong>—</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>CPT Code</span>
                  <strong>—</strong>
                </div>
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total Charges</span>
                  <strong>$0.00</strong>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Notes</label>
                <textarea
                  rows={3}
                  placeholder="Additional notes for this claim..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Attachments</label>
                <div className={styles.fileUpload}>
                  <span>{Icon.file}</span>
                  <span>
                    Drop files here or <u>browse</u>
                  </span>
                  <input type="file" multiple />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnGhost} onClick={onClose}>
            Cancel
          </button>
          <div className={styles.modalFooterRight}>
            {step > 1 && (
              <button
                className={styles.btnOutline}
                onClick={() => setStep((s) => s - 1)}
              >
                ← Back
              </button>
            )}
            {step < totalSteps ? (
              <button
                className={styles.btnPrimary}
                onClick={() => setStep((s) => s + 1)}
              >
                Continue →
              </button>
            ) : (
              <>
                <button className={styles.btnOutline}>Save Draft</button>
                <button className={styles.btnSuccess}>Submit Claim</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PostPaymentModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}
const PostPaymentModal = ({ invoice, onClose }: PostPaymentModalProps) => (
  <div className={styles.modalOverlay} onClick={onClose}>
    <div
      className={`${styles.modal} ${styles.modalSm}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.modalHeader}>
        <div>
          <h2 className={styles.modalTitle}>Post Payment</h2>
          <p className={styles.modalSubtitle}>{invoice?.id}</p>
        </div>
        <button className={styles.modalClose} onClick={onClose}>
          {Icon.close}
        </button>
      </div>
      <div className={styles.modalBody}>
        <div className={styles.formGrid2}>
          <div className={styles.formGroup}>
            <label>Invoice ID</label>
            <input type="text" defaultValue={invoice?.id} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label>Patient Name</label>
            <input type="text" defaultValue={invoice?.patientName} readOnly />
          </div>
          <div className={`${styles.formGroup} ${styles.colSpan2}`}>
            <label>Payment Method</label>
            <select>
              <option>Credit Card (stored)</option>
              <option>Insurance Billing</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Amount Paid</label>
            <input
              type="number"
              placeholder="0.00"
              defaultValue={invoice?.balance}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Transaction Reference</label>
            <input type="text" placeholder="TXN-XXXX" />
          </div>
          <div className={styles.formGroup}>
            <label>Payment Date</label>
            <input type="date" />
          </div>
          <div className={`${styles.formGroup} ${styles.colSpan2}`}>
            <label>Notes</label>
            <textarea rows={2} placeholder="Optional notes..." />
          </div>
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.btnGhost} onClick={onClose}>
          Cancel
        </button>
        <button className={styles.btnSuccess} onClick={onClose}>
          Submit Payment
        </button>
      </div>
    </div>
  </div>
);

interface AdjustmentModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}
const AdjustmentModal = ({ invoice, onClose }: AdjustmentModalProps) => (
  <div className={styles.modalOverlay} onClick={onClose}>
    <div
      className={`${styles.modal} ${styles.modalSm}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.modalHeader}>
        <div>
          <h2 className={styles.modalTitle}>Apply Adjustment</h2>
          <p className={styles.modalSubtitle}>{invoice?.id}</p>
        </div>
        <button className={styles.modalClose} onClick={onClose}>
          {Icon.close}
        </button>
      </div>
      <div className={styles.modalBody}>
        <div className={styles.formGrid2}>
          <div className={styles.formGroup}>
            <label>Invoice ID</label>
            <input type="text" defaultValue={invoice?.id} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label>Current Balance</label>
            <input
              type="text"
              defaultValue={fmt(invoice?.balance || 0)}
              readOnly
            />
          </div>
          <div className={`${styles.formGroup} ${styles.colSpan2}`}>
            <label>Adjustment Type</label>
            <select>
              <option>Discount</option>
              <option>Correction</option>
              <option>Refund</option>
              <option>Write-off</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Adjustment Amount</label>
            <input type="number" placeholder="0.00" />
          </div>
          <div className={`${styles.formGroup} ${styles.colSpan2}`}>
            <label>Reason</label>
            <textarea rows={2} placeholder="Reason for adjustment..." />
          </div>
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.btnGhost} onClick={onClose}>
          Cancel
        </button>
        <button className={styles.btnWarning} onClick={onClose}>
          Apply Adjustment
        </button>
      </div>
    </div>
  </div>
);

// ─── Sub Panels ───────────────────────────────────────────────────────────────

const ClaimQueue = ({ claims }: { claims: Claim[] }) => {
  const pending = claims.filter(
    (c) => c.status === "Draft" || c.status === "Submitted",
  ).length;
  const processing = claims.filter((c) => c.status === "Processing").length;
  const completed = claims.filter((c) => c.status === "Completed").length;
  const today = claims.filter((c) => c.createdDate === "2024-05-13").length;
  return (
    <div>
      <div className={styles.queueGrid}>
        {[
          {
            label: "Pending Claims",
            value: pending,
            icon: Icon.clock,
            color: styles.queueCardYellow,
          },
          {
            label: "Processing Claims",
            value: processing,
            icon: Icon.trend,
            color: styles.queueCardBlue,
          },
          {
            label: "Completed Claims",
            value: completed,
            icon: Icon.check,
            color: styles.queueCardGreen,
          },
          {
            label: "Today's Claims",
            value: today,
            icon: Icon.file,
            color: styles.queueCardPurple,
          },
        ].map((q) => (
          <div key={q.label} className={`${styles.queueCard} ${q.color}`}>
            <div className={styles.queueIcon}>{q.icon}</div>
            <div>
              <div className={styles.queueValue}>{q.value}</div>
              <div className={styles.queueLabel}>{q.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.queueList}>
        <h3 className={styles.panelSubtitle}>Priority Queue</h3>
        {claims
          .filter((c) => c.status !== "Completed" && c.status !== "Cancelled")
          .map((c) => (
            <div key={c.id} className={styles.queueItem}>
              <div className={styles.queueItemLeft}>
                <span className={styles.queueItemId}>{c.id}</span>
                <span className={styles.queueItemPatient}>{c.patientName}</span>
              </div>
              <div className={styles.queueItemRight}>
                <span className={styles.queueItemAmt}>
                  {fmt(c.claimAmount)}
                </span>
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const StatusTracker = ({ claims }: { claims: Claim[] }) => (
  <div>
    <h3 className={styles.panelSubtitle}>Claim Status Tracker</h3>
    <div className={styles.trackerList}>
      {claims.map((c) => (
        <div key={c.id} className={styles.trackerItem}>
          <div className={styles.trackerHeader}>
            <div>
              <span className={styles.trackerClaimId}>{c.id}</span>
              <span className={styles.trackerPatient}>
                {c.patientName} — {c.serviceType}
              </span>
            </div>
            <div className={styles.trackerMeta}>
              <span>{fmt(c.claimAmount)}</span>
              {c.status === "Cancelled" && <StatusBadge status="Cancelled" />}
            </div>
          </div>
          {c.status !== "Cancelled" ? (
            <ClaimStepper status={c.status} />
          ) : (
            <div className={styles.cancelledNote}>
              This claim has been cancelled and will not be processed.
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// const EOBRemittance = () => (
//   <div>
//     <h3 className={styles.panelSubtitle}>EOB / Remittance Advice</h3>
//     <div className={styles.eobGrid}>
//       {[
//         {
//           payer: "BlueCross BlueShield",
//           eobDate: "2024-05-12",
//           claimId: "CLM-2024-0001",
//           billed: 285.0,
//           allowed: 220.0,
//           paid: 180.0,
//           adjCode: "CO-45",
//           status: "Posted",
//         },
//         {
//           payer: "Aetna",
//           eobDate: "2024-05-13",
//           claimId: "CLM-2024-0002",
//           billed: 195.0,
//           allowed: 175.0,
//           paid: 140.0,
//           adjCode: "CO-97",
//           status: "Review",
//         },
//         {
//           payer: "UnitedHealth",
//           eobDate: "2024-05-11",
//           claimId: "CLM-2024-0003",
//           billed: 420.0,
//           allowed: 380.0,
//           paid: 320.0,
//           adjCode: "—",
//           status: "Posted",
//         },
//       ].map((e) => (
//         <div key={e.claimId} className={styles.eobCard}>
//           <div className={styles.eobCardHeader}>
//             <span className={styles.eobPayer}>{e.payer}</span>
//             <StatusBadge status={e.status} />
//           </div>
//           <div className={styles.eobClaimId}>{e.claimId}</div>
//           <div className={styles.eobRow}>
//             <span>Billed</span>
//             <strong>{fmt(e.billed)}</strong>
//           </div>
//           <div className={styles.eobRow}>
//             <span>Allowed</span>
//             <strong>{fmt(e.allowed)}</strong>
//           </div>
//           <div className={styles.eobRow}>
//             <span>Paid</span>
//             <strong className={styles.eobPaid}>{fmt(e.paid)}</strong>
//           </div>
//           <div className={styles.eobRow}>
//             <span>Adj. Code</span>
//             <strong>{e.adjCode}</strong>
//           </div>
//           <div className={styles.eobRow}>
//             <span>EOB Date</span>
//             <strong>{e.eobDate}</strong>
//           </div>
//           <button className={styles.btnSmOutline}>Download EOB</button>
//         </div>
//       ))}
//     </div>
//   </div>
// );

const DenialManagement = () => (
  <div>
    <h3 className={styles.panelSubtitle}>Denial Management</h3>
    <div className={styles.denialStats}>
      {[
        {
          label: "Total Denials",
          value: 4,
          sub: "This month",
          color: "#ef4444",
        },
        {
          label: "Denial Rate",
          value: "12%",
          sub: "Avg. industry 5–10%",
          color: "#f59e0b",
        },
        {
          label: "Pending Appeals",
          value: 2,
          sub: "Requires action",
          color: "#3b82f6",
        },
        {
          label: "Recovered",
          value: "$1,240",
          sub: "Via appeals",
          color: "#10b981",
        },
      ].map((s) => (
        <div key={s.label} className={styles.denialStatCard}>
          <div className={styles.denialStatValue} style={{ color: s.color }}>
            {s.value}
          </div>
          <div className={styles.denialStatLabel}>{s.label}</div>
          <div className={styles.denialStatSub}>{s.sub}</div>
        </div>
      ))}
    </div>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Claim ID</th>
          <th>Patient</th>
          <th>Denial Reason</th>
          <th>Code</th>
          <th>Amount</th>
          <th>Appeal Due</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {[
          {
            id: "CLM-2024-0008",
            patient: "Anne Collins",
            reason: "Service Not Covered",
            code: "CO-96",
            amount: 195.0,
            due: "2024-06-01",
            status: "Denied",
          },
          {
            id: "CLM-2024-0009",
            patient: "Ben Torres",
            reason: "Authorization Required",
            code: "CO-197",
            amount: 340.0,
            due: "2024-05-30",
            status: "Appeal Filed",
          },
          {
            id: "CLM-2024-0010",
            patient: "Claire Moon",
            reason: "Duplicate Claim",
            code: "CO-18",
            amount: 150.0,
            due: "2024-06-05",
            status: "Denied",
          },
          {
            id: "CLM-2024-0011",
            patient: "Derek Shaw",
            reason: "Coding Error",
            code: "CO-4",
            amount: 285.0,
            due: "2024-05-28",
            status: "Resubmitted",
          },
        ].map((d) => (
          <tr key={d.id}>
            <td>
              <span className={styles.claimId}>{d.id}</span>
            </td>
            <td>{d.patient}</td>
            <td>{d.reason}</td>
            <td>
              <code className={styles.codeChip}>{d.code}</code>
            </td>
            <td>{fmt(d.amount)}</td>
            <td>{d.due}</td>
            <td>
              <StatusBadge status={d.status} />
            </td>
            <td>
              <div className={styles.actionGroup}>
                <button className={styles.actionBtn} title="File Appeal">
                  Appeal
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ChargesPanel = ({ charges }: { charges: Charge[] }) => (
  <div>
    <h3 className={styles.panelSubtitle}>Charge Entry</h3>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Charge ID</th>
          <th>Patient</th>
          <th>CPT Code</th>
          <th>Description</th>
          <th>Units</th>
          <th>Charge Amt</th>
          <th>Allowed Amt</th>
          <th>Variance</th>
          <th>Date</th>
          <th>Provider</th>
        </tr>
      </thead>
      <tbody>
        {charges.map((c) => (
          <tr key={c.id}>
            <td>
              <span className={styles.claimId}>{c.id}</span>
            </td>
            <td>{c.patientName}</td>
            <td>
              <code className={styles.codeChip}>{c.cptCode}</code>
            </td>
            <td>{c.description}</td>
            <td>{c.units}</td>
            <td>{fmt(c.chargeAmount)}</td>
            <td>{fmt(c.allowedAmount)}</td>
            <td
              className={
                c.chargeAmount - c.allowedAmount > 0
                  ? styles.varNeg
                  : styles.varPos
              }
            >
              {c.chargeAmount > c.allowedAmount
                ? `-${fmt(c.chargeAmount - c.allowedAmount)}`
                : `+${fmt(c.allowedAmount - c.chargeAmount)}`}
            </td>
            <td>{c.date}</td>
            <td>{c.provider}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Analytics Banner ─────────────────────────────────────────────────────────

const AnalyticsBanner = () => (
  <div className={styles.analyticsBanner}>
    {[
      {
        label: "Total Claims",
        value: "$12,480",
        sub: "This month",
        icon: Icon.file,
        accent: styles.accentBlue,
      },
      {
        label: "Collected Revenue",
        value: "$8,940",
        sub: "72% collection rate",
        icon: Icon.dollar,
        accent: styles.accentGreen,
      },
      {
        label: "Outstanding Balance",
        value: "$3,540",
        sub: "Pending collection",
        icon: Icon.alert,
        accent: styles.accentYellow,
      },
      {
        label: "Denial Rate",
        value: "12%",
        sub: "↓ 2% vs last month",
        icon: Icon.trend,
        accent: styles.accentRed,
      },
    ].map((a) => (
      <div key={a.label} className={`${styles.analyticCard} ${a.accent}`}>
        <div className={styles.analyticIcon}>{a.icon}</div>
        <div>
          <div className={styles.analyticValue}>{a.value}</div>
          <div className={styles.analyticLabel}>{a.label}</div>
          <div className={styles.analyticSub}>{a.sub}</div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BillingClaims() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("claims");
  const [claimsSubTab, setClaimsSubTab] = useState<ClaimsSubTab>("all-claims");
  const [billingSubTab, setBillingSubTab] = useState<BillingSubTab>("invoices");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("");
  const [claims] = useState<Claim[]>(mockClaims);
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [charges] = useState<Charge[]>(mockCharges);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const filteredClaims = claims.filter((c) => {
    const matchSearch =
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.providerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    
    return matchSearch && matchStatus;
  });

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(
    activeTab === "claims"
      ? filteredClaims.length / perPage
      : filteredInvoices.length / perPage,
  );

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>
            Billing <span className={styles.ampersand}>&</span> Claims
          </h1>
          <p className={styles.pageSubtitle}>
            Manage telemedicine billing and claims operations
          </p>
        </div>
        <div className={styles.headerControls}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>{Icon.search}</span>
            <input
              className={styles.searchInput}
              placeholder="Search patient, provider, ID…"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className={styles.filterWrap}>
            <span className={styles.filterIcon}>{Icon.filter}</span>
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {activeTab === "claims"
                ? [
                    "All",
                    "Draft",
                    "Submitted",
                    "Processing",
                    "Completed",
                    "Cancelled",
                  ].map((s) => <option key={s}>{s}</option>)
                : [
                    "All",
                    "Unpaid",
                    "Paid",
                    "Partial",
                    "Refunded",
                    "Cancelled",
                  ].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className={styles.filterWrap}>
            <span className={styles.filterIcon}>{Icon.calendar}</span>
            <input
              type="date"
              className={styles.filterSelect}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>
          {activeTab === "claims" && (
            <button
              className={styles.btnPrimary}
              onClick={() => {
                if (activeTab === "claims") setIsClaimModalOpen(true);
              }}
            >
              {Icon.plus}
              Create Claim
            </button>
          )}
        </div>
      </header>

      {/* Analytics Strip */}
      <AnalyticsBanner />

      {/* Main Tabs */}
      <div className={styles.mainTabs}>
        <button
          className={`${styles.mainTab} ${activeTab === "claims" ? styles.mainTabActive : ""}`}
          onClick={() => {
            setActiveTab("claims");
            setStatusFilter("All");
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Claims Management
          <span className={styles.tabBadge}>{claims.length}</span>
        </button>
        <button
          className={`${styles.mainTab} ${activeTab === "billing" ? styles.mainTabActive : ""}`}
          onClick={() => {
            setActiveTab("billing");
            setStatusFilter("All");
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          Billing Management
          <span className={styles.tabBadge}>{invoices.length}</span>
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === "claims" && (
          <>
            <div className={styles.subTabs}>
              {(
                [
                  "all-claims",
                  "claim-queue",
                  "status-tracker",
                  // "eob-remittance",
                  "denial-mgmt",
                ] as ClaimsSubTab[]
              ).map((t) => (
                <button
                  key={t}
                  className={`${styles.subTab} ${claimsSubTab === t ? styles.subTabActive : ""}`}
                  onClick={() => setClaimsSubTab(t)}
                >
                  {
                    {
                      "all-claims": "All Claims",
                      "claim-queue": "Claim Queue",
                      "status-tracker": "Status Tracker",
                      // "eob-remittance": "EOB / Remittance",
                      "denial-mgmt": "Denial Management",
                    }[t]
                  }
                </button>
              ))}
            </div>
            <div className={styles.panel}>
              {claimsSubTab === "all-claims" && (
                <>
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Claim ID</th>
                          <th>Patient Name</th>
                          <th>Provider</th>
                          <th>Appt. ID</th>
                          <th>Visit Date</th>
                          <th>Service Type</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClaims
                          .slice(
                            (currentPage - 1) * perPage,
                            currentPage * perPage,
                          )
                          .map((c) => (
                            <tr key={c.id}>
                              <td>
                                <span className={styles.claimId}>{c.id}</span>
                              </td>
                              <td>{c.patientName}</td>
                              <td>{c.providerName}</td>
                              <td>
                                <span className={styles.apptId}>
                                  {c.appointmentId}
                                </span>
                              </td>
                              <td>{c.visitDate}</td>
                              <td>
                                <span className={styles.serviceChip}>
                                  {c.serviceType}
                                </span>
                              </td>
                              <td className={styles.amount}>
                                {fmt(c.claimAmount)}
                              </td>
                              <td>
                                <StatusBadge status={c.status} />
                              </td>
                              <td>{c.createdDate}</td>
                              <td>
                                <div className={styles.actionGroup}>
                                  {/* <button
                                    className={styles.actionBtn}
                                    title="View"
                                  >
                                    {Icon.eye}
                                  </button>
                                  <button
                                    className={styles.actionBtn}
                                    title="Edit"
                                  >
                                    {Icon.edit}
                                  </button> */}
                                  <button
                                    className={styles.actionBtn}
                                    title="Submit"
                                  >
                                    Resend
                                    {Icon.submit}
                                  </button>
                                  {/* <button
                                    className={styles.actionBtn}
                                    title="Download"
                                  >
                                    {Icon.download}
                                  </button>
                                  <button
                                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                    title="Cancel"
                                  >
                                    {Icon.cancel}
                                  </button> */}
                                </div>
                              </td>
                            </tr>
                          ))}
                        {filteredClaims.length === 0 && (
                          <tr>
                            <td colSpan={10}>
                              <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                  {Icon.file}
                                </div>
                                <p>No claims found</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className={styles.pagination}>
                    <span className={styles.paginationInfo}>
                      Showing{" "}
                      {Math.min(
                        (currentPage - 1) * perPage + 1,
                        filteredClaims.length,
                      )}
                      –{Math.min(currentPage * perPage, filteredClaims.length)}{" "}
                      of {filteredClaims.length}
                    </span>
                    <div className={styles.paginationControls}>
                      <button
                        className={styles.pageBtn}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                      >
                        ‹
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.pageBtnActive : ""}`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        className={styles.pageBtn}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </>
              )}
              {claimsSubTab === "claim-queue" && <ClaimQueue claims={claims} />}
              {claimsSubTab === "status-tracker" && (
                <StatusTracker claims={claims} />
              )}
              {/* {claimsSubTab === "eob-remittance" && <EOBRemittance />} */}
              {claimsSubTab === "denial-mgmt" && <DenialManagement />}
            </div>
          </>
        )}

        {activeTab === "billing" && (
          <>
            <div className={styles.subTabs}>
              {(
                [
                  "invoices",
                  "charges",
                  "payment-posting",
                  "adjustments",
                ] as BillingSubTab[]
              ).map((t) => (
                <button
                  key={t}
                  className={`${styles.subTab} ${billingSubTab === t ? styles.subTabActive : ""}`}
                  onClick={() => setBillingSubTab(t)}
                >
                  {
                    {
                      invoices: "Invoices",
                      charges: "Charges",
                      "payment-posting": "Payment Posting",
                      adjustments: "Adjustments",
                    }[t]
                  }
                </button>
              ))}
            </div>
            <div className={styles.panel}>
              {billingSubTab === "invoices" && (
                <>
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Invoice ID</th>
                          <th>Patient Name</th>
                          <th>Provider</th>
                          <th>Appt. ID</th>
                          <th>Service</th>
                          <th>Amount</th>
                          <th>Paid</th>
                          <th>Balance</th>
                          <th>Status</th>
                          <th>Due Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvoices
                          .slice(
                            (currentPage - 1) * perPage,
                            currentPage * perPage,
                          )
                          .map((inv) => (
                            <tr key={inv.id}>
                              <td>
                                <span className={styles.claimId}>{inv.id}</span>
                              </td>
                              <td>{inv.patientName}</td>
                              <td>{inv.providerName}</td>
                              <td>
                                <span className={styles.apptId}>
                                  {inv.appointmentId}
                                </span>
                              </td>
                              <td>{inv.service}</td>
                              <td className={styles.amount}>
                                {fmt(inv.amount)}
                              </td>
                              <td className={styles.amountGreen}>
                                {fmt(inv.paidAmount)}
                              </td>
                              <td
                                className={
                                  inv.balance > 0
                                    ? styles.amountRed
                                    : styles.amountGreen
                                }
                              >
                                {fmt(inv.balance)}
                              </td>
                              <td>
                                <StatusBadge status={inv.status} />
                              </td>
                              <td>{inv.dueDate}</td>
                              <td>
                                <div className={styles.actionGroup}>
                                  <button
                                    className={styles.actionBtn}
                                    title="View"
                                  >
                                    {Icon.eye}
                                  </button>
                                  <button
                                    className={styles.actionBtn}
                                    title="Edit"
                                  >
                                    {Icon.edit}
                                  </button>
                                  <button
                                    className={styles.actionBtn}
                                    title="Post Payment"
                                    onClick={() => {
                                      setSelectedInvoice(inv);
                                      setIsPaymentModalOpen(true);
                                    }}
                                  >
                                    {Icon.payment}
                                  </button>
                                  <button
                                    className={styles.actionBtn}
                                    title="Adjustment"
                                    onClick={() => {
                                      setSelectedInvoice(inv);
                                      setIsAdjustmentModalOpen(true);
                                    }}
                                  >
                                    {Icon.adjust}
                                  </button>
                                  <button
                                    className={styles.actionBtn}
                                    title="Download"
                                  >
                                    {Icon.download}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        {filteredInvoices.length === 0 && (
                          <tr>
                            <td colSpan={11}>
                              <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                  {Icon.file}
                                </div>
                                <p>No invoices found</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className={styles.pagination}>
                    <span className={styles.paginationInfo}>
                      Showing{" "}
                      {Math.min(
                        (currentPage - 1) * perPage + 1,
                        filteredInvoices.length,
                      )}
                      –
                      {Math.min(currentPage * perPage, filteredInvoices.length)}{" "}
                      of {filteredInvoices.length}
                    </span>
                    <div className={styles.paginationControls}>
                      <button
                        className={styles.pageBtn}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                      >
                        ‹
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.pageBtnActive : ""}`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        className={styles.pageBtn}
                        disabled={
                          currentPage === totalPages || totalPages === 0
                        }
                        onClick={() => setCurrentPage((p) => p + 1)}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </>
              )}
              {billingSubTab === "charges" && (
                <ChargesPanel charges={charges} />
              )}
              {billingSubTab === "payment-posting" && (
                <div>
                  <h3 className={styles.panelSubtitle}>Payment Posting Log</h3>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Posting ID</th>
                        <th>Invoice ID</th>
                        <th>Patient</th>
                        <th>Method</th>
                        <th>Amount</th>
                        <th>Ref #</th>
                        <th>Date</th>
                        <th>Posted By</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "POST-001",
                          inv: "INV-2024-0092",
                          patient: "Maria Gonzalez",
                          method: "Credit Card",
                          amount: 195.0,
                          ref: "TXN-8821",
                          date: "2024-05-12",
                          by: "Admin",
                          status: "Posted",
                        },
                        {
                          id: "POST-002",
                          inv: "INV-2024-0094",
                          patient: "Tanya Brooks",
                          method: "Credit Card",
                          amount: 150.0,
                          ref: "TXN-8834",
                          date: "2024-05-13",
                          by: "Admin",
                          status: "Posted",
                        },
                        {
                          id: "POST-003",
                          inv: "INV-2024-0091",
                          patient: "James Whitmore",
                          method: "Insurance Billing",
                          amount: 200.0,
                          ref: "INS-4421",
                          date: "2024-05-11",
                          by: "Admin",
                          status: "Posted",
                        },
                      ].map((p) => (
                        <tr key={p.id}>
                          <td>
                            <span className={styles.claimId}>{p.id}</span>
                          </td>
                          <td>
                            <span className={styles.apptId}>{p.inv}</span>
                          </td>
                          <td>{p.patient}</td>
                          <td>
                            <span className={styles.methodChip}>
                              {p.method}
                            </span>
                          </td>
                          <td className={styles.amountGreen}>
                            {fmt(p.amount)}
                          </td>
                          <td>
                            <code className={styles.codeChip}>{p.ref}</code>
                          </td>
                          <td>{p.date}</td>
                          <td>{p.by}</td>
                          <td>
                            <StatusBadge status={p.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {billingSubTab === "adjustments" && (
                <div>
                  <h3 className={styles.panelSubtitle}>Adjustment Log</h3>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Adj. ID</th>
                        <th>Invoice ID</th>
                        <th>Patient</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Reason</th>
                        <th>Date</th>
                        <th>Applied By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "ADJ-001",
                          inv: "INV-2024-0095",
                          patient: "Harold Pierce",
                          type: "Refund",
                          amount: 310.0,
                          reason: "Cancelled appointment",
                          date: "2024-05-10",
                          by: "Admin",
                        },
                        {
                          id: "ADJ-002",
                          inv: "INV-2024-0091",
                          patient: "James Whitmore",
                          type: "Discount",
                          amount: 25.0,
                          reason: "Insurance adjustment",
                          date: "2024-05-12",
                          by: "Billing Mgr",
                        },
                        {
                          id: "ADJ-003",
                          inv: "INV-2024-0093",
                          patient: "Robert Kline",
                          type: "Write-off",
                          amount: 40.0,
                          reason: "Contractual write-off",
                          date: "2024-05-13",
                          by: "Admin",
                        },
                      ].map((a) => (
                        <tr key={a.id}>
                          <td>
                            <span className={styles.claimId}>{a.id}</span>
                          </td>
                          <td>
                            <span className={styles.apptId}>{a.inv}</span>
                          </td>
                          <td>{a.patient}</td>
                          <td>
                            <span className={styles.methodChip}>{a.type}</span>
                          </td>
                          <td className={styles.amountRed}>-{fmt(a.amount)}</td>
                          <td>{a.reason}</td>
                          <td>{a.date}</td>
                          <td>{a.by}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {isClaimModalOpen && (
        <CreateClaimModal onClose={() => setIsClaimModalOpen(false)} />
      )}
      {isPaymentModalOpen && (
        <PostPaymentModal
          invoice={selectedInvoice}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}
      {isAdjustmentModalOpen && (
        <AdjustmentModal
          invoice={selectedInvoice}
          onClose={() => setIsAdjustmentModalOpen(false)}
        />
      )}
    </div>
  );
}
