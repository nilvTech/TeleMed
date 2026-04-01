import styles from "./Dashboard.module.css";
import { GoReply } from "react-icons/go";
import Avatar from "@mui/material/Avatar";
import { LuCalendarPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { Users, CheckCircle, Clock, Calendar } from "lucide-react";
import CountUp from "../CountUp";
//import Header from "./Header";
//import SideBar from "./SideBar";

function MainContent() {
  return (
    <>
      <div className={styles.mainContent}>
        <WelcomeBanner />

        <div className={styles.grid}>
          <div className={styles.grid1}>
            <QuickStats />
          </div>
          <div className={styles.grid2}>
            <Grid2 />
          </div>
          <div className={styles.grid3}>
            <Grid3 />
          </div>
        </div>
      </div>
    </>
  );
}

function WelcomeBanner() {
  const NavToAppointment = useNavigate();
  const HandleOnClick = () => {
    NavToAppointment("/Appointment");
  };
  return (
    <div className={styles.WelcomeBanner}>
      <div className={styles.WelcomeMSG}>
        <h4>
          <strong>Welcome back, </strong>
          <span className={styles.username}>Michael Chen!</span>
        </h4>
        <p>Here's your health overview for today</p>
      </div>

      <button onClick={HandleOnClick}>
        <LuCalendarPlus className={styles.BookAppointmentIcon} />
        Book Appointment
      </button>
    </div>
  );
}

function QuickStats() {
  const stats = [
    {
      label: "Patients Today",
      value: 18,
      icon: <Users size={24} />,
      theme: styles.blue,
    },
    {
      label: "Completed",
      value: 10,
      icon: <CheckCircle size={24} />,
      theme: styles.green,
    },
    {
      label: "Pending",
      value: 4,
      icon: <Clock size={24} />,
      theme: styles.orange,
    },
    {
      label: "Total Appointment",
      value: 22,
      icon: <Calendar size={24} />,
      theme: styles.purple,
    },
  ];

  return (
    <div className={styles.statsContainer}>
      <div className={styles.bentoGrid}>
        {stats.map((item, idx) => (
          <div key={idx} className={`${styles.statCard} ${item.theme}`}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>{item.icon}</div>
              <span className={styles.statLabel}>{item.label}</span>
            </div>
            <div className={styles.statValue}>
              <CountUp end={item.value} />
              <span className={styles.plusSign}>+</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Grid2() {
  const Patients = [
    {
      name: "Michal Smith",
      visitReason: "Annual Physical",
      Day: "Today",
      Time: "09:00 - 09 :45AM",
    },
    {
      name: "Jhon Doe",
      visitReason: "Follow-up",
      Day: "Wednesday",
      Time: "12:00 - 12 :45PM",
    },
    {
      name: "Jane",
      visitReason: "Chest Pain",
      Day: "Saturday",
      Time: "08:00 - 08 :45AM",
    },
    {
      name: "Mittal",
      visitReason: "Fewer",
      Day: "Tomorrow",
      Time: "5:00 - 05 :45PM",
    },
    {
      name: "Olivia",
      visitReason: "Headache",
      Day: "Sunday",
      Time: "07:00 - 07 :45PM",
    },
  ];

  const NavToVideoCall = useNavigate();
  const handleonClick = (doc: any) => {
    NavToVideoCall("/VideoCall", {
      state: {
        name: doc.name,
        Visit_Reason: doc.visitReason,
        Day: doc.Day,
        Time: doc.Time,
        DocName: "Michael Chen",
      },
    });
  };
  return (
    <>
      <div className={styles.formContainer1}>
        <h5>Today's Appointments</h5>
        <div className={styles.providerListContainer}>
          {Patients.map((doc, index) => (
            <div key={index} className={styles.providerList}>
              <div className={styles.providerInfo}>
                <h5>
                  <small>{doc.name}</small>
                </h5>
                <h6>
                  <strong>Visit reason:</strong> {doc.visitReason}
                </h6>
              </div>

              <div className={styles.appointmentInfo}>
                <h5>{doc.Day}</h5>
                <h5>{doc.Time}</h5>
              </div>

              <button
                className={styles.joinButton}
                onClick={() => handleonClick(doc)}
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.formContainer2}>
        <div className={styles.formContainer2heading}>
          <h5>Notifications</h5>
          <p>Latest Lab Result Notification</p>
        </div>

        <div className={styles.formContainer2content}>
          <div className={styles.formContainer2UserData}>
            <Avatar src="../assets/doctor_png" className={styles.Avatar} />
            <h4>
              <strong>Dr. Emily Rodriguez</strong>
              <span>High</span>
              <p>
                Values within normal limits.
                <br /> Recommend scheduling a follow-up for nutrition
                counseling.
              </p>
            </h4>
          </div>
          <hr style={{ width: "90%", margin: "2px 0px 2px 15px" }} />
          <div className={styles.formContainer2contentUpdates}>
            <p>
              <span>2 hour ago</span>
              <button>
                <GoReply className={styles.ReplyIconContainer2} />
                Reply
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Grid3() {
  return (
    <>
      <div className={styles.PendingConsultation}>
        <span>Pending Consultation</span>
        <ul>
          <li>Michael Chen (Waiting 5 min)</li>
          <li>Sarah Lee (Waiting 2 min)</li>
          <li>David Kim (Waiting 1 min)</li>
        </ul>
      </div>
      <div className={styles.PatientAlerts}>
        <span>Patient Alerts</span>
        <ul>
          <li>
            ⚠ John Smith – <span>High blood pressure reading</span>
          </li>
          <li>
            ⚠ Maria Garcia – <span>Missed medication</span>
          </li>
          <li>
            ⚠ Robert Brown – <span>Abnormal lab result</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default MainContent;
