import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import styles from "./PatientForm.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Patient {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dob: string;
  ssn: string;
  mrn: string;
  maritalStatus: string;
  language: string;

  email: string;
  phone: string;
  address: string;
  communicationChannel: string;

  soapNotes: string;

  primaryProvider: string;
  careTeam: string[];

  insuranceType: string;
  holderName: string;
  relationToInsured: string;
  companyName: string;
  policyNumber: string;
  employerName: string;
  groupName: string;
  plan: string;
  effectiveDate: string;

  verified: boolean;
  valid: boolean;
}

function PatientForm() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient>({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: "",
    ssn: "",
    mrn: "",
    maritalStatus: "",
    language: "",

    email: "",
    phone: "",
    address: "",
    communicationChannel: "",

    soapNotes: "",

    primaryProvider: "",
    careTeam: [],

    insuranceType: "",
    holderName: "",
    relationToInsured: "",
    companyName: "",
    policyNumber: "",
    employerName: "",
    groupName: "",
    plan: "",
    effectiveDate: "",
    verified: false,
    valid: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setPatient((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCareTeamCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setPatient((prev) => ({
      ...prev,
      careTeam: checked
        ? [...prev.careTeam, value]
        : prev.careTeam.filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(patient);
    e.preventDefault();
    try {
      const response = await axios.post("URL", patient);
      console.log("Success:", response.data);
      alert("Patient registered successfully");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to register patient");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.formTitle}>Patient Registration</h2>

      {/* Personal Details */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Details</h3>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label>First Name</label>
            <input
              type="text"
              placeholder="John"
              name="firstName"
              value={patient.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Middle Name</label>
            <input
              type="text"
              name="middleName"
              placeholder="A"
              value={patient.middleName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Smith"
              value={patient.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Gender</label>
            <select
              name="gender"
              value={patient.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={patient.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>SSN</label>
            <input
              type="text"
              name="ssn"
              placeholder="XXX-XX-1234"
              value={patient.ssn}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>MRN</label>
            <input
              type="text"
              name="mrn"
              placeholder="MRN100234"
              value={patient.mrn}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Marital Status</label>
            <select
              name="maritalStatus"
              value={patient.maritalStatus}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="married">Married</option>
              <option value="unmarried">Unmarried</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Language</label>
            <select
              name="language"
              value={patient.language}
              onChange={handleChange}
            >
              <option value="">Select Language</option>
              <option value="english">English</option>
              <option value="french">French</option>
              <option value="spanish">Spanish</option>
              <option value="arabic">Arabic</option>
            </select>
          </div>
        </div>
      </section>

      {/* Contact Details */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Contact & Communication</h3>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={patient.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone</label>
            <PhoneInput
              country={"in"}
              value={patient.phone}
              onChange={(phone) => {
                setPatient((prev) => ({
                  ...prev,
                  phone: phone,
                }));
              }}
              inputClass={styles.phoneInput}
              containerClass={styles.phoneContainer}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Address</label>
            <textarea
              rows={2}
              name="address"
              value={patient.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Preferred Communication</label>
            <select
              name="communicationChannel"
              value={patient.communicationChannel}
              onChange={handleChange}
            >
              <option value="">Select Channel</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
        </div>
      </section>

      {/* Medical Information */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Medical Information</h3>

        <div className={styles.grid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>SOAP Notes</label>
            <textarea
              rows={3}
              name="soapNotes"
              value={patient.soapNotes}
              onChange={handleChange}
              placeholder="Enter medical notes"
            />
          </div>
        </div>
      </section>

      {/* Care Team */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Care Team</h3>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label>Primary Provider</label>
            <select
              name="primaryProvider"
              value={patient.primaryProvider}
              onChange={handleChange}
              required
            >
              <option value="">Select Provider</option>
              <option value="1">Dr. Michael Chen</option>
              <option value="2">Dr. John Doe</option>
              <option value="3">Dr. Sara Cody</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Care Team Members</label>

            <div className={styles.checkboxGrid}>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  value="nurse"
                  checked={patient.careTeam.includes("nurse")}
                  onChange={handleCareTeamCheckbox}
                />
                Nurse
              </label>

              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  value="specialist"
                  checked={patient.careTeam.includes("specialist")}
                  onChange={handleCareTeamCheckbox}
                />
                Specialist
              </label>

              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  value="physician_assistants"
                  checked={patient.careTeam.includes("physician_assistants")}
                  onChange={handleCareTeamCheckbox}
                />
                Physician Assistants
              </label>

              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  value="nurse_practitioners"
                  checked={patient.careTeam.includes("nurse_practitioners")}
                  onChange={handleCareTeamCheckbox}
                />
                Nurse Practitioners
              </label>

              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  value="pharmacists"
                  checked={patient.careTeam.includes("pharmacists")}
                  onChange={handleCareTeamCheckbox}
                />
                Pharmacists
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Information */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Insurance Information</h3>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label>Insurance Type</label>
            <select
              name="insuranceType"
              value={patient.insuranceType}
              onChange={handleChange}
            >
              <option value="" disabled hidden>Select Insurance</option>
              <option value="private">Private</option>
              <option value="medicare">Medicare</option>
              <option value="medicaid">Medicaid</option>
              <option value="selfpay">Self Pay</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Holder Name</label>
            <input
              type="text"
              name="holderName"
              value={patient.holderName}
              onChange={handleChange}
              placeholder="John Smith"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Relation to Insured</label>
            <select
              name="relationToInsured"
              value={patient.relationToInsured}
              onChange={handleChange}
              defaultValue={"Self"}
            >
              <option value="self">Self</option>
              <option value="spouse">Spouse</option>
              <option value="child">Child</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={patient.companyName}
              onChange={handleChange}
              placeholder="Insurance Company"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Policy Number</label>
            <input
              type="text"
              name="policyNumber"
              value={patient.policyNumber}
              onChange={handleChange}
              placeholder="POL123456"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Employer Name</label>
            <input
              type="text"
              name="employerName"
              value={patient.employerName}
              onChange={handleChange}
              placeholder="Employer"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Group Name</label>
            <input
              type="text"
              name="groupName"
              value={patient.groupName}
              onChange={handleChange}
              placeholder="Group A"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Plan</label>
            <input
              type="text"
              name="plan"
              value={patient.plan}
              onChange={handleChange}
              placeholder="Gold Plan"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Effective Date</label>
            <input
              type="date"
              name="effectiveDate"
              value={patient.effectiveDate}
              onChange={handleChange}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                name="verified"
                checked={patient.verified}
                onChange={handleChange}
              />{" "}
              Verified
            </label>

            <label>
              <input
                type="checkbox"
                name="valid"
                checked={patient.valid}
                onChange={handleChange}
              />{" "}
              Valid
            </label>
          </div>
        </div>
      </section>

      <div className={styles.buttonContainer}>
        <button className={styles.submitButton} onClick={() => navigate(-1)}>
         <MdOutlineKeyboardBackspace className={styles.backButton}/> Back
        </button>
        <button className={styles.submitButton} onClick={handleSubmit}>
          {" "}
          Register Patient
        </button>
      </div>
    </div>
  );
}

export default PatientForm;
