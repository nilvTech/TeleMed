import styles from "./Appointment.module.css";
import { LuCalendarPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
//import { useState } from "react";

function Appointment() {
  const NavToAppointment = useNavigate();
  const HandleOnClick = () => {
    NavToAppointment("/Appointment");
  };

  return (
    <>
      <div className={styles.BookAppointmentBTN}>
        <button onClick={HandleOnClick}>
          <LuCalendarPlus className={styles.BookAppointmentIcon} />
          Book Appointment
        </button>
      </div>
    </>
  );
}

export default Appointment;
