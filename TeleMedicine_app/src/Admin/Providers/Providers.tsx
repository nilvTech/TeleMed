import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./Providers.module.css";

// ─── Types ───    

type ProviderStatus = "Active" | "Pending" | "Suspended" | "Inactive";
type AvailabilityStatus = "Available" | "Offline" | "On Leave";
type CredentialStatus = "Valid" | "Expiring Soon" | "Expired" | "Missing";
type VerificationStatus = "Verified" | "Pending" | "Failed";
type DocumentStatus = "Complete" | "Incomplete" | "Under Review";

interface Provider {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  npi: string;
  license: string;
  state: string;
  experience: number;
  status: ProviderStatus;
  lastActive: string;
  availability: AvailabilityStatus;
  email: string;
  submittedDate?: string;
  documentStatus?: DocumentStatus;
  verificationStatus?: VerificationStatus;
  licenseExpiry?: string;
  deaNumber?: string;
  boardCertification?: string;
  malpracticeInsurance?: string;
  credentialStatus?: CredentialStatus;
  todaySchedule?: string;
  nextSlot?: string;
  timezone?: string;
  suspendedDate?: string;
  suspendedReason?: string;
  suspendedBy?: string;
}

type ModalType =
  | "add" | "edit"
  | "confirm-suspend" | "confirm-activate" | "confirm-deactivate" | "confirm-approve" | "confirm-reset-password"
  | "send-notification" | "view-activity" | "reject" | "view-docs" | "request-info"
  | null;

interface ProviderFormData {
  name: string; email: string; specialty: string; npi: string; license: string;
  state: string; experience: string; status: ProviderStatus; availability: AvailabilityStatus;
}

const BLANK_FORM: ProviderFormData = {
  name: "", email: "", specialty: "Cardiology", npi: "", license: "",
  state: "California", experience: "", status: "Active", availability: "Available",
};

// ─── Mock Data ───

const INITIAL_PROVIDERS: Provider[] = [
  {
    id: "1", name: "Dr. John Smith", avatar: "JS", specialty: "Cardiology",
    npi: "1234567890", license: "CA-458921", state: "California", experience: 12,
    status: "Active", lastActive: "5 mins ago", availability: "Available",
    email: "john.smith@telehealth.com", licenseExpiry: "2025-08-15",
    deaNumber: "BS1234563", boardCertification: "ABIM", malpracticeInsurance: "Active",
    credentialStatus: "Valid", todaySchedule: "9:00 AM – 5:00 PM", nextSlot: "2:30 PM", timezone: "PST",
  },
  {
    id: "2", name: "Dr. Sarah Johnson", avatar: "SJ", specialty: "Dermatology",
    npi: "2345678901", license: "TX-219034", state: "Texas", experience: 8,
    status: "Active", lastActive: "2 hours ago", availability: "Offline",
    email: "sarah.johnson@telehealth.com", licenseExpiry: "2024-12-01",
    deaNumber: "BJ9876541", boardCertification: "ABD", malpracticeInsurance: "Active",
    credentialStatus: "Expiring Soon", todaySchedule: "10:00 AM – 3:00 PM", nextSlot: "11:00 AM", timezone: "CST",
  },
  {
    id: "3", name: "Dr. Michael Chen", avatar: "MC", specialty: "Psychiatry",
    npi: "3456789012", license: "NY-334521", state: "New York", experience: 15,
    status: "Pending", lastActive: "Yesterday", availability: "Available",
    email: "michael.chen@telehealth.com", submittedDate: "2024-01-10",
    documentStatus: "Complete", verificationStatus: "Pending",
    licenseExpiry: "2026-03-20", deaNumber: "BC5432107", boardCertification: "ABPN",
    malpracticeInsurance: "Active", credentialStatus: "Valid", todaySchedule: "–", nextSlot: "–", timezone: "EST",
  },
  {
    id: "4", name: "Dr. Emily Rodriguez", avatar: "ER", specialty: "Family Medicine",
    npi: "4567890123", license: "FL-512384", state: "Florida", experience: 6,
    status: "Active", lastActive: "3 hours ago", availability: "On Leave",
    email: "emily.rodriguez@telehealth.com", licenseExpiry: "2025-11-30",
    deaNumber: "BR7654329", boardCertification: "ABFM", malpracticeInsurance: "Active",
    credentialStatus: "Valid", todaySchedule: "–", nextSlot: "–", timezone: "EST",
  },
  {
    id: "5", name: "Dr. James Williams", avatar: "JW", specialty: "Orthopedics",
    npi: "5678901234", license: "WA-678234", state: "Washington", experience: 20,
    status: "Suspended", lastActive: "3 days ago", availability: "Offline",
    email: "james.williams@telehealth.com", suspendedDate: "2024-01-05",
    suspendedReason: "License compliance issue", suspendedBy: "Admin Sarah K.",
    licenseExpiry: "2023-12-01", deaNumber: "BW2109876", boardCertification: "ABOS",
    malpracticeInsurance: "Expired", credentialStatus: "Expired", timezone: "PST",
  },
  {
    id: "6", name: "Dr. Aisha Patel", avatar: "AP", specialty: "Neurology",
    npi: "6789012345", license: "IL-789123", state: "Illinois", experience: 10,
    status: "Active", lastActive: "30 mins ago", availability: "Available",
    email: "aisha.patel@telehealth.com", licenseExpiry: "2026-07-10",
    deaNumber: "BP3214567", boardCertification: "ABPN", malpracticeInsurance: "Active",
    credentialStatus: "Valid", todaySchedule: "8:00 AM – 4:00 PM", nextSlot: "1:00 PM", timezone: "CST",
  },
  {
    id: "7", name: "Dr. Robert Kim", avatar: "RK", specialty: "Oncology",
    npi: "7890123456", license: "MA-890234", state: "Massachusetts", experience: 18,
    status: "Pending", lastActive: "1 day ago", availability: "Available",
    email: "robert.kim@telehealth.com", submittedDate: "2024-01-08",
    documentStatus: "Incomplete", verificationStatus: "Pending",
    licenseExpiry: "2025-04-15", deaNumber: "BK6547893", boardCertification: "ABIM",
    malpracticeInsurance: "Active", credentialStatus: "Missing", timezone: "EST",
  },
  {
    id: "8", name: "Dr. Linda Torres", avatar: "LT", specialty: "Pediatrics",
    npi: "8901234567", license: "AZ-901345", state: "Arizona", experience: 14,
    status: "Inactive", lastActive: "2 weeks ago", availability: "Offline",
    email: "linda.torres@telehealth.com", licenseExpiry: "2025-09-22",
    deaNumber: "BT9876541", boardCertification: "ABP", malpracticeInsurance: "Active",
    credentialStatus: "Valid", timezone: "MST",
  },
];

const SPECIALTIES_LIST = ["Cardiology", "Dermatology", "Psychiatry", "Family Medicine", "Orthopedics", "Neurology", "Oncology", "Pediatrics"];
const SPECIALTIES = ["All Specialties", ...SPECIALTIES_LIST];
const STATUSES = ["All Statuses", "Active", "Pending", "Suspended", "Inactive"];
const STATES_LIST = ["California", "Texas", "New York", "Florida", "Washington", "Illinois", "Massachusetts", "Arizona"];
const STATES = ["All States", ...STATES_LIST];
const AVAILABILITIES = ["All Availability", "Available", "Offline", "On Leave"];
const TABS = ["All Providers", "Approvals", "Credentialing", "Availability", "Suspended"];

const MOCK_ACTIVITY = [
  { id: "a1", event: "Account created", time: "Jan 2, 2024 — 9:00 AM", icon: "✦" },
  { id: "a2", event: "Profile completed", time: "Jan 2, 2024 — 9:15 AM", icon: "✎" },
  { id: "a3", event: "Credentials submitted", time: "Jan 3, 2024 — 11:30 AM", icon: "⊕" },
  { id: "a4", event: "Password changed", time: "Jan 5, 2024 — 2:45 PM", icon: "⬡" },
  { id: "a5", event: "First appointment completed", time: "Jan 8, 2024 — 10:00 AM", icon: "✓" },
  { id: "a6", event: "Last login", time: "Today — 8:32 AM", icon: "◎" },
  { id: "a7", event: "Profile updated", time: "Today — 8:35 AM", icon: "✎" },
];

const MOCK_DOCUMENTS = [
  { id: "d1", name: "Medical License", status: "Verified", date: "Jan 3, 2024" },
  { id: "d2", name: "Board Certification", status: "Verified", date: "Jan 3, 2024" },
  { id: "d3", name: "DEA Certificate", status: "Pending Review", date: "Jan 3, 2024" },
  { id: "d4", name: "Malpractice Insurance", status: "Verified", date: "Jan 3, 2024" },
  { id: "d5", name: "CV / Resume", status: "Verified", date: "Jan 3, 2024" },
];

// ─── Utilities ───

let nextId = 9;
const genId = () => String(nextId++);
const genAvatar = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

function exportCSV(providers: Provider[]) {
  const headers = ["Name", "Email", "Specialty", "NPI", "License", "State", "Experience", "Status", "Availability"];
  const rows = providers.map((p) =>
    [p.name, p.email, p.specialty, p.npi, p.license, p.state, `${p.experience} yrs`, p.status, p.availability]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "providers_export.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ─── Focus Trap Hook ───

function useFocusTrap() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first?.focus(); } }
    };
    el.addEventListener("keydown", trap);
    return () => el.removeEventListener("keydown", trap);
  }, []);
  return ref;
}

// ─── Toast ───

const Toast: React.FC<{ message: string; onDone: () => void }> = ({ message, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <span className={styles.toastIcon}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" fill="#059669" />
          <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {message}
    </div>
  );
};

// ─── Avatar ───

const AVATAR_COLORS: Record<string, string> = {
  JS: "#2563eb", SJ: "#7c3aed", MC: "#0891b2", ER: "#059669",
  JW: "#dc2626", AP: "#d97706", RK: "#6d28d9", LT: "#0d9488",
};

const Avatar: React.FC<{ initials: string; status?: AvailabilityStatus }> = ({ initials, status }) => (
  <div className={styles.avatarWrap}>
    <div className={styles.avatar} style={{ background: AVATAR_COLORS[initials] || "#4b5563" }}>{initials}</div>
    {status && (
      <span className={`${styles.avatarDot} ${status === "Available" ? styles.dotGreen : status === "On Leave" ? styles.dotYellow : styles.dotGray}`} />
    )}
  </div>
);

// ─── Badge ───

const Badge: React.FC<{ label: string; type: string }> = ({ label, type }) => (
  <span className={`${styles.badge} ${styles[`badge_${type.toLowerCase().replace(/\s+/g, "_")}`] || styles.badge_inactive}`}>{label}</span>
);

// ─── Spinner / Empty ───

const Spinner: React.FC = () => (
  <div className={styles.spinnerWrap} aria-label="Loading">
    <div className={styles.spinner} />
    <p className={styles.spinnerText}>Loading providers…</p>
  </div>
);

const EmptyState: React.FC<{ message?: string }> = ({ message = "No providers found" }) => (
  <div className={styles.emptyState} role="status">
    <svg width="56" height="56" fill="none" viewBox="0 0 56 56" aria-hidden="true">
      <rect width="56" height="56" rx="16" fill="#f1f5f9" />
      <path d="M20 36c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="28" cy="22" r="5" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="38" cy="20" r="3.5" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="18" cy="20" r="3.5" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
    <p className={styles.emptyTitle}>{message}</p>
    <p className={styles.emptySubtitle}>Try adjusting your search or filter criteria</p>
  </div>
);

// ─── Modal Shell ───

const ModalShell: React.FC<{
  title: string; onClose: () => void; size?: "sm" | "md" | "lg"; children: React.ReactNode;
}> = ({ title, onClose, size = "md", children }) => {
  const ref = useFocusTrap();
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`${styles.modal} ${size === "sm" ? styles.modalSm : size === "lg" ? styles.modalLg : ""}`} ref={ref}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle} id="modal-title">{title}</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── Confirm Dialog ───

const ConfirmDialog: React.FC<{
  title: string; message: string; confirmLabel: string; confirmClass?: string;
  onConfirm: () => void; onClose: () => void;
}> = ({ title, message, confirmLabel, confirmClass, onConfirm, onClose }) => (
  <ModalShell title={title} onClose={onClose} size="sm">
    <div className={styles.modalBody}>
      <p className={styles.confirmMessage}>{message}</p>
    </div>
    <div className={styles.modalActions}>
      <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
      <button className={confirmClass || styles.btnPrimary} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
    </div>
  </ModalShell>
);

// ─── Provider Form ───

const ProviderForm: React.FC<{
  mode: "add" | "edit"; initial?: ProviderFormData;
  onSave: (data: ProviderFormData) => void; onClose: () => void;
}> = ({ mode, initial = BLANK_FORM, onSave, onClose }) => {
  const [form, setForm] = useState<ProviderFormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof ProviderFormData, string>>>({});

  const set = (k: keyof ProviderFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email is required";
    if (!form.npi.trim() || !/^\d{10}$/.test(form.npi)) errs.npi = "NPI must be exactly 10 digits";
    if (!form.license.trim()) errs.license = "License number is required";
    if (!form.experience.trim() || isNaN(Number(form.experience)) || Number(form.experience) < 0)
      errs.experience = "Experience must be a valid number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const renderField = (label: string, key: keyof ProviderFormData, type = "text", placeholder = "") => (
    <div className={styles.formGroup} key={key}>
      <label className={styles.formLabel} htmlFor={`pf-${key}`}>{label}</label>
      <input id={`pf-${key}`} className={`${styles.formInput} ${errors[key] ? styles.formInputError : ""}`}
        type={type} value={form[key] as string} onChange={set(key)} placeholder={placeholder}
        aria-describedby={errors[key] ? `pf-err-${key}` : undefined} />
      {errors[key] && <span id={`pf-err-${key}`} className={styles.formError} role="alert">{errors[key]}</span>}
    </div>
  );

  const renderSelect = (label: string, key: keyof ProviderFormData, options: string[]) => (
    <div className={styles.formGroup} key={key}>
      <label className={styles.formLabel} htmlFor={`pf-${key}`}>{label}</label>
      <select id={`pf-${key}`} className={styles.formSelect} value={form[key] as string} onChange={set(key)}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <ModalShell title={mode === "add" ? "Add New Provider" : "Edit Provider"} onClose={onClose} size="lg">
      <div className={`${styles.modalBody} ${styles.formGrid}`}>
        {renderField("Full Name *", "name", "text", "Dr. Jane Smith")}
        {renderField("Email *", "email", "email", "provider@telehealth.com")}
        {renderSelect("Specialty", "specialty", SPECIALTIES_LIST)}
        {renderField("NPI Number * (10 digits)", "npi", "text", "1234567890")}
        {renderField("License Number *", "license", "text", "CA-123456")}
        {renderSelect("State", "state", STATES_LIST)}
        {renderField("Years of Experience *", "experience", "number", "10")}
        {renderSelect("Status", "status", ["Active", "Pending", "Suspended", "Inactive"])}
        {renderSelect("Availability", "availability", ["Available", "Offline", "On Leave"])}
      </div>
      <div className={styles.modalActions}>
        <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
        <button className={styles.btnPrimary} onClick={() => { if (validate()) onSave(form); }}>
          {mode === "add" ? "Save Provider" : "Save Changes"}
        </button>
      </div>
    </ModalShell>
  );
};

// ─── Notification Modal ───

const NotificationModal: React.FC<{ provider: Provider; onClose: () => void; onSend: () => void }> = ({ provider, onClose, onSend }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({});
  const validate = () => {
    const e: typeof errors = {};
    if (!subject.trim()) e.subject = "Subject is required";
    if (!message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  return (
    <ModalShell title="Send Notification" onClose={onClose}>
      <div className={styles.modalBody}>
        <p className={styles.modalSubtitle}>To: <strong>{provider.name}</strong> · {provider.email}</p>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="notif-subject">Subject *</label>
          <input id="notif-subject" className={`${styles.formInput} ${errors.subject ? styles.formInputError : ""}`}
            value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Notification subject…" />
          {errors.subject && <span className={styles.formError}>{errors.subject}</span>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="notif-msg">Message *</label>
          <textarea id="notif-msg" className={`${styles.formTextarea} ${errors.message ? styles.formInputError : ""}`}
            rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message…" />
          {errors.message && <span className={styles.formError}>{errors.message}</span>}
        </div>
      </div>
      <div className={styles.modalActions}>
        <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
        <button className={styles.btnPrimary} onClick={() => { if (validate()) { onSend(); onClose(); } }}>Send Notification</button>
      </div>
    </ModalShell>
  );
};

// ─── Activity Modal ───

const ActivityModal: React.FC<{ provider: Provider; onClose: () => void }> = ({ provider, onClose }) => (
  <ModalShell title="Provider Activity" onClose={onClose}>
    <div className={styles.modalBody}>
      <p className={styles.modalSubtitle}>{provider.name} — Activity Timeline</p>
      <div className={styles.activityList}>
        {MOCK_ACTIVITY.map((a) => (
          <div key={a.id} className={styles.activityItem}>
            <div className={styles.activityIconBox}>{a.icon}</div>
            <div className={styles.activityContent}>
              <span className={styles.activityEvent}>{a.event}</span>
              <span className={styles.activityTime}>{a.time}</span>
            </div>
            <div className={styles.activityLine} />
          </div>
        ))}
      </div>
    </div>
    <div className={styles.modalActions}>
      <button className={styles.btnSecondary} onClick={onClose}>Close</button>
    </div>
  </ModalShell>
);

// ─── View Documents Modal ───

const ViewDocsModal: React.FC<{ provider: Provider; onClose: () => void }> = ({ provider, onClose }) => (
  <ModalShell title="Provider Documents" onClose={onClose}>
    <div className={styles.modalBody}>
      <p className={styles.modalSubtitle}>{provider.name} — Submitted Documents</p>
      <div className={styles.docList}>
        {MOCK_DOCUMENTS.map((d) => (
          <div key={d.id} className={styles.docItem}>
            <div className={styles.docInfo}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="3" y="1" width="12" height="17" rx="2" stroke="#94a3b8" strokeWidth="1.4" />
                <path d="M6 7h8M6 10h8M6 13h5" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <div>
                <span className={styles.docName}>{d.name}</span>
                <span className={styles.docDate}>Submitted {d.date}</span>
              </div>
            </div>
            <div className={styles.docRight}>
              <span className={`${styles.docStatusBadge} ${d.status === "Verified" ? styles.docVerified : styles.docPending}`}>{d.status}</span>
              <button className={styles.actionBtn} onClick={() => alert(`Downloading: ${d.name}`)}>Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className={styles.modalActions}>
      <button className={styles.btnSecondary} onClick={onClose}>Close</button>
    </div>
  </ModalShell>
);

// ─── Request Info Modal ───

const RequestInfoModal: React.FC<{ provider: Provider; onClose: () => void; onSend: () => void }> = ({ provider, onClose, onSend }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  return (
    <ModalShell title="Request Additional Information" onClose={onClose}>
      <div className={styles.modalBody}>
        <p className={styles.modalSubtitle}>Requesting info from <strong>{provider.name}</strong></p>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="req-msg">Message *</label>
          <textarea id="req-msg" className={`${styles.formTextarea} ${error ? styles.formInputError : ""}`}
            rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder="Specify what additional documents or information are required…" />
          {error && <span className={styles.formError}>{error}</span>}
        </div>
      </div>
      <div className={styles.modalActions}>
        <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
        <button className={styles.btnPrimary} onClick={() => {
          if (!message.trim()) { setError("Message is required"); return; }
          onSend(); onClose();
        }}>Send Request</button>
      </div>
    </ModalShell>
  );
};

// ─── Reject Modal ───

const RejectModal: React.FC<{ provider: Provider; onClose: () => void; onConfirm: (reason: string) => void }> = ({ provider, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  return (
    <ModalShell title="Reject Provider" onClose={onClose} size="sm">
      <div className={styles.modalBody}>
        <p className={styles.modalSubtitle}>Rejecting <strong>{provider.name}</strong>. This will remove them from the approval queue.</p>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="reject-reason">Reason for Rejection *</label>
          <textarea id="reject-reason" className={`${styles.formTextarea} ${error ? styles.formInputError : ""}`}
            placeholder="Enter rejection reason…" value={reason}
            onChange={(e) => setReason(e.target.value)} rows={4} />
          {error && <span className={styles.formError}>{error}</span>}
        </div>
      </div>
      <div className={styles.modalActions}>
        <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
        <button className={styles.btnDanger} onClick={() => {
          if (!reason.trim()) { setError("Rejection reason is required"); return; }
          onConfirm(reason); onClose();
        }}>Reject Provider</button>
      </div>
    </ModalShell>
  );
};

// ─── More Menu ───

interface MoreMenuProps {
  provider: Provider; onClose: () => void;
  onResetPassword: () => void; onSendNotification: () => void;
  onViewActivity: () => void; onDeactivate: () => void;
}
const MoreMenu: React.FC<MoreMenuProps> = ({ onClose, onResetPassword, onSendNotification, onViewActivity, onDeactivate }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);
  const items = [
    { label: "Reset Password", icon: "🔑", action: onResetPassword, danger: false },
    { label: "Send Notification", icon: "🔔", action: onSendNotification, danger: false },
    { label: "View Activity", icon: "📋", action: onViewActivity, danger: false },
    { label: "Deactivate Provider", icon: "⛔", action: onDeactivate, danger: true },
  ];
  return (
    <div className={styles.moreMenu} ref={ref} role="menu" aria-label="More actions">
      {items.map(({ label, icon, action, danger }) => (
        <button key={label} className={`${styles.moreMenuItem} ${danger ? styles.moreMenuItemDanger : ""}`}
          role="menuitem" onClick={(e) => { e.stopPropagation(); action(); onClose(); }}>
          <span className={styles.moreMenuIcon}>{icon}</span>{label}
        </button>
      ))}
    </div>
  );
};

// ─── Pagination ───

const Pagination: React.FC<{ total: number; page: number; pageSize: number; onPage: (p: number) => void; onPageSize: (s: number) => void }> =
  ({ total, page, pageSize, onPage, onPageSize }) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return (
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>Showing <strong>{start}–{end}</strong> of <strong>{total}</strong> providers</div>
        <div className={styles.paginationControls}>
          <label className={styles.pageSizeLabel} htmlFor="ps-sel">Rows:</label>
          <select id="ps-sel" className={styles.pageSizeSelect} value={pageSize}
            onChange={(e) => { onPageSize(Number(e.target.value)); onPage(1); }} aria-label="Rows per page">
            {[10, 25, 50].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className={styles.pageBtn} onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="Previous page">‹</button>
          {pages.map((p, i) => p === "..."
            ? <span key={`e${i}`} className={styles.pageEllipsis}>…</span>
            : <button key={p} className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ""}`}
                onClick={() => onPage(p as number)} aria-label={`Page ${p}`} aria-current={page === p ? "page" : undefined}>{p}</button>
          )}
          <button className={styles.pageBtn} onClick={() => onPage(page + 1)} disabled={page === totalPages} aria-label="Next page">›</button>
        </div>
      </div>
    );
  };

// ─── Bulk Actions Bar ───

const BulkActionsBar: React.FC<{ count: number; onAction: (a: string) => void; onClear: () => void }> = ({ count, onAction, onClear }) => (
  <div className={styles.bulkBar} role="toolbar" aria-label="Bulk actions">
    <span className={styles.bulkCount}><strong>{count}</strong> provider{count !== 1 ? "s" : ""} selected</span>
    <div className={styles.bulkActions}>
      {["Activate", "Suspend", "Deactivate", "Export"].map((a) => (
        <button key={a} className={`${styles.bulkBtn} ${a === "Deactivate" ? styles.bulkBtnDanger : a === "Export" ? styles.bulkBtnExport : ""}`}
          onClick={() => onAction(a)}>{a}</button>
      ))}
    </div>
    <button className={styles.bulkClear} onClick={onClear} aria-label="Clear selection">✕ Clear</button>
  </div>
);

// ─── All Providers Table ───

interface AllProvidersTableProps {
  providers: Provider[];
  onSelect: (id: string) => void;
  selected: Set<string>;
  onSelectAll: () => void;
  onEdit: (p: Provider) => void;
  onSuspend: (p: Provider) => void;
  onActivate: (p: Provider) => void;
  onApprove: (p: Provider) => void;
  onReject: (p: Provider) => void;
  onDeactivate: (p: Provider) => void;
  onResetPassword: (p: Provider) => void;
  onSendNotification: (p: Provider) => void;
  onViewActivity: (p: Provider) => void;
}

const AllProvidersTable: React.FC<AllProvidersTableProps> = ({
  providers, onSelect, selected, onSelectAll, onEdit, onSuspend, onActivate,
  onApprove, onReject, onDeactivate, onResetPassword, onSendNotification, onViewActivity,
}) => {
  const [openMoreId, setOpenMoreId] = useState<string | null>(null);
  const allSelected = providers.length > 0 && providers.every((p) => selected.has(p.id));
  const getStatusType = (s: ProviderStatus) =>
    s === "Active" ? "active" : s === "Pending" ? "pending" : s === "Suspended" ? "suspended" : "inactive";
  const getAvailType = (a: AvailabilityStatus) =>
    a === "Available" ? "available" : a === "On Leave" ? "on_leave" : "offline";

  return (
    <div className={styles.tableWrapper} role="region" aria-label="Providers table">
      <table className={styles.table} aria-label="All providers">
        <thead>
          <tr>
            <th className={styles.thCheck}>
              <input type="checkbox" checked={allSelected} onChange={onSelectAll} aria-label="Select all" className={styles.checkbox} />
            </th>
            {["Provider", "Specialty", "NPI Number", "License", "State", "Experience", "Status", "Last Active", "Availability", "Actions"].map((h) => (
              <th key={h} className={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {providers.map((p) => (
            <tr key={p.id} className={`${styles.tr} ${selected.has(p.id) ? styles.trSelected : ""}`}>
              <td className={styles.tdCheck}>
                <input type="checkbox" checked={selected.has(p.id)}
                  onChange={(e) => { e.stopPropagation(); onSelect(p.id); }}
                  aria-label={`Select ${p.name}`} className={styles.checkbox} />
              </td>
              <td className={styles.td}>
                <div className={styles.providerCell}>
                  <Avatar initials={p.avatar} status={p.availability} />
                  <div>
                    <a href={`/admin/providers/${p.id}`} className={styles.providerName}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>{p.name}</a>
                    <span className={styles.providerEmail}>{p.email}</span>
                  </div>
                </div>
              </td>
              <td className={styles.td}><span className={styles.specialty}>{p.specialty}</span></td>
              <td className={styles.td}><span className={styles.mono}>{p.npi}</span></td>
              <td className={styles.td}><span className={styles.mono}>{p.license}</span></td>
              <td className={styles.td}>{p.state}</td>
              <td className={styles.td}><span className={styles.experience}>{p.experience} yrs</span></td>
              <td className={styles.td}><Badge label={p.status} type={getStatusType(p.status)} /></td>
              <td className={styles.td}><span className={styles.lastActive}>{p.lastActive}</span></td>
              <td className={styles.td}><Badge label={p.availability} type={getAvailType(p.availability)} /></td>
              <td className={styles.td}>
                <div className={styles.actionsCell}>
                  {/* <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); }}>View</button> */}
                  <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); onEdit(p); }}>Edit</button>
                  {p.status === "Pending" && <>
                    <button className={styles.actionBtnApprove} onClick={(e) => { e.stopPropagation(); onApprove(p); }}>Approve</button>
                    <button className={styles.actionBtnReject} onClick={(e) => { e.stopPropagation(); onReject(p); }}>Reject</button>
                  </>}
                  {p.status === "Active" && (
                    <button className={styles.actionBtnSuspend} onClick={(e) => { e.stopPropagation(); onSuspend(p); }}>Suspend</button>
                  )}
                  {(p.status === "Suspended" || p.status === "Inactive") && (
                    <button className={styles.actionBtnActivate} onClick={(e) => { e.stopPropagation(); onActivate(p); }}>Activate</button>
                  )}
                  <div className={styles.moreWrap}>
                    <button className={styles.actionBtnMore}
                      onClick={(e) => { e.stopPropagation(); setOpenMoreId(openMoreId === p.id ? null : p.id); }}
                      aria-label="More actions" aria-expanded={openMoreId === p.id}>⋯</button>
                    {openMoreId === p.id && (
                      <MoreMenu provider={p} onClose={() => setOpenMoreId(null)}
                        onResetPassword={() => onResetPassword(p)}
                        onSendNotification={() => onSendNotification(p)}
                        onViewActivity={() => onViewActivity(p)}
                        onDeactivate={() => onDeactivate(p)} />
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Approvals Table ───

interface ApprovalsTableProps {
  providers: Provider[];
  onApprove: (p: Provider) => void;
  onReject: (p: Provider) => void;
  onViewDocs: (p: Provider) => void;
  onRequestInfo: (p: Provider) => void;
}
const ApprovalsTable: React.FC<ApprovalsTableProps> = ({ providers, onApprove, onReject, onViewDocs, onRequestInfo }) => {
  const pending = providers.filter((p) => p.status === "Pending");
  if (pending.length === 0) return <EmptyState message="No pending approvals" />;
  const getDocBadge = (s?: DocumentStatus) => s === "Complete" ? "active" : s === "Incomplete" ? "suspended" : "pending";
  const getVerBadge = (s?: VerificationStatus) => s === "Verified" ? "active" : s === "Failed" ? "suspended" : "pending";
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table} aria-label="Approvals table">
        <thead>
          <tr>{["Provider", "Specialty", "NPI Number", "Submitted Date", "Documents", "Verification", "Actions"].map((h) =>
            <th key={h} className={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {pending.map((p) => (
            <tr key={p.id} className={styles.tr}>
              <td className={styles.td}>
                <div className={styles.providerCell}>
                  <Avatar initials={p.avatar} />
                  <div><span className={styles.providerName}>{p.name}</span><span className={styles.providerEmail}>{p.email}</span></div>
                </div>
              </td>
              <td className={styles.td}>{p.specialty}</td>
              <td className={styles.td}><span className={styles.mono}>{p.npi}</span></td>
              <td className={styles.td}>{p.submittedDate}</td>
              <td className={styles.td}><Badge label={p.documentStatus || "–"} type={getDocBadge(p.documentStatus)} /></td>
              <td className={styles.td}><Badge label={p.verificationStatus || "–"} type={getVerBadge(p.verificationStatus)} /></td>
              <td className={styles.td}>
                <div className={styles.actionsCell}>
                  <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); onViewDocs(p); }}>View Docs</button>
                  <button className={styles.actionBtnApprove} onClick={(e) => { e.stopPropagation(); onApprove(p); }}>Approve</button>
                  <button className={styles.actionBtnReject} onClick={(e) => { e.stopPropagation(); onReject(p); }}>Reject</button>
                  <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); onRequestInfo(p); }}>Request Info</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Credentialing Table ───

const CredentialingTable: React.FC<{ providers: Provider[] }> = ({ providers }) => {
  const getCredBadge = (s?: CredentialStatus) =>
    s === "Valid" ? "active" : s === "Expiring Soon" ? "expiring" : s === "Expired" ? "suspended" : "inactive";
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table} aria-label="Credentialing table">
        <thead>
          <tr>{["Provider", "License #", "License Expiry", "DEA Number", "Board Cert.", "Malpractice Ins.", "Credential Status"].map((h) =>
            <th key={h} className={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {providers.map((p) => (
            <tr key={p.id} className={styles.tr}>
              <td className={styles.td}>
                <div className={styles.providerCell}>
                  <Avatar initials={p.avatar} />
                  <div><span className={styles.providerName}>{p.name}</span><span className={styles.providerEmail}>{p.specialty}</span></div>
                </div>
              </td>
              <td className={styles.td}><span className={styles.mono}>{p.license}</span></td>
              <td className={styles.td}>
                <span className={`${styles.expiry} ${p.credentialStatus === "Expired" ? styles.expiryExpired : p.credentialStatus === "Expiring Soon" ? styles.expiryWarn : ""}`}>
                  {p.licenseExpiry}
                </span>
              </td>
              <td className={styles.td}><span className={styles.mono}>{p.deaNumber || "–"}</span></td>
              <td className={styles.td}>{p.boardCertification || "–"}</td>
              <td className={styles.td}><Badge label={p.malpracticeInsurance || "–"} type={p.malpracticeInsurance === "Active" ? "active" : "suspended"} /></td>
              <td className={styles.td}><Badge label={p.credentialStatus || "–"} type={getCredBadge(p.credentialStatus)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Availability Table ───

const AvailabilityTable: React.FC<{ providers: Provider[] }> = ({ providers }) => {
  const active = providers.filter((p) => p.status === "Active" || p.status === "Pending");
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table} aria-label="Availability table">
        <thead>
          <tr>{["Provider", "Specialty", "Today's Schedule", "Next Available Slot", "Status", "Timezone"].map((h) =>
            <th key={h} className={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {active.map((p) => (
            <tr key={p.id} className={styles.tr}>
              <td className={styles.td}>
                <div className={styles.providerCell}>
                  <Avatar initials={p.avatar} status={p.availability} />
                  <div><span className={styles.providerName}>{p.name}</span><span className={styles.providerEmail}>{p.email}</span></div>
                </div>
              </td>
              <td className={styles.td}>{p.specialty}</td>
              <td className={styles.td}><span className={styles.scheduleText}>{p.todaySchedule || "–"}</span></td>
              <td className={styles.td}><span className={styles.nextSlot}>{p.nextSlot && p.nextSlot !== "–" ? `Next: ${p.nextSlot}` : "–"}</span></td>
              <td className={styles.td}><Badge label={p.availability} type={p.availability === "Available" ? "available" : p.availability === "On Leave" ? "on_leave" : "offline"} /></td>
              <td className={styles.td}><span className={styles.timezone}>{p.timezone || "–"}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Suspended Table ───

interface SuspendedTableProps {
  providers: Provider[];
  onActivate: (p: Provider) => void;
  onEdit: (p: Provider) => void;
}
const SuspendedTable: React.FC<SuspendedTableProps> = ({ providers, onActivate, onEdit }) => {
  const suspended = providers.filter((p) => p.status === "Suspended");
  if (suspended.length === 0) return <EmptyState message="No suspended providers" />;
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table} aria-label="Suspended providers table">
        <thead>
          <tr>{["Provider", "Specialty", "Suspended Date", "Reason", "Suspended By", "Status", "Actions"].map((h) =>
            <th key={h} className={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {suspended.map((p) => (
            <tr key={p.id} className={styles.tr}>
              <td className={styles.td}>
                <div className={styles.providerCell}>
                  <Avatar initials={p.avatar} />
                  <div><span className={styles.providerName}>{p.name}</span><span className={styles.providerEmail}>{p.email}</span></div>
                </div>
              </td>
              <td className={styles.td}>{p.specialty}</td>
              <td className={styles.td}>{p.suspendedDate}</td>
              <td className={styles.td}><span className={styles.suspendedReason}>{p.suspendedReason}</span></td>
              <td className={styles.td}>{p.suspendedBy}</td>
              <td className={styles.td}><Badge label="Suspended" type="suspended" /></td>
              <td className={styles.td}>
                <div className={styles.actionsCell}>
                  {/* <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>View</button> */}
                  <button className={styles.actionBtnActivate} onClick={(e) => { e.stopPropagation(); onActivate(p); }}>Activate</button>
                  <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); onEdit(p); }}>Edit</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Main Providers Page ───

const Providers: React.FC = () => {
  //  State
  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("All Specialties");
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [filterState, setFilterState] = useState("All States");
  const [filterAvail, setFilterAvail] = useState("All Availability");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const showToast = useCallback((msg: string) => { setToast(null); setTimeout(() => setToast(msg), 10); }, []);
  const closeModal = useCallback(() => { setModal(null); setSelectedProvider(null); }, []);

  //  Mutations
  const updateProvider = useCallback((id: string, patch: Partial<Provider>) =>
    setProviders((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p)), []);

  const removeProvider = useCallback((id: string) =>
    setProviders((prev) => prev.filter((p) => p.id !== id)), []);

  // ── Action handlers
  const handleAddProvider = useCallback((data: ProviderFormData) => {
    const initials = genAvatar(data.name);
    const today = new Date().toISOString().split("T")[0];
    const newProvider: Provider = {
      id: genId(), name: data.name, avatar: initials, specialty: data.specialty,
      npi: data.npi, license: data.license, state: data.state,
      experience: parseInt(data.experience, 10) || 0, status: data.status,
      lastActive: "Just now", availability: data.availability, email: data.email,
      licenseExpiry: "–", credentialStatus: "Valid", malpracticeInsurance: "Active",
      timezone: "EST", submittedDate: today, documentStatus: "Incomplete", verificationStatus: "Pending",
    };
    setProviders((prev) => [newProvider, ...prev]);
    closeModal();
    showToast("Provider added successfully");
  }, [closeModal, showToast]);

  const handleEditProvider = useCallback((data: ProviderFormData) => {
    if (!selectedProvider) return;
    updateProvider(selectedProvider.id, {
      name: data.name, email: data.email, specialty: data.specialty,
      npi: data.npi, license: data.license, state: data.state,
      experience: parseInt(data.experience, 10) || selectedProvider.experience,
      status: data.status, availability: data.availability,
    });
    closeModal();
    showToast("Provider updated successfully");
  }, [selectedProvider, updateProvider, closeModal, showToast]);

  const handleSuspend = useCallback((p: Provider) => {
    updateProvider(p.id, {
      status: "Suspended",
      suspendedDate: new Date().toISOString().split("T")[0],
      suspendedBy: "Current Admin", suspendedReason: "Administrative action",
    });
    showToast("Provider suspended successfully");
  }, [updateProvider, showToast]);

  const handleActivate = useCallback((p: Provider) => {
    updateProvider(p.id, { status: "Active", suspendedDate: undefined, suspendedReason: undefined, suspendedBy: undefined });
    showToast("Provider activated successfully");
  }, [updateProvider, showToast]);

  const handleDeactivate = useCallback((p: Provider) => {
    updateProvider(p.id, { status: "Inactive" });
    showToast("Provider deactivated successfully");
  }, [updateProvider, showToast]);

  const handleApprove = useCallback((p: Provider) => {
    updateProvider(p.id, { status: "Active", verificationStatus: "Verified" });
    showToast("Provider approved successfully");
  }, [updateProvider, showToast]);

  const handleReject = useCallback((p: Provider, _reason: string) => {
    removeProvider(p.id);
    showToast("Provider rejected");
  }, [removeProvider, showToast]);

  // ── Open modal shortcuts
  const openModal = useCallback((type: ModalType, p?: Provider) => {
    if (p) setSelectedProvider(p);
    setModal(type);
  }, []);

  // ── Bulk actions
  const handleBulkAction = useCallback((action: string) => {
    const ids = Array.from(selectedRows);
    const today = new Date().toISOString().split("T")[0];
    if (action === "Activate") {
      ids.forEach((id) => updateProvider(id, { status: "Active", suspendedDate: undefined, suspendedReason: undefined }));
      showToast(`${ids.length} provider(s) activated`);
    } else if (action === "Suspend") {
      ids.forEach((id) => updateProvider(id, { status: "Suspended", suspendedDate: today, suspendedBy: "Admin (Bulk)", suspendedReason: "Bulk administrative action" }));
      showToast(`${ids.length} provider(s) suspended`);
    } else if (action === "Deactivate") {
      ids.forEach((id) => updateProvider(id, { status: "Inactive" }));
      showToast(`${ids.length} provider(s) deactivated`);
    } else if (action === "Export") {
      const toExport = providers.filter((p) => selectedRows.has(p.id));
      exportCSV(toExport);
      showToast(`Exported ${toExport.length} providers as CSV`);
    }
    setSelectedRows(new Set());
  }, [selectedRows, providers, updateProvider, showToast]);

  const handleExportAll = useCallback(() => {
    exportCSV(providers);
    showToast(`Exported ${providers.length} providers as CSV`);
  }, [providers, showToast]);

  // ── Filtering
  const filtered = useCallback(() =>
    providers.filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        (!q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.npi.includes(q) || p.license.toLowerCase().includes(q)) &&
        (filterSpecialty === "All Specialties" || p.specialty === filterSpecialty) &&
        (filterStatus === "All Statuses" || p.status === filterStatus) &&
        (filterState === "All States" || p.state === filterState) &&
        (filterAvail === "All Availability" || p.availability === filterAvail)
      );
    }), [providers, searchQuery, filterSpecialty, filterStatus, filterState, filterAvail]);

  const filteredList = filtered();
  const paginated = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSelect = (id: string) =>
    setSelectedRows((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const handleSelectAll = () => {
    if (paginated.every((p) => selectedRows.has(p.id)))
      setSelectedRows((prev) => { const n = new Set(prev); paginated.forEach((p) => n.delete(p.id)); return n; });
    else
      setSelectedRows((prev) => { const n = new Set(prev); paginated.forEach((p) => n.add(p.id)); return n; });
  };

  const resetFilters = () => {
    setSearchQuery(""); setFilterSpecialty("All Specialties"); setFilterStatus("All Statuses");
    setFilterState("All States"); setFilterAvail("All Availability"); setCurrentPage(1);
  };
  const hasFilters = !!(searchQuery || filterSpecialty !== "All Specialties" || filterStatus !== "All Statuses" || filterState !== "All States" || filterAvail !== "All Availability");

  const tabCounts = {
    "All Providers": providers.length,
    "Approvals": providers.filter((p) => p.status === "Pending").length,
    "Credentialing": providers.length,
    "Availability": providers.filter((p) => p.status === "Active").length,
    "Suspended": providers.filter((p) => p.status === "Suspended").length,
  };

  return (
    <div className={styles.page}>
      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* ── Modals ─── */}
      {modal === "add" && (
        <ProviderForm mode="add" onSave={handleAddProvider} onClose={closeModal} />
      )}
      {modal === "edit" && selectedProvider && (
        <ProviderForm mode="edit" onSave={handleEditProvider} onClose={closeModal}
          initial={{
            name: selectedProvider.name, email: selectedProvider.email, specialty: selectedProvider.specialty,
            npi: selectedProvider.npi, license: selectedProvider.license, state: selectedProvider.state,
            experience: String(selectedProvider.experience), status: selectedProvider.status,
            availability: selectedProvider.availability,
          }} />
      )}
      {modal === "confirm-suspend" && selectedProvider && (
        <ConfirmDialog title="Suspend Provider"
          message={`Suspend ${selectedProvider.name}? They will be unable to see patients until reactivated.`}
          confirmLabel="Suspend" confirmClass={styles.btnDanger}
          onConfirm={() => handleSuspend(selectedProvider)} onClose={closeModal} />
      )}
      {modal === "confirm-activate" && selectedProvider && (
        <ConfirmDialog title="Activate Provider"
          message={`Reactivate ${selectedProvider.name}? They will regain full patient access.`}
          confirmLabel="Activate" confirmClass={styles.btnSuccess}
          onConfirm={() => handleActivate(selectedProvider)} onClose={closeModal} />
      )}
      {modal === "confirm-deactivate" && selectedProvider && (
        <ConfirmDialog title="Deactivate Provider"
          message={`Deactivate ${selectedProvider.name}? They will be unable to log in or access the platform.`}
          confirmLabel="Deactivate" confirmClass={styles.btnDanger}
          onConfirm={() => handleDeactivate(selectedProvider)} onClose={closeModal} />
      )}
      {modal === "confirm-approve" && selectedProvider && (
        <ConfirmDialog title="Approve Provider"
          message={`Approve ${selectedProvider.name} and grant them Active status?`}
          confirmLabel="Approve" confirmClass={styles.btnSuccess}
          onConfirm={() => handleApprove(selectedProvider)} onClose={closeModal} />
      )}
      {modal === "confirm-reset-password" && selectedProvider && (
        <ConfirmDialog title="Reset Password"
          message={`Send a password reset link to ${selectedProvider.email}?`}
          confirmLabel="Send Reset Link"
          onConfirm={() => showToast("Password reset email sent")} onClose={closeModal} />
      )}
      {modal === "send-notification" && selectedProvider && (
        <NotificationModal provider={selectedProvider} onClose={closeModal}
          onSend={() => showToast("Notification sent successfully")} />
      )}
      {modal === "view-activity" && selectedProvider && (
        <ActivityModal provider={selectedProvider} onClose={closeModal} />
      )}
      {modal === "reject" && selectedProvider && (
        <RejectModal provider={selectedProvider} onClose={closeModal}
          onConfirm={(reason) => handleReject(selectedProvider, reason)} />
      )}
      {modal === "view-docs" && selectedProvider && (
        <ViewDocsModal provider={selectedProvider} onClose={closeModal} />
      )}
      {modal === "request-info" && selectedProvider && (
        <RequestInfoModal provider={selectedProvider} onClose={closeModal}
          onSend={() => showToast("Information request sent")} />
      )}

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Providers</h1>
          <p className={styles.pageSubtitle}>Manage healthcare providers, credentials, and availability</p>
        </div>
        <div className={styles.pageHeaderRight}>
          <button className={styles.btnSecondary} onClick={handleExportAll} aria-label="Export all providers">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 10v3a1 1 0 001 1h10a1 1 0 001-1v-3M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Export
          </button>
          <button className={styles.btnPrimary} onClick={() => openModal("add")} aria-label="Add new provider">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Add Provider
          </button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className={styles.statsBar}>
        {[
          { label: "Total Providers", value: providers.length, color: "#2563eb" },
          { label: "Active", value: providers.filter((p) => p.status === "Active").length, color: "#059669" },
          { label: "Pending Approval", value: providers.filter((p) => p.status === "Pending").length, color: "#d97706" },
          { label: "Suspended", value: providers.filter((p) => p.status === "Suspended").length, color: "#dc2626" },
        ].map(({ label, value, color }) => (
          <div key={label} className={styles.statCard}>
            <span className={styles.statValue} style={{ color }}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Search & Filters ── */}
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M10.5 10.5L13 13" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input className={styles.searchInput} type="search" placeholder="Search by name, email, NPI or license…"
            value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            aria-label="Search providers" />
          {searchQuery && <button className={styles.searchClear} onClick={() => setSearchQuery("")} aria-label="Clear search">✕</button>}
        </div>
        <div className={styles.filters}>
          {([
            { value: filterSpecialty, setter: setFilterSpecialty, options: SPECIALTIES, label: "Specialty" },
            { value: filterStatus, setter: setFilterStatus, options: STATUSES, label: "Status" },
            { value: filterState, setter: setFilterState, options: STATES, label: "State" },
            { value: filterAvail, setter: setFilterAvail, options: AVAILABILITIES, label: "Availability" },
          ] as const).map(({ value, setter, options, label }) => (
            <select key={label} className={styles.filterSelect} value={value}
              onChange={(e) => { (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value); setCurrentPage(1); }}
              aria-label={`Filter by ${label}`}>
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          {hasFilters && <button className={styles.resetFilters} onClick={resetFilters} aria-label="Reset all filters">Reset filters</button>}
        </div>
      </div>

      {/* ── Bulk Actions ── */}
      {selectedRows.size > 0 && (
        <BulkActionsBar count={selectedRows.size} onAction={handleBulkAction} onClear={() => setSelectedRows(new Set())} />
      )}

      {/* ── Tabs ── */}
      <div className={styles.tabsWrap}>
        <div className={styles.tabs} role="tablist" aria-label="Provider categories">
          {TABS.map((tab, i) => (
            <button key={tab} role="tab"
              className={`${styles.tab} ${activeTab === i ? styles.tabActive : ""}`}
              onClick={() => { setActiveTab(i); setCurrentPage(1); setSelectedRows(new Set()); }}
              aria-selected={activeTab === i} aria-controls={`tabpanel-${i}`} id={`tab-${i}`}>
              {tab}
              <span className={`${styles.tabCount} ${activeTab === i ? styles.tabCountActive : ""}`}>
                {tabCounts[tab as keyof typeof tabCounts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Panels ── */}
      <div className={styles.tableCard} role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {loading ? <Spinner /> : (
          <>
            {activeTab === 0 && (
              paginated.length === 0 ? <EmptyState /> :
                <AllProvidersTable
                  providers={paginated} onSelect={handleSelect} selected={selectedRows} onSelectAll={handleSelectAll}
                  onEdit={(p) => openModal("edit", p)}
                  onSuspend={(p) => openModal("confirm-suspend", p)}
                  onActivate={(p) => openModal("confirm-activate", p)}
                  onApprove={(p) => openModal("confirm-approve", p)}
                  onReject={(p) => openModal("reject", p)}
                  onDeactivate={(p) => openModal("confirm-deactivate", p)}
                  onResetPassword={(p) => openModal("confirm-reset-password", p)}
                  onSendNotification={(p) => openModal("send-notification", p)}
                  onViewActivity={(p) => openModal("view-activity", p)} />
            )}
            {activeTab === 1 && (
              <ApprovalsTable providers={providers}
                onApprove={(p) => openModal("confirm-approve", p)}
                onReject={(p) => openModal("reject", p)}
                onViewDocs={(p) => openModal("view-docs", p)}
                onRequestInfo={(p) => openModal("request-info", p)} />
            )}
            {activeTab === 2 && <CredentialingTable providers={providers} />}
            {activeTab === 3 && <AvailabilityTable providers={providers} />}
            {activeTab === 4 && (
              <SuspendedTable providers={providers}
                onActivate={(p) => openModal("confirm-activate", p)}
                onEdit={(p) => openModal("edit", p)} />
            )}
            {activeTab === 0 && filteredList.length > 0 && (
              <Pagination total={filteredList.length} page={currentPage} pageSize={pageSize}
                onPage={setCurrentPage} onPageSize={setPageSize} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Providers;