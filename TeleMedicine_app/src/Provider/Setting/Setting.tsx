import React, { useState } from "react";
import styles from "./SettingsPage.module.css";
import { CgProfile } from "react-icons/cg";
import Checkbox from "@mui/material/Checkbox";

type details = {
  GroupName: string;
  Website: string;
  Speciality1: string;
  PhysicalAddressLine1: string;
  State: string;
  Email: string;
  Bio: string;
  Specialtiy2: string;
  AddressLine2: string;
  ZIP: string;
  Phone: string;
  ProfilePicture: string | File;
  TimeZone: string;
  City: string;
  Country: string;
  isActive: boolean;
};

function SettingPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [details, setDetails] = useState<details>({
    GroupName: "",
    Website: "",
    Speciality1: "",
    PhysicalAddressLine1: "",
    State: "",
    Email: "",
    Bio: "",
    Specialtiy2: "",
    AddressLine2: "",
    ZIP: "",
    Phone: "",
    ProfilePicture: "",
    TimeZone: "",
    City: "",
    Country: "",
    isActive: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Update the actual data object
      setDetails((prev) => ({ ...prev, ProfilePicture: file }));

      // 2. Generate a temporary URL for the preview <img> tag
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Profile Card Header */}
        <div className={styles.profileHeader}>
          <div className={styles.headerText}>
            <h1>Michael Chen</h1>
            <p className={styles.subtitle}>Healthcare Provider</p>
          </div>

          {/* This 'action' div will be pushed to the end */}
          <div className={styles.action}>
            <button
              className={styles.editBtn}
              onClick={() => setShowDetails(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* View Mode Grid */}
        <div className={styles.infoGrid}>
          <div className={styles.section}>
            <div className={styles.profilePhoto}>
              <CgProfile />
            </div>
          </div>
          <div className={styles.section}>
            <h3>Account Details</h3>
            <p>
              <strong>Provider Type:</strong> MD
            </p>
            <p>
              <strong>Display Name:</strong> Dr. Chen
            </p>
            <p>
              <strong>Phone:</strong> (657) 606-5444
            </p>
            <p>
              <strong>Email:</strong> michael@chen.com
            </p>
            <p>
              <strong>Bio:</strong> Provider
            </p>
          </div>
          <div className={styles.section}>
            <h3>Professional Info</h3>
            <p>
              <strong>Experience:</strong> 10 Years
            </p>
            <p>
              <strong>Gender:</strong> Male
            </p>
            <p>
              <strong>NPI Number:</strong> 9875644589
            </p>
            <p>
              <strong>State Licensed:</strong> CA
            </p>
            <p>
              <strong>License #:</strong> 45789642
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showDetails && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Profile Information</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowDetails(false)}
              >
                &times;
              </button>
            </div>

            <form className={styles.editForm}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.required}>Group Name</label>
                  <input
                    type="text"
                    name="GroupName"
                    required
                    onChange={handleChange}
                    placeholder="Enter group name"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Website</label>
                  <input
                    type="text"
                    name="Website"
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Speciality 1</label>
                  <input
                    type="text"
                    name="speciality1"
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Speciality 2</label>
                  <input
                    type="text"
                    name="speciality2"
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.required}>Timezone</label>
                  <input
                    type="text"
                    name="timezone"
                    required
                    onChange={handleChange}
                  />
                </div>

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

                <div className={styles.inputGroup}>
                  <label>Bio</label>
                  <textarea name="bio" id="bio"></textarea>
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.required}>Email</label>
                  <input
                    type="email"
                    name="Email"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.required}>Phone</label>
                  <input
                    type="number"
                    name="Phone"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.required}>
                    Physical Address Line 1
                  </label>
                  <input
                    type="text"
                    name="physcialAddressLine1"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.required}>Address Line 2</label>
                  <input
                    type="text"
                    name="AddressLine2"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.required}>City</label>
                  <input
                    type="text"
                    name="City"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>State</label>
                  <input type="text" name="State" onChange={handleChange} />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.required}>ZIP</label>
                  <input
                    type="text"
                    name="ZIP"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Country</label>
                  <input type="text" name="Country" onChange={handleChange} />
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <label htmlFor="active" className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={details.isActive}
                    onChange={(e) =>
                      setDetails((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    id="active"
                  />
                  <span className={styles.checkmark}></span>
                  <span className={styles.labelText}>Active</span>
                </label>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowDetails(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingPage;
