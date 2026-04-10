import { useState } from "react";
import styles from "./PatientAppointments.module.css";

function PatientAppointments() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const tabs = ["Upcoming", "Past", "Cancelled","All"];

  const appointments = [
    {
      id: 1,
      date: "April 12, 2026",
      time: "10:30 AM",
      provider: "Dr. Sharma",
      type: "Video Visit",
      status: "Upcoming", // Logic: Scheduled/Active
    },
    {
      id: 2,
      date: "April 15, 2026",
      time: "02:00 PM",
      provider: "Dr. Miller",
      type: "In-Person",
      status: "Upcoming",
    },
    {
      id: 3,
      date: "March 20, 2026",
      time: "09:15 AM",
      provider: "Dr. Lee",
      type: "Video Visit",
      status: "Past",
    },
    {
      id: 4,
      date: "March 10, 2026",
      time: "11:00 AM",
      provider: "Dr. Patel",
      type: "Follow-up",
      status: "Past",
    },
    {
      id: 5,
      date: "April 05, 2026",
      time: "04:30 PM",
      provider: "Dr. Gomez",
      type: "Consultation",
      status: "Cancelled",
    },
  ];
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>Appointments</h1>
        <button className={styles.bookButton}>Book Appointment</button>
      </div>
      {/* Filter / Tabs Section  */}
      <div className={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.listContainer}>
        {/* Appointments List */}
        {
          appointments.filter(item => activeTab === "All" ? true : item.status === activeTab).map((appointment) => (
            <div className={styles.card}>
            <div className={styles.cardLeft}>
              <span className={styles.date}>{appointment.date}</span>
              <span className={styles.time}>{appointment.time}</span>
            </div>

            <div className={styles.cardCenter}>
              <span className={styles.provider}>{appointment.provider}</span>
              <span className={styles.type}>{appointment.type}</span>
            </div>

            <div className={styles.cardRight}>
              <span className={styles.status}>{appointment.status}</span>

              <div className={styles.actions}>
                <button className={styles.primaryAction}>Join Visit</button>

                <button className={styles.secondaryAction}>Reschedule</button>

                <button className={styles.dangerAction}>Cancel</button>
              </div>
            </div>
          </div>)
        )}
      </div>
    </div>
  );
}

export default PatientAppointments;
