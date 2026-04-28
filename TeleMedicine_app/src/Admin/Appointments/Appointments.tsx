import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Appointments.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type AppointmentStatus = "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "No-show";
type PaymentStatus = "Paid" | "Pending" | "Refunded" | "Failed" | "Waived";
type VisitType = "Video" | "In-Person" | "Chat";

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  patientDob: string;
  patientGender: string;
  patientPhone: string;
  patientEmail: string;
  patientAddress: string;
  insuranceProvider: string;
  insuranceId: string;
  providerName: string;
  providerSpecialty: string;
  providerLicense: string;
  providerNPI: string;
  providerYears: number;
  clinicName: string;
  specialty: string;
  visitType: VisitType;
  date: string;
  time: string;
  duration: number;
  reason: string;
  notes: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  amount: number;
  insuranceCoverage: number;
  patientResponsibility: number;
  transactionId: string;
  invoiceId: string;
  paymentDate: string;
  location: string;
  timezone: string;
  meetingId: string;
  platform: string;
  sessionStatus: string;
  sessionStart: string;
  sessionEnd: string;
  recordingAvailable: boolean;
  createdAt: string;
  timeline: { time: string; event: string; icon: string }[];
}

type Tab = "all" | "today" | "upcoming" | "completed" | "cancelled";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "APT-1001", patientName: "John Doe", patientId: "PT-10023",
    patientDob: "Mar 14, 1985", patientGender: "Male",
    patientPhone: "(555) 234-5678", patientEmail: "john.doe@email.com",
    patientAddress: "1234 Maple St, Austin, TX 78701",
    insuranceProvider: "BlueCross BlueShield", insuranceId: "BCBS-887263",
    providerName: "Dr. Sarah Johnson", providerSpecialty: "Cardiology",
    providerLicense: "TX-MD-44821", providerNPI: "1234567890", providerYears: 14,
    clinicName: "Austin Heart Center",
    specialty: "Cardiology", visitType: "Video",
    date: "Apr 27, 2026", time: "10:30 AM", duration: 30,
    reason: "Chest discomfort and shortness of breath follow-up",
    notes: "Patient reported improvement since last visit. Medication adjusted.",
    status: "Scheduled", paymentStatus: "Pending",
    paymentMethod: "Insurance + Copay", amount: 250, insuranceCoverage: 200,
    patientResponsibility: 50, transactionId: "TXN-88192", invoiceId: "INV-55031",
    paymentDate: "Apr 25, 2026", location: "Virtual", timezone: "CST",
    meetingId: "MTG-9921-AA", platform: "TeleCare Pro", sessionStatus: "Pending",
    sessionStart: "—", sessionEnd: "—", recordingAvailable: false,
    createdAt: "Apr 25, 2026",
    timeline: [
      { time: "Apr 25, 2026 09:12 AM", event: "Appointment created by patient", icon: "📋" },
      { time: "Apr 25, 2026 09:14 AM", event: "Confirmation email sent to patient", icon: "📧" },
      { time: "Apr 26, 2026 08:00 AM", event: "Reminder SMS sent", icon: "📱" },
      { time: "Apr 27, 2026 10:00 AM", event: "Pre-visit check-in completed", icon: "✅" },
    ],
  },
  {
    id: "APT-1002", patientName: "Maria Garcia", patientId: "PT-10047",
    patientDob: "Jul 22, 1990", patientGender: "Female",
    patientPhone: "(555) 876-5432", patientEmail: "maria.garcia@email.com",
    patientAddress: "890 Oak Ave, Dallas, TX 75201",
    insuranceProvider: "Aetna", insuranceId: "AET-334521",
    providerName: "Dr. Michael Lee", providerSpecialty: "Endocrinology",
    providerLicense: "TX-MD-29871", providerNPI: "2345678901", providerYears: 9,
    clinicName: "Dallas Endocrine Clinic",
    specialty: "Endocrinology", visitType: "In-Person",
    date: "Apr 27, 2026", time: "02:00 PM", duration: 45,
    reason: "Diabetes management quarterly review",
    notes: "HbA1c trending down. Continue current regimen.",
    status: "In Progress", paymentStatus: "Pending",
    paymentMethod: "Insurance", amount: 320, insuranceCoverage: 320,
    patientResponsibility: 0, transactionId: "TXN-88204", invoiceId: "INV-55042",
    paymentDate: "Apr 20, 2026", location: "Dallas Clinic — Room 3B", timezone: "CST",
    meetingId: "—", platform: "In-Person", sessionStatus: "Active",
    sessionStart: "02:03 PM", sessionEnd: "—", recordingAvailable: false,
    createdAt: "Apr 20, 2026",
    timeline: [
      { time: "Apr 20, 2026 11:30 AM", event: "Appointment created via EHR integration", icon: "🔗" },
      { time: "Apr 20, 2026 11:31 AM", event: "Insurance pre-authorization approved", icon: "🛡️" },
      { time: "Apr 26, 2026 09:00 AM", event: "Reminder email sent", icon: "📧" },
      { time: "Apr 27, 2026 02:03 PM", event: "Visit started", icon: "▶️" },
    ],
  },
  {
    id: "APT-1003", patientName: "Robert Kim", patientId: "PT-10088",
    patientDob: "Nov 5, 1978", patientGender: "Male",
    patientPhone: "(555) 112-3344", patientEmail: "robert.kim@email.com",
    patientAddress: "56 Pine Rd, Houston, TX 77001",
    insuranceProvider: "UnitedHealthcare", insuranceId: "UHC-776321",
    providerName: "Dr. Emily Chen", providerSpecialty: "Dermatology",
    providerLicense: "TX-MD-61234", providerNPI: "3456789012", providerYears: 11,
    clinicName: "Houston Skin & Health",
    specialty: "Dermatology", visitType: "Video",
    date: "Apr 26, 2026", time: "09:00 AM", duration: 20,
    reason: "Rash evaluation — recurring psoriasis",
    notes: "Prescribed topical corticosteroid. Follow up in 6 weeks.",
    status: "Completed", paymentStatus: "Paid",
    paymentMethod: "Credit Card", amount: 150, insuranceCoverage: 0,
    patientResponsibility: 150, transactionId: "TXN-87999", invoiceId: "INV-55011",
    paymentDate: "Apr 26, 2026", location: "Virtual", timezone: "CST",
    meetingId: "MTG-8810-BB", platform: "TeleCare Pro", sessionStatus: "Ended",
    sessionStart: "09:01 AM", sessionEnd: "09:22 AM", recordingAvailable: true,
    createdAt: "Apr 24, 2026",
    timeline: [
      { time: "Apr 24, 2026 03:00 PM", event: "Appointment created by provider", icon: "👨‍⚕️" },
      { time: "Apr 25, 2026 08:00 AM", event: "Reminder email sent", icon: "📧" },
      { time: "Apr 26, 2026 09:01 AM", event: "Visit started", icon: "▶️" },
      { time: "Apr 26, 2026 09:22 AM", event: "Visit completed", icon: "✅" },
      { time: "Apr 26, 2026 09:25 AM", event: "Payment processed — $150.00", icon: "💳" },
      { time: "Apr 26, 2026 09:26 AM", event: "Visit summary sent to patient", icon: "📄" },
    ],
  },
  {
    id: "APT-1004", patientName: "Anna Chen", patientId: "PT-10104",
    patientDob: "Feb 18, 2000", patientGender: "Female",
    patientPhone: "(555) 443-9900", patientEmail: "anna.chen@email.com",
    patientAddress: "321 Birch Blvd, San Antonio, TX 78201",
    insuranceProvider: "Cigna", insuranceId: "CGN-219087",
    providerName: "Dr. James Ortiz", providerSpecialty: "General Practice",
    providerLicense: "TX-MD-55021", providerNPI: "4567890123", providerYears: 7,
    clinicName: "MedFirst San Antonio",
    specialty: "General Practice", visitType: "Video",
    date: "Apr 25, 2026", time: "11:00 AM", duration: 15,
    reason: "Annual wellness check",
    notes: "Patient did not answer call. Voicemail left.",
    status: "No-show", paymentStatus: "Waived",
    paymentMethod: "Insurance", amount: 100, insuranceCoverage: 100,
    patientResponsibility: 0, transactionId: "—", invoiceId: "INV-55060",
    paymentDate: "—", location: "Virtual", timezone: "CST",
    meetingId: "—", platform: "TeleCare Pro", sessionStatus: "No-show",
    sessionStart: "—", sessionEnd: "—", recordingAvailable: false,
    createdAt: "Apr 22, 2026",
    timeline: [
      { time: "Apr 22, 2026 10:00 AM", event: "Appointment created by external scheduling", icon: "📅" },
      { time: "Apr 24, 2026 09:00 AM", event: "Reminder SMS sent", icon: "📱" },
      { time: "Apr 25, 2026 11:00 AM", event: "No-show recorded — patient unreachable", icon: "⚠️" },
    ],
  },
  {
    id: "APT-1005", patientName: "David Thompson", patientId: "PT-10120",
    patientDob: "Sep 30, 1965", patientGender: "Male",
    patientPhone: "(555) 667-2211", patientEmail: "david.t@email.com",
    patientAddress: "789 Cedar Lane, Fort Worth, TX 76101",
    insuranceProvider: "Humana", insuranceId: "HUM-445672",
    providerName: "Dr. Sarah Johnson", providerSpecialty: "Cardiology",
    providerLicense: "TX-MD-44821", providerNPI: "1234567890", providerYears: 14,
    clinicName: "Austin Heart Center",
    specialty: "Cardiology", visitType: "Video",
    date: "Apr 29, 2026", time: "03:30 PM", duration: 45,
    reason: "Post-surgery cardiac monitoring — 30-day follow-up",
    notes: "",
    status: "Scheduled", paymentStatus: "Pending",
    paymentMethod: "Insurance + Copay", amount: 400, insuranceCoverage: 350,
    patientResponsibility: 50, transactionId: "—", invoiceId: "INV-55088",
    paymentDate: "—", location: "Virtual", timezone: "CST",
    meetingId: "MTG-1022-CC", platform: "TeleCare Pro", sessionStatus: "Pending",
    sessionStart: "—", sessionEnd: "—", recordingAvailable: false,
    createdAt: "Apr 27, 2026",
    timeline: [
      { time: "Apr 27, 2026 07:15 AM", event: "Appointment created via EHR integration", icon: "🔗" },
      { time: "Apr 27, 2026 07:16 AM", event: "Confirmation email sent", icon: "📧" },
    ],
  },
  {
    id: "APT-1006", patientName: "Lisa Nguyen", patientId: "PT-10133",
    patientDob: "May 11, 1992", patientGender: "Female",
    patientPhone: "(555) 334-5566", patientEmail: "lisa.nguyen@email.com",
    patientAddress: "100 Willow Way, El Paso, TX 79901",
    insuranceProvider: "Molina Healthcare", insuranceId: "MOL-993412",
    providerName: "Dr. Aisha Williams", providerSpecialty: "Psychiatry",
    providerLicense: "TX-MD-78234", providerNPI: "5678901234", providerYears: 12,
    clinicName: "El Paso Mental Health Center",
    specialty: "Psychiatry", visitType: "Video",
    date: "Apr 28, 2026", time: "01:00 PM", duration: 60,
    reason: "Anxiety and depression follow-up",
    notes: "Patient has been responding well to CBT sessions.",
    status: "Scheduled", paymentStatus: "Pending",
    paymentMethod: "Insurance", amount: 280, insuranceCoverage: 280,
    patientResponsibility: 0, transactionId: "—", invoiceId: "INV-55099",
    paymentDate: "—", location: "Virtual", timezone: "MST",
    meetingId: "MTG-7743-DD", platform: "TeleCare Pro", sessionStatus: "Pending",
    sessionStart: "—", sessionEnd: "—", recordingAvailable: false,
    createdAt: "Apr 26, 2026",
    timeline: [
      { time: "Apr 26, 2026 02:00 PM", event: "Appointment created by patient", icon: "📋" },
      { time: "Apr 26, 2026 02:02 PM", event: "Confirmation sent", icon: "📧" },
      { time: "Apr 27, 2026 08:00 AM", event: "Reminder SMS sent", icon: "📱" },
    ],
  },
  {
    id: "APT-1007", patientName: "Samuel Brooks", patientId: "PT-10155",
    patientDob: "Jan 3, 1950", patientGender: "Male",
    patientPhone: "(555) 789-0011", patientEmail: "s.brooks@email.com",
    patientAddress: "555 Elm Drive, Lubbock, TX 79401",
    insuranceProvider: "Medicare", insuranceId: "MCR-112233",
    providerName: "Dr. Rachel Moore", providerSpecialty: "Orthopedics",
    providerLicense: "TX-MD-33219", providerNPI: "6789012345", providerYears: 20,
    clinicName: "Lubbock Ortho & Spine",
    specialty: "Orthopedics", visitType: "In-Person",
    date: "Apr 23, 2026", time: "08:30 AM", duration: 60,
    reason: "Pre-operative consultation — left knee replacement",
    notes: "Surgery scheduled for May 15. Labs ordered.",
    status: "Cancelled", paymentStatus: "Waived",
    paymentMethod: "Medicare", amount: 0, insuranceCoverage: 0,
    patientResponsibility: 0, transactionId: "TXN-87888", invoiceId: "INV-54990",
    paymentDate: "Apr 23, 2026", location: "Lubbock Ortho — Suite 201", timezone: "CST",
    meetingId: "—", platform: "In-Person", sessionStatus: "Cancelled",
    sessionStart: "—", sessionEnd: "—", recordingAvailable: false,
    createdAt: "Apr 18, 2026",
    timeline: [
      { time: "Apr 18, 2026 10:00 AM", event: "Appointment created by provider", icon: "👨‍⚕️" },
      { time: "Apr 22, 2026 09:00 AM", event: "Cancellation requested by patient", icon: "❌" },
      { time: "Apr 22, 2026 09:05 AM", event: "Appointment cancelled", icon: "🚫" },
      { time: "Apr 22, 2026 09:10 AM", event: "Refund issued", icon: "💰" },
    ],
  },
  {
    id: "APT-1008", patientName: "Angela Foster", patientId: "PT-10178",
    patientDob: "Aug 29, 1988", patientGender: "Female",
    patientPhone: "(555) 210-4455", patientEmail: "angela.f@email.com",
    patientAddress: "72 Spruce Ct, Corpus Christi, TX 78401",
    insuranceProvider: "Oscar Health", insuranceId: "OSC-667891",
    providerName: "Dr. Michael Lee", providerSpecialty: "Endocrinology",
    providerLicense: "TX-MD-29871", providerNPI: "2345678901", providerYears: 9,
    clinicName: "Dallas Endocrine Clinic",
    specialty: "Endocrinology", visitType: "Chat",
    date: "Apr 30, 2026", time: "11:30 AM", duration: 20,
    reason: "Thyroid medication dosage adjustment",
    notes: "Recent labs faxed over — TSH slightly elevated.",
    status: "Scheduled", paymentStatus: "Pending",
    paymentMethod: "Credit Card", amount: 120, insuranceCoverage: 0,
    patientResponsibility: 120, transactionId: "TXN-88301", invoiceId: "INV-55110",
    paymentDate: "Apr 27, 2026", location: "Virtual", timezone: "CST",
    meetingId: "MTG-5500-EE", platform: "TeleCare Chat", sessionStatus: "Pending",
    sessionStart: "—", sessionEnd: "—", recordingAvailable: false,
    createdAt: "Apr 27, 2026",
    timeline: [
      { time: "Apr 27, 2026 10:45 AM", event: "Appointment created by patient", icon: "📋" },
      { time: "Apr 27, 2026 10:46 AM", event: "Payment processed — $120.00", icon: "💳" },
      { time: "Apr 27, 2026 10:47 AM", event: "Confirmation email sent", icon: "📧" },
    ],
  },
];

const PROVIDERS = ["Dr. Sarah Johnson", "Dr. Michael Lee", "Dr. Emily Chen", "Dr. James Ortiz", "Dr. Aisha Williams", "Dr. Rachel Moore"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TODAY = "Apr 27, 2026";
const UPCOMING_DATES = ["Apr 28, 2026", "Apr 29, 2026", "Apr 30, 2026"];

function statusClass(status: AppointmentStatus, s: typeof styles): string {
  const map: Record<AppointmentStatus, string> = {
    "Scheduled": s.statusScheduled,
    "In Progress": s.statusInProgress,
    "Completed": s.statusCompleted,
    "Cancelled": s.statusCancelled,
    "No-show": s.statusNoShow,
  };
  return map[status] ?? "";
}
function paymentClass(p: PaymentStatus, s: typeof styles): string {
  const map: Record<PaymentStatus, string> = {
    Paid: s.payPaid, Pending: s.payPending, Refunded: s.payRefunded,
    Failed: s.payFailed, Waived: s.payWaived,
  };
  return map[p] ?? "";
}
function visitTypeIcon(t: VisitType): string {
  return { Video: "🎥", "In-Person": "🏥", Chat: "💬" }[t] ?? "🩺";
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps { title: string; onClose: () => void; children: React.ReactNode; }
const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);
  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modalBox} ref={ref} tabIndex={-1}>
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>{title}</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

interface ConfirmProps { message: string; onConfirm: () => void; onCancel: () => void; confirmLabel?: string; danger?: boolean; }
const ConfirmDialog: React.FC<ConfirmProps> = ({ message, onConfirm, onCancel, confirmLabel = "Confirm", danger }) => (
  <div className={styles.modalOverlay} role="alertdialog" aria-modal="true">
    <div className={styles.confirmBox}>
      <p className={styles.confirmMsg}>{message}</p>
      <div className={styles.confirmActions}>
        <button className={styles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button className={danger ? styles.btnDanger : styles.btnPrimary} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

// ─── Success Toast ─────────────────────────────────────────────────────────────

interface ToastProps { message: string; }
const Toast: React.FC<ToastProps> = ({ message }) => (
  <div className={styles.toast} role="status" aria-live="polite">
    <span className={styles.toastIcon}>✓</span> {message}
  </div>
);

// ─── Appointment Details View ─────────────────────────────────────────────────

interface DetailsProps {
  apt: Appointment;
  onBack: () => void;
  onUpdate: (updated: Appointment) => void;
  showToast: (msg: string) => void;
}

const AppointmentDetailsView: React.FC<DetailsProps> = ({ apt, onBack, onUpdate, showToast }) => {
  const [current, setCurrent] = useState<Appointment>(apt);
  const [modal, setModal] = useState<null | "edit" | "reschedule" | "assign" | "refund-confirm" | "cancel-confirm" | "reminder-confirm" | "startvisit-confirm" | "complete-confirm">(null);
  const [editForm, setEditForm] = useState({ provider: current.providerName, date: current.date, time: current.time, visitType: current.visitType as VisitType, duration: current.duration, notes: current.notes });
  const [reschedForm, setReschedForm] = useState({ date: "", time: "" });
  const [assignProvider, setAssignProvider] = useState(current.providerName);

  const update = (patch: Partial<Appointment>) => {
    const updated = { ...current, ...patch };
    setCurrent(updated);
    onUpdate(updated);
  };

  const closeModal = () => setModal(null);

  const handleEditSave = () => {
    update({ providerName: editForm.provider, date: editForm.date, time: editForm.time, visitType: editForm.visitType, duration: editForm.duration, notes: editForm.notes });
    closeModal(); showToast("Appointment updated successfully.");
  };
  const handleReschedSave = () => {
    if (!reschedForm.date || !reschedForm.time) return;
    update({ date: reschedForm.date, time: reschedForm.time, status: "Scheduled" });
    closeModal(); showToast("Appointment rescheduled.");
  };
  const handleAssignSave = () => {
    update({ providerName: assignProvider });
    closeModal(); showToast("Provider assigned successfully.");
  };
  const handleCancel = () => { update({ status: "Cancelled" }); closeModal(); showToast("Appointment cancelled."); };
  const handleStart = () => { update({ status: "In Progress", sessionStart: new Date().toLocaleTimeString() }); closeModal(); showToast("Visit started."); };
  const handleComplete = () => {
    const end = new Date().toLocaleTimeString();
    update({ status: "Completed", sessionEnd: end, sessionStatus: "Ended" });
    const newEntry = { time: new Date().toLocaleString(), event: "Visit completed", icon: "✅" };
    update({ status: "Completed", sessionEnd: end, sessionStatus: "Ended", timeline: [...current.timeline, newEntry] });
    closeModal(); showToast("Visit marked as completed.");
  };
  const handleRefund = () => { update({ paymentStatus: "Refunded" }); closeModal(); showToast("Refund issued successfully."); };
  const handleReminder = () => { closeModal(); showToast("Reminder sent to patient."); };
  const handleDownload = () => {
    const content = `APPOINTMENT SUMMARY\n\nID: ${current.id}\nPatient: ${current.patientName}\nProvider: ${current.providerName}\nDate: ${current.date} ${current.time}\nStatus: ${current.status}\nPayment: ${current.paymentStatus}\nReason: ${current.reason}`;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `appointment_summary_${current.id}.txt`;
    a.click();
    showToast("Summary downloaded.");
  };

  return (
    <div className={styles.detailsRoot}>
      {/* Header */}
      <div className={styles.detailsHeader}>
        <div className={styles.detailsHeaderLeft}>
          <button className={styles.backBtn} onClick={onBack} aria-label="Back to appointments">
            <span className={styles.backArrow}>←</span> Back to Appointments
          </button>
          <div className={styles.detailsTitle}>
            <h1 className={styles.detailsHeading}>Appointment Details</h1>
            <span className={styles.detailsId}>{current.id}</span>
          </div>
        </div>
        <div className={styles.detailsHeaderBadges}>
          <span className={`${styles.statusBadge} ${statusClass(current.status, styles)}`}>{current.status}</span>
          <span className={`${styles.payBadge} ${paymentClass(current.paymentStatus, styles)}`}>{current.paymentStatus}</span>
        </div>
      </div>

      {/* Actions Panel */}
      <div className={styles.actionsPanel}>
        <p className={styles.actionsPanelLabel}>Actions</p>
        <div className={styles.actionsBtnRow}>
          {current.status === "Scheduled" && (<>  
            <button className={styles.btnAction} onClick={() => setModal("edit")}>✏️ Edit</button>
            <button className={styles.btnAction} onClick={() => setModal("reschedule")}>📅 Reschedule</button>
            <button className={`${styles.btnAction} ${styles.btnActionDanger}`} onClick={() => setModal("cancel-confirm")}>🚫 Cancel</button>
            <button className={styles.btnAction} onClick={() => setModal("assign")}>👨‍⚕️ Assign Provider</button>
            <button className={styles.btnAction} onClick={() => setModal("reminder-confirm")}>📨 Send Reminder</button>
            <button className={`${styles.btnAction} ${styles.btnActionSuccess}`} onClick={() => setModal("startvisit-confirm")}>▶️ Start Visit</button>
          </>)}
          {current.status === "In Progress" && (
            <button className={`${styles.btnAction} ${styles.btnActionSuccess}`} onClick={() => setModal("complete-confirm")}>✅ Complete Visit</button>
          )}
          {current.status === "Completed" && (<>
            <button className={styles.btnAction} onClick={handleDownload}>⬇️ Download Summary</button>
            <button className={`${styles.btnAction} ${styles.btnActionDanger}`} onClick={() => setModal("refund-confirm")}>💰 Refund</button>
          </>)}
          {(current.status === "Cancelled" || current.status === "No-show") && (
            <button className={styles.btnAction} onClick={() => setModal("reschedule")}>📅 Reschedule</button>
          )}
        </div>
      </div>

      <div className={styles.detailsGrid}>
        {/* Summary Card */}
        <section className={`${styles.detailsCard} ${styles.cardSummary}`} aria-label="Appointment Summary">
          <h2 className={styles.cardTitle}>Appointment Summary</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}><span className={styles.summaryLabel}>ID</span><span className={styles.summaryValue}>{current.id}</span></div>
            <div className={styles.summaryItem}><span className={styles.summaryLabel}>Patient</span><span className={styles.summaryValue}>{current.patientName}</span></div>
            <div className={styles.summaryItem}><span className={styles.summaryLabel}>Provider</span><span className={styles.summaryValue}>{current.providerName}</span></div>
            <div className={styles.summaryItem}><span className={styles.summaryLabel}>Date</span><span className={styles.summaryValue}>{current.date}</span></div>
            <div className={styles.summaryItem}><span className={styles.summaryLabel}>Time</span><span className={styles.summaryValue}>{current.time}</span></div>
            <div className={styles.summaryItem}><span className={styles.summaryLabel}>Visit Type</span><span className={styles.summaryValue}>{visitTypeIcon(current.visitType)} {current.visitType}</span></div>
            <div className={styles.summaryItem}><span className={styles.summaryLabel}>Status</span><span className={`${styles.statusBadge} ${statusClass(current.status, styles)}`}>{current.status}</span></div>
            <div className={styles.summaryItem}><span className={styles.summaryLabel}>Payment</span><span className={`${styles.payBadge} ${paymentClass(current.paymentStatus, styles)}`}>{current.paymentStatus}</span></div>
            <div className={styles.summaryItem}><span className={styles.summaryLabel}>Location</span><span className={styles.summaryValue}>{current.location}</span></div>
          </div>
        </section>

        {/* Patient Info */}
        <section className={styles.detailsCard} aria-label="Patient Information">
          <h2 className={styles.cardTitle}>Patient Information</h2>
          <dl className={styles.infoList}>
            <div className={styles.infoRow}><dt>Name</dt><dd>{current.patientName}</dd></div>
            <div className={styles.infoRow}><dt>Patient ID</dt><dd>{current.patientId}</dd></div>
            <div className={styles.infoRow}><dt>Date of Birth</dt><dd>{current.patientDob}</dd></div>
            <div className={styles.infoRow}><dt>Gender</dt><dd>{current.patientGender}</dd></div>
            <div className={styles.infoRow}><dt>Phone</dt><dd>{current.patientPhone}</dd></div>
            <div className={styles.infoRow}><dt>Email</dt><dd>{current.patientEmail}</dd></div>
            <div className={styles.infoRow}><dt>Address</dt><dd>{current.patientAddress}</dd></div>
            <div className={styles.infoRow}><dt>Insurance Provider</dt><dd>{current.insuranceProvider}</dd></div>
            <div className={styles.infoRow}><dt>Insurance ID</dt><dd>{current.insuranceId}</dd></div>
          </dl>
        </section>

        {/* Provider Info */}
        <section className={styles.detailsCard} aria-label="Provider Information">
          <h2 className={styles.cardTitle}>Provider Information</h2>
          <dl className={styles.infoList}>
            <div className={styles.infoRow}><dt>Name</dt><dd>{current.providerName}</dd></div>
            <div className={styles.infoRow}><dt>Specialty</dt><dd>{current.providerSpecialty}</dd></div>
            <div className={styles.infoRow}><dt>License Number</dt><dd>{current.providerLicense}</dd></div>
            <div className={styles.infoRow}><dt>NPI Number</dt><dd>{current.providerNPI}</dd></div>
            <div className={styles.infoRow}><dt>Years of Experience</dt><dd>{current.providerYears} years</dd></div>
            <div className={styles.infoRow}><dt>Clinic Name</dt><dd>{current.clinicName}</dd></div>
          </dl>
        </section>

        {/* Appointment Details */}
        <section className={styles.detailsCard} aria-label="Appointment Details">
          <h2 className={styles.cardTitle}>Appointment Details</h2>
          <dl className={styles.infoList}>
            <div className={styles.infoRow}><dt>Visit Type</dt><dd>{visitTypeIcon(current.visitType)} {current.visitType}</dd></div>
            <div className={styles.infoRow}><dt>Date</dt><dd>{current.date}</dd></div>
            <div className={styles.infoRow}><dt>Time</dt><dd>{current.time}</dd></div>
            <div className={styles.infoRow}><dt>Duration</dt><dd>{current.duration} min</dd></div>
            <div className={styles.infoRow}><dt>Reason for Visit</dt><dd>{current.reason}</dd></div>
            <div className={styles.infoRow}><dt>Notes</dt><dd>{current.notes || "—"}</dd></div>
            <div className={styles.infoRow}><dt>Status</dt><dd><span className={`${styles.statusBadge} ${statusClass(current.status, styles)}`}>{current.status}</span></dd></div>
            <div className={styles.infoRow}><dt>Location</dt><dd>{current.location}</dd></div>
            <div className={styles.infoRow}><dt>Timezone</dt><dd>{current.timezone}</dd></div>
          </dl>
        </section>

        {/* Visit Info */}
        <section className={styles.detailsCard} aria-label="Visit Information">
          <h2 className={styles.cardTitle}>Visit Information</h2>
          <dl className={styles.infoList}>
            <div className={styles.infoRow}><dt>Meeting ID</dt><dd>{current.meetingId}</dd></div>
            <div className={styles.infoRow}><dt>Platform</dt><dd>{current.platform}</dd></div>
            <div className={styles.infoRow}><dt>Session Status</dt><dd>{current.sessionStatus}</dd></div>
            <div className={styles.infoRow}><dt>Start Time</dt><dd>{current.sessionStart}</dd></div>
            <div className={styles.infoRow}><dt>End Time</dt><dd>{current.sessionEnd}</dd></div>
            <div className={styles.infoRow}><dt>Recording Available</dt><dd>{current.recordingAvailable ? "Yes" : "No"}</dd></div>
          </dl>
        </section>

        {/* Payment Info */}
        <section className={styles.detailsCard} aria-label="Payment Information">
          <h2 className={styles.cardTitle}>Payment Information</h2>
          <dl className={styles.infoList}>
            <div className={styles.infoRow}><dt>Payment Status</dt><dd><span className={`${styles.payBadge} ${paymentClass(current.paymentStatus, styles)}`}>{current.paymentStatus}</span></dd></div>
            <div className={styles.infoRow}><dt>Payment Method</dt><dd>{current.paymentMethod}</dd></div>
            <div className={styles.infoRow}><dt>Total Amount</dt><dd>${current.amount.toFixed(2)}</dd></div>
            <div className={styles.infoRow}><dt>Insurance Coverage</dt><dd>${current.insuranceCoverage.toFixed(2)}</dd></div>
            <div className={styles.infoRow}><dt>Patient Responsibility</dt><dd>${current.patientResponsibility.toFixed(2)}</dd></div>
            <div className={styles.infoRow}><dt>Transaction ID</dt><dd>{current.transactionId}</dd></div>
            <div className={styles.infoRow}><dt>Invoice ID</dt><dd>{current.invoiceId}</dd></div>
            <div className={styles.infoRow}><dt>Payment Date</dt><dd>{current.paymentDate}</dd></div>
          </dl>
        </section>

        {/* Timeline */}
        <section className={`${styles.detailsCard}`} aria-label="Activity Timeline">
          <h2 className={styles.cardTitle}>Activity Timeline</h2>
          <ol className={styles.timeline}>
            {current.timeline.map((entry, i) => (
              <li key={i} className={styles.timelineItem}>
                <div className={styles.timelineDot}>{entry.icon}</div>
                <div className={styles.timelineContent}>
                  <span className={styles.timelineEvent}>{entry.event}</span>
                  <span className={styles.timelineTime}>{entry.time}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Modals */}
      {modal === "edit" && (
        <Modal title="Edit Appointment" onClose={closeModal}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Provider</label>
            <select className={styles.formSelect} value={editForm.provider} onChange={e => setEditForm(f => ({ ...f, provider: e.target.value }))}>
              {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Date</label>
              <input className={styles.formInput} type="text" value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Time</label>
              <input className={styles.formInput} type="text" value={editForm.time} onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Visit Type</label>
              <select className={styles.formSelect} value={editForm.visitType} onChange={e => setEditForm(f => ({ ...f, visitType: e.target.value as VisitType }))}>
                {(["Video","In-Person","Chat"] as VisitType[]).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Duration (min)</label>
              <input className={styles.formInput} type="number" value={editForm.duration} onChange={e => setEditForm(f => ({ ...f, duration: +e.target.value }))} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Notes</label>
            <textarea className={styles.formTextarea} value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} rows={3} />
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.btnSecondary} onClick={closeModal}>Cancel</button>
            <button className={styles.btnPrimary} onClick={handleEditSave}>Save Changes</button>
          </div>
        </Modal>
      )}
      {modal === "reschedule" && (
        <Modal title="Reschedule Appointment" onClose={closeModal}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>New Date</label>
              <input className={styles.formInput} type="text" placeholder="e.g. May 5, 2026" value={reschedForm.date} onChange={e => setReschedForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>New Time</label>
              <input className={styles.formInput} type="text" placeholder="e.g. 2:00 PM" value={reschedForm.time} onChange={e => setReschedForm(f => ({ ...f, time: e.target.value }))} />
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.btnSecondary} onClick={closeModal}>Cancel</button>
            <button className={styles.btnPrimary} onClick={handleReschedSave}>Reschedule</button>
          </div>
        </Modal>
      )}
      {modal === "assign" && (
        <Modal title="Assign Provider" onClose={closeModal}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Select Provider</label>
            <select className={styles.formSelect} value={assignProvider} onChange={e => setAssignProvider(e.target.value)}>
              {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.btnSecondary} onClick={closeModal}>Cancel</button>
            <button className={styles.btnPrimary} onClick={handleAssignSave}>Assign</button>
          </div>
        </Modal>
      )}
      {modal === "cancel-confirm" && <ConfirmDialog message={`Cancel appointment ${current.id} for ${current.patientName}? This action cannot be undone.`} onConfirm={handleCancel} onCancel={closeModal} confirmLabel="Cancel Appointment" danger />}
      {modal === "reminder-confirm" && <ConfirmDialog message={`Send a reminder to ${current.patientName} for their appointment on ${current.date} at ${current.time}?`} onConfirm={handleReminder} onCancel={closeModal} confirmLabel="Send Reminder" />}
      {modal === "startvisit-confirm" && <ConfirmDialog message={`Start the visit for ${current.patientName} (${current.id})?`} onConfirm={handleStart} onCancel={closeModal} confirmLabel="Start Visit" />}
      {modal === "complete-confirm" && <ConfirmDialog message={`Mark this visit as completed for ${current.patientName}?`} onConfirm={handleComplete} onCancel={closeModal} confirmLabel="Complete Visit" />}
      {modal === "refund-confirm" && <ConfirmDialog message={`Issue a refund for appointment ${current.id}? This will update payment status to Refunded.`} onConfirm={handleRefund} onCancel={closeModal} confirmLabel="Issue Refund" danger />}
    </div>
  );
};

// ─── Main Appointments Component ──────────────────────────────────────────────

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterVisitType, setFilterVisitType] = useState("");
  const [filterProvider, setFilterProvider] = useState("");
  //const [filterDateRange, setFilterDateRange] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showBulkCancelConfirm, setShowBulkCancelConfirm] = useState(false);
  const [showBulkReminderConfirm, setShowBulkReminderConfirm] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleUpdate = useCallback((updated: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
    if (selectedAppointment?.id === updated.id) setSelectedAppointment(updated);
  }, [selectedAppointment]);

  const handleRowClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowDetailsView(true);
  };

  const handleViewClick = (e: React.MouseEvent, apt: Appointment) => {
    e.stopPropagation();
    setSelectedAppointment(apt);
    setShowDetailsView(true);
  };

  const handleBack = () => {
    setShowDetailsView(false);
    setSelectedAppointment(null);
  };

  // Filtering
  const filtered = appointments.filter(apt => {
    if (activeTab === "today" && apt.date !== TODAY) return false;
    if (activeTab === "upcoming" && !UPCOMING_DATES.includes(apt.date)) return false;
    if (activeTab === "completed" && apt.status !== "Completed") return false;
    if (activeTab === "cancelled" && apt.status !== "Cancelled" && apt.status !== "No-show") return false;
    if (filterStatus && apt.status !== filterStatus) return false;
    if (filterVisitType && apt.visitType !== filterVisitType) return false;
    if (filterProvider && apt.providerName !== filterProvider) return false;
    if (filterLocation && !apt.location.toLowerCase().includes(filterLocation.toLowerCase())) return false;
    if (search) {
      const q = search.toLowerCase();
      return apt.patientName.toLowerCase().includes(q) || apt.providerName.toLowerCase().includes(q) ||
        apt.id.toLowerCase().includes(q) || apt.patientPhone.includes(q) || apt.patientEmail.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const toggleRow = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const next = new Set(selectedRows);
    e.target.checked ? next.add(id) : next.delete(id);
    setSelectedRows(next);
  };
  const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedRows(new Set(paginated.map(a => a.id)));
    else setSelectedRows(new Set());
  };

  const exportCSV = (rows: Appointment[], filename: string) => {
    const headers = ["ID", "Patient", "Provider", "Specialty", "Visit Type", "Date", "Time", "Duration", "Status", "Payment Status", "Location", "Created At"];
    const csv = [headers.join(","), ...rows.map(a => [a.id, a.patientName, a.providerName, a.specialty, a.visitType, a.date, a.time, a.duration, a.status, a.paymentStatus, a.location, a.createdAt].join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    showToast("Export complete.");
  };

  const handleBulkCancel = () => {
    setAppointments(prev => prev.map(a => selectedRows.has(a.id) ? { ...a, status: "Cancelled" as AppointmentStatus } : a));
    setSelectedRows(new Set()); setShowBulkCancelConfirm(false); showToast(`${selectedRows.size} appointment(s) cancelled.`);
  };
  const handleBulkReminder = () => {
    setShowBulkReminderConfirm(false); showToast(`Reminders sent to ${selectedRows.size} patient(s).`);
  };

  const tabCounts = {
    all: appointments.length,
    today: appointments.filter(a => a.date === TODAY).length,
    upcoming: appointments.filter(a => UPCOMING_DATES.includes(a.date)).length,
    completed: appointments.filter(a => a.status === "Completed").length,
    cancelled: appointments.filter(a => a.status === "Cancelled" || a.status === "No-show").length,
  };

  if (showDetailsView && selectedAppointment) {
    return (
      <div className={styles.page}>
        {toast && <Toast message={toast} />}
        <AppointmentDetailsView
          apt={appointments.find(a => a.id === selectedAppointment.id) || selectedAppointment}
          onBack={handleBack}
          onUpdate={handleUpdate}
          showToast={showToast}
        />
        {showBulkCancelConfirm && <ConfirmDialog message={`Cancel ${selectedRows.size} selected appointment(s)?`} onConfirm={handleBulkCancel} onCancel={() => setShowBulkCancelConfirm(false)} confirmLabel="Cancel Appointments" danger />}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {toast && <Toast message={toast} />}

      {/* Top Controls */}
      <div className={styles.topBar}>
        <div className={styles.pageTitleRow}>
          <div>
            <h1 className={styles.pageTitle}>Appointments</h1>
            <p className={styles.pageSubtitle}>Monitor and manage all patient appointments across the platform.</p>
          </div>
          <button className={styles.btnExport} onClick={() => exportCSV(filtered, "appointments_export.csv")} aria-label="Export appointments">
            ⬇️ Export
          </button>
        </div>
        <div className={styles.controlsRow}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Search by patient, provider, ID, phone, or email..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              aria-label="Search appointments"
            />
          </div>
          <div className={styles.filtersRow}>
            <select className={styles.filterSelect} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} aria-label="Filter by status">
              <option value="">All Statuses</option>
              {["Scheduled","In Progress","Completed","Cancelled","No-show"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className={styles.filterSelect} value={filterVisitType} onChange={e => { setFilterVisitType(e.target.value); setCurrentPage(1); }} aria-label="Filter by visit type">
              <option value="">All Visit Types</option>
              {["Video","In-Person","Chat"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select className={styles.filterSelect} value={filterProvider} onChange={e => { setFilterProvider(e.target.value); setCurrentPage(1); }} aria-label="Filter by provider">
              <option value="">All Providers</option>
              {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select className={styles.filterSelect} value={filterLocation} onChange={e => { setFilterLocation(e.target.value); setCurrentPage(1); }} aria-label="Filter by location">
              <option value="">All Locations</option>
              <option value="Virtual">Virtual</option>
              <option value="Dallas Clinic — Room 3B">Dallas Clinic — Room 3B</option>
              <option value="Lubbock Ortho — Suite 201">Lubbock Ortho — Suite 201</option>
              {/* <option value="Phone">Phone</option> */}
              {/* <option value="In-Person">In-Person</option> */}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs} role="tablist" aria-label="Appointment tabs">
        {([["all","All Appointments"],["today","Today"],["upcoming","Upcoming"],["completed","Completed"],["cancelled","Cancelled / No-show"]] as [Tab,string][]).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            className={`${styles.tab} ${activeTab === key ? styles.tabActive : ""}`}
            onClick={() => { setActiveTab(key); setCurrentPage(1); setSelectedRows(new Set()); }}
          >
            {label}
            <span className={styles.tabCount}>{tabCounts[key]}</span>
          </button>
        ))}
      </div>

      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        console.log("Selected rows:", selectedRows),
        <div className={styles.bulkBar} role="region" aria-label="Bulk actions">
          <span className={styles.bulkCount}>{selectedRows.size} selected</span>
          <div className={styles.bulkActions}>
            {
                !appointments.some(a=> selectedRows.has(a.id) && a.status === "Completed") && (
                    <>
                        <button className={styles.btnBulk} onClick={() => setShowBulkCancelConfirm(true)}>🚫 Cancel</button>
                        <button className={styles.btnBulk} onClick={() => setShowBulkReminderConfirm(true)}>📨 Send Reminder</button>
                    </>
                )
            }
            <button className={styles.btnBulk} onClick={() => exportCSV(appointments.filter(a => selectedRows.has(a.id)), "selected_appointments.csv")}>⬇️ Export</button>
            <button className={styles.btnBulkClear} onClick={() => setSelectedRows(new Set())}>✕ Clear</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableWrapper} role="region" aria-label="Appointments table">
        {loading ? (
          <div className={styles.loadingState} aria-label="Loading appointments">
            <div className={styles.spinner} aria-hidden="true"></div>
            <p>Loading appointments…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon} aria-hidden="true">🗓️</span>
            <p className={styles.emptyTitle}>No appointments found</p>
            <p className={styles.emptySubtitle}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <table className={styles.table} aria-label="Appointments list">
            <thead>
              <tr>
                <th className={styles.thCheck}>
                  <input type="checkbox" aria-label="Select all" checked={paginated.length > 0 && paginated.every(a => selectedRows.has(a.id))} onChange={toggleAll} />
                </th>
                <th>Appt ID</th>
                <th>Patient</th>
                <th>Provider</th>
                <th>Specialty</th>
                <th>Visit Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Location</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(apt => (
                <tr
                  key={apt.id}
                  className={`${styles.tableRow} ${selectedRows.has(apt.id) ? styles.rowSelected : ""}`}
                  onClick={() => handleRowClick(apt)}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") handleRowClick(apt); }}
                  aria-label={`Appointment ${apt.id} for ${apt.patientName}`}
                >
                  <td className={styles.tdCheck} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" aria-label={`Select ${apt.id}`} checked={selectedRows.has(apt.id)} onChange={e => toggleRow(e, apt.id)} />
                  </td>
                  <td><span className={styles.aptId}>{apt.id}</span></td>
                  <td>
                    <div className={styles.patientCell}>
                      <div className={styles.avatar} aria-hidden="true">{apt.patientName.split(" ").map(n => n[0]).join("").slice(0,2)}</div>
                      <div>
                        <div className={styles.patientName}>{apt.patientName}</div>
                        <div className={styles.patientId}>{apt.patientId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.providerName}>{apt.providerName}</div>
                  </td>
                  <td><span className={styles.specialty}>{apt.specialty}</span></td>
                  <td>
                    <span className={styles.visitType}>{visitTypeIcon(apt.visitType)} {apt.visitType}</span>
                  </td>
                  <td className={styles.dateCell}>{apt.date}</td>
                  <td className={styles.timeCell}>{apt.time}</td>
                  <td className={styles.durationCell}>{apt.duration}m</td>
                  <td><span className={`${styles.statusBadge} ${statusClass(apt.status, styles)}`}>{apt.status}</span></td>
                  <td><span className={`${styles.payBadge} ${paymentClass(apt.paymentStatus, styles)}`}>{apt.paymentStatus}</span></td>
                  <td className={styles.locationCell}>{apt.location}</td>
                  <td className={styles.createdCell}>{apt.createdAt}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className={styles.btnView} onClick={e => handleViewClick(e, apt)} aria-label={`View appointment ${apt.id}`}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className={styles.pagination} aria-label="Pagination">
          <div className={styles.paginationLeft}>
            <span className={styles.paginationInfo}>
              Showing {((currentPage - 1) * rowsPerPage) + 1}–{Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length}
            </span>
            <label className={styles.rowsLabel}>
              Rows per page:
              <select className={styles.rowsSelect} value={rowsPerPage} onChange={e => { setRowsPerPage(+e.target.value); setCurrentPage(1); }} aria-label="Rows per page">
                {[10,25,50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          </div>
          <div className={styles.paginationRight}>
            <button className={styles.pageBtn} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Previous page">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === currentPage ? styles.pageBtnActive : ""}`}
                onClick={() => setCurrentPage(p)}
                aria-label={`Page ${p}`}
                aria-current={p === currentPage ? "page" : undefined}
              >{p}</button>
            ))}
            <button className={styles.pageBtn} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} aria-label="Next page">›</button>
          </div>
        </div>
      )}

      {/* Bulk Confirm Dialogs */}
      {showBulkCancelConfirm && <ConfirmDialog message={`Cancel ${selectedRows.size} selected appointment(s)?`} onConfirm={handleBulkCancel} onCancel={() => setShowBulkCancelConfirm(false)} confirmLabel="Cancel Appointments" danger />}
      {showBulkReminderConfirm && <ConfirmDialog message={`Send reminders to ${selectedRows.size} patient(s)?`} onConfirm={handleBulkReminder} onCancel={() => setShowBulkReminderConfirm(false)} confirmLabel="Send Reminders" />}
    </div>
  );
};

export default Appointments;