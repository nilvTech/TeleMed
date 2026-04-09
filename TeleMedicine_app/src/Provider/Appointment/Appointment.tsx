// import styles from "./Appointment.module.css";
// //import { LuCalendarPlus } from "react-icons/lu";
// //import { useNavigate } from "react-router-dom";
// //import { useState } from "react";

// function Appointment() {
//   // const NavToAppointment = useNavigate();
//   const Patients = [
//     {
//       name: "Michal Smith",
//       visitReason: "Annual Physical",
//       Day: "Today",
//       Time: "09:00 - 09 :45AM",
//     },
//     {
//       name: "Jhon Doe",
//       visitReason: "Follow-up",
//       Day: "Wednesday",
//       Time: "12:00 - 12 :45PM",
//     },
//     {
//       name: "Jane",
//       visitReason: "Chest Pain",
//       Day: "Saturday",
//       Time: "08:00 - 08 :45AM",
//     },
//     {
//       name: "Mittal",
//       visitReason: "Fewer",
//       Day: "Tomorrow",
//       Time: "5:00 - 05 :45PM",
//     },
//     {
//       name: "Olivia",
//       visitReason: "Headache",
//       Day: "Sunday",
//       Time: "07:00 - 07 :45PM",
//     },
//   ];
//   return (
//     <>
//       <div className={styles.BookAppointmentBTN}>
//         {/* <div className={styles.formContainer1}>
//           <h5>Upcoming Appointments</h5>
//           <div className={styles.providerListContainer}>
//             {Patients.map((doc, index) => (
//               <div key={index} className={styles.providerList}>
//                 <div className={styles.providerInfo}>
//                   <h5>
//                     <small>{doc.name}</small>
//                   </h5>
//                   <h6>
//                     <strong>Visit reason:</strong> {doc.visitReason}
//                   </h6>
//                 </div>

//                 <div className={styles.appointmentInfo}>
//                   <h5>{doc.Day}</h5>
//                   <h5>{doc.Time}</h5>
//                 </div>

//                 <button
//                   className={styles.joinButton}
//                   // onClick={() => handleonClick(doc)}
//                 >
//                   Join
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div> */}
//         {/* <button onClick={HandleOnClick}>
//           <LuCalendarPlus className={styles.BookAppointmentIcon} />
//           Book Appointment
//         </button> */}

//       </div>
//     </>
//   );
// }

// export default Appointment;

import React, { useState } from "react";
import styles from "./Appointment.module.css";
import { FaPlus, FaSearch, FaEdit } from "react-icons/fa"; //FaTrash

interface Appointment {
  id: string;
  patient: string;
  provider: string;
  date: string;
  time: string;
  type: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  note: string;
}

const dummyAppointments: Appointment[] = [
  {
    id: "APT-001",
    patient: "John Smith",
    provider: "Dr. Michael Chen",
    date: "04/10/2026",
    time: "10:00 AM",
    type: "Video",
    status: "Scheduled",
    note: "",
  },
  {
    id: "APT-002",
    patient: "Emma Johnson",
    provider: "Dr. Michael Chen",
    date: "04/09/2026",
    time: "02:30 PM",
    type: "Audio",
    status: "Completed",
    note: "",
  },
  {
    id: "APT-003",
    patient: "Robert Brown",
    provider: "Dr. Michael Chen",
    date: "04/11/2026",
    time: "11:15 AM",
    type: "Video",
    status: "Cancelled",
    note: "",
  },
];

export default function Appointment() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(dummyAppointments);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditform] = useState<Appointment>({
    id: "",
    patient: "",
    provider: "",
    date: "",
    time: "",
    type: "",
    status: "Scheduled",
    note: "",
  });

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch = appt.patient
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || appt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // const handleDelete = (id: string) => {
  //   setAppointments(
  //     appointments.filter((appointment) => appointment.id !== id),
  //   );
  // };

  const handleSaveAppointment = (newAppointment: any) => {
    setAppointments([newAppointment, ...appointments]);
  };

  //Appointment Edit
  const handleEdit = (id: string) => {
    setShowEditModal(true);
    const itemToEdit = appointments.find((item) => item.id === id);
    if (itemToEdit) {
      setEditform(itemToEdit);
    }
  };

  const handleSaveEdit = () => {
    if (!editForm.patient || !editForm.date || !editForm.time) {
      alert("Please fill the fields");
      return;
    }

    const isEditing = appointments.some((item) => item.id === editForm.id);

    if (isEditing) {
      setAppointments(
        appointments.map((item) => (item.id === editForm.id ? editForm : item)),
      );
    }

    setEditform({
      id: "",
      patient: "",
      provider: "",
      date: "",
      time: "",
      type: "",
      status: "Scheduled",
      note: "",
    });
    setShowEditModal(false);
  };

  // Replace above handleSaveEdit with following handleSaveEdit when we connect to backend (PUT API)
  //   const handleSaveEdit = async () => {
  //   try {
  //     await fetch(`/api/appointments/${editForm.id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(editForm),
  //     });

  //     setAppointments(
  //       appointments.map((item) =>
  //         item.id === editForm.id ? editForm : item,
  //       ),
  //     );

  //     setShowEditModal(false);
  //   } catch (error) {
  //     console.error("Update failed", error);
  //   }
  // };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Appointments</h2>

        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <FaPlus />
          Book Appointment
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={styles.statusFilter}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAppointments.map((appt) => (
            <tr key={appt.id}>
              <td>{appt.id}</td>
              <td>{appt.patient}</td>
              <td>{appt.date}</td>
              <td>{appt.time}</td>
              <td>{appt.type}</td>

              <td>
                <span
                  className={`${styles.status} ${
                    styles[appt.status.toLowerCase()]
                  }`}
                >
                  {appt.status}
                </span>
              </td>

              <td className={styles.actions}>
                <button
                  className={styles.editBtn}
                  disabled={appt.status !== "Scheduled"}
                  onClick={() => handleEdit(appt.id)}
                >
                  <FaEdit />
                </button>

                {/* <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(appt.id)}
                >
                  <FaTrash />
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredAppointments.length === 0 && (
        <div className={styles.empty}>No appointments found</div>
      )}

      {showModal && (
        <AddAppointmentModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveAppointment}
        />
      )}

      {showEditModal && (
        <EditAppointmentModal
          appointment={editForm}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          setEditform={setEditform}
        />
      )}
    </div>
  );
}

interface Props {
  onClose: () => void;
  onSave: (appointment: any) => void;
}

function AddAppointmentModal({ onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    patient: "",
    date: "",
    time: "",
    type: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.patient || !formData.date || !formData.time) {
      alert("Please fill the fields");
      return;
    }

    const newAppointment = {
      id: `APT-${Date.now()}`,
      provider: "Dr. Michael Chen",
      status: "Scheduled",
      ...formData,
    };
    onSave(newAppointment);
    onClose();
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Book New Appointment</h2>

        <div className={styles.formGroup}>
          <label>Patient Name *</label>
          <input
            name="patient"
            value={formData.patient}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Time *</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Appointment Type</label>

          <select name="type" value={formData.type} onChange={handleChange}>
            <option>Video</option>
            <option>Audio</option>
            <option>In-person</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Notes</label>

          <textarea
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button className={styles.saveBtn} onClick={handleSubmit}>
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

interface EditProps {
  appointment: Appointment;
  onClose: () => void;
  onSave: () => void;
  setEditform: React.Dispatch<React.SetStateAction<Appointment>>;
}

function EditAppointmentModal({
  appointment,
  onClose,
  onSave,
  setEditform,
}: EditProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setEditform({
      ...appointment,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Edit Appointment</h2>

        <div className={styles.formGroup}>
          <label>Patient Name *</label>

          <input
            name="patient"
            value={appointment.patient}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Date *</label>

            <input
              type="date"
              name="date"
              value={appointment.date}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Time *</label>

            <input
              type="time"
              name="time"
              value={appointment.time}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Appointment Type</label>

          <select name="type" value={appointment.type} onChange={handleChange}>
            <option>Video</option>
            <option>Audio</option>
            <option>In-person</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Status</label>

          <select
            name="status"
            value={appointment.status}
            onChange={handleChange}
          >
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Notes</label>

          <textarea
            name="note"
            rows={3}
            value={appointment.note}
            onChange={handleChange}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button className={styles.saveBtn} onClick={onSave}>
            Update Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
