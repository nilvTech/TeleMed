import { useState } from "react";
import styles from "./PatientAppointments.module.css";
import { RxCross1 } from "react-icons/rx";

type Booking = {
  id: number;
  Speciality: string;
  Provider: string;
  VisitType: string;
  VisitDate: string;
  SelectedTimeSlots: string;
  ReasonForVisit: string;
  PreferredPharmacy: string;
  Status: string;
};

const Appointments: Booking[] = [
  {
    id: 1,
    VisitDate: "April 12, 2026",
    SelectedTimeSlots: "10:30 AM",
    Provider: "Dr. Sharma",
    VisitType: "Video Visit",
    Status: "Upcoming", // Logic: Scheduled/Active
    Speciality: "General Medicine",
    ReasonForVisit: "",
    PreferredPharmacy: "",
  },
  {
    id: 2,
    VisitDate: "April 15, 2026",
    SelectedTimeSlots: "02:00 PM",
    Provider: "Dr. Miller",
    VisitType: "In-Person",
    Status: "Upcoming",
    Speciality: "Cardiology",
    ReasonForVisit: "",
    PreferredPharmacy: "",
  },
  {
    id: 3,
    VisitDate: "March 20, 2026",
    SelectedTimeSlots: "09:15 AM",
    Provider: "Dr. Lee",
    VisitType: "Video Visit",
    Status: "Past",
    Speciality: "General Medicine",
    ReasonForVisit: "",
    PreferredPharmacy: "",
  },
  {
    id: 4,
    VisitDate: "March 10, 2026",
    SelectedTimeSlots: "11:00 AM",
    Provider: "Dr. Patel",
    VisitType: "Follow-up",
    Status: "Past",
    Speciality: "Cardiology",
    ReasonForVisit: "",
    PreferredPharmacy: "",
  },
  {
    id: 5,
    VisitDate: "April 05, 2026",
    SelectedTimeSlots: "04:30 PM",
    Provider: "Dr. Gomez",
    VisitType: "Consultation",
    Status: "Cancelled",
    Speciality: "General Medicine",
    ReasonForVisit: "",
    PreferredPharmacy: "",
  },
];

const steps = [
  "Select Provider",
  "Select Date & Time",
  "Visit Details",
  "Confirm",
];

function PatientAppointments() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [bookingModal, setBookingModal] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [step, setStep] = useState(1);
  const tabs = ["Upcoming", "Past", "Cancelled", "All"];
  const [appointments, setAppointments] = useState(Appointments);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [BookingForm, setBookingForm] = useState<Booking>({
    id: Date.now(),
    Speciality: "",
    Provider: "",
    VisitType: "",
    VisitDate: "",
    SelectedTimeSlots: "",
    ReasonForVisit: "",
    PreferredPharmacy: "",
    Status: "Upcoming",
  });

  const handleNext = () => {
    setStep((prev) => (prev !== 4 ? prev + 1 : prev));
  };
  const handleBack = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const handleConfirmation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsConfirmed(event.target.checked);
  };

  const handleSubmit = () => {
    if (
      BookingForm.Provider &&
      BookingForm.Speciality &&
      BookingForm.Status &&
      BookingForm.VisitDate &&
      BookingForm.VisitType &&
      BookingForm.ReasonForVisit
    ) {
      setAppointments([BookingForm, ...appointments]);
      setBookingModal(false);
      setStep(1);
    } else {
      alert("Fill all details in the form");
    }

    setIsConfirmed(false);

    setBookingForm({
      id: Date.now(),
      Speciality: "",
      Provider: "",
      VisitType: "",
      VisitDate: "",
      SelectedTimeSlots: "",
      ReasonForVisit: "",
      PreferredPharmacy: "",
      Status: "Upcoming",
    });
  };

  const handleBookingForm = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeSlot = (time: string) => {
    setBookingForm((prev) => ({ ...prev, SelectedTimeSlots: time }));
  };

  const handleReschedule = (id: number) => {
    setRescheduleModal(!rescheduleModal);
    const itemToEdit = appointments.find((item) => item.id === id);
    if (itemToEdit) {
      setBookingForm(itemToEdit);
    }
  };

  const handleConfirmReschedule = () => {
    if (!BookingForm.VisitDate || !BookingForm.SelectedTimeSlots) {
      return;
    }

    const isReschedule = appointments.some(
      (item) => item.id === BookingForm.id,
    );

    if (isReschedule) {
      setAppointments(
        appointments.map((item) =>
          item.id === BookingForm.id ? { ...BookingForm } : item,
        ),
      );
    }

    setRescheduleModal(false);
  };

  // Appointment Date Selection Duration
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const maxDateObj = new Date();
  maxDateObj.setMonth(maxDateObj.getMonth() + 3);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>Appointments</h1>
        <button
          className={styles.bookButton}
          onClick={() => setBookingModal(true)}
        >
          Book Appointment
        </button>
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
        {appointments
          .filter((item) =>
            activeTab === "All" ? true : item.Status === activeTab,
          )
          .map((appointment) => (
            <div className={styles.card}>
              <div className={styles.cardLeft}>
                <span className={styles.date}>
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(appointment.VisitDate))}
                </span>
                <span className={styles.time}>
                  {appointment.SelectedTimeSlots}
                </span>
              </div>

              <div className={styles.cardCenter}>
                <span className={styles.provider}>{appointment.Provider}</span>
                <span className={styles.type}>{appointment.VisitType}</span>
              </div>

              <div className={styles.cardRight}>
                <span className={styles.status}>{appointment.Status}</span>

                <div className={styles.actions}>
                  <button className={styles.primaryAction}>Join Visit</button>

                  <button
                    className={styles.secondaryAction}
                    onClick={() => handleReschedule(appointment.id)}
                  >
                    Reschedule
                  </button>

                  <button className={styles.dangerAction}>Cancel</button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* 
      Booking Modal
      Logic for open/close and step navigation to be implemented */}

      {bookingModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Book Appointment</h2>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setBookingModal(false);
                  setStep(1);
                }}
              >
                <RxCross1 />
              </button>
            </div>

            {/* Step Indicator */}
            <div className={styles.stepIndicator}>
              {steps.map((label, index) => {
                const stepNumber = index + 1;
                const isActive = step === stepNumber;

                return (
                  <div
                    key={stepNumber}
                    className={isActive ? styles.stepActive : styles.step}
                  >
                    <span className={styles.stepLabel}>
                      {stepNumber} {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Modal Body — Screen 1 */}
            {step === 1 && (
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Specialty</label>
                  <select
                    className={styles.input}
                    name="Speciality"
                    value={BookingForm.Speciality}
                    onChange={handleBookingForm}
                  >
                    <option>Select Specialty</option>
                    <option>General Medicine</option>
                    <option>Cardiology</option>
                    <option>Dermatology</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Provider</label>
                  <select
                    className={styles.input}
                    name="Provider"
                    value={BookingForm.Provider}
                    onChange={handleBookingForm}
                  >
                    <option>Select Provider</option>
                    <option>Dr. Sharma</option>
                    <option>Dr. Patel</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Visit Type</label>
                  <select
                    className={styles.input}
                    name="VisitType"
                    value={BookingForm.VisitType}
                    onChange={handleBookingForm}
                  >
                    <option>Video Visit</option>
                    <option>In-Person Visit</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2 — Select Date & Time */}

            {step === 2 && (
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Select Date</label>

                  <input
                    type="date"
                    className={styles.input}
                    name="VisitDate"
                    value={BookingForm.VisitDate}
                    onChange={handleBookingForm}
                    min={minDate}
                    max={maxDate}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Available Time Slots</label>

                  <div className={styles.timeSlots}>
                    <button
                      className={styles.timeSlot}
                      onClick={() => handleTimeSlot("09:00 AM")}
                    >
                      09:00 AM
                    </button>

                    <button
                      className={styles.timeSlot}
                      onClick={() => handleTimeSlot("10:30 AM")}
                    >
                      10:30 AM
                    </button>

                    <button
                      className={styles.timeSlot}
                      onClick={() => handleTimeSlot("01:00 PM")}
                    >
                      01:00 PM
                    </button>

                    <button
                      className={styles.timeSlot}
                      onClick={() => handleTimeSlot("03:30 PM")}
                    >
                      03:30 PM
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Step 3 — Visit Details */}
            {step === 3 && (
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Reason for Visit</label>

                  <textarea
                    className={styles.textarea}
                    placeholder="Describe symptoms or reason for visit"
                    name="ReasonForVisit"
                    value={BookingForm.ReasonForVisit}
                    onChange={handleBookingForm}
                  />
                </div>
                {/* 
                <div className={styles.formGroup}>
                  <label className={styles.label}>Visit Type</label>

                  <select
                    className={styles.input}
                    name="VisitType"
                    value={BookingForm.VisitType}
                    onChange={handleBookingForm}
                  >
                    <option>Video Visit</option>
                    <option>In-Person Visit</option>
                  </select>
                </div> */}

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Preferred Pharmacy (Optional)
                  </label>

                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter pharmacy name"
                    name="PreferredPharmacy"
                    value={BookingForm.PreferredPharmacy}
                    onChange={handleBookingForm}
                  />
                </div>
              </div>
            )}

            {/* Step 4 — Confirm Appointment */}

            {step === 4 && (
              <div className={styles.modalBody}>
                <div className={styles.summaryCard}>
                  <h3 className={styles.summaryTitle}>Appointment Summary</h3>

                  <div className={styles.summaryRow}>
                    <span>Provider:</span>
                    <span>
                      {BookingForm.Provider ? BookingForm.Provider : "NA"}
                    </span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span>Date:</span>
                    <span>
                      {BookingForm.VisitDate ? BookingForm.VisitDate : "NA"}
                    </span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span>Time:</span>
                    <span>
                      {BookingForm.SelectedTimeSlots
                        ? BookingForm.SelectedTimeSlots
                        : "NA"}
                    </span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span>Visit Type:</span>
                    <span>
                      {BookingForm.VisitType ? BookingForm.VisitType : "NA"}
                    </span>
                  </div>
                </div>

                <div className={styles.checkBox}>
                  <label htmlFor="apptConfirmation">
                    <input
                      type="checkbox"
                      id="apptConfirmation"
                      checked={isConfirmed}
                      onChange={handleConfirmation}
                    />
                    <span>I confirm the appointment details</span>
                  </label>
                </div>
              </div>
            )}

            {/* Modal Footer Navigation */}
            <div className={styles.modalFooter}>
              {step > 1 ? (
                <button className={styles.secondaryButton} onClick={handleBack}>
                  Back
                </button>
              ) : (
                ""
              )}

              <button
                className={styles.primaryButton}
                onClick={step === 4 ? handleSubmit : handleNext}
                disabled={step === 4 && !isConfirmed}
              >
                {step === 4 ? "Confirm" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}

      {rescheduleModal && (
        <div className={styles.resheduleModalOverlay}>
          <div className={styles.resheduleModalContainer}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Book Appointment</h2>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setRescheduleModal(!rescheduleModal);
                }}
              >
                <RxCross1 />
              </button>
            </div>

            <div className={styles.stepIndicator}>
              <div className={styles.stepActive}>
                <span className={styles.stepLabel}>Select Date & Time</span>
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Select Date</label>

                <input
                  type="date"
                  className={styles.input}
                  name="VisitDate"
                  value={BookingForm.VisitDate}
                  onChange={handleBookingForm}
                  min={minDate}
                  max={maxDate}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Available Time Slots</label>

                <div className={styles.timeSlots}>
                  <button
                    className={styles.timeSlot}
                    onClick={() => handleTimeSlot("09:00 AM")}
                  >
                    09:00 AM
                  </button>

                  <button
                    className={styles.timeSlot}
                    onClick={() => handleTimeSlot("10:30 AM")}
                  >
                    10:30 AM
                  </button>

                  <button
                    className={styles.timeSlot}
                    onClick={() => handleTimeSlot("01:00 PM")}
                  >
                    01:00 PM
                  </button>

                  <button
                    className={styles.timeSlot}
                    onClick={() => handleTimeSlot("03:30 PM")}
                  >
                    03:30 PM
                  </button>
                </div>
              </div>
            </div>

            <button
              className={styles.primaryButton}
              onClick={handleConfirmReschedule}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientAppointments;
