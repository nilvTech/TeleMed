import React, { useState, useRef, useEffect } from "react";
import styles from "./Billing.module.css";
import jsPDF from "jspdf";

// ─── Types ───────────────────────────────────────────────────────────────────

type PaymentStatus = "Paid" | "Pending" | "Failed" | "Processing";
type InvoiceStatus = "Paid" | "Unpaid" | "Overdue";
type InsuranceStatus = "Active" | "Inactive";
type Tab = "payments" | "invoices" | "insurance" | "payment-methods";

interface Payment {
  id: string;
  date: string;
  provider: string;
  visitType: string;
  totalAmount: number;
  insurancePaid: number;
  patientPaid: number;
  paymentMethod: string;
  status: PaymentStatus;
  cptCode: string;
  diagnosis: string;
  transactionId: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  provider: string;
  amount: number;
  status: InvoiceStatus;
  patientName: string;
  visitDate: string;
  services: string[];
  insuranceCoverage: number;
  balanceDue: number;
}

interface Insurance {
  id: string;
  provider: string;
  planName: string;
  memberId: string;
  groupNumber: string;
  coverageType: string;
  status: InsuranceStatus;
  preference: string;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  cardholderName: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockPayments: Payment[] = [
  {
    id: "PAY-1001",
    date: "2026-03-10",
    provider: "Dr. John Smith",
    visitType: "Video Consultation",
    totalAmount: 150,
    insurancePaid: 120,
    patientPaid: 30,
    paymentMethod: "Visa ••••4242",
    status: "Paid",
    cptCode: "99213",
    diagnosis: "Essential Hypertension (I10)",
    transactionId: "TXN-8821043",
  },
  {
    id: "PAY-1002",
    date: "2026-02-22",
    provider: "Dr. Emily Carter",
    visitType: "Follow-up Visit",
    totalAmount: 200,
    insurancePaid: 160,
    patientPaid: 40,
    paymentMethod: "Mastercard ••••8810",
    status: "Paid",
    cptCode: "99214",
    diagnosis: "Type 2 Diabetes Mellitus (E11.9)",
    transactionId: "TXN-7743210",
  },
  {
    id: "PAY-1003",
    date: "2026-04-01",
    provider: "Dr. Sarah Lee",
    visitType: "Mental Health Session",
    totalAmount: 180,
    insurancePaid: 144,
    patientPaid: 36,
    paymentMethod: "Visa ••••4242",
    status: "Pending",
    cptCode: "90837",
    diagnosis: "Major Depressive Disorder (F33.1)",
    transactionId: "TXN-PENDING",
  },
  {
    id: "PAY-1005",
    date: "2026-03-28",
    provider: "Dr. Patricia Nguyen",
    visitType: "Dermatology Consult",
    totalAmount: 175,
    insurancePaid: 100,
    patientPaid: 75,
    paymentMethod: "Visa ••••4242",
    status: "Paid",
    cptCode: "99202",
    diagnosis: "Atopic Dermatitis (L20.9)",
    transactionId: "TXN-9902341",
  },
  {
    id: "PAY-1006",
    date: "2025-12-05",
    provider: "Dr. John Smith",
    visitType: "Annual Wellness Visit",
    totalAmount: 300,
    insurancePaid: 300,
    patientPaid: 0,
    paymentMethod: "Insurance Only",
    status: "Paid",
    cptCode: "99395",
    diagnosis: "Routine Health Examination (Z00.00)",
    transactionId: "TXN-REF-4421",
  },
  {
    id: "PAY-1004",
    date: "2026-01-15",
    provider: "Dr. Michael Torres",
    visitType: "Urgent Care Visit",
    totalAmount: 250,
    insurancePaid: 0,
    patientPaid: 0,
    paymentMethod: "—",
    status: "Failed",
    cptCode: "99203",
    diagnosis: "Acute Bronchitis (J20.9)",
    transactionId: "TXN-FAILED",
  },
];

const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    invoiceNumber: "INV-2026-0031",
    date: "2026-03-10",
    provider: "Dr. John Smith",
    amount: 150,
    status: "Paid",
    patientName: "Alex Johnson",
    visitDate: "2026-03-10",
    services: ["Video Consultation (99213)", "Blood Pressure Monitoring"],
    insuranceCoverage: 120,
    balanceDue: 0,
  },
  {
    id: "INV-002",
    invoiceNumber: "INV-2026-0028",
    date: "2026-03-01",
    provider: "Dr. Emily Carter",
    amount: 200,
    status: "Unpaid",
    patientName: "Alex Johnson",
    visitDate: "2026-02-28",
    services: ["Office Visit (99214)", "Diabetes Management Counseling"],
    insuranceCoverage: 160,
    balanceDue: 40,
  },
  {
    id: "INV-003",
    invoiceNumber: "INV-2026-0011",
    date: "2026-01-20",
    provider: "Dr. Michael Torres",
    amount: 250,
    status: "Overdue",
    patientName: "Alex Johnson",
    visitDate: "2026-01-15",
    services: [
      "Urgent Care Visit (99203)",
      "Chest X-Ray",
      "Nebulizer Treatment",
    ],
    insuranceCoverage: 0,
    balanceDue: 250,
  },
  {
    id: "INV-004",
    invoiceNumber: "INV-2026-0044",
    date: "2026-04-05",
    provider: "Dr. Sarah Lee",
    amount: 180,
    status: "Unpaid",
    patientName: "Alex Johnson",
    visitDate: "2026-04-01",
    services: ["Psychotherapy Session 53 min (90837)"],
    insuranceCoverage: 144,
    balanceDue: 36,
  },
];

const mockInsurance: Insurance[] = [
  {
    id: "INS-001",
    provider: "Blue Cross Blue Shield",
    planName: "BlueCare PPO Gold",
    memberId: "XCB-998812345",
    groupNumber: "GRP-44820",
    coverageType: "PPO",
    status: "Active",
    preference: "Primary",
  },
  {
    id: "INS-002",
    provider: "Aetna",
    planName: "Aetna Choice POS II",
    memberId: "AET-773401002",
    groupNumber: "GRP-88120",
    coverageType: "POS",
    status: "Inactive",
    preference: "Secondary",
  },
  {
    id: "INS-003",
    provider: "Humana",
    planName: "Medicare Prescription Drug Plans (PDPs)",
    memberId: "HMN-773401002",
    groupNumber: "GRP-99175",
    coverageType: "POS",
    status: "Inactive",
    preference: "Ternary",
  },
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "PM-001",
    brand: "Visa",
    last4: "4242",
    expiryMonth: "08",
    expiryYear: "2027",
    isDefault: true,
    cardholderName: "Alex Johnson",
  },
  {
    id: "PM-002",
    brand: "Mastercard",
    last4: "8810",
    expiryMonth: "11",
    expiryYear: "2026",
    isDefault: false,
    cardholderName: "Alex Johnson",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const PAYMENT_STATUS_CLASS: Record<PaymentStatus, string> = {
  Paid: styles.badgeGreen,
  Pending: styles.badgeYellow,
  Failed: styles.badgeRed,
  Processing: styles.badgeBlue,
};

const INVOICE_STATUS_CLASS: Record<InvoiceStatus, string> = {
  Paid: styles.badgeGreen,
  Unpaid: styles.badgeYellow,
  Overdue: styles.badgeRed,
};

const CARD_ICONS: Record<string, string> = {
  Visa: "💳",
  Mastercard: "💳",
  "American Express": "💳",
  Discover: "💳",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

// -------------- Payment Receipt Download function -----------------
const handleReceiptDownload = (p: Payment) => {
  const doc = new jsPDF();

  // Calculate remaining balance
  const remainingBalance = p.totalAmount - p.insurancePaid - p.patientPaid;

  // =============================
  // 1. HEADER
  // =============================

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("TeleMed", 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Official Digital Payment Receipt", 20, 32);

  // =============================
  // 2. TITLE
  // =============================

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Payment Receipt", 20, 60);

  doc.setDrawColor(229, 231, 235);
  doc.line(20, 65, 190, 65);

  // =============================
  // 3. LEFT COLUMN LABELS
  // =============================

  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");

  doc.text("Receipt Number", 20, 80);
  doc.text("Payment Date", 20, 95);
  doc.text("Provider", 20, 110);
  doc.text("Visit Type", 20, 125);
  doc.text("CPT Code", 20, 140);
  doc.text("Diagnosis", 20, 155);

  doc.text("Total Amount", 20, 175);
  doc.text("Insurance Paid", 20, 190);
  doc.text("Patient Paid", 20, 205);
  doc.text("Remaining Balance", 20, 220);

  doc.text("Payment Method", 20, 240);
  doc.text("Transaction ID", 20, 255);
  doc.text("Status", 20, 270);

  // =============================
  // 4. RIGHT COLUMN VALUES
  // =============================

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");

  doc.text(`${p.id}`, 90, 80);

  doc.text(new Date(p.date).toLocaleDateString("en-US"), 90, 95);

  doc.text(`${p.provider}`, 90, 110);
  doc.text(`${p.visitType}`, 90, 125);

  doc.text(`${p.cptCode}`, 90, 140);
  doc.text(`${p.diagnosis}`, 90, 155);

  doc.text(`$${p.totalAmount.toFixed(2)}`, 90, 175);
  doc.text(`$${p.insurancePaid.toFixed(2)}`, 90, 190);
  doc.text(`$${p.patientPaid.toFixed(2)}`, 90, 205);

  doc.text(`$${remainingBalance.toFixed(2)}`, 90, 220);

  doc.text(`${p.paymentMethod}`, 90, 240);
  doc.text(`${p.transactionId}`, 90, 255);

  // =============================
  // 5. STATUS COLOR LOGIC
  // =============================

  if (p.status === "Paid") {
    doc.setTextColor(16, 185, 129); // Green
  } else if (p.status === "Pending") {
    doc.setTextColor(245, 158, 11); // Orange
  } else {
    doc.setTextColor(239, 68, 68); // Red
  }

  doc.text(p.status.toUpperCase(), 90, 270);

  // =============================
  // 6. FOOTER
  // =============================

  doc.setDrawColor(229, 231, 235);
  doc.line(20, 285, 190, 285);

  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.setFont("helvetica", "italic");

  const footerText =
    "This is a computer-generated receipt. No signature is required.";

  const center = doc.internal.pageSize.getWidth() / 2;

  doc.text(footerText, center, 295, {
    align: "center",
  });

  // =============================
  // 7. SAVE FILE
  // =============================

  doc.save(`Receipt-${p.id}.pdf`);
};


// ----------------- Invoice Donwload Function -------------------------
const handleInvoiceDownload = (inv: Invoice) => {
  const doc = new jsPDF();

  // =============================
  // 1. HEADER
  // =============================

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("TeleMed", 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Official Billing Invoice", 20, 32);

  // =============================
  // 2. TITLE
  // =============================

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice", 20, 60);

  doc.setDrawColor(229, 231, 235);
  doc.line(20, 65, 190, 65);

  // =============================
  // 3. LEFT COLUMN LABELS
  // =============================

  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");

  doc.text("Invoice Number", 20, 80);
  doc.text("Invoice Date", 20, 95);
  doc.text("Due Date", 20, 110);

  doc.text("Patient Name", 20, 125);
  doc.text("Provider", 20, 140);
  doc.text("Visit Date", 20, 155);

  doc.text("Services", 20, 175);

  doc.text("Total Amount", 20, 195);
  doc.text("Insurance Coverage", 20, 210);
  doc.text("Balance Due", 20, 225);

  doc.text("Status", 20, 245);

  // =============================
  // 4. RIGHT COLUMN VALUES
  // =============================

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");

  doc.text(`${inv.invoiceNumber}`, 90, 80);

  doc.text(
    new Date(inv.date).toLocaleDateString("en-US"),
    90,
    95
  );

  doc.text(
    new Date(inv.dueDate).toLocaleDateString("en-US"),
    90,
    110
  );

  doc.text(`${inv.patientName}`, 90, 125);
  doc.text(`${inv.provider}`, 90, 140);

  doc.text(
    new Date(inv.visitDate).toLocaleDateString("en-US"),
    90,
    155
  );

  doc.text(`${inv.services}`, 90, 175);

  doc.text(`$${inv.amount.toFixed(2)}`, 90, 195);
  doc.text(`$${inv.insuranceCoverage.toFixed(2)}`, 90, 210);
  doc.text(`$${inv.balanceDue.toFixed(2)}`, 90, 225);

  // =============================
  // 5. STATUS COLOR LOGIC
  // =============================

  if (inv.status === "Paid") {
    doc.setTextColor(16, 185, 129); // Green
  } else if (inv.status === "Unpaid") {
    doc.setTextColor(245, 158, 11); // Orange
  } else if (inv.status === "Overdue") {
    doc.setTextColor(239, 68, 68); // Red
  }

  doc.text(inv.status.toUpperCase(), 90, 245);

  // =============================
  // 6. FOOTER
  // =============================

  doc.setDrawColor(229, 231, 235);
  doc.line(20, 285, 190, 285);

  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.setFont("helvetica", "italic");

  const footerText =
    "This is a computer-generated invoice. Please complete payment before the due date.";

  const center =
    doc.internal.pageSize.getWidth() / 2;

  doc.text(footerText, center, 295, {
    align: "center",
  });

  // =============================
  // 7. SAVE FILE
  // =============================

  doc.save(`Invoice-${inv.invoiceNumber}.pdf`);
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = "600px",
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      overlayRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      ref={overlayRef}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modalBox} style={{ maxWidth: width }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

// ─── Payment Details Modal ────────────────────────────────────────────────────

const PaymentDetailsModal: React.FC<{
  payment: Payment | null;
  onClose: () => void;
}> = ({ payment, onClose }) => {
  if (!payment) return null;
  return (
    <Modal isOpen={!!payment} onClose={onClose} title="Payment Details">
      <div className={styles.detailGrid}>
        <div className={styles.detailRow}>
          <span>Payment ID</span>
          <strong>{payment.id}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Appointment Date</span>
          <strong>{fmtDate(payment.date)}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Provider</span>
          <strong>{payment.provider}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Visit Type</span>
          <strong>{payment.visitType}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>CPT Code</span>
          <strong>{payment.cptCode}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Diagnosis</span>
          <strong>{payment.diagnosis}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Total Amount</span>
          <strong>{fmt(payment.totalAmount)}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Insurance Paid</span>
          <strong className={styles.textGreen}>
            {fmt(payment.insurancePaid)}
          </strong>
        </div>
        <div className={styles.detailRow}>
          <span>Patient Paid</span>
          <strong>{fmt(payment.patientPaid)}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Payment Method</span>
          <strong>{payment.paymentMethod}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Status</span>
          <span
            className={`${styles.badge} ${PAYMENT_STATUS_CLASS[payment.status]}`}
          >
            {payment.status}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span>Transaction ID</span>
          <strong className={styles.mono}>{payment.transactionId}</strong>
        </div>
      </div>
      <div className={styles.modalActions}>
        <button
          className={styles.btnOutline}
          onClick={() => handleReceiptDownload(payment)}
        >
          ⬇ Download Receipt
        </button>
        <button className={styles.btnPrimary} onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

// ─── Invoice View Modal ───────────────────────────────────────────────────────

const InvoiceViewModal: React.FC<{
  invoice: Invoice | null;
  onClose: () => void;
}> = ({ invoice, onClose }) => {
  if (!invoice) return null;
  return (
    <Modal
      isOpen={!!invoice}
      onClose={onClose}
      title="Invoice Details"
      width="640px"
    >
      <div className={styles.invoiceHeader}>
        <div>
          <p className={styles.invoiceMeta}>
            Invoice #<strong>{invoice.invoiceNumber}</strong>
          </p>
          <p className={styles.invoiceMeta}>
            Date: <strong>{fmtDate(invoice.date)}</strong>
          </p>
        </div>
        <span
          className={`${styles.badge} ${INVOICE_STATUS_CLASS[invoice.status]}`}
        >
          {invoice.status}
        </span>
      </div>
      <div className={styles.detailGrid} style={{ marginTop: "1rem" }}>
        <div className={styles.detailRow}>
          <span>Patient Name</span>
          <strong>{invoice.patientName}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Provider</span>
          <strong>{invoice.provider}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Visit Date</span>
          <strong>{fmtDate(invoice.visitDate)}</strong>
        </div>
      </div>
      <div className={styles.servicesBox}>
        <p className={styles.servicesLabel}>Services Rendered</p>
        {invoice.services.map((s, i) => (
          <div key={i} className={styles.serviceItem}>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <div className={styles.invoiceTotals}>
        <div className={styles.totalRow}>
          <span>Total Amount</span>
          <span>{fmt(invoice.amount)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Insurance Coverage</span>
          <span className={styles.textGreen}>
            −{fmt(invoice.insuranceCoverage)}
          </span>
        </div>
        <div className={`${styles.totalRow} ${styles.totalRowFinal}`}>
          <span>Balance Due</span>
          <span>{fmt(invoice.balanceDue)}</span>
        </div>
      </div>
      <div className={styles.modalActions}>
        <button
          className={styles.btnOutline}
          onClick={() => handleInvoiceDownload(invoice)}
        >
          ⬇ Download Invoice
        </button>
        <button className={styles.btnPrimary} onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

// ─── Add Insurance Modal ──────────────────────────────────────────────────────

interface InsuranceForm {
  provider: string;
  planName: string;
  memberId: string;
  groupNumber: string;
  policyHolderName: string;
  relationship: string;
  effectiveDate: string;
}

const AddInsuranceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InsuranceForm) => void;
  initial?: Insurance | null;
}> = ({ isOpen, onClose, onSave, initial }) => {
  const [form, setForm] = useState<InsuranceForm>({
    provider: initial?.provider ?? "",
    planName: initial?.planName ?? "",
    memberId: initial?.memberId ?? "",
    groupNumber: initial?.groupNumber ?? "",
    policyHolderName: "",
    relationship: "Self",
    effectiveDate: "",
  });

  useEffect(() => {
    if (initial) {
      setForm((f) => ({
        ...f,
        provider: initial.provider,
        planName: initial.planName,
        memberId: initial.memberId,
        groupNumber: initial.groupNumber,
      }));
    }
  }, [initial]);

  const handleChange = (field: keyof InsuranceForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? "Edit Insurance" : "Add Insurance"}
    >
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="ins-provider">Insurance Provider</label>
          <input
            id="ins-provider"
            className={styles.input}
            value={form.provider}
            onChange={(e) => handleChange("provider", e.target.value)}
            placeholder="e.g. Blue Cross Blue Shield"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="ins-plan">Plan Name</label>
          <input
            id="ins-plan"
            className={styles.input}
            value={form.planName}
            onChange={(e) => handleChange("planName", e.target.value)}
            placeholder="e.g. BlueCare PPO Gold"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="ins-member">Member ID</label>
          <input
            id="ins-member"
            className={styles.input}
            value={form.memberId}
            onChange={(e) => handleChange("memberId", e.target.value)}
            placeholder="e.g. XCB-998812345"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="ins-group">Group Number</label>
          <input
            id="ins-group"
            className={styles.input}
            value={form.groupNumber}
            onChange={(e) => handleChange("groupNumber", e.target.value)}
            placeholder="e.g. GRP-44820"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="ins-holder">Policy Holder Name</label>
          <input
            id="ins-holder"
            className={styles.input}
            value={form.policyHolderName}
            onChange={(e) => handleChange("policyHolderName", e.target.value)}
            placeholder="Full legal name"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="ins-relation">Relationship to Patient</label>
          <select
            id="ins-relation"
            className={styles.input}
            value={form.relationship}
            onChange={(e) => handleChange("relationship", e.target.value)}
          >
            <option>Self</option>
            <option>Spouse</option>
            <option>Child</option>
            <option>Other</option>
          </select>
        </div>
        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label htmlFor="ins-date">Effective Date</label>
          <input
            id="ins-date"
            type="date"
            className={styles.input}
            value={form.effectiveDate}
            onChange={(e) => handleChange("effectiveDate", e.target.value)}
          />
        </div>
      </div>
      <div className={styles.modalActions}>
        <button className={styles.btnGhost} onClick={onClose}>
          Cancel
        </button>
        <button
          className={styles.btnPrimary}
          onClick={() => {
            onSave(form);
            onClose();
          }}
        >
          Save Insurance
        </button>
      </div>
    </Modal>
  );
};

// ─── Add Card Modal ───────────────────────────────────────────────────────────

interface CardForm {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  zip: string;
}

const AddCardModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CardForm) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<CardForm>({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    zip: "",
  });

  const handleChange = (field: keyof CardForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const formatCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Payment Card">
      <div className={styles.formGrid}>
        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label htmlFor="card-name">Cardholder Name</label>
          <input
            id="card-name"
            className={styles.input}
            value={form.cardholderName}
            onChange={(e) => handleChange("cardholderName", e.target.value)}
            placeholder="As shown on card"
          />
        </div>
        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label htmlFor="card-number">Card Number</label>
          <input
            id="card-number"
            className={`${styles.input} ${styles.mono}`}
            value={formatCard(form.cardNumber)}
            onChange={(e) =>
              handleChange("cardNumber", e.target.value.replace(/\s/g, ""))
            }
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            inputMode="numeric"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="card-exp-month">Expiry Month</label>
          <select
            id="card-exp-month"
            className={styles.input}
            value={form.expiryMonth}
            onChange={(e) => handleChange("expiryMonth", e.target.value)}
          >
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) =>
              String(i + 1).padStart(2, "0"),
            ).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="card-exp-year">Expiry Year</label>
          <select
            id="card-exp-year"
            className={styles.input}
            value={form.expiryYear}
            onChange={(e) => handleChange("expiryYear", e.target.value)}
          >
            <option value="">Year</option>
            {Array.from({ length: 8 }, (_, i) => String(2026 + i)).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="card-cvv">CVV</label>
          <input
            id="card-cvv"
            className={`${styles.input} ${styles.mono}`}
            value={form.cvv}
            onChange={(e) =>
              handleChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="•••"
            maxLength={4}
            inputMode="numeric"
            type="password"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="card-zip">Billing ZIP Code</label>
          <input
            id="card-zip"
            className={styles.input}
            value={form.zip}
            onChange={(e) =>
              handleChange("zip", e.target.value.replace(/\D/g, "").slice(0, 5))
            }
            placeholder="90210"
            maxLength={5}
            inputMode="numeric"
          />
        </div>
      </div>
      <div className={styles.secureNote}>
        🔒 Your card information is encrypted and stored securely.
      </div>
      <div className={styles.modalActions}>
        <button className={styles.btnGhost} onClick={onClose}>
          Cancel
        </button>
        <button
          className={styles.btnPrimary}
          onClick={() => {
            onSave(form);
            onClose();
          }}
        >
          Save Card
        </button>
      </div>
    </Modal>
  );
};

// ─── Payments Tab ─────────────────────────────────────────────────────────────

const PaymentsTab: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [loading] = useState(false);

  const statuses: string[] = ["All", "Paid", "Pending", "Failed", "Processing"];

  const filtered = payments.filter((p) => {
    const matchSearch =
      p.provider.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.visitType.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Payments</h2>
          <p className={styles.sectionDesc}>
            View your payment history and outstanding balances.
          </p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden="true">
            🔍
          </span>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search by provider, visit type, or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search payments"
          />
        </div>
        <div
          className={styles.filterGroup}
          role="group"
          aria-label="Filter by status"
        >
          {statuses.map((s) => (
            <button
              key={s}
              className={`${styles.filterBtn} ${statusFilter === s ? styles.filterBtnActive : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading} aria-live="polite">
          <div className={styles.spinner} aria-label="Loading" />
          <p>Loading payments…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>💳</span>
          <h3>No payments found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table
            className={styles.table}
            role="table"
            aria-label="Payments table"
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Provider</th>
                <th>Visit Type</th>
                <th>Total</th>
                <th>Ins. Paid</th>
                <th>You Paid</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={styles.tableRow}>
                  <td>{fmtDate(p.date)}</td>
                  <td>
                    <div className={styles.providerCell}>
                      <div className={styles.avatar}>
                        {p.provider.split(" ").slice(-1)[0][0]}
                      </div>
                      <span>{p.provider}</span>
                    </div>
                  </td>
                  <td>{p.visitType}</td>
                  <td className={styles.mono}>{fmt(p.totalAmount)}</td>
                  <td className={`${styles.mono} ${styles.textGreen}`}>
                    {fmt(p.insurancePaid)}
                  </td>
                  <td className={styles.mono}>{fmt(p.patientPaid)}</td>
                  <td className={styles.methodCell}>{p.paymentMethod}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${PAYMENT_STATUS_CLASS[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => setSelectedPayment(p)}
                        aria-label={`View details for ${p.id}`}
                      >
                        View Details
                      </button>
                      <button
                        className={styles.actionBtnSecondary}
                        onClick={() => handleReceiptDownload(p)}
                        aria-label={`Download receipt for ${p.id}`}
                        hidden={p.status !== "Paid"}
                      >
                        ⬇ Receipt
                      </button>
                      {/* {(p.status === "Pending" ||
                        p.status === "Failed" ||
                        p.status === "Partially Paid") && (
                        <button
                          className={styles.actionBtnPay}
                          aria-label={`Pay now for ${p.id}`}
                        >
                          Pay Now
                        </button>
                      )} */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaymentDetailsModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </div>
  );
};

// ─── Invoices Tab ─────────────────────────────────────────────────────────────

const InvoicesTab: React.FC = () => {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const statuses = ["All", "Paid", "Unpaid", "Overdue"];

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.provider.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Invoices</h2>
          <p className={styles.sectionDesc}>
            View and download your medical invoices.
          </p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search by invoice number or provider…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search invoices"
          />
        </div>
        <div
          className={styles.filterGroup}
          role="group"
          aria-label="Filter invoices by status"
        >
          {statuses.map((s) => (
            <button
              key={s}
              className={`${styles.filterBtn} ${statusFilter === s ? styles.filterBtnActive : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🧾</span>
          <h3>No invoices found</h3>
          <p>Your invoices will appear here after each visit.</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table} aria-label="Invoices table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Provider</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className={styles.tableRow}>
                  <td className={styles.mono}>{inv.invoiceNumber}</td>
                  <td>{fmtDate(inv.date)}</td>
                  <td>
                    <div className={styles.providerCell}>
                      <div className={styles.avatar}>
                        {inv.provider.split(" ").slice(-1)[0][0]}
                      </div>
                      <span>{inv.provider}</span>
                    </div>
                  </td>
                  <td className={styles.mono}>{fmt(inv.amount)}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${INVOICE_STATUS_CLASS[inv.status]}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        View Invoice
                      </button>
                      <button
                        className={styles.actionBtnSecondary}
                        onClick={() =>
                          handleInvoiceDownload(inv)
                        }
                      >
                        ⬇ PDF
                      </button>
                      {/* {inv.status !== "Paid" && (
                        <button className={styles.actionBtnPay}>Pay Now</button>
                      )} */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <InvoiceViewModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};

// ─── Insurance Tab ────────────────────────────────────────────────────────────

const InsuranceTab: React.FC = () => {
  const [insurances, setInsurances] = useState<Insurance[]>(mockInsurance);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Insurance | null>(null);

  const handleSave = (data: InsuranceForm) => {
    if (editTarget) {
      setInsurances((prev) =>
        prev.map((ins) =>
          ins.id === editTarget.id
            ? {
                ...ins,
                provider: data.provider,
                planName: data.planName,
                memberId: data.memberId,
                groupNumber: data.groupNumber,
              }
            : ins,
        ),
      );
      setEditTarget(null);
    } else {
      const newIns: Insurance = {
        id: `INS-${Date.now()}`,
        provider: data.provider,
        planName: data.planName,
        memberId: data.memberId,
        groupNumber: data.groupNumber,
        coverageType: "PPO",
        status: "Active",
        preference: "",
      };
      setInsurances((prev) => [...prev, newIns]);
    }
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this insurance plan?")) {
      setInsurances((prev) => prev.filter((ins) => ins.id !== id));
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Insurance</h2>
          <p className={styles.sectionDesc}>
            Manage your health insurance plans on file.
          </p>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={() => setShowAddModal(true)}
        >
          + Add Insurance
        </button>
      </div>

      {insurances.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🏥</span>
          <h3>No insurance on file</h3>
          <p>Add your insurance information to streamline billing.</p>
          <button
            className={styles.btnPrimary}
            onClick={() => setShowAddModal(true)}
          >
            Add Insurance
          </button>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {insurances.map((ins) => (
            <div key={ins.id} className={styles.insuranceCard}>
              <div className={styles.insuranceCardHeader}>
                <div className={styles.insLogo}>
                  {ins.provider.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className={styles.insProvider}>{ins.provider}</h3>
                  <p className={styles.insPlan}>{ins.planName}</p>
                </div>
                <span
                  className={`${styles.badge} ${ins.status === "Active" ? styles.badgeGreen : styles.badgeRed}`}
                >
                  {ins.status}
                </span>
                <span
                  className={`${styles.badge} ${ins.preference === "Primary" ? styles.badgeGreen : styles.badgeRed}`}
                >
                  {ins.preference}
                </span>
              </div>
              <div className={styles.insDetails}>
                <div className={styles.insDetailRow}>
                  <span>Member ID</span>
                  <strong className={styles.mono}>{ins.memberId}</strong>
                </div>
                <div className={styles.insDetailRow}>
                  <span>Group Number</span>
                  <strong className={styles.mono}>{ins.groupNumber}</strong>
                </div>
                <div className={styles.insDetailRow}>
                  <span>Coverage Type</span>
                  <strong>{ins.coverageType}</strong>
                </div>
              </div>
              <div className={styles.insActions}>
                <button
                  className={styles.actionBtn}
                  onClick={() => {
                    setEditTarget(ins);
                    setShowAddModal(true);
                  }}
                  aria-label={`Edit ${ins.provider}`}
                >
                  ✏ Edit
                </button>
                <button
                  className={styles.actionBtnDanger}
                  onClick={() => handleDelete(ins.id)}
                  aria-label={`Delete ${ins.provider}`}
                >
                  🗑 Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddInsuranceModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditTarget(null);
        }}
        onSave={handleSave}
        initial={editTarget}
      />
    </div>
  );
};

// ─── Payment Methods Tab ──────────────────────────────────────────────────────

const PaymentMethodsTab: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSetDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  const handleRemove = (id: string) => {
    if (confirm("Remove this payment method?")) {
      setMethods((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleSaveCard = (data: CardForm) => {
    const detectedBrand = data.cardNumber.startsWith("4")
      ? "Visa"
      : data.cardNumber.startsWith("5")
        ? "Mastercard"
        : "Card";
    const newMethod: PaymentMethod = {
      id: `PM-${Date.now()}`,
      brand: detectedBrand,
      last4: data.cardNumber.slice(-4),
      expiryMonth: data.expiryMonth,
      expiryYear: data.expiryYear,
      isDefault: methods.length === 0,
      cardholderName: data.cardholderName,
    };
    setMethods((prev) => [...prev, newMethod]);
  };

  const cardGradient = (brand: string) => {
    if (brand === "Visa")
      return "linear-gradient(135deg, #1a1f5e 0%, #2d3591 100%)";
    if (brand === "Mastercard")
      return "linear-gradient(135deg, #eb5757 0%, #B06AB3 100%)";
    return "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)";
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Payment Methods</h2>
          <p className={styles.sectionDesc}>
            Manage your saved cards for co-pays and balances.
          </p>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={() => setShowAddModal(true)}
        >
          + Add Card
        </button>
      </div>

      {methods.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>💳</span>
          <h3>No payment methods saved</h3>
          <p>
            Add a card to quickly pay your co-pays and outstanding balances.
          </p>
          <button
            className={styles.btnPrimary}
            onClick={() => setShowAddModal(true)}
          >
            Add Card
          </button>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {methods.map((m) => (
            <div
              key={m.id}
              className={styles.cardVisual}
              style={{ background: cardGradient(m.brand) }}
              aria-label={`${m.brand} card ending in ${m.last4}`}
            >
              <div className={styles.cardTop}>
                <div className={styles.cardChip} aria-hidden="true">
                  <div />
                  <div />
                </div>
                {m.isDefault && (
                  <span className={styles.defaultBadge}>Default</span>
                )}
              </div>
              <div
                className={styles.cardNumber}
                aria-label={`Card number ending in ${m.last4}`}
              >
                •••• •••• •••• {m.last4}
              </div>
              <div className={styles.cardBottom}>
                <div>
                  <div className={styles.cardLabel}>Cardholder</div>
                  <div className={styles.cardValue}>{m.cardholderName}</div>
                </div>
                <div>
                  <div className={styles.cardLabel}>Expires</div>
                  <div className={styles.cardValue}>
                    {m.expiryMonth}/{m.expiryYear}
                  </div>
                </div>
                <div className={styles.cardBrand}>{m.brand}</div>
              </div>
              <div className={styles.cardActions}>
                {!m.isDefault && (
                  <button
                    className={styles.cardActionBtn}
                    onClick={() => handleSetDefault(m.id)}
                  >
                    Set Default
                  </button>
                )}
                <button
                  className={styles.cardActionBtnDanger}
                  onClick={() => handleRemove(m.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCardModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveCard}
      />
    </div>
  );
};

// ─── Main Billing Component ───────────────────────────────────────────────────

const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("payments");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "payments", label: "Payments", icon: "💰" },
    { id: "invoices", label: "Invoices", icon: "🧾" },
    { id: "insurance", label: "Insurance", icon: "🏥" },
    { id: "payment-methods", label: "Payment Methods", icon: "💳" },
  ];

  const summaryStats = [
    {
      label: "Total Paid (2026)",
      value: "$70.00",
      sub: "2 payments",
      color: "#10b981",
    },
    {
      label: "Pending Balance",
      value: "$111.00",
      sub: "3 invoices",
      color: "#f59e0b",
    },
    {
      label: "Insurance Savings",
      value: "$544.00",
      sub: "YTD coverage",
      color: "#3b82f6",
    },
    {
      label: "Next Due Date",
      value: "Apr 30",
      sub: "INV-2026-0028",
      color: "#8b5cf6",
    },
  ];

  return (
    <div className={styles.billingRoot}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Billing & Payments</h1>
          <p className={styles.pageSubtitle}>
            Manage your payments, invoices, and insurance information.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryStrip}>
        {summaryStats.map((stat) => (
          <div key={stat.label} className={styles.summaryCard}>
            <div
              className={styles.summaryDot}
              style={{ background: stat.color }}
              aria-hidden="true"
            />
            <div>
              <div
                className={styles.summaryValue}
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className={styles.summaryLabel}>{stat.label}</div>
              <div className={styles.summarySub}>{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div
        className={styles.tabNav}
        role="tablist"
        aria-label="Billing sections"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-label={activeTab}
        className={styles.panelWrap}
      >
        {activeTab === "payments" && <PaymentsTab />}
        {activeTab === "invoices" && <InvoicesTab />}
        {activeTab === "insurance" && <InsuranceTab />}
        {activeTab === "payment-methods" && <PaymentMethodsTab />}
      </div>
    </div>
  );
};

export default Billing;
