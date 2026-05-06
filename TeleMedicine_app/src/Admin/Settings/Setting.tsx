import React, { useState } from "react";
import styles from "./Settings.module.css";

// ─── Types ───

interface AppSettings {
  // Security & Compliance
  hipaaMode: boolean;
  sessionTimeout: 15 | 30 | 60;
  twoFactorRequired: boolean;

  // Appointment Controls
  defaultAppointmentDuration: 15 | 20 | 30 | 45 | 60;
  allowSameDayBooking: boolean;
  autoCancelNoShowMinutes: number;

  // Provider Controls
  autoApproveProviders: boolean;
  requireLicenseVerification: boolean;

  // Notifications
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;

  // System Controls
  maintenanceMode: boolean;
  debugLoggingMode: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  hipaaMode: true,
  sessionTimeout: 30,
  twoFactorRequired: true,
  defaultAppointmentDuration: 30,
  allowSameDayBooking: true,
  autoCancelNoShowMinutes: 15,
  autoApproveProviders: false,
  requireLicenseVerification: true,
  enableEmailNotifications: true,
  enableSmsNotifications: false,
  maintenanceMode: false,
  debugLoggingMode: false,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  warning?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  warning = false,
}) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={`${styles.toggle} ${checked ? styles.toggleOn : ""} ${
      warning && checked ? styles.toggleWarning : ""
    } ${disabled ? styles.toggleDisabled : ""}`}
  >
    <span className={styles.toggleThumb} />
  </button>
);

interface SettingRowProps {
  label: string;
  description: string;
  htmlFor?: string;
  warning?: boolean;
  children: React.ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  description,
  htmlFor,
  warning,
  children,
}) => (
  <div
    className={`${styles.settingRow} ${warning ? styles.settingRowWarning : ""}`}
  >
    <div className={styles.settingMeta}>
      <label className={styles.settingLabel} htmlFor={htmlFor}>
        {label}
      </label>
      <p className={styles.settingDescription}>{description}</p>
      {warning && (
        <span className={styles.warningBadge}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Will take the application offline for all users
        </span>
      )}
    </div>
    <div className={styles.settingControl}>{children}</div>
  </div>
);

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  badge,
  children,
}) => (
  <section className={styles.card}>
    <div className={styles.cardHeader}>
      <span className={styles.cardIcon}>{icon}</span>
      <h2 className={styles.cardTitle}>{title}</h2>
      {badge && <span className={styles.cardBadge}>{badge}</span>}
    </div>
    <div className={styles.cardBody}>{children}</div>
  </section>
);

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconShield = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconCalendar = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconUsers = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const IconBell = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
const IconSettings = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // Mock save — replace with API call
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaved(false);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>System Settings</h1>
          <p className={styles.pageSubtitle}>
            Manage critical configurations
          </p>
        </div>
        {/* <div className={styles.headerMeta}>
          <span className={styles.hipaaChip}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            HIPAA Compliant Platform
          </span>
        </div> */}
      </div>

      <div className={styles.content}>
        {/* 1. Security & Compliance */}
        <SectionCard
          title="Security & Compliance"
          icon={<IconShield />}
          badge="Critical"
        >
          <SettingRow
            label="HIPAA Mode"
            description="Enforce HIPAA-compliant data handling, audit logs, and access controls across the platform."
            htmlFor="hipaaMode"
          >
            <Toggle
              id="hipaaMode"
              checked={settings.hipaaMode}
              onChange={(v) => update("hipaaMode", v)}
            />
          </SettingRow>

          <SettingRow
            label="Session Timeout"
            description="Automatically log out inactive users to prevent unauthorized access."
            htmlFor="sessionTimeout"
          >
            <select
              id="sessionTimeout"
              className={styles.select}
              value={settings.sessionTimeout}
              onChange={(e) =>
                update("sessionTimeout", Number(e.target.value) as 15 | 30 | 60)
              }
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </SettingRow>

          <SettingRow
            label="Two-Factor Authentication"
            description="Require all admin and provider accounts to use 2FA on login."
            htmlFor="twoFactor"
          >
            <Toggle
              id="twoFactor"
              checked={settings.twoFactorRequired}
              onChange={(v) => update("twoFactorRequired", v)}
            />
          </SettingRow>
        </SectionCard>

        {/* 2. Appointment Controls */}
        <SectionCard title="Appointment Controls" icon={<IconCalendar />}>
          <SettingRow
            label="Default Appointment Duration"
            description="Set the standard slot length used when providers create new appointment types."
            htmlFor="apptDuration"
          >
            <select
              id="apptDuration"
              className={styles.select}
              value={settings.defaultAppointmentDuration}
              onChange={(e) =>
                update(
                  "defaultAppointmentDuration",
                  Number(e.target.value) as 15 | 20 | 30 | 45 | 60,
                )
              }
            >
              <option value={15}>15 minutes</option>
              <option value={20}>20 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </SettingRow>

          <SettingRow
            label="Allow Same-Day Booking"
            description="Let patients schedule appointments on the current calendar day."
            htmlFor="sameDayBooking"
          >
            <Toggle
              id="sameDayBooking"
              checked={settings.allowSameDayBooking}
              onChange={(v) => update("allowSameDayBooking", v)}
            />
          </SettingRow>

          <SettingRow
            label="Auto-Cancel No-Show"
            description="Automatically cancel appointments if the patient hasn't joined after this many minutes."
            htmlFor="noShowMinutes"
          >
            <div className={styles.inputAddon}>
              <input
                id="noShowMinutes"
                type="number"
                min={5}
                max={60}
                step={5}
                className={styles.numberInput}
                value={settings.autoCancelNoShowMinutes}
                onChange={(e) =>
                  update(
                    "autoCancelNoShowMinutes",
                    Math.max(5, Number(e.target.value)),
                  )
                }
              />
              <span className={styles.inputAddonLabel}>min</span>
            </div>
          </SettingRow>
        </SectionCard>

        {/* 3. Provider Controls */}
        <SectionCard title="Provider Controls" icon={<IconUsers />}>
          <SettingRow
            label="Auto-Approve Providers"
            description="Automatically approve new provider registrations without manual admin review."
            htmlFor="autoApprove"
          >
            <Toggle
              id="autoApprove"
              checked={settings.autoApproveProviders}
              onChange={(v) => update("autoApproveProviders", v)}
            />
          </SettingRow>

          <SettingRow
            label="Require License Verification"
            description="Block providers from seeing patients until their state medical license is verified."
            htmlFor="licenseVerif"
          >
            <Toggle
              id="licenseVerif"
              checked={settings.requireLicenseVerification}
              onChange={(v) => update("requireLicenseVerification", v)}
              disabled={settings.autoApproveProviders}
            />
          </SettingRow>
        </SectionCard>

        {/* 4. Notifications */}
        <SectionCard title="Notifications" icon={<IconBell />}>
          <SettingRow
            label="Email Notifications"
            description="Send appointment reminders, confirmations, and system alerts via email."
            htmlFor="emailNotif"
          >
            <Toggle
              id="emailNotif"
              checked={settings.enableEmailNotifications}
              onChange={(v) => update("enableEmailNotifications", v)}
            />
          </SettingRow>

          <SettingRow
            label="SMS Notifications"
            description="Send text message reminders and alerts to patients and providers."
            htmlFor="smsNotif"
          >
            <Toggle
              id="smsNotif"
              checked={settings.enableSmsNotifications}
              onChange={(v) => update("enableSmsNotifications", v)}
            />
          </SettingRow>
        </SectionCard>

        {/* 5. System Controls */}
        <SectionCard
          title="System Controls"
          icon={<IconSettings />}
          badge="Admin Only"
        >
          <SettingRow
            label="Maintenance Mode"
            description="Suspend access to the platform for all non-admin users during maintenance windows."
            htmlFor="maintenanceMode"
            warning={settings.maintenanceMode}
          >
            <Toggle
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={(v) => update("maintenanceMode", v)}
              warning
            />
          </SettingRow>

          <SettingRow
            label="Debug / Logging Mode"
            description="Enable verbose logging for diagnostics. Do not use in production for extended periods."
            htmlFor="debugMode"
          >
            <Toggle
              id="debugMode"
              checked={settings.debugLoggingMode}
              onChange={(v) => update("debugLoggingMode", v)}
            />
          </SettingRow>
        </SectionCard>

        <div className={styles.footerInner}>
          <button className={styles.resetBtn} onClick={handleReset}>
            Reset to Defaults
          </button>
          <button
            className={`${styles.saveBtn} ${saved ? styles.saveBtnSuccess : ""}`}
            onClick={handleSave}
          >
            {saved ? (
              <>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
