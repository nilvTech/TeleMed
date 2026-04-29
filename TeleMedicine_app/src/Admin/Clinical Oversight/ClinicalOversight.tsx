import React, { useState, useReducer, useMemo } from "react";
import styles from "./ClinicalOversight.module.css";

// ==================== TYPES ====================
type RiskLevel = "high" | "medium" | "low";
type EncounterStatus = "pending_review" | "approved" | "flagged" | "escalated";
type AlertStatus = "active" | "acknowledged" | "resolved" | "dismissed";
type IncidentSeverity = "critical" | "major" | "moderate" | "minor";
type IncidentStatus =
  | "reported"
  | "under_investigation"
  | "resolved"
  | "closed";

interface Provider {
  id: string;
  name: string;
  specialty: string;
  qualityScore: number;
  completionRate: number;
  avgResponseTime: number;
  flaggedEncounters: number;
}

interface Encounter {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  date: string;
  diagnosis: string;
  riskLevel: RiskLevel;
  status: EncounterStatus;
  duration: number;
  notes: string;
  prescriptions: string[];
  flags: string[];
}

interface Alert {
  id: string;
  type: string;
  severity: RiskLevel;
  description: string;
  encounterId: string;
  providerId: string;
  providerName: string;
  patientName: string;
  timestamp: string;
  status: AlertStatus;
  details: string;
}

interface Protocol {
  id: string;
  name: string;
  category: string;
  version: string;
  adherenceRate: number;
  violations: number;
  lastUpdated: string;
  description: string;
}

interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  targetType: string;
  targetId: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: string;
  reportedDate: string;
  category: string;
  description: string;
  affectedPatients: string[];
  involvedProviders: string[];
  resolution: string;
}

type TabType =
  | "encounters"
  | "alerts"
  | "quality"
  | "protocols"
  | "audit"
  | "incidents";

// ==================== MOCK DATA ====================
const MOCK_PROVIDERS: Provider[] = [
  {
    id: "P001",
    name: "Dr. Sarah Johnson",
    specialty: "Internal Medicine",
    qualityScore: 94,
    completionRate: 98,
    avgResponseTime: 12,
    flaggedEncounters: 2,
  },
  {
    id: "P002",
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    qualityScore: 97,
    completionRate: 99,
    avgResponseTime: 8,
    flaggedEncounters: 0,
  },
  {
    id: "P003",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    qualityScore: 92,
    completionRate: 95,
    avgResponseTime: 15,
    flaggedEncounters: 4,
  },
  {
    id: "P004",
    name: "Dr. James Wilson",
    specialty: "Psychiatry",
    qualityScore: 88,
    completionRate: 92,
    avgResponseTime: 18,
    flaggedEncounters: 7,
  },
  {
    id: "P005",
    name: "Dr. Lisa Anderson",
    specialty: "Dermatology",
    qualityScore: 96,
    completionRate: 97,
    avgResponseTime: 10,
    flaggedEncounters: 1,
  },
];

const MOCK_ENCOUNTERS: Encounter[] = [
  {
    id: "E001",
    patientId: "PT001",
    patientName: "John Smith",
    providerId: "P001",
    providerName: "Dr. Sarah Johnson",
    date: "2024-04-28T14:30:00",
    diagnosis: "Acute Upper Respiratory Infection",
    riskLevel: "low",
    status: "pending_review",
    duration: 15,
    notes:
      "Patient presents with cough and congestion for 3 days. No fever. Prescribed antibiotics.",
    prescriptions: ["Amoxicillin 500mg", "Mucinex"],
    flags: [],
  },
  {
    id: "E002",
    patientId: "PT002",
    patientName: "Mary Johnson",
    providerId: "P004",
    providerName: "Dr. James Wilson",
    date: "2024-04-28T10:15:00",
    diagnosis: "Major Depressive Disorder - Follow-up",
    riskLevel: "high",
    status: "flagged",
    duration: 45,
    notes:
      "Patient reports increased suicidal ideation. Adjusted medication dosage. Scheduled follow-up in 3 days.",
    prescriptions: ["Sertraline 100mg", "Trazodone 50mg"],
    flags: ["Suicide risk mentioned", "Dosage change outside protocol"],
  },
  {
    id: "E003",
    patientId: "PT003",
    patientName: "Robert Davis",
    providerId: "P002",
    providerName: "Dr. Michael Chen",
    date: "2024-04-27T16:45:00",
    diagnosis: "Hypertension - New diagnosis",
    riskLevel: "medium",
    status: "approved",
    duration: 30,
    notes:
      "BP 165/95. Discussed lifestyle modifications. Started on ACE inhibitor. Follow-up in 2 weeks.",
    prescriptions: ["Lisinopril 10mg"],
    flags: [],
  },
  {
    id: "E004",
    patientId: "PT004",
    patientName: "Sarah Williams",
    providerId: "P003",
    providerName: "Dr. Emily Rodriguez",
    date: "2024-04-27T11:20:00",
    diagnosis: "Pediatric Fever - Rule out infection",
    riskLevel: "medium",
    status: "pending_review",
    duration: 20,
    notes:
      "8-year-old with fever 101.5F for 24 hours. No clear source identified. Recommended monitoring.",
    prescriptions: ["Ibuprofen (pediatric dose)"],
    flags: ["Incomplete physical exam documentation"],
  },
  {
    id: "E005",
    patientId: "PT005",
    patientName: "Michael Brown",
    providerId: "P001",
    providerName: "Dr. Sarah Johnson",
    date: "2024-04-26T09:00:00",
    diagnosis: "Type 2 Diabetes - Medication adjustment",
    riskLevel: "low",
    status: "approved",
    duration: 25,
    notes:
      "A1C 7.2%. Increased metformin dosage. Patient educated on dietary changes.",
    prescriptions: ["Metformin 1000mg"],
    flags: [],
  },
  {
    id: "E006",
    patientId: "PT006",
    patientName: "Jennifer Martinez",
    providerId: "P004",
    providerName: "Dr. James Wilson",
    date: "2024-04-28T13:00:00",
    diagnosis: "Anxiety Disorder - Initial Consultation",
    riskLevel: "high",
    status: "escalated",
    duration: 60,
    notes:
      "Patient expressing severe anxiety and panic attacks. Concerning substance use history mentioned.",
    prescriptions: ["Buspirone 10mg"],
    flags: [
      "Substance abuse history",
      "Rapid prescription without full assessment",
    ],
  },
];

const MOCK_ALERTS: Alert[] = [
  {
    id: "A001",
    type: "Medication Interaction",
    severity: "high",
    description: "Potential drug interaction detected",
    encounterId: "E002",
    providerId: "P004",
    providerName: "Dr. James Wilson",
    patientName: "Mary Johnson",
    timestamp: "2024-04-28T10:30:00",
    status: "active",
    details:
      "Sertraline + Trazodone: Risk of serotonin syndrome. Monitor closely for symptoms.",
  },
  {
    id: "A002",
    type: "Documentation Incomplete",
    severity: "medium",
    description: "Missing required clinical documentation",
    encounterId: "E004",
    providerId: "P003",
    providerName: "Dr. Emily Rodriguez",
    patientName: "Mary Johnson",
    timestamp: "2024-04-27T11:45:00",
    status: "acknowledged",
    details: "Physical examination notes incomplete for pediatric fever case.",
  },
  {
    id: "A003",
    type: "Protocol Deviation",
    severity: "high",
    description: "Treatment outside established clinical guidelines",
    encounterId: "E006",
    providerId: "P004",
    providerName: "Dr. James Wilson",
    patientName: "Mary Johnson",
    timestamp: "2024-04-28T13:15:00",
    status: "active",
    details:
      "Prescription issued without complete mental health assessment per protocol.",
  },
  {
    id: "A004",
    type: "High Risk Patient",
    severity: "high",
    description: "Patient flagged for suicide risk",
    encounterId: "E002",
    providerId: "P004",
    providerName: "Dr. James Wilson",
    patientName: "Mary Johnson",
    timestamp: "2024-04-28T10:20:00",
    status: "active",
    details:
      "Patient expressed suicidal ideation. Safety plan required. Immediate follow-up needed.",
  },
  {
    id: "A005",
    type: "Prescription Anomaly",
    severity: "medium",
    description: "Unusual prescription pattern detected",
    encounterId: "E001",
    providerId: "P001",
    providerName: "Dr. Sarah Johnson",
    patientName: "Mary Johnson",
    timestamp: "2024-04-28T14:45:00",
    status: "dismissed",
    details:
      "Antibiotic prescribed for likely viral infection. Consider diagnostic stewardship.",
  },
  {
    id: "A006",
    type: "Response Time",
    severity: "low",
    description: "Extended response time to patient inquiry",
    encounterId: "E004",
    providerId: "P003",
    providerName: "Dr. Emily Rodriguez",
    patientName: "Mary Johnson",
    timestamp: "2024-04-27T12:00:00",
    status: "resolved",
    details: "Patient follow-up message response took 4 hours (SLA: 2 hours).",
  },
];

const MOCK_PROTOCOLS: Protocol[] = [
  {
    id: "PR001",
    name: "Mental Health Crisis Assessment",
    category: "Psychiatry",
    version: "2.1",
    adherenceRate: 87,
    violations: 8,
    lastUpdated: "2024-03-15",
    description:
      "Comprehensive assessment protocol for patients presenting with mental health crisis, including suicide risk evaluation.",
  },
  {
    id: "PR002",
    name: "Hypertension Management Guidelines",
    category: "Cardiology",
    version: "3.0",
    adherenceRate: 95,
    violations: 2,
    lastUpdated: "2024-02-01",
    description:
      "Evidence-based guidelines for diagnosis and management of hypertension in adult patients.",
  },
  {
    id: "PR003",
    name: "Antibiotic Stewardship",
    category: "General Medicine",
    version: "1.8",
    adherenceRate: 82,
    violations: 12,
    lastUpdated: "2024-01-20",
    description:
      "Guidelines for appropriate antibiotic prescribing to reduce resistance and improve patient outcomes.",
  },
  {
    id: "PR004",
    name: "Pediatric Fever Evaluation",
    category: "Pediatrics",
    version: "2.3",
    adherenceRate: 91,
    violations: 5,
    lastUpdated: "2024-04-01",
    description:
      "Systematic approach to evaluating fever in pediatric patients, including red flag symptoms.",
  },
  {
    id: "PR005",
    name: "Documentation Standards",
    category: "General",
    version: "4.0",
    adherenceRate: 89,
    violations: 15,
    lastUpdated: "2024-03-10",
    description:
      "Minimum documentation requirements for all clinical encounters to ensure quality and compliance.",
  },
];

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "AU001",
    action: "Encounter Approved",
    performedBy: "Dr. Admin Smith",
    targetType: "Encounter",
    targetId: "E003",
    timestamp: "2024-04-28T09:15:00",
    details: "Hypertension case reviewed and approved. Documentation complete.",
    ipAddress: "192.168.1.45",
  },
  {
    id: "AU002",
    action: "Alert Acknowledged",
    performedBy: "Clinical Manager Jones",
    targetType: "Alert",
    targetId: "A002",
    timestamp: "2026-04-27T14:30:00",
    details: "Documentation incomplete alert acknowledged. Provider notified.",
    ipAddress: "192.168.1.52",
  },
  {
    id: "AU003",
    action: "Encounter Escalated",
    performedBy: "Dr. Admin Smith",
    targetType: "Encounter",
    targetId: "E006",
    timestamp: "2026-04-28T13:45:00",
    details:
      "Mental health case escalated to senior clinical review due to protocol deviation.",
    ipAddress: "192.168.1.45",
  },
  {
    id: "AU004",
    action: "Provider Quality Review",
    performedBy: "Quality Assurance Team",
    targetType: "Provider",
    targetId: "P004",
    timestamp: "2026-04-29T11:00:00",
    details:
      "Dr. James Wilson flagged for increased oversight due to multiple protocol deviations.",
    ipAddress: "192.168.1.60",
  },
  {
    id: "AU005",
    action: "Protocol Updated",
    performedBy: "Medical Director",
    targetType: "Protocol",
    targetId: "PR005",
    timestamp: "2026-04-10T16:20:00",
    details: "Documentation Standards protocol updated to version 4.0.",
    ipAddress: "192.168.1.70",
  },
];

const MOCK_INCIDENTS: Incident[] = [
  {
    id: "IN001",
    title: "Medication Error - Wrong Dosage",
    severity: "major",
    status: "under_investigation",
    reportedBy: "Pharmacy Team",
    reportedDate: "2024-04-27T15:30:00",
    category: "Medication Safety",
    description:
      "Provider prescribed double the recommended dosage of blood pressure medication. Caught during pharmacy review.",
    affectedPatients: ["PT007"],
    involvedProviders: ["P001"],
    resolution:
      "Investigation ongoing. Provider education scheduled. Patient contacted and corrected prescription issued.",
  },
  {
    id: "IN002",
    title: "Patient Safety Concern - Delayed Follow-up",
    severity: "moderate",
    status: "resolved",
    reportedBy: "Care Coordinator",
    reportedDate: "2024-04-25T10:00:00",
    category: "Care Coordination",
    description:
      "High-risk patient did not receive scheduled follow-up appointment within required timeframe.",
    affectedPatients: ["PT008"],
    involvedProviders: ["P003"],
    resolution:
      "Process improved with automated reminder system. Patient seen and stable. No adverse outcome.",
  },
  {
    id: "IN003",
    title: "Privacy Breach - Unauthorized Access",
    severity: "critical",
    status: "closed",
    reportedBy: "IT Security",
    reportedDate: "2024-04-20T08:45:00",
    category: "HIPAA Compliance",
    description:
      "Staff member accessed patient records without clinical justification.",
    affectedPatients: ["PT009", "PT010"],
    involvedProviders: [],
    resolution:
      "Staff member terminated. Patients notified per HIPAA breach protocol. Additional security training implemented.",
  },
  {
    id: "IN004",
    title: "Clinical Judgment Concern",
    severity: "major",
    status: "reported",
    reportedBy: "Peer Review",
    reportedDate: "2024-04-28T14:00:00",
    category: "Quality of Care",
    description:
      "Provider dismissed concerning symptoms that later required emergency intervention.",
    affectedPatients: ["PT011"],
    involvedProviders: ["P004"],
    resolution: "",
  },
];

// ==================== REDUCER ====================
type Action =
  | { type: "APPROVE_ENCOUNTER"; id: string }
  | { type: "FLAG_ENCOUNTER"; id: string }
  | { type: "ESCALATE_ENCOUNTER"; id: string }
  | { type: "ACKNOWLEDGE_ALERT"; id: string }
  | { type: "RESOLVE_ALERT"; id: string }
  | { type: "DISMISS_ALERT"; id: string }
  | { type: "INVESTIGATE_INCIDENT"; id: string }
  | { type: "RESOLVE_INCIDENT"; id: string }
  | { type: "CLOSE_INCIDENT"; id: string };

interface State {
  encounters: Encounter[];
  alerts: Alert[];
  incidents: Incident[];
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "APPROVE_ENCOUNTER":
      return {
        ...state,
        encounters: state.encounters.map((e) =>
          e.id === action.id
            ? { ...e, status: "approved" as EncounterStatus }
            : e,
        ),
      };
    case "FLAG_ENCOUNTER":
      return {
        ...state,
        encounters: state.encounters.map((e) =>
          e.id === action.id
            ? { ...e, status: "flagged" as EncounterStatus }
            : e,
        ),
      };
    case "ESCALATE_ENCOUNTER":
      return {
        ...state,
        encounters: state.encounters.map((e) =>
          e.id === action.id
            ? { ...e, status: "escalated" as EncounterStatus }
            : e,
        ),
      };
    case "ACKNOWLEDGE_ALERT":
      return {
        ...state,
        alerts: state.alerts.map((a) =>
          a.id === action.id
            ? { ...a, status: "acknowledged" as AlertStatus }
            : a,
        ),
      };
    case "RESOLVE_ALERT":
      return {
        ...state,
        alerts: state.alerts.map((a) =>
          a.id === action.id ? { ...a, status: "resolved" as AlertStatus } : a,
        ),
      };
    case "DISMISS_ALERT":
      return {
        ...state,
        alerts: state.alerts.map((a) =>
          a.id === action.id ? { ...a, status: "dismissed" as AlertStatus } : a,
        ),
      };
    case "INVESTIGATE_INCIDENT":
      return {
        ...state,
        incidents: state.incidents.map((i) =>
          i.id === action.id
            ? { ...i, status: "under_investigation" as IncidentStatus }
            : i,
        ),
      };
    case "RESOLVE_INCIDENT":
      return {
        ...state,
        incidents: state.incidents.map((i) =>
          i.id === action.id
            ? { ...i, status: "resolved" as IncidentStatus }
            : i,
        ),
      };
    case "CLOSE_INCIDENT":
      return {
        ...state,
        incidents: state.incidents.map((i) =>
          i.id === action.id ? { ...i, status: "closed" as IncidentStatus } : i,
        ),
      };
    default:
      return state;
  }
};

// ==================== MAIN COMPONENT ====================
const ClinicalOversight: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, {
    encounters: MOCK_ENCOUNTERS,
    alerts: MOCK_ALERTS,
    incidents: MOCK_INCIDENTS,
  });

  const [activeTab, setActiveTab] = useState<TabType>("encounters");
  const [loading, setLoading] = useState(false);

  // Filter states
  const [encounterFilters, setEncounterFilters] = useState({
    status: "all",
    riskLevel: "all",
    provider: "all",
    search: "",
  });

  const [alertFilters, setAlertFilters] = useState({
    status: "all",
    severity: "all",
    type: "all",
    search: "",
  });

  const [qualityFilters, setQualityFilters] = useState({
    specialty: "all",
    minScore: 0,
    search: "",
  });

  const [protocolFilters, setProtocolFilters] = useState({
    category: "all",
    search: "",
  });

  const [auditFilters, setAuditFilters] = useState({
    action: "all",
    dateRange: "all",
    search: "",
  });

  const [incidentFilters, setIncidentFilters] = useState({
    severity: "all",
    status: "all",
    category: "all",
    search: "",
  });

  // Modal states
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(
    null,
  );
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(
    null,
  );
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );

  // Simulate loading
  const simulateLoading = async (callback: () => void) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    callback();
    setLoading(false);
  };

  // Action handlers
  const handleApproveEncounter = (id: string) => {
    simulateLoading(() => dispatch({ type: "APPROVE_ENCOUNTER", id }));
  };

  const handleFlagEncounter = (id: string) => {
    simulateLoading(() => dispatch({ type: "FLAG_ENCOUNTER", id }));
  };

  const handleEscalateEncounter = (id: string) => {
    simulateLoading(() => dispatch({ type: "ESCALATE_ENCOUNTER", id }));
  };

  const handleAcknowledgeAlert = (id: string) => {
    simulateLoading(() => dispatch({ type: "ACKNOWLEDGE_ALERT", id }));
  };

  const handleResolveAlert = (id: string) => {
    simulateLoading(() => dispatch({ type: "RESOLVE_ALERT", id }));
  };

  const handleDismissAlert = (id: string) => {
    simulateLoading(() => dispatch({ type: "DISMISS_ALERT", id }));
  };

  const handleInvestigateIncident = (id: string) => {
    simulateLoading(() => dispatch({ type: "INVESTIGATE_INCIDENT", id }));
  };

  const handleResolveIncident = (id: string) => {
    simulateLoading(() => dispatch({ type: "RESOLVE_INCIDENT", id }));
  };

  const handleCloseIncident = (id: string) => {
    simulateLoading(() => dispatch({ type: "CLOSE_INCIDENT", id }));
  };

  // Filtered data
  const filteredEncounters = useMemo(() => {
    return state.encounters.filter((e) => {
      if (
        encounterFilters.status !== "all" &&
        e.status !== encounterFilters.status
      )
        return false;
      if (
        encounterFilters.riskLevel !== "all" &&
        e.riskLevel !== encounterFilters.riskLevel
      )
        return false;
      if (
        encounterFilters.provider !== "all" &&
        e.providerId !== encounterFilters.provider
      )
        return false;
      if (
        encounterFilters.search &&
        !e.patientName
          .toLowerCase()
          .includes(encounterFilters.search.toLowerCase()) &&
        !e.diagnosis
          .toLowerCase()
          .includes(encounterFilters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [state.encounters, encounterFilters]);

  const filteredAlerts = useMemo(() => {
    return state.alerts.filter((a) => {
      if (alertFilters.status !== "all" && a.status !== alertFilters.status)
        return false;
      if (
        alertFilters.severity !== "all" &&
        a.severity !== alertFilters.severity
      )
        return false;
      if (alertFilters.type !== "all" && a.type !== alertFilters.type)
        return false;
      if (
        alertFilters.search &&
        !a.description
          .toLowerCase()
          .includes(alertFilters.search.toLowerCase()) &&
        !a.providerName
          .toLowerCase()
          .includes(alertFilters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [state.alerts, alertFilters]);

  const filteredProviders = useMemo(() => {
    return MOCK_PROVIDERS.filter((p) => {
      if (
        qualityFilters.specialty !== "all" &&
        p.specialty !== qualityFilters.specialty
      )
        return false;
      if (p.qualityScore < qualityFilters.minScore) return false;
      if (
        qualityFilters.search &&
        !p.name.toLowerCase().includes(qualityFilters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [qualityFilters]);

  const filteredProtocols = useMemo(() => {
    return MOCK_PROTOCOLS.filter((p) => {
      if (
        protocolFilters.category !== "all" &&
        p.category !== protocolFilters.category
      )
        return false;
      if (
        protocolFilters.search &&
        !p.name.toLowerCase().includes(protocolFilters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [protocolFilters]);

  const filteredAuditLogs = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    return MOCK_AUDIT_LOGS.filter((a) => {
      const itemDate = new Date(a.timestamp);
      switch (auditFilters.dateRange) {
        case "today":
          return itemDate >= startOfToday;
        case "week": {
          const dayOfWeek = now.getDay();
          const startOfWeek = new Date(startOfToday);
          startOfWeek.setDate(startOfToday.getDate() - dayOfWeek);
          return itemDate >= startOfWeek;
        }
        case "month": {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          return itemDate >= startOfMonth;
        }
        default:
          return true;
      }

      if (auditFilters.action !== "all" && a.action !== auditFilters.action)
        return false;
      if (
        auditFilters.search &&
        !a.details.toLowerCase().includes(auditFilters.search.toLowerCase()) &&
        !a.performedBy.toLowerCase().includes(auditFilters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [auditFilters]);

  const filteredIncidents = useMemo(() => {
    return state.incidents.filter((i) => {
      if (
        incidentFilters.severity !== "all" &&
        i.severity !== incidentFilters.severity
      )
        return false;
      if (
        incidentFilters.status !== "all" &&
        i.status !== incidentFilters.status
      )
        return false;
      if (
        incidentFilters.category !== "all" &&
        i.category !== incidentFilters.category
      )
        return false;
      if (
        incidentFilters.search &&
        !i.title.toLowerCase().includes(incidentFilters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [state.incidents, incidentFilters]);

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRiskBadgeClass = (risk: RiskLevel) => {
    return `${styles.badge} ${styles[`badge${risk.charAt(0).toUpperCase() + risk.slice(1)}`]}`;
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending_review: "badgePending",
      approved: "badgeSuccess",
      flagged: "badgeWarning",
      escalated: "badgeDanger",
      active: "badgeDanger",
      acknowledged: "badgeWarning",
      resolved: "badgeSuccess",
      dismissed: "badgeSecondary",
      reported: "badgePending",
      under_investigation: "badgeWarning",
      closed: "badgeSecondary",
      critical: "badgeDanger",
      major: "badgeWarning",
      moderate: "badgePending",
      minor: "badgeSecondary",
    };
    return `${styles.badge} ${styles[statusMap[status] || "badgeSecondary"]}`;
  };
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 3;
  const totalPages = Math.ceil(
    activeTab === "encounters"
      ? filteredEncounters.length / perPage
      : activeTab === "alerts"
        ? filteredAlerts.length / perPage
        : activeTab === "quality"
          ? filteredProviders.length / perPage
          : activeTab === "protocols"
            ? filteredProtocols.length / perPage
            : activeTab === "audit"
              ? filteredAuditLogs.length / perPage
              : activeTab === "incidents"
                ? filteredIncidents.length / perPage
                : 1,
  );

  // ==================== TAB CONTENT ====================

  // Encounter Review Tab
  const renderEncountersTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search patient or diagnosis..."
          className={styles.searchInput}
          value={encounterFilters.search}
          onChange={(e) =>
            setEncounterFilters({ ...encounterFilters, search: e.target.value })
          }
        />
        <select
          value={encounterFilters.status}
          onChange={(e) =>
            setEncounterFilters({ ...encounterFilters, status: e.target.value })
          }
          className={styles.filterSelect}
        >
          <option value="all">All Statuses</option>
          <option value="pending_review">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="flagged">Flagged</option>
          <option value="escalated">Escalated</option>
        </select>
        <select
          value={encounterFilters.riskLevel}
          onChange={(e) =>
            setEncounterFilters({
              ...encounterFilters,
              riskLevel: e.target.value,
            })
          }
          className={styles.filterSelect}
        >
          <option value="all">All Risk Levels</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>
        <select
          value={encounterFilters.provider}
          onChange={(e) =>
            setEncounterFilters({
              ...encounterFilters,
              provider: e.target.value,
            })
          }
          className={styles.filterSelect}
        >
          <option value="all">All Providers</option>
          {MOCK_PROVIDERS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {filteredEncounters.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No encounters match your filters</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Provider</th>
                  <th>Date</th>
                  <th>Diagnosis</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>Flags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEncounters
                  .slice((currentPage - 1) * perPage, currentPage * perPage)
                  .map((encounter) => (
                    <tr key={encounter.id}>
                      <td>{encounter.id}</td>
                      <td>{encounter.patientName}</td>
                      <td>{encounter.providerName}</td>
                      <td>{formatDate(encounter.date)}</td>
                      <td>{encounter.diagnosis}</td>
                      <td>
                        <span
                          className={getRiskBadgeClass(encounter.riskLevel)}
                        >
                          {encounter.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(encounter.status)}>
                          {encounter.status.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {encounter.flags.length > 0 ? (
                          <span className={styles.badgeWarning}>
                            {encounter.flags.length}
                          </span>
                        ) : (
                          <span className={styles.badgeSecondary}>0</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.buttonSmall}
                            onClick={() => setSelectedEncounter(encounter)}
                            title="View Details"
                          >
                            View
                          </button>
                          {encounter.status === "pending_review" && (
                            <>
                              <button
                                className={styles.buttonSuccess}
                                onClick={() =>
                                  handleApproveEncounter(encounter.id)
                                }
                                disabled={loading}
                              >
                                Approve
                              </button>
                              <button
                                className={styles.buttonWarning}
                                onClick={() =>
                                  handleFlagEncounter(encounter.id)
                                }
                                disabled={loading}
                              >
                                Flag
                              </button>
                              <button
                                className={styles.buttonDanger}
                                onClick={() =>
                                  handleEscalateEncounter(encounter.id)
                                }
                                disabled={loading}
                              >
                                Escalate
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Showing{" "}
              {Math.min(
                (currentPage - 1) * perPage + 1,
                filteredEncounters.length,
              )}
              –{Math.min(currentPage * perPage, filteredEncounters.length)} of{" "}
              {filteredEncounters.length}
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
    </div>
  );

  // Alerts & Risk Tab
  const renderAlertsTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search alerts..."
          className={styles.searchInput}
          value={alertFilters.search}
          onChange={(e) =>
            setAlertFilters({ ...alertFilters, search: e.target.value })
          }
        />
        <select
          value={alertFilters.status}
          onChange={(e) =>
            setAlertFilters({ ...alertFilters, status: e.target.value })
          }
          className={styles.filterSelect}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <select
          value={alertFilters.severity}
          onChange={(e) =>
            setAlertFilters({ ...alertFilters, severity: e.target.value })
          }
          className={styles.filterSelect}
        >
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={alertFilters.type}
          onChange={(e) =>
            setAlertFilters({ ...alertFilters, type: e.target.value })
          }
          className={styles.filterSelect}
        >
          <option value="all">All Types</option>
          <option value="Medication Interaction">Medication Interaction</option>
          <option value="Documentation Incomplete">
            Documentation Incomplete
          </option>
          <option value="Protocol Deviation">Protocol Deviation</option>
          <option value="High Risk Patient">High Risk Patient</option>
        </select>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No alerts match your filters</p>
        </div>
      ) : (
        <>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Description</th>
                <th>Provider</th>
                <th>Patient</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.slice((currentPage -1) * perPage, currentPage * perPage).map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.id}</td>
                  <td>{alert.type}</td>
                  <td>
                    <span className={getRiskBadgeClass(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </td>
                  <td>{alert.description}</td>
                  <td>{alert.providerName}</td>
                  <td>{alert.patientName}</td>
                  <td>{formatDate(alert.timestamp)}</td>
                  <td>
                    <span className={getStatusBadgeClass(alert.status)}>
                      {alert.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.buttonSmall}
                        onClick={() => setSelectedAlert(alert)}
                      >
                        View
                      </button>
                      {alert.status === "active" && (
                        <>
                          <button
                            className={styles.buttonWarning}
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                            disabled={loading}
                          >
                            Acknowledge
                          </button>
                          <button
                            className={styles.buttonSuccess}
                            onClick={() => handleResolveAlert(alert.id)}
                            disabled={loading}
                          >
                            Resolve
                          </button>
                          <button
                            className={styles.buttonSecondary}
                            onClick={() => handleDismissAlert(alert.id)}
                            disabled={loading}
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Showing{" "}
              {Math.min(
                (currentPage - 1) * perPage + 1,
                filteredAlerts.length,
              )}
              –{Math.min(currentPage * perPage, filteredAlerts.length)} of{" "}
              {filteredAlerts.length}
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
    </div>
  );

  // Provider Quality Tab
  const renderQualityTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search provider..."
          className={styles.searchInput}
          value={qualityFilters.search}
          onChange={(e) =>
            setQualityFilters({ ...qualityFilters, search: e.target.value })
          }
        />
        <select
          value={qualityFilters.specialty}
          onChange={(e) =>
            setQualityFilters({ ...qualityFilters, specialty: e.target.value })
          }
          className={styles.filterSelect}
        >
          <option value="all">All Specialties</option>
          <option value="Internal Medicine">Internal Medicine</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Psychiatry">Psychiatry</option>
          <option value="Dermatology">Dermatology</option>
        </select>
        <div className={styles.filterGroup}>
          <label>Min Quality Score:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={qualityFilters.minScore}
            onChange={(e) =>
              setQualityFilters({
                ...qualityFilters,
                minScore: Number(e.target.value),
              })
            }
            className={styles.rangeInput}
          />
          <span>{qualityFilters.minScore}</span>
        </div>
      </div>

      {filteredProviders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No providers match your filters</p>
        </div>
      ) : (

        <>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialty</th>
                <th>Quality Score</th>
                <th>Completion Rate</th>
                <th>Avg Response (min)</th>
                <th>Flagged Encounters</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.slice((currentPage - 1)*perPage, currentPage*perPage).map((provider) => (
                <tr key={provider.id}>
                  <td>{provider.id}</td>
                  <td>{provider.name}</td>
                  <td>{provider.specialty}</td>
                  <td>
                    <div className={styles.scoreContainer}>
                      <span
                        className={
                          provider.qualityScore >= 90
                            ? styles.scoreHigh
                            : provider.qualityScore >= 80
                              ? styles.scoreMedium
                              : styles.scoreLow
                        }
                      >
                        {provider.qualityScore}%
                      </span>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${provider.qualityScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>{provider.completionRate}%</td>
                  <td>{provider.avgResponseTime}</td>
                  <td>
                    {provider.flaggedEncounters > 0 ? (
                      <span className={styles.badgeWarning}>
                        {provider.flaggedEncounters}
                      </span>
                    ) : (
                      <span className={styles.badgeSuccess}>0</span>
                    )}
                  </td>
                  <td>
                    <button
                      className={styles.buttonPrimary}
                      onClick={() => setSelectedProvider(provider)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Showing{" "}
              {Math.min(
                (currentPage - 1) * perPage + 1,
                filteredProviders.length,
              )}
              –{Math.min(currentPage * perPage, filteredProviders.length)} of{" "}
              {filteredProviders.length}
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
    </div>
  );

  // Protocols & Guidelines Tab
  const renderProtocolsTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search protocols..."
          className={styles.searchInput}
          value={protocolFilters.search}
          onChange={(e) =>
            setProtocolFilters({ ...protocolFilters, search: e.target.value })
          }
        />
        <select
          value={protocolFilters.category}
          onChange={(e) =>
            setProtocolFilters({ ...protocolFilters, category: e.target.value })
          }
          className={styles.filterSelect}
        >
          <option value="all">All Categories</option>
          <option value="Psychiatry">Psychiatry</option>
          <option value="Cardiology">Cardiology</option>
          <option value="General Medicine">General Medicine</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="General">General</option>
        </select>
      </div>

      {filteredProtocols.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No protocols match your filters</p>
        </div>
      ) : (
        <>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Version</th>
                <th>Adherence Rate</th>
                <th>Violations</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProtocols.slice((currentPage-1)*perPage,currentPage*perPage).map((protocol) => (
                <tr key={protocol.id}>
                  <td>{protocol.id}</td>
                  <td>{protocol.name}</td>
                  <td>{protocol.category}</td>
                  <td>
                    <span className={styles.badgeSecondary}>
                      v{protocol.version}
                    </span>
                  </td>
                  <td>
                    <div className={styles.scoreContainer}>
                      <span
                        className={
                          protocol.adherenceRate >= 90
                            ? styles.scoreHigh
                            : protocol.adherenceRate >= 80
                              ? styles.scoreMedium
                              : styles.scoreLow
                        }
                      >
                        {protocol.adherenceRate}%
                      </span>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${protocol.adherenceRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {protocol.violations > 0 ? (
                      <span className={styles.badgeWarning}>
                        {protocol.violations}
                      </span>
                    ) : (
                      <span className={styles.badgeSuccess}>0</span>
                    )}
                  </td>
                  <td>{protocol.lastUpdated}</td>
                  <td>
                    <button
                      className={styles.buttonPrimary}
                      onClick={() => setSelectedProtocol(protocol)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Showing{" "}
              {Math.min(
                (currentPage - 1) * perPage + 1,
                filteredProtocols.length,
              )}
              –{Math.min(currentPage * perPage, filteredProtocols.length)} of{" "}
              {filteredProtocols.length}
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
    </div>
  );

  // Audit & Compliance Tab
  const renderAuditTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search audit logs..."
          className={styles.searchInput}
          value={auditFilters.search}
          onChange={(e) =>
            setAuditFilters({ ...auditFilters, search: e.target.value })
          }
        />
        <select
          value={auditFilters.action}
          onChange={(e) =>
            setAuditFilters({ ...auditFilters, action: e.target.value })
          }
          className={styles.filterSelect}
        >
          <option value="all">All Actions</option>
          <option value="Encounter Approved">Encounter Approved</option>
          <option value="Alert Acknowledged">Alert Acknowledged</option>
          <option value="Encounter Escalated">Encounter Escalated</option>
          <option value="Provider Quality Review">
            Provider Quality Review
          </option>
          <option value="Protocol Updated">Protocol Updated</option>
        </select>
        <select
          value={auditFilters.dateRange}
          onChange={(e) =>
            setAuditFilters({ ...auditFilters, dateRange: e.target.value })
          }
          className={styles.filterSelect}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {filteredAuditLogs.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No audit logs match your filters</p>
        </div>
      ) : (
        <>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Action</th>
                <th>Performed By</th>
                <th>Target Type</th>
                <th>Target ID</th>
                <th>Timestamp</th>
                <th>IP Address</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuditLogs.slice((currentPage-1)*perPage,currentPage*perPage).map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>
                    <span className={styles.badgePrimary}>{log.action}</span>
                  </td>
                  <td>{log.performedBy}</td>
                  <td>{log.targetType}</td>
                  <td>{log.targetId}</td>
                  <td>{formatDate(log.timestamp)}</td>
                  <td>
                    <code className={styles.code}>{log.ipAddress}</code>
                  </td>
                  <td>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Showing{" "}
              {Math.min(
                (currentPage - 1) * perPage + 1,
                filteredAuditLogs.length,
              )}
              –{Math.min(currentPage * perPage, filteredAuditLogs.length)} of{" "}
              {filteredAuditLogs.length}
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
    </div>
  );

  // Incidents Tab
  const renderIncidentsTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search incidents..."
          className={styles.searchInput}
          value={incidentFilters.search}
          onChange={(e) =>
            setIncidentFilters({ ...incidentFilters, search: e.target.value })
          }
        />
        <select
          value={incidentFilters.severity}
          onChange={(e) =>
            setIncidentFilters({ ...incidentFilters, severity: e.target.value })
          }
          className={styles.filterSelect}
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="major">Major</option>
          <option value="moderate">Moderate</option>
          <option value="minor">Minor</option>
        </select>
        <select
          value={incidentFilters.status}
          onChange={(e) =>
            setIncidentFilters({ ...incidentFilters, status: e.target.value })
          }
          className={styles.filterSelect}
        >
          <option value="all">All Statuses</option>
          <option value="reported">Reported</option>
          <option value="under_investigation">Under Investigation</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={incidentFilters.category}
          onChange={(e) =>
            setIncidentFilters({ ...incidentFilters, category: e.target.value })
          }
          className={styles.filterSelect}
        >
          <option value="all">All Categories</option>
          <option value="Medication Safety">Medication Safety</option>
          <option value="Care Coordination">Care Coordination</option>
          <option value="HIPAA Compliance">HIPAA Compliance</option>
          <option value="Quality of Care">Quality of Care</option>
        </select>
      </div>

      {filteredIncidents.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No incidents match your filters</p>
        </div>
      ) : (
        <>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Category</th>
                <th>Reported By</th>
                <th>Reported Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.slice((currentPage-1)*perPage,currentPage*perPage).map((incident) => (
                <tr key={incident.id}>
                  <td>{incident.id}</td>
                  <td>{incident.title}</td>
                  <td>
                    <span className={getStatusBadgeClass(incident.severity)}>
                      {incident.severity.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(incident.status)}>
                      {incident.status.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td>{incident.category}</td>
                  <td>{incident.reportedBy}</td>
                  <td>{formatDate(incident.reportedDate)}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.buttonSmall}
                        onClick={() => setSelectedIncident(incident)}
                      >
                        View
                      </button>
                      {incident.status === "reported" && (
                        <button
                          className={styles.buttonWarning}
                          onClick={() => handleInvestigateIncident(incident.id)}
                          disabled={loading}
                        >
                          Investigate
                        </button>
                      )}
                      {incident.status === "under_investigation" && (
                        <button
                          className={styles.buttonSuccess}
                          onClick={() => handleResolveIncident(incident.id)}
                          disabled={loading}
                        >
                          Resolve
                        </button>
                      )}
                      {incident.status === "resolved" && (
                        <button
                          className={styles.buttonSecondary}
                          onClick={() => handleCloseIncident(incident.id)}
                          disabled={loading}
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Showing{" "}
              {Math.min(
                (currentPage - 1) * perPage + 1,
                filteredIncidents.length,
              )}
              –{Math.min(currentPage * perPage, filteredIncidents.length)} of{" "}
              {filteredIncidents.length}
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
    </div>
  );

  // ==================== MODALS ====================

  const renderEncounterModal = () => {
    if (!selectedEncounter) return null;

    return (
      <div
        className={styles.modalOverlay}
        onClick={() => setSelectedEncounter(null)}
      >
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Encounter Details - {selectedEncounter.id}</h2>
            <button
              className={styles.modalClose}
              onClick={() => setSelectedEncounter(null)}
            >
              ×
            </button>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.detailGrid}>
              <div className={styles.detailRow}>
                <strong>Patient:</strong>
                <span>
                  {selectedEncounter.patientName} ({selectedEncounter.patientId}
                  )
                </span>
              </div>
              <div className={styles.detailRow}>
                <strong>Provider:</strong>
                <span>{selectedEncounter.providerName}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Date:</strong>
                <span>{formatDate(selectedEncounter.date)}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Duration:</strong>
                <span>{selectedEncounter.duration} minutes</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Diagnosis:</strong>
                <span>{selectedEncounter.diagnosis}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Risk Level:</strong>
                <span
                  className={getRiskBadgeClass(selectedEncounter.riskLevel)}
                >
                  {selectedEncounter.riskLevel.toUpperCase()}
                </span>
              </div>
              <div className={styles.detailRow}>
                <strong>Status:</strong>
                <span className={getStatusBadgeClass(selectedEncounter.status)}>
                  {selectedEncounter.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Clinical Notes</h3>
              <p>{selectedEncounter.notes}</p>
            </div>

            <div className={styles.detailSection}>
              <h3>Prescriptions</h3>
              <ul>
                {selectedEncounter.prescriptions.map((rx, idx) => (
                  <li key={idx}>{rx}</li>
                ))}
              </ul>
            </div>

            {selectedEncounter.flags.length > 0 && (
              <div className={styles.detailSection}>
                <h3>Flags</h3>
                <ul>
                  {selectedEncounter.flags.map((flag, idx) => (
                    <li key={idx} className={styles.flagItem}>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className={styles.modalFooter}>
            {selectedEncounter.status === "pending_review" && (
              <>
                <button
                  className={styles.buttonSuccess}
                  onClick={() => {
                    handleApproveEncounter(selectedEncounter.id);
                    setSelectedEncounter(null);
                  }}
                >
                  Approve
                </button>
                <button
                  className={styles.buttonWarning}
                  onClick={() => {
                    handleFlagEncounter(selectedEncounter.id);
                    setSelectedEncounter(null);
                  }}
                >
                  Flag for Review
                </button>
                <button
                  className={styles.buttonDanger}
                  onClick={() => {
                    handleEscalateEncounter(selectedEncounter.id);
                    setSelectedEncounter(null);
                  }}
                >
                  Escalate
                </button>
              </>
            )}
            <button
              className={styles.buttonSecondary}
              onClick={() => setSelectedEncounter(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAlertModal = () => {
    if (!selectedAlert) return null;

    return (
      <div
        className={styles.modalOverlay}
        onClick={() => setSelectedAlert(null)}
      >
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Alert Details - {selectedAlert.id}</h2>
            <button
              className={styles.modalClose}
              onClick={() => setSelectedAlert(null)}
            >
              ×
            </button>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.detailGrid}>
              <div className={styles.detailRow}>
                <strong>Type:</strong>
                <span>{selectedAlert.type}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Severity:</strong>
                <span className={getRiskBadgeClass(selectedAlert.severity)}>
                  {selectedAlert.severity.toUpperCase()}
                </span>
              </div>
              <div className={styles.detailRow}>
                <strong>Status:</strong>
                <span className={getStatusBadgeClass(selectedAlert.status)}>
                  {selectedAlert.status.toUpperCase()}
                </span>
              </div>
              <div className={styles.detailRow}>
                <strong>Provider:</strong>
                <span>{selectedAlert.providerName}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Patient:</strong>
                <span>{selectedAlert.patientName}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Encounter ID:</strong>
                <span>{selectedAlert.encounterId}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Timestamp:</strong>
                <span>{formatDate(selectedAlert.timestamp)}</span>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Description</h3>
              <p>{selectedAlert.description}</p>
            </div>

            <div className={styles.detailSection}>
              <h3>Details</h3>
              <p>{selectedAlert.details}</p>
            </div>
          </div>
          <div className={styles.modalFooter}>
            {selectedAlert.status === "active" && (
              <>
                <button
                  className={styles.buttonWarning}
                  onClick={() => {
                    handleAcknowledgeAlert(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                >
                  Acknowledge
                </button>
                <button
                  className={styles.buttonSuccess}
                  onClick={() => {
                    handleResolveAlert(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                >
                  Resolve
                </button>
                <button
                  className={styles.buttonSecondary}
                  onClick={() => {
                    handleDismissAlert(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                >
                  Dismiss
                </button>
              </>
            )}
            <button
              className={styles.buttonSecondary}
              onClick={() => setSelectedAlert(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProviderModal = () => {
    if (!selectedProvider) return null;

    return (
      <div
        className={styles.modalOverlay}
        onClick={() => setSelectedProvider(null)}
      >
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Provider Quality Details</h2>
            <button
              className={styles.modalClose}
              onClick={() => setSelectedProvider(null)}
            >
              ×
            </button>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.detailGrid}>
              <div className={styles.detailRow}>
                <strong>Provider:</strong>
                <span>
                  {selectedProvider.name} ({selectedProvider.id})
                </span>
              </div>
              <div className={styles.detailRow}>
                <strong>Specialty:</strong>
                <span>{selectedProvider.specialty}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Quality Score:</strong>
                <span
                  className={
                    selectedProvider.qualityScore >= 90
                      ? styles.scoreHigh
                      : selectedProvider.qualityScore >= 80
                        ? styles.scoreMedium
                        : styles.scoreLow
                  }
                >
                  {selectedProvider.qualityScore}%
                </span>
              </div>
              <div className={styles.detailRow}>
                <strong>Completion Rate:</strong>
                <span>{selectedProvider.completionRate}%</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Avg Response Time:</strong>
                <span>{selectedProvider.avgResponseTime} minutes</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Flagged Encounters:</strong>
                <span
                  className={
                    selectedProvider.flaggedEncounters > 0
                      ? styles.badgeWarning
                      : styles.badgeSuccess
                  }
                >
                  {selectedProvider.flaggedEncounters}
                </span>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Performance Metrics</h3>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Patient Satisfaction</div>
                  <div className={styles.metricValue}>4.7/5.0</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Protocol Adherence</div>
                  <div className={styles.metricValue}>93%</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>
                    Documentation Quality
                  </div>
                  <div className={styles.metricValue}>91%</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Total Encounters</div>
                  <div className={styles.metricValue}>847</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button
              className={styles.buttonSecondary}
              onClick={() => setSelectedProvider(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProtocolModal = () => {
    if (!selectedProtocol) return null;

    return (
      <div
        className={styles.modalOverlay}
        onClick={() => setSelectedProtocol(null)}
      >
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Protocol Details</h2>
            <button
              className={styles.modalClose}
              onClick={() => setSelectedProtocol(null)}
            >
              ×
            </button>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.detailGrid}>
              <div className={styles.detailRow}>
                <strong>Name:</strong>
                <span>{selectedProtocol.name}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>ID:</strong>
                <span>{selectedProtocol.id}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Category:</strong>
                <span>{selectedProtocol.category}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Version:</strong>
                <span className={styles.badgeSecondary}>
                  v{selectedProtocol.version}
                </span>
              </div>
              <div className={styles.detailRow}>
                <strong>Adherence Rate:</strong>
                <span
                  className={
                    selectedProtocol.adherenceRate >= 90
                      ? styles.scoreHigh
                      : selectedProtocol.adherenceRate >= 80
                        ? styles.scoreMedium
                        : styles.scoreLow
                  }
                >
                  {selectedProtocol.adherenceRate}%
                </span>
              </div>
              <div className={styles.detailRow}>
                <strong>Violations:</strong>
                <span
                  className={
                    selectedProtocol.violations > 0
                      ? styles.badgeWarning
                      : styles.badgeSuccess
                  }
                >
                  {selectedProtocol.violations}
                </span>
              </div>
              <div className={styles.detailRow}>
                <strong>Last Updated:</strong>
                <span>{selectedProtocol.lastUpdated}</span>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Description</h3>
              <p>{selectedProtocol.description}</p>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button
              className={styles.buttonSecondary}
              onClick={() => setSelectedProtocol(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderIncidentModal = () => {
    if (!selectedIncident) return null;

    return (
      <div
        className={styles.modalOverlay}
        onClick={() => setSelectedIncident(null)}
      >
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Incident Details - {selectedIncident.id}</h2>
            <button
              className={styles.modalClose}
              onClick={() => setSelectedIncident(null)}
            >
              ×
            </button>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.detailGrid}>
              <div className={styles.detailRow}>
                <strong>Title:</strong>
                <span>{selectedIncident.title}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Severity:</strong>
                <span
                  className={getStatusBadgeClass(selectedIncident.severity)}
                >
                  {selectedIncident.severity.toUpperCase()}
                </span>
              </div>
              <div className={styles.detailRow}>
                <strong>Status:</strong>
                <span className={getStatusBadgeClass(selectedIncident.status)}>
                  {selectedIncident.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <div className={styles.detailRow}>
                <strong>Category:</strong>
                <span>{selectedIncident.category}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Reported By:</strong>
                <span>{selectedIncident.reportedBy}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Reported Date:</strong>
                <span>{formatDate(selectedIncident.reportedDate)}</span>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Description</h3>
              <p>{selectedIncident.description}</p>
            </div>

            <div className={styles.detailSection}>
              <h3>Affected Patients</h3>
              <ul>
                {selectedIncident.affectedPatients.map((patient, idx) => (
                  <li key={idx}>{patient}</li>
                ))}
              </ul>
            </div>

            {selectedIncident.involvedProviders.length > 0 && (
              <div className={styles.detailSection}>
                <h3>Involved Providers</h3>
                <ul>
                  {selectedIncident.involvedProviders.map((provider, idx) => (
                    <li key={idx}>{provider}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedIncident.resolution && (
              <div className={styles.detailSection}>
                <h3>Resolution</h3>
                <p>{selectedIncident.resolution}</p>
              </div>
            )}
          </div>
          <div className={styles.modalFooter}>
            {selectedIncident.status === "reported" && (
              <button
                className={styles.buttonWarning}
                onClick={() => {
                  handleInvestigateIncident(selectedIncident.id);
                  setSelectedIncident(null);
                }}
              >
                Start Investigation
              </button>
            )}
            {selectedIncident.status === "under_investigation" && (
              <button
                className={styles.buttonSuccess}
                onClick={() => {
                  handleResolveIncident(selectedIncident.id);
                  setSelectedIncident(null);
                }}
              >
                Mark as Resolved
              </button>
            )}
            {selectedIncident.status === "resolved" && (
              <button
                className={styles.buttonSecondary}
                onClick={() => {
                  handleCloseIncident(selectedIncident.id);
                  setSelectedIncident(null);
                }}
              >
                Close Incident
              </button>
            )}
            <button
              className={styles.buttonSecondary}
              onClick={() => setSelectedIncident(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==================== MAIN RENDER ====================

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Clinical Oversight</h1>
        <p>
          Ensure clinical quality, safety, and compliance across all
          telemedicine encounters
        </p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "encounters" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("encounters")}
        >
          Encounter Review
        </button>
        <button
          className={`${styles.tab} ${activeTab === "alerts" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("alerts")}
        >
          Alerts & Risk
        </button>
        <button
          className={`${styles.tab} ${activeTab === "quality" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("quality")}
        >
          Provider Quality
        </button>
        <button
          className={`${styles.tab} ${activeTab === "protocols" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("protocols")}
        >
          Protocols & Guidelines
        </button>
        <button
          className={`${styles.tab} ${activeTab === "audit" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("audit")}
        >
          Audit & Compliance
        </button>
        <button
          className={`${styles.tab} ${activeTab === "incidents" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("incidents")}
        >
          Incidents
        </button>
      </div>

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {activeTab === "encounters" && renderEncountersTab()}
      {activeTab === "alerts" && renderAlertsTab()}
      {activeTab === "quality" && renderQualityTab()}
      {activeTab === "protocols" && renderProtocolsTab()}
      {activeTab === "audit" && renderAuditTab()}
      {activeTab === "incidents" && renderIncidentsTab()}

      {renderEncounterModal()}
      {renderAlertModal()}
      {renderProviderModal()}
      {renderProtocolModal()}
      {renderIncidentModal()}
    </div>
  );
};

export default ClinicalOversight;
