
import { GoReply } from "react-icons/go";
import Avatar from "@mui/material/Avatar";
//import Header from "./Header";
//import SideBar from "./SideBar";

function MainData() {
  const doctors = [
    {
      name: "Dr. Michal Smith",
      role: "Cardiologist",
      Day: "Today",
      Time: "09:00 - 09 :45AM",
    },
    {
      name: "Dr. Jhon Doe",
      role: "Neurologist",
      Day: "Wednesday",
      Time: "12:00 - 12 :45PM",
    },
    {
      name: "Dr. Jane",
      role: "Pediatrics",
      Day: "Saturday",
      Time: "08:00 - 08 :45AM",
    },
    {
      name: "Dr. Mittal",
      role: "Internists",
      Day: "Tomorrow",
      Time: "5:00 - 05 :45PM",
    },
    {
      name: "Dr.Olivia",
      role: "Dermatology ",
      Day: "Sunday",
      Time: "07:00 - 07 :45PM",
    },
  ];
  return (
    <>
{/*       
      <div className={styles.mainContent}>
        <div className={styles.WelcomeMSG}>
          <h4>
            <strong>Welcome back, </strong>
            <span className={styles.username}>Michael Chen!</span>
          </h4>
          <p>Here's your health overview for today</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.formContainer1}>
            <h5>Upcoming Appointments</h5>
            <div className={styles.providerListContainer}>
              {doctors.map((doc, index) => (
                <div key={index} className={styles.providerList}>
                  <div className={styles.providerInfo}>
                    <h5>
                      <small>{doc.name}</small>
                    </h5>
                    <h6>{doc.role}</h6>
                  </div>

                  <div className={styles.appointmentInfo}>
                    <h5>{doc.Day}</h5>
                    <h5>{doc.Time}</h5>
                  </div>

                  <button className={styles.joinButton}>Join</button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formContainer2}>
            <div className={styles.formContainer2heading}>
              <h5>Unread Messages</h5>
              <p>Latest from your care team</p>
            </div>

            <div className={styles.formContainer2content}>
              <div className={styles.formContainer2UserData}>
                <Avatar src="../assets/doctor_png" className={styles.Avatar} />
                <h4>
                  <strong>Dr. Emily Rodriguez</strong>
                  <span>Nutritionist</span>
                  <p>
                    Your latest blood work results look great! Let's schedule a{" "}
                    <br /> follow-up to discuss your nutrition plan
                  </p>
                </h4>
              </div>
              <hr style={{ width: "90%", margin: "5px" }} />
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
        </div>
        
      </div> */}
    </>
  );
}

export default MainData;
