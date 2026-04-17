import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Lock,
  Bell,
  Shield,
  LogOut,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { CgProfile } from "react-icons/cg"; //  FileText,

import styles from "./Settings.module.css";

// Mock data
const mockPatientData = {
  firstName: "Jhon",
  lastName: "Chen",
  dateOfBirth: "1990-05-15",
  gender: "Male",
  phone: "+1 (555) 123-4567",
  email: "jhon.chen@email.com",
  address: "123 Health St",
  city: "San Francisco",
  state: "CA",
  zipCode: "94102",
  country: "United States",
};

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ConfirmModal {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

const Settings: React.FC = () => {
  // Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(mockPatientData);
  const [editProfileData, setEditProfileData] = useState(mockPatientData);
  const [preview, setPreview] = useState<string | null>(null);

  // Password state
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");

  interface Notifications {
    appointmentReminders: boolean;
    medicationReminders: boolean;
    labResults: boolean;
    billingNotifications: boolean;
    promotionalEmails: boolean;
  }

  // Notifications state
  const [notifications, setNotifications] = useState<Notifications>({
    appointmentReminders: true,
    medicationReminders: true,
    labResults: true,
    billingNotifications: false,
    promotionalEmails: false,
  });

  // Communication preferences state
  const [communicationPreference, setCommunicationPreference] =
    useState("email");

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    telehealthRecording: false,
    shareRecords: true,
    shareInsurance: false,
  });

  // Insurance state
  const [insuranceData, setInsuranceData] = useState({
    provider: "Blue Shield California",
    policyNumber: "BS-1234567890",
    groupNumber: "GRP-98765",
  });
  const [isEditingInsurance, setIsEditingInsurance] = useState(false);
  const [editInsuranceData, setEditInsuranceData] = useState(insuranceData);

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modal state
  const [confirmModal, setConfirmModal] = useState<ConfirmModal>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Helper functions
  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Profile handlers
  const handleEditProfile = () => {
    setEditProfileData(profileData);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setProfileData(editProfileData);
    setIsEditingProfile(false);
    addToast("success", "Profile updated successfully");
  };

  const handleCancelProfile = () => {
    setIsEditingProfile(false);
    setEditProfileData(profileData);
  };

  const handleProfileChange = (field: string, value: string) => {
    setEditProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Password handlers
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPasswordError("");
  };

  const handleUpdatePassword = () => {
    if (passwordData.new.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (!passwordData.current) {
      setPasswordError("Please enter your current password");
      return;
    }
    setPasswordData({ current: "", new: "", confirm: "" });
    addToast("success", "Password updated successfully");
  };

  // Notification handlers
  const handleToggleNotification = (key: keyof Notifications) => {
    setNotifications((prev: Notifications) => ({
      ...prev,
      [key]: !prev[key],
    }));
    addToast("success", "Notification preferences updated");
  };

  // Privacy handlers
  const handleTogglePrivacy = (key: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    addToast("success", "Privacy settings updated");
  };

  // Insurance handlers
  const handleEditInsurance = () => {
    setEditInsuranceData(insuranceData);
    setIsEditingInsurance(true);
  };

  const handleSaveInsurance = () => {
    setInsuranceData(editInsuranceData);
    setIsEditingInsurance(false);
    addToast("success", "Insurance information updated");
  };

  const handleInsuranceChange = (field: string, value: string) => {
    setEditInsuranceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Deactivate account handler
  const handleDeactivateAccount = () => {
    setConfirmModal({
      open: true,
      title: "Deactivate Account",
      message:
        "Are you sure you want to deactivate your account? This action cannot be undone. All your data will be archived.",
      onConfirm: () => {
        setConfirmModal({ ...confirmModal, open: false });
        addToast("success", "Account deactivation request submitted");
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Update the actual data object
      setProfileData((prev) => ({ ...prev, ProfilePicture: file }));

      // 2. Generate a temporary URL for the preview <img> tag
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  // handle profile click from header
  const profileFormRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.setIsEditingProfile) {
      setIsEditingProfile(true);

      setTimeout(() => {
        profileFormRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>
          Manage your account preferences and security
        </p>
      </div>

      {/* Toast notifications */}
      <div className={styles.toastContainer} role="region" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type]}`}
          >
            <div className={styles.toastContent}>
              {toast.type === "success" && (
                <CheckCircle size={20} className={styles.toastIcon} />
              )}
              {toast.type === "error" && (
                <AlertCircle size={20} className={styles.toastIcon} />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              className={styles.toastClose}
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Settings sections */}
      <div className={styles.content} ref={profileFormRef}>
        {/* Profile Information Section */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Profile Information</h2>
            {!isEditingProfile && (
              <button
                className={styles.buttonSecondary}
                onClick={handleEditProfile}
                aria-label="Edit profile"
              >
                <Edit2 size={18} />
                Edit
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.inputGroup}>
                <label>Profile Picture</label>
                <div className={styles.imagePreviewContainer}>
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className={styles.previewImage}
                    />
                  ) : (
                    <CgProfile className={styles.placeholderIcon} />
                  )}
                </div>
                <input
                  type="file"
                  name="ProfilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName" className={styles.label}>
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={styles.input}
                    value={editProfileData.firstName}
                    onChange={(e) =>
                      handleProfileChange("firstName", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName" className={styles.label}>
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={styles.input}
                    value={editProfileData.lastName}
                    onChange={(e) =>
                      handleProfileChange("lastName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="dob" className={styles.label}>
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    className={styles.input}
                    value={editProfileData.dateOfBirth}
                    onChange={(e) =>
                      handleProfileChange("dateOfBirth", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="gender" className={styles.label}>
                    Gender
                  </label>
                  <select
                    id="gender"
                    className={styles.input}
                    value={editProfileData.gender}
                    onChange={(e) =>
                      handleProfileChange("gender", e.target.value)
                    }
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={styles.input}
                    value={editProfileData.phone}
                    onChange={(e) =>
                      handleProfileChange("phone", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    value={editProfileData.email}
                    onChange={(e) =>
                      handleProfileChange("email", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.label}>
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  className={styles.input}
                  value={editProfileData.address}
                  onChange={(e) =>
                    handleProfileChange("address", e.target.value)
                  }
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="city" className={styles.label}>
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    className={styles.input}
                    value={editProfileData.city}
                    onChange={(e) =>
                      handleProfileChange("city", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="state" className={styles.label}>
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    className={styles.input}
                    value={editProfileData.state}
                    onChange={(e) =>
                      handleProfileChange("state", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="zipCode" className={styles.label}>
                    ZIP Code
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    className={styles.input}
                    value={editProfileData.zipCode}
                    onChange={(e) =>
                      handleProfileChange("zipCode", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="country" className={styles.label}>
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  className={styles.input}
                  value={editProfileData.country}
                  onChange={(e) =>
                    handleProfileChange("country", e.target.value)
                  }
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.buttonPrimary}
                  onClick={handleSaveProfile}
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  type="button"
                  className={styles.buttonSecondary}
                  onClick={handleCancelProfile}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Name</span>
                <p>
                  {profileData.firstName} {profileData.lastName}
                </p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Date of Birth</span>
                <p>{profileData.dateOfBirth}</p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Gender</span>
                <p>{profileData.gender}</p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Phone</span>
                <p>{profileData.phone}</p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email</span>
                <p>{profileData.email}</p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Address</span>
                <p>
                  {profileData.address}, {profileData.city}, {profileData.state}{" "}
                  {profileData.zipCode}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>
            <Lock size={20} />
            Change Password
          </h2>

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            {passwordError && (
              <div className={styles.errorMessage} role="alert">
                <AlertCircle size={18} />
                {passwordError}
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="currentPassword" className={styles.label}>
                Current Password
              </label>
              <div className={styles.passwordInput}>
                <input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  className={styles.input}
                  value={passwordData.current}
                  onChange={(e) =>
                    handlePasswordChange("current", e.target.value)
                  }
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPasswords.current ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword" className={styles.label}>
                New Password
              </label>
              <div className={styles.passwordInput}>
                <input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  className={styles.input}
                  value={passwordData.new}
                  onChange={(e) => handlePasswordChange("new", e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      new: !prev.new,
                    }))
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <div className={styles.passwordInput}>
                <input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  className={styles.input}
                  value={passwordData.confirm}
                  onChange={(e) =>
                    handlePasswordChange("confirm", e.target.value)
                  }
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              className={styles.buttonPrimary}
              onClick={handleUpdatePassword}
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Notification Preferences Section */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>
            <Bell size={20} />
            Notification Preferences
          </h2>

          <div className={styles.toggleList}>
            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <label
                  htmlFor="appointmentReminders"
                  className={styles.toggleLabel}
                >
                  Appointment Reminders
                </label>
                <p className={styles.toggleDescription}>
                  Receive reminders before your appointments
                </p>
              </div>
              <label className={styles.switch}>
                <input
                  id="appointmentReminders"
                  type="checkbox"
                  checked={notifications.appointmentReminders}
                  onChange={() =>
                    handleToggleNotification("appointmentReminders")
                  }
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <label
                  htmlFor="medicationReminders"
                  className={styles.toggleLabel}
                >
                  Medication Reminders
                </label>
                <p className={styles.toggleDescription}>
                  Receive reminders for your medications
                </p>
              </div>
              <label className={styles.switch}>
                <input
                  id="medicationReminders"
                  type="checkbox"
                  checked={notifications.medicationReminders}
                  onChange={() =>
                    handleToggleNotification("medicationReminders")
                  }
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <label htmlFor="labResults" className={styles.toggleLabel}>
                  Lab Result Notifications
                </label>
                <p className={styles.toggleDescription}>
                  Get notified when lab results are available
                </p>
              </div>
              <label className={styles.switch}>
                <input
                  id="labResults"
                  type="checkbox"
                  checked={notifications.labResults}
                  onChange={() => handleToggleNotification("labResults")}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <label
                  htmlFor="billingNotifications"
                  className={styles.toggleLabel}
                >
                  Billing Notifications
                </label>
                <p className={styles.toggleDescription}>
                  Receive billing and invoice updates
                </p>
              </div>
              <label className={styles.switch}>
                <input
                  id="billingNotifications"
                  type="checkbox"
                  checked={notifications.billingNotifications}
                  onChange={() =>
                    handleToggleNotification("billingNotifications")
                  }
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <label
                  htmlFor="promotionalEmails"
                  className={styles.toggleLabel}
                >
                  Promotional Emails
                </label>
                <p className={styles.toggleDescription}>
                  Receive updates about new features and promotions
                </p>
              </div>
              <label className={styles.switch}>
                <input
                  id="promotionalEmails"
                  type="checkbox"
                  checked={notifications.promotionalEmails}
                  onChange={() => handleToggleNotification("promotionalEmails")}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Communication Preferences Section */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Communication Preferences</h2>

          <div className={styles.radioList}>
            <label className={styles.radioItem}>
              <input
                type="radio"
                name="communication"
                value="email"
                checked={communicationPreference === "email"}
                onChange={(e) => {
                  setCommunicationPreference(e.target.value);
                  addToast("success", "Communication preference updated");
                }}
              />
              <span className={styles.radioCustom}></span>
              <span className={styles.radioLabel}>Email</span>
            </label>

            <label className={styles.radioItem}>
              <input
                type="radio"
                name="communication"
                value="sms"
                checked={communicationPreference === "sms"}
                onChange={(e) => {
                  setCommunicationPreference(e.target.value);
                  addToast("success", "Communication preference updated");
                }}
              />
              <span className={styles.radioCustom}></span>
              <span className={styles.radioLabel}>SMS</span>
            </label>

            <label className={styles.radioItem}>
              <input
                type="radio"
                name="communication"
                value="push"
                checked={communicationPreference === "push"}
                onChange={(e) => {
                  setCommunicationPreference(e.target.value);
                  addToast("success", "Communication preference updated");
                }}
              />
              <span className={styles.radioCustom}></span>
              <span className={styles.radioLabel}>Push Notifications</span>
            </label>
          </div>
        </div>

        {/* Privacy Settings Section */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>
            <Shield size={20} />
            Privacy Settings
          </h2>

          <div className={styles.toggleList}>
            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <label
                  htmlFor="telehealthRecording"
                  className={styles.toggleLabel}
                >
                  Allow Telehealth Recording
                </label>
                <p className={styles.toggleDescription}>
                  Allow sessions to be recorded for quality assurance
                </p>
              </div>
              <label className={styles.switch}>
                <input
                  id="telehealthRecording"
                  type="checkbox"
                  checked={privacySettings.telehealthRecording}
                  onChange={() => handleTogglePrivacy("telehealthRecording")}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <label htmlFor="shareRecords" className={styles.toggleLabel}>
                  Share Records with Providers
                </label>
                <p className={styles.toggleDescription}>
                  Allow your records to be shared with healthcare providers
                </p>
              </div>
              <label className={styles.switch}>
                <input
                  id="shareRecords"
                  type="checkbox"
                  checked={privacySettings.shareRecords}
                  onChange={() => handleTogglePrivacy("shareRecords")}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <label htmlFor="shareInsurance" className={styles.toggleLabel}>
                  Share Records with Insurance
                </label>
                <p className={styles.toggleDescription}>
                  Allow your records to be shared with your insurance provider
                </p>
              </div>
              <label className={styles.switch}>
                <input
                  id="shareInsurance"
                  type="checkbox"
                  checked={privacySettings.shareInsurance}
                  onChange={() => handleTogglePrivacy("shareInsurance")}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Insurance Settings Section */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Insurance Settings</h2>
            {!isEditingInsurance && (
              <button
                className={styles.buttonSecondary}
                onClick={handleEditInsurance}
                aria-label="Edit insurance"
              >
                <Edit2 size={18} />
                Edit
              </button>
            )}
          </div>

          {isEditingInsurance ? (
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.formGroup}>
                <label htmlFor="provider" className={styles.label}>
                  Primary Insurance Provider
                </label>
                <input
                  id="provider"
                  type="text"
                  className={styles.input}
                  value={editInsuranceData.provider}
                  onChange={(e) =>
                    handleInsuranceChange("provider", e.target.value)
                  }
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="policyNumber" className={styles.label}>
                    Policy Number
                  </label>
                  <input
                    id="policyNumber"
                    type="text"
                    className={styles.input}
                    value={editInsuranceData.policyNumber}
                    onChange={(e) =>
                      handleInsuranceChange("policyNumber", e.target.value)
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="groupNumber" className={styles.label}>
                    Group Number
                  </label>
                  <input
                    id="groupNumber"
                    type="text"
                    className={styles.input}
                    value={editInsuranceData.groupNumber}
                    onChange={(e) =>
                      handleInsuranceChange("groupNumber", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.buttonPrimary}
                  onClick={handleSaveInsurance}
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  type="button"
                  className={styles.buttonSecondary}
                  onClick={() => setIsEditingInsurance(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Insurance Provider</span>
                <p>{insuranceData.provider}</p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Policy Number</span>
                <p>{insuranceData.policyNumber}</p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Group Number</span>
                <p>{insuranceData.groupNumber}</p>
              </div>
            </div>
          )}
        </div>

        {/* Account Actions Section */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Account Actions</h2>

          <div className={styles.actionButtons}>
            {/* <button
              className={styles.buttonSecondary}
              onClick={() =>
                addToast("success", "Medical records download started")
              }
            >
              <FileText size={18} />
              Download Medical Records
            </button> */}

            <button
              className={styles.buttonDanger}
              onClick={handleDeactivateAccount}
            >
              <LogOut size={18} />
              Deactivate Account
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div
          className={styles.modalOverlay}
          onClick={() => setConfirmModal({ ...confirmModal, open: false })}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className={styles.modalHeader}>
              <h3 id="modal-title" className={styles.modalTitle}>
                {confirmModal.title}
              </h3>
              <button
                className={styles.modalClose}
                onClick={() =>
                  setConfirmModal({ ...confirmModal, open: false })
                }
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalContent}>
              <p>{confirmModal.message}</p>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.buttonSecondary}
                onClick={() =>
                  setConfirmModal({ ...confirmModal, open: false })
                }
              >
                Cancel
              </button>
              <button
                className={styles.buttonDanger}
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({ ...confirmModal, open: false });
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
