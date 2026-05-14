import React, { useState, useEffect, useRef } from "react";
import styles from "./Encounter.module.css";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";

import jsPDF from "jspdf";
//import { useLocation } from "react-router-dom";

// ─── Types ─────────────────────────────────────────────────────────────────
type TabType = "S" | "O" | "A" | "P";
type SaveStatus = "saved" | "saving" | "unsaved";
type ConnectionStatus = "stable" | "weak" | "reconnecting";

interface SOAPData {
  chiefCondition: string;
  hpi: string;
  symptoms: string;
  symptomDuration: string;
  painScale: string;
  ros: string;
  bp: string;
  temperature: string;
  pulse: string;
  spo2: string;
  respiratoryRate: string;
  weight: string;
  clinicalObservations: string;
  clinicalImpression: string;
  primaryDiagnosis: string;
  icd10Code: string;
  differentialDiagnosis: string;
  severity: string;
  treatmentPlan: string;
  medicationPlan: string;
  labOrders: string;
  referral: string;
  followUpDate: string;
  patientInstructions: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_PATIENT = {
  encounterId: "ENC-20260513-1001",
  name: "John Doe",
  initials: "JD",
  dob: "Mar 15, 1978",
  mrn: "MRN-4821093",
  insurance: "BlueCross PPO",
  age: 48,
};

const MOCK_PROVIDER = {
  name: "Dr. Sarah Wilson",
  initials: "SW",
  specialty: "Internal Medicine",
  npi: "NPI-1234567890",
};

const MOCK_EHR = {
  pastConditions: ["Diabetes Type 2", "Hypertension"],
  allergies: ["Penicillin", "Dust Allergy"],
  currentMedications: ["Metformin 1000mg", "Aspirin 81mg", "Lisinopril 10mg"],
  previousEncounters: [
    { date: "Jan 2026", description: "Fever Consultation" },
    { date: "Mar 2026", description: "Hypertension Follow-up" },
  ],
};

const ICD10_OPTIONS = [
  {
    code: "J06.9",
    description: "Acute upper respiratory infection, unspecified",
  },
  { code: "J00", description: "Acute nasopharyngitis (common cold)" },
  { code: "J02.9", description: "Acute pharyngitis, unspecified" },
  { code: "R05", description: "Cough" },
  { code: "R50.9", description: "Fever, unspecified" },
  { code: "J20.9", description: "Acute bronchitis, unspecified" },
  { code: "J18.9", description: "Pneumonia, unspecified organism" },
  {
    code: "Z10.0",
    description: "Routine general health check-up of defined subpopulation",
  },
];

const INITIAL_SOAP: SOAPData = {
  chiefCondition: "",
  hpi: "",
  symptoms: "",
  symptomDuration: "",
  painScale: "",
  ros: "",
  bp: "",
  temperature: "",
  pulse: "",
  spo2: "",
  respiratoryRate: "",
  weight: "",
  clinicalObservations: "",
  clinicalImpression: "",
  primaryDiagnosis: "",
  icd10Code: "",
  differentialDiagnosis: "",
  severity: "",
  treatmentPlan: "",
  medicationPlan: "",
  labOrders: "",
  referral: "",
  followUpDate: "",
  patientInstructions: "",
};

// ─── Inline SVG Icons ───────────────────────────────────────────────────────
const MicIcon = ({ muted }: { muted?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
    {muted && <line x1="1" y1="1" x2="23" y2="23" />}
  </svg>
);

const CameraIcon = ({ off }: { off?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {off ? (
      <>
        <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34" />
        <path d="M23 7l-7 5 7 5V7z" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    )}
  </svg>
);

// const ChatIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     width="18"
//     height="18"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//   </svg>
// );

const ScreenShareIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <polyline points="9 10 12 7 15 10" />
    <line x1="12" y1="7" x2="12" y2="13" />
  </svg>
);

// const HoldIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     width="18"
//     height="18"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <rect x="6" y="4" width="4" height="16" />
//     <rect x="14" y="4" width="4" height="16" />
//   </svg>
// );

// const ResumeIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     width="18"
//     height="18"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <polygon points="5 3 19 12 5 21 5 3" />
//   </svg>
// );

// const PhoneOffIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     width="18"
//     height="18"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 17.25 7.76 15.59 6.32 13.7" />
//     <path d="M6.32 6.32A15.92 15.92 0 0 0 3.07 14.37" />
//     <line x1="1" y1="1" x2="23" y2="23" />
//   </svg>
// );

const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// ─── Main Component ─────────────────────────────────────────────────────────
const Encounter: React.FC = () => {
  const [elapsed, setElapsed] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<TabType>("S");
  const [micOn, setMicOn] = useState<boolean>(true);
  const [cameraOn, setCameraOn] = useState<boolean>(true);
  // const [onHold, setOnHold] = useState<boolean>(false);
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  // const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [connectionStatus] = useState<ConnectionStatus>("stable");
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showEndModal, setShowEndModal] = useState<boolean>(false);
  const [soapData, setSoapData] = useState<SOAPData>(INITIAL_SOAP);
  const [icd10Search, setIcd10Search] = useState<string>("");
  const [showIcd10Dropdown, setShowIcd10Dropdown] = useState<boolean>(false);
  const [saveAnimation, setSaveAnimation] = useState<boolean>(false);

  const [showSOAPPreview, setShowSOAPPreview] = useState<boolean>(false);

  const icd10Ref = useRef<HTMLDivElement>(null);

  // ── Live Timer ───────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Autosave every 30 s ──────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setSaveStatus("saving");
      setTimeout(() => {
        setSaveStatus("saved");
        setSaveAnimation(true);
        setTimeout(() => setSaveAnimation(false), 2000);
      }, 1400);
    }, 30000);
    return () => clearInterval(id);
  }, []);

  // ── Close ICD-10 dropdown on outside click ───────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (icd10Ref.current && !icd10Ref.current.contains(e.target as Node)) {
        setShowIcd10Dropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const formatTime = (s: number): string => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleSOAPChange = (field: keyof SOAPData, value: string): void => {
    setSoapData((prev) => ({ ...prev, [field]: value }));
    setSaveStatus("unsaved");
  };

  const handleManualSave = (): void => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      setSaveAnimation(true);
      setTimeout(() => setSaveAnimation(false), 2000);
    }, 1200);
  };

  const connectionMeta: Record<
    ConnectionStatus,
    { label: string; cls: string }
  > = {
    stable: { label: "Stable", cls: styles.dotGreen },
    weak: { label: "Weak Signal", cls: styles.dotYellow },
    reconnecting: { label: "Reconnecting…", cls: styles.dotRed },
  };

  const filteredICD10 = ICD10_OPTIONS.filter(
    (o) =>
      o.code.toLowerCase().includes(icd10Search.toLowerCase()) ||
      o.description.toLowerCase().includes(icd10Search.toLowerCase()),
  );

  const encounterDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleCompleteEncounter = () => {
    setShowEndModal(false);
    setShowSOAPPreview(true);
  };
  //const location = useLocation();
  //const {doc} = location.state || {};

  // On Cancel/download encounter summary Navigate to Appointments
  const navToAppt = useNavigate();

  const handleEncounterSummaryEnd = (): void => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const W = pdf.internal.pageSize.getWidth(); // 210 mm
      const H = pdf.internal.pageSize.getHeight(); // 297 mm
      const LM = 15; // left margin
      const RM = 15; // right margin
      const CW = W - LM - RM; // usable content width = 180 mm
      let y = 0;

      // ── Helpers ─────────────────────────────────────────────────────────────
      const newPage = (): void => {
        pdf.addPage();
        y = 22;
      };

      const guard = (needed: number): void => {
        if (y + needed > H - 18) newPage();
      };

      const field = (label: string, value: string, labelW = 38): void => {
        const text = value?.trim() || "—";
        const lines = pdf.splitTextToSize(text, CW - labelW - 4);
        guard(lines.length * 4.5 + 3);
        pdf
          .setFontSize(9)
          .setFont("helvetica", "bold")
          .setTextColor(74, 96, 116);
        pdf.text(`${label}:`, LM + 2, y);
        pdf.setFont("helvetica", "normal").setTextColor(15, 28, 46);
        pdf.text(lines, LM + labelW, y);
        y += lines.length * 4.5 + 2.5;
      };

      const sectionBar = (
        letter: string,
        title: string,
        r: number,
        g: number,
        b: number,
      ): void => {
        guard(14);
        pdf.setFillColor(r, g, b);
        pdf.roundedRect(LM, y, CW, 9, 1.5, 1.5, "F");
        pdf
          .setFontSize(10.5)
          .setFont("helvetica", "bold")
          .setTextColor(255, 255, 255);
        pdf.text(`${letter}   ${title}`, LM + 4, y + 6.2);
        y += 13;
      };

      // ── Header bar ───────────────────────────────────────────────────────────
      pdf.setFillColor(23, 121, 196);
      pdf.rect(0, 0, W, 30, "F");

      pdf
        .setFontSize(15)
        .setFont("helvetica", "bold")
        .setTextColor(255, 255, 255);
      pdf.text("ENCOUNTER SUMMARY", LM, 13);

      pdf.setFontSize(8.5).setFont("helvetica", "normal");
      pdf.text(
        `${MOCK_PATIENT.name}  ·  ${MOCK_PATIENT.encounterId}  ·  ${encounterDate}`,
        LM,
        20,
      );
      pdf.text(
        `Provider: ${MOCK_PROVIDER.name}  ·  Duration: ${formatTime(elapsed)}`,
        LM,
        26,
      );

      y = 38;

      // ── Patient info strip ───────────────────────────────────────────────────
      pdf.setFillColor(238, 244, 251);
      pdf.roundedRect(LM, y, CW, 18, 2, 2, "F");
      pdf.setFontSize(8.5).setTextColor(74, 96, 116);

      const col2 = LM + CW / 3;
      const col3 = LM + (CW / 3) * 2;

      pdf.setFont("helvetica", "bold");
      pdf.text("Patient", LM + 4, y + 6);
      pdf.text("Encounter", col2, y + 6);
      pdf.text("Provider", col3, y + 6);

      pdf.setFont("helvetica", "normal").setTextColor(15, 28, 46);
      pdf.text(`${MOCK_PATIENT.name}, ${MOCK_PATIENT.age} yrs`, LM + 4, y + 12);
      pdf.text(`MRN: ${MOCK_PATIENT.mrn}`, LM + 4, y + 16.5);
      pdf.text(MOCK_PATIENT.encounterId, col2, y + 12);
      pdf.text(`Insurance: ${MOCK_PATIENT.insurance}`, col2, y + 16.5);
      pdf.text(MOCK_PROVIDER.name, col3, y + 12);
      pdf.text(MOCK_PROVIDER.specialty, col3, y + 16.5);

      y += 24;

      // ── S — Subjective ───────────────────────────────────────────────────────
      sectionBar("S", "SUBJECTIVE", 23, 121, 196);
      field("Condition", soapData.chiefCondition);
      field("Symptoms", soapData.symptoms);
      field("Onset", soapData.symptomDuration);
      y += 4;

      // ── O — Objective ────────────────────────────────────────────────────────
      sectionBar("O", "OBJECTIVE", 8, 145, 178);

      // Vitals in a 2-column grid
      const vitals: [string, string][] = [
        ["Blood Pressure", soapData.bp],
        ["Temperature", soapData.temperature],
        ["Pulse", soapData.pulse],
        ["SpO₂", soapData.spo2],
        ["Resp. Rate", soapData.respiratoryRate],
        ["Weight", soapData.weight],
      ];

      const half = CW / 2;
      vitals.forEach(([label, val], idx) => {
        if (idx % 2 === 0) guard(7);
        const xBase = idx % 2 === 0 ? LM + 2 : LM + half + 2;
        pdf
          .setFontSize(9)
          .setFont("helvetica", "bold")
          .setTextColor(74, 96, 116);
        pdf.text(`${label}:`, xBase, y);
        pdf.setFont("helvetica", "normal").setTextColor(15, 28, 46);
        pdf.text(val?.trim() || "—", xBase + 28, y);
        if (idx % 2 !== 0) y += 6.5;
      });
      if (vitals.length % 2 !== 0) y += 6.5;

      if (soapData.clinicalObservations?.trim()) {
        y += 2;
        field("Observations", soapData.clinicalObservations, 30);
      }
      y += 4;

      // ── A — Assessment ───────────────────────────────────────────────────────
      sectionBar("A", "ASSESSMENT", 99, 102, 241);
      field("Diagnosis", soapData.primaryDiagnosis);
      field("ICD-10 Code", soapData.icd10Code);
      field("Severity", soapData.severity);
      y += 4;

      // ── P — Plan ─────────────────────────────────────────────────────────────
      sectionBar("P", "PLAN", 22, 163, 74);
      field("Treatment", soapData.treatmentPlan);
      field("Medications", soapData.medicationPlan);
      field("Lab / Imaging", soapData.labOrders);
      field("Follow-up", soapData.followUpDate);
      field("Instructions", soapData.patientInstructions);
      y += 6;

      // ── Footer ───────────────────────────────────────────────────────────────
      guard(14);
      pdf.setDrawColor(214, 226, 239).setLineWidth(0.3);
      pdf.line(LM, y, W - RM, y);
      y += 5;
      pdf
        .setFontSize(7.5)
        .setFont("helvetica", "italic")
        .setTextColor(160, 180, 200);
      pdf.text(
        `Generated: ${new Date().toLocaleString("en-US")}  ·  ${MOCK_PROVIDER.name}  ·  ${MOCK_PROVIDER.npi}`,
        LM,
        y,
      );
      pdf.text(
        "Confidential — for authorized clinical personnel only.",
        LM,
        y + 4.5,
      );

      // ── Save ─────────────────────────────────────────────────────────────────
      pdf.save("Encounter_Summary.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    }

    setShowSOAPPreview(false);
    navToAppt("/Appointment");
  };


  const handleEncounterSummaryCancel = ()=>{
    setShowSOAPPreview(false);
   navToAppt("/Appointment");
  }
  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      <SideBar />
      <div className={styles.root}>
        {/* ══════════════════ HEADER ══════════════════ */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.encounterIdBlock}>
              <span className={styles.encounterLabel}>ENCOUNTER</span>
              <span className={styles.encounterValue}>
                {MOCK_PATIENT.encounterId}
              </span>
            </div>
            <div className={styles.headerSep} />
            <div className={styles.patientBlock}>
              <div className={styles.patientAvatar}>
                {MOCK_PATIENT.initials}
              </div>
              <div className={styles.patientInfo}>
                <span className={styles.patientName}>{MOCK_PATIENT.name}</span>
                <span className={styles.patientMeta}>
                  DOB: {MOCK_PATIENT.dob} &nbsp;·&nbsp; {MOCK_PATIENT.mrn}{" "}
                  &nbsp;·&nbsp; {MOCK_PATIENT.age} yrs
                </span>
              </div>
            </div>
          </div>

          <div className={styles.headerCenter}>
            <div className={styles.timerBlock}>
              <span className={styles.timerLive} />
              <ClockIcon />
              <span className={styles.timerDisplay}>{formatTime(elapsed)}</span>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.connectionBlock}>
              <span
                className={`${styles.connDot} ${connectionMeta[connectionStatus].cls}`}
              />
              <span className={styles.connLabel}>
                {connectionMeta[connectionStatus].label}
              </span>
            </div>

            <div
              className={`${styles.saveStatusBlock} ${
                saveStatus === "saved"
                  ? styles.saveStatusSaved
                  : saveStatus === "saving"
                    ? styles.saveStatusSaving
                    : styles.saveStatusUnsaved
              } ${saveAnimation ? styles.saveFlash : ""}`}
            >
              {saveStatus === "saved" && "✓ Saved"}
              {saveStatus === "saving" && "⟳ Saving…"}
              {saveStatus === "unsaved" && "● Unsaved"}
            </div>

            <div className={styles.headerProviderBlock}>
              <div className={styles.providerAvatar}>
                {MOCK_PROVIDER.initials}
              </div>
              <span className={styles.providerName}>{MOCK_PROVIDER.name}</span>
            </div>

            <button
              className={styles.exitBtn}
              onClick={() => setShowExitModal(true)}
            >
              Exit
            </button>
          </div>
        </header>
        {/* ══════════════════ MAIN CONTENT ══════════════════ */}
        <main className={styles.main}>
          {/* ── Left: Video Panel (70%) ── */}
          <section className={styles.videoPanel}>
            {/* Patient Video Card */}
            <div className={styles.patientVideoCard}>
              <div className={styles.videoMockBg}>
                {/* Gradient mesh overlay */}
                <div className={styles.videoGradientMesh} />

                {/* Live indicator */}
                <div className={styles.videoTopBar}>
                  <div className={styles.liveIndicator}>
                    <span className={styles.liveDot} />
                    LIVE
                  </div>
                  <div className={styles.videoEncounterId}>
                    {MOCK_PATIENT.encounterId}
                  </div>
                  {screenSharing && (
                    <div className={styles.screenShareBadge}>
                      ⊡ Screen Share Active
                    </div>
                  )}
                </div>

                {/* Patient avatar placeholder */}
                {!cameraOn ? (
                  <div className={styles.cameraOffState}>
                    <div className={styles.cameraOffAvatar}>
                      {MOCK_PATIENT.initials}
                    </div>
                    <span className={styles.cameraOffLabel}>Camera Off</span>
                  </div>
                ) : (
                  <div className={styles.patientAvatarBig}>
                    {MOCK_PATIENT.initials}
                  </div>
                )}

                {/* Hold overlay */}

                {/* Muted badge */}
                {!micOn && (
                  <div className={styles.mutedBadge}>
                    <MicIcon muted />
                    Muted
                  </div>
                )}

                {/* Patient label at bottom */}
                <div className={styles.videoPatientLabel}>
                  <div className={styles.videoPatientName}>
                    {MOCK_PATIENT.name}
                  </div>
                  <div className={styles.videoPatientSub}>
                    Patient · {MOCK_PATIENT.insurance}
                  </div>
                </div>
              </div>

              {/* Provider Self Video (floating mini) */}
              <div className={styles.providerMiniVideo}>
                <div className={styles.miniVideoBg}>
                  <div className={styles.miniProviderAvatar}>
                    {MOCK_PROVIDER.initials}
                  </div>
                  <div className={styles.miniVideoLabel}>
                    <span className={styles.miniVideoName}>
                      {MOCK_PROVIDER.name}
                    </span>
                    <span className={styles.miniVideoRole}>Provider · You</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video status strip */}
            <div className={styles.videoStatusStrip}>
              <div className={styles.videoStatusItem}>
                <span
                  className={`${styles.vStatusDot} ${micOn ? styles.vDotGreen : styles.vDotRed}`}
                />
                {micOn ? "Microphone Active" : "Microphone Muted"}
              </div>
              <div className={styles.videoStatusItem}>
                <span
                  className={`${styles.vStatusDot} ${cameraOn ? styles.vDotGreen : styles.vDotRed}`}
                />
                {cameraOn ? "Camera Active" : "Camera Off"}
              </div>
              <div className={styles.videoStatusItem}>
                <span className={`${styles.vStatusDot} ${styles.vDotGreen}`} />
                Connection Stable — 42ms
              </div>
              {screenSharing && (
                <div className={styles.videoStatusItem}>
                  <span className={`${styles.vStatusDot} ${styles.vDotBlue}`} />
                  Screen Sharing
                </div>
              )}
            </div>
          </section>

          {/* ── Right: SOAP Notes Panel (30%) ── */}
          <aside className={styles.soapPanel}>
            {/* SOAP Header */}
            <div className={styles.soapHeader}>
              <div className={styles.soapTitleRow}>
                <h2 className={styles.soapTitle}>SOAP Notes</h2>
                <div className={styles.soapDateBadge}>{encounterDate}</div>
              </div>
              <div className={styles.soapProviderRow}>
                <div className={styles.soapProviderAvatar}>
                  {MOCK_PROVIDER.initials}
                </div>
                <span className={styles.soapProviderName}>
                  {MOCK_PROVIDER.name}
                </span>
                <span className={styles.soapProviderSpec}>
                  {MOCK_PROVIDER.specialty}
                </span>
              </div>
            </div>

            {/* Tab Bar */}
            <div className={styles.tabBar}>
              {(["S", "O", "A", "P"] as TabType[]).map((tab) => {
                const labels: Record<TabType, string> = {
                  S: "Subjective",
                  O: "Objective",
                  A: "Assessment",
                  P: "Plan",
                };
                return (
                  <button
                    key={tab}
                    className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    <span className={styles.tabLetter}>{tab}</span>
                    <span className={styles.tabWord}>{labels[tab]}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Tab Content */}
            <div className={styles.soapScrollArea}>
              {/* ═══ SUBJECTIVE ═══ */}
              {activeTab === "S" && (
                <div className={styles.tabPane}>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Condition</label>
                    <textarea
                      className={styles.fieldTextarea}
                      rows={2}
                      placeholder="Enter patient's condition…"
                      value={soapData.chiefCondition}
                      onChange={(e) =>
                        handleSOAPChange("chiefCondition", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      Reported Symptoms
                    </label>
                    <textarea
                      className={styles.fieldTextarea}
                      rows={3}
                      placeholder="Dry cough, sore throat, fatigue…"
                      value={soapData.symptoms}
                      onChange={(e) =>
                        handleSOAPChange("symptoms", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.fieldLabel}>Onset Date</label>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        placeholder="e.g., 3 days"
                        value={soapData.symptomDuration}
                        onChange={(e) =>
                          handleSOAPChange("symptomDuration", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ OBJECTIVE ═══ */}
              {activeTab === "O" && (
                <div className={styles.tabPane}>
                  <div className={styles.sectionHeading}>Vital Signs</div>
                  <div className={styles.vitalsGrid}>
                    {[
                      {
                        key: "bp" as keyof SOAPData,
                        label: "Blood Pressure",
                        ph: "120/80 mmHg",
                      },
                      {
                        key: "temperature" as keyof SOAPData,
                        label: "Temperature",
                        ph: "98.6 °F",
                      },
                      {
                        key: "pulse" as keyof SOAPData,
                        label: "Pulse",
                        ph: "72 bpm",
                      },
                      {
                        key: "spo2" as keyof SOAPData,
                        label: "SpO₂",
                        ph: "98%",
                      },
                      {
                        key: "respiratoryRate" as keyof SOAPData,
                        label: "Respiratory Rate",
                        ph: "16 /min",
                      },
                      {
                        key: "weight" as keyof SOAPData,
                        label: "Weight",
                        ph: "175 lbs",
                      },
                    ].map(({ key, label, ph }) => (
                      <div className={styles.formGroup} key={key}>
                        <label className={styles.fieldLabel}>{label}</label>
                        <input
                          type="text"
                          className={styles.fieldInput}
                          placeholder={ph}
                          value={soapData[key]}
                          onChange={(e) =>
                            handleSOAPChange(key, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Objective</label>
                    <textarea
                      className={styles.fieldTextarea}
                      rows={4}
                      //   placeholder="Document observable clinical findings… (e.g., Patient appears fatigued but alert. Mild cough observed.)"
                      value={soapData.clinicalObservations}
                      onChange={(e) =>
                        handleSOAPChange("clinicalObservations", e.target.value)
                      }
                    />
                  </div>

                  {/* RPM Mock Card */}
                  <div className={styles.rpmCard}>
                    <div className={styles.rpmCardHeader}>
                      <div className={styles.rpmPulse} />
                      <span className={styles.rpmCardTitle}>
                        Latest RPM Reading
                      </span>
                    </div>
                    <div className={styles.rpmValues}>
                      <div className={styles.rpmItem}>
                        <span className={styles.rpmItemLabel}>BP</span>
                        <span className={styles.rpmItemValue}>126/80</span>
                        <span className={styles.rpmUnit}>mmHg</span>
                      </div>
                      <div className={styles.rpmItem}>
                        <span className={styles.rpmItemLabel}>SpO₂</span>
                        <span className={styles.rpmItemValue}>98</span>
                        <span className={styles.rpmUnit}>%</span>
                      </div>
                      <div className={styles.rpmItem}>
                        <span className={styles.rpmItemLabel}>Pulse</span>
                        <span className={styles.rpmItemValue}>74</span>
                        <span className={styles.rpmUnit}>bpm</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ ASSESSMENT ═══ */}
              {activeTab === "A" && (
                <div className={styles.tabPane}>
                  {/* EHR History */}
                  <div className={styles.sectionHeading}>Medical History</div>
                  <div className={styles.ehrCard}>
                    <div className={styles.ehrRow}>
                      <div className={styles.ehrSectionTitle}>
                        Past Conditions
                      </div>
                      <div className={styles.ehrTagGroup}>
                        {MOCK_EHR.pastConditions.map((c) => (
                          <span key={c} className={styles.ehrTagCondition}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.ehrDivider} />
                    <div className={styles.ehrRow}>
                      <div className={styles.ehrSectionTitle}>Allergies</div>
                      <div className={styles.ehrTagGroup}>
                        {MOCK_EHR.allergies.map((a) => (
                          <span key={a} className={styles.ehrTagAllergy}>
                            ⚠ {a}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.ehrDivider} />
                    <div className={styles.ehrRow}>
                      <div className={styles.ehrSectionTitle}>
                        Current Medications
                      </div>
                      <div className={styles.ehrTagGroup}>
                        {MOCK_EHR.currentMedications.map((m) => (
                          <span key={m} className={styles.ehrTagMed}>
                            💊 {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.ehrDivider} />
                    <div className={styles.ehrRow}>
                      <div className={styles.ehrSectionTitle}>
                        Previous Encounters
                      </div>
                      <div className={styles.ehrEncounterList}>
                        {MOCK_EHR.previousEncounters.map((enc) => (
                          <div
                            key={enc.date}
                            className={styles.ehrEncounterItem}
                          >
                            <span className={styles.ehrEncDate}>
                              {enc.date}
                            </span>
                            <span className={styles.ehrEncDesc}>
                              {enc.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Diagnosis Entry */}
                  <div
                    className={styles.sectionHeading}
                    style={{ marginTop: 20 }}
                  >
                    Structured Diagnosis Entry
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Diagnosis</label>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="e.g., Upper Respiratory Infection"
                      value={soapData.primaryDiagnosis}
                      onChange={(e) =>
                        handleSOAPChange("primaryDiagnosis", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.formGroup} ref={icd10Ref}>
                    <label className={styles.fieldLabel}>ICD-10 Code</label>
                    <div className={styles.icd10Container}>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        placeholder="Search code or diagnosis…"
                        value={
                          icd10Search !== "" ? icd10Search : soapData.icd10Code
                        }
                        onChange={(e) => {
                          setIcd10Search(e.target.value);
                          setShowIcd10Dropdown(true);
                          handleSOAPChange("icd10Code", e.target.value);
                        }}
                        onFocus={() => {
                          setShowIcd10Dropdown(true);
                          setIcd10Search("");
                        }}
                      />
                      {showIcd10Dropdown && (
                        <div className={styles.icd10Dropdown}>
                          {filteredICD10.length > 0 ? (
                            filteredICD10.map((opt) => (
                              <div
                                key={opt.code}
                                className={styles.icd10Option}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  const val = `${opt.code} — ${opt.description}`;
                                  handleSOAPChange("icd10Code", val);
                                  setIcd10Search(val);
                                  setShowIcd10Dropdown(false);
                                }}
                              >
                                <span className={styles.icd10Code}>
                                  {opt.code}
                                </span>
                                <span className={styles.icd10Desc}>
                                  {opt.description}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className={styles.icd10Empty}>
                              No results found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Severity</label>
                    <select
                      className={styles.fieldSelect}
                      value={soapData.severity}
                      onChange={(e) =>
                        handleSOAPChange("severity", e.target.value)
                      }
                    >
                      <option value="">Select Severity</option>
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ═══ PLAN ═══ */}
              {activeTab === "P" && (
                <div className={styles.tabPane}>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Treatment Plan</label>
                    <textarea
                      className={styles.fieldTextarea}
                      rows={4}
                      placeholder="Enter treatment strategy…"
                      value={soapData.treatmentPlan}
                      onChange={(e) =>
                        handleSOAPChange("treatmentPlan", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      Medication / Prescription
                    </label>
                    <textarea
                      className={styles.fieldTextarea}
                      rows={3}
                      placeholder="e.g., Amoxicillin 500mg twice daily for 7 days…"
                      value={soapData.medicationPlan}
                      onChange={(e) =>
                        handleSOAPChange("medicationPlan", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      Lab / Imaging Orders
                    </label>
                    <textarea
                      className={styles.fieldTextarea}
                      rows={2}
                      placeholder="CBC, Chest X-Ray, Blood Sugar…"
                      value={soapData.labOrders}
                      onChange={(e) =>
                        handleSOAPChange("labOrders", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.fieldLabel}>
                        Follow-up Date
                      </label>
                      <input
                        type="date"
                        className={styles.fieldInput}
                        value={soapData.followUpDate}
                        onChange={(e) =>
                          handleSOAPChange("followUpDate", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      Patient Instructions
                    </label>
                    <textarea
                      className={styles.fieldTextarea}
                      rows={3}
                      placeholder="Dietary guidance, precautions, home care, activity restrictions…"
                      value={soapData.patientInstructions}
                      onChange={(e) =>
                        handleSOAPChange("patientInstructions", e.target.value)
                      }
                    />
                  </div>

                  {/* Patient Summary Preview */}
                  <div className={styles.summaryPreviewCard}>
                    <div className={styles.summaryPreviewIcon}>📋</div>
                    <div className={styles.summaryPreviewBody}>
                      <div className={styles.summaryPreviewTitle}>
                        Patient Summary Preview
                      </div>
                      <div className={styles.summaryPreviewDesc}>
                        A secure, patient-facing summary will be generated and
                        shared upon encounter completion via the patient portal.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SOAP Save Bar (sticky bottom of aside) */}
            <div className={styles.soapSaveBar}>
              <span
                className={`${styles.autoSaveIndicator} ${
                  saveStatus === "unsaved" ? styles.autoSaveUnsaved : ""
                }`}
              >
                {saveStatus === "saved" && "✓ All changes saved"}
                {saveStatus === "saving" && "⟳ Saving…"}
                {saveStatus === "unsaved" && "● Unsaved changes"}
              </span>
              <button className={styles.saveSoapBtn} onClick={handleManualSave}>
                Save SOAP
              </button>
            </div>
          </aside>
        </main>
        {/* ══════════════════ ACTION BAR ══════════════════ */}
        <footer className={styles.actionBar}>
          <div className={styles.actionBarInner}>
            <button
              className={`${styles.actionBtn} ${!micOn ? styles.actionBtnOff : ""}`}
              onClick={() => setMicOn((v) => !v)}
              title={micOn ? "Mute Microphone" : "Unmute Microphone"}
            >
              <MicIcon muted={!micOn} />
              <span>{micOn ? "Mute" : "Unmute"}</span>
            </button>

            <button
              className={`${styles.actionBtn} ${!cameraOn ? styles.actionBtnOff : ""}`}
              onClick={() => setCameraOn((v) => !v)}
              title={cameraOn ? "Stop Camera" : "Start Camera"}
            >
              <CameraIcon off={!cameraOn} />
              <span>{cameraOn ? "Camera" : "Start Cam"}</span>
            </button>

            {/* <button
              className={`${styles.actionBtn} ${chatOpen ? styles.actionBtnActive : ""}`}
              onClick={() => setChatOpen((v) => !v)}
              title="Toggle Chat"
            >
              <ChatIcon />
              <span>Chat</span>
              {chatOpen && <span className={styles.actionBadge}>2</span>}
            </button> */}

            <button
              className={`${styles.actionBtn} ${screenSharing ? styles.actionBtnActive : ""}`}
              onClick={() => setScreenSharing((v) => !v)}
              title="Toggle Screen Share"
            >
              <ScreenShareIcon />
              <span>{screenSharing ? "Stop Share" : "Share Screen"}</span>
            </button>

            {/* <button
              className={`${styles.actionBtn} ${onHold ? styles.actionBtnHold : ""}`}
              onClick={() => setOnHold((v) => !v)}
              title={onHold ? "Resume Encounter" : "Put on Hold"}
            >
              {onHold ? <ResumeIcon /> : <HoldIcon />}
              <span>{onHold ? "Resume" : "Hold"}</span>
            </button> */}

            <div className={styles.actionBarSep} />

            <button
              className={styles.actionBtnEnd}
              onClick={() => setShowEndModal(true)}
              title="End Encounter"
            >
              {/* <PhoneOffIcon /> */}
              <span>End Encounter</span>
            </button>
          </div>
        </footer>
        {/* ══════════════════ EXIT MODAL ══════════════════ */}
        {showExitModal && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowExitModal(false)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalIconWrap}>🚪</div>
              <h3 className={styles.modalTitle}>Leave Encounter?</h3>
              <p className={styles.modalBody}>
                You are about to exit the encounter session. Any unsaved SOAP
                notes may be lost. Please save your notes before exiting.
              </p>
              <div className={styles.modalFooter}>
                <button
                  className={styles.modalBtnCancel}
                  onClick={() => setShowExitModal(false)}
                >
                  Cancel
                </button>
                <button className={styles.modalBtnDanger}>
                  Exit Without Saving
                </button>
              </div>
            </div>
          </div>
        )}
        {/* ══════════════════ END ENCOUNTER MODAL ══════════════════ */}
        {showEndModal && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowEndModal(false)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalIconWrap}>📋</div>
              <h3 className={styles.modalTitle}>Complete Encounter?</h3>
              <p className={styles.modalBody}>
                You are about to end this telemedicine encounter for{" "}
                <strong>{MOCK_PATIENT.name}</strong>. Please confirm that all
                SOAP notes have been reviewed, signed, and are ready for
                submission.
              </p>
              <div className={styles.modalPatientSummary}>
                <div className={styles.modalSummaryRow}>
                  <span>Encounter ID</span>
                  <span>{MOCK_PATIENT.encounterId}</span>
                </div>
                <div className={styles.modalSummaryRow}>
                  <span>Duration</span>
                  <span>{formatTime(elapsed)}</span>
                </div>
                <div className={styles.modalSummaryRow}>
                  <span>Provider</span>
                  <span>{MOCK_PROVIDER.name}</span>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button
                  className={styles.modalBtnCancel}
                  onClick={() => setShowEndModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={styles.modalBtnSecondary}
                  onClick={() => {
                    handleManualSave();
                    setShowEndModal(false);
                  }}
                >
                  Save Draft
                </button>
                <button
                  className={styles.modalBtnPrimary}
                  onClick={handleCompleteEncounter}
                >
                  Complete Encounter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ END ENCOUNTER SUMMARY MODAL ══════════════════ */}

        {showSOAPPreview && (
          <div
            className={styles.summaryModalBackdrop}
            onClick={() => setShowSOAPPreview(false)}
          >
            <div
              className={styles.summaryModal}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={styles.summaryModalTitle}>Encounter Summary</h3>

              <div className={styles.summaryFields}>
                {/* SUBJECTIVE */}
                <div className={styles.subjectSummaryCard}>
                  <h4>Subjective (S)</h4>

                  <p>
                    <strong>Condition:</strong> Acute Upper Respiratory
                    Infection
                  </p>

                  <p>
                    <strong>Reported Symptoms:</strong> Fever, dry cough, sore
                    throat, mild fatigue, nasal congestion
                  </p>

                  <p>
                    <strong>Symptom Duration:</strong> 4 Days
                  </p>

                  <p>
                    <strong>Pain Scale:</strong> 3 / 10
                  </p>

                  <p>
                    <strong>Review of Systems:</strong> No chest pain, mild
                    headache, reduced appetite
                  </p>
                </div>

                {/* OBJECTIVE */}
                <div className={styles.ObjectiveSummaryCard}>
                  <h4>Objective (O)</h4>

                  <div className={styles.vitals}>
                    <p>
                      <strong>Blood Pressure:</strong> 124/78 mmHg
                    </p>

                    <p>
                      <strong>Temperature:</strong> 99.4°F
                    </p>

                    <p>
                      <strong>Pulse:</strong> 76 bpm
                    </p>

                    <p>
                      <strong>SpO₂:</strong> 98%
                    </p>

                    <p>
                      <strong>Respiratory Rate:</strong> 18 breaths/min
                    </p>

                    <p>
                      <strong>Weight:</strong> 72 kg
                    </p>
                  </div>

                  <div className={styles.objective}>
                    <p>
                      <strong>Clinical Observation:</strong> Patient appears
                      mildly fatigued but alert and oriented. Mild throat
                      irritation observed. No respiratory distress.
                    </p>
                  </div>
                </div>

                {/* ASSESSMENT */}
                <div className={styles.AssessmentSummaryCard}>
                  <h4>Assessment (A)</h4>

                  <p>
                    <strong>Diagnosis:</strong> Acute Upper Respiratory
                    Infection
                  </p>

                  <p>
                    <strong>ICD-10 Code:</strong> J06.9
                  </p>

                  <p>
                    <strong>Differential Diagnosis:</strong> Seasonal Viral
                    Infection, Allergic Rhinitis
                  </p>

                  <p>
                    <strong>Severity:</strong> Mild
                  </p>
                </div>

                {/* PLAN */}
                <div className={styles.PlanSummaryCard}>
                  <h4>Plan (P)</h4>

                  <p>
                    <strong>Treatment Plan:</strong> Conservative treatment with
                    hydration, rest, and symptomatic management.
                  </p>

                  <p>
                    <strong>Medication / Prescription:</strong> Paracetamol
                    500mg as needed for fever, Cetirizine 10mg once daily for 5
                    days.
                  </p>

                  <p>
                    <strong>Lab / Imaging Orders:</strong> No laboratory tests
                    required at this time.
                  </p>

                  <p>
                    <strong>Patient Instructions:</strong> Maintain hydration,
                    avoid cold beverages, monitor fever, and seek emergency care
                    if breathing worsens.
                  </p>

                  <p className={styles.followUpDate}>
                    <strong>Follow-up Date:</strong> 18 May 2026
                  </p>
                </div>
              </div>

              <div className={styles.summaryModalFooter}>
                <button
                  className={styles.summaryModalBtnCancel}
                  onClick={handleEncounterSummaryCancel}
                >
                  Cancel
                </button>

                <button
                  className={styles.summaryModalBtnPrimary}
                  onClick={handleEncounterSummaryEnd}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
        {/* 
        {showSOAPPreview && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowEndModal(false)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3 className={styles.modalTitle}>Encounter Summary</h3>
              <div className={styles.summaryFields}>
                <div className={styles.subjectSummaryCard}>
                  <p>
                    <strong>Condition: </strong>
                  </p>
                  <p>
                    <strong>Reported Symptoms: </strong>
                  </p>
                </div>
                <div className={styles.ObjectiveSummaryCard}>
                  <div className={styles.vitals}>
                    <p>
                      <strong>Blood Pressure: </strong>
                    </p>
                    <p>
                      <strong>Temperature: </strong>
                    </p>
                    <p>
                      <strong>Pulse: </strong>
                    </p>
                    <p>
                      <strong>SpO₂: </strong>
                    </p>
                    <p>
                      <strong>Respiratory Rate: </strong>
                    </p>
                    <p>
                      <strong>Weight: </strong>
                    </p>
                  </div>
                  <div className={styles.objective}>
                    <p>
                      <strong>Objective:</strong>
                    </p>
                  </div>
                </div>
                <div className={styles.AssessmentSummaryCard}>
                  <p>
                    <strong>Diagnosis:</strong>
                  </p>
                  <p>
                    <strong>ICD-10 Code</strong>
                  </p>
                </div>
                <div className={styles.PlanSummaryCard}>
                    <p><strong>Treatment Plan:</strong></p>
                    <p><strong>Medication / Prescription:</strong></p>
                    <p><strong>Lab / Imaging Orders:</strong></p>
                    <p><strong>Patient Instructions:</strong></p>
                    <p className={styles.followUpDate}><strong>Follow-up Date:</strong></p>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button
                  className={styles.modalBtnCancel}
                  onClick={() => {
                    setShowSOAPPreview(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  className={styles.modalBtnPrimary}
                  onClick={() => {
                    handleCompleteEncounter;
                  }}
                >
                  Complete Encounter
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Encounter;
