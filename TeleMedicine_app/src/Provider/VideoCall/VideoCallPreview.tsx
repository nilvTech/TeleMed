import { useRef, useState, useEffect } from "react";
import styles from "./VideoCallPreview.module.css";
import Header from "../DashboardContent/Header";
import SideBar from "../DashboardContent/SideBar";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useLocation } from "react-router-dom";
function VideoCallPreview() {
  const location = useLocation();
  const name = location.state?.name || "Guest";
  const { Visit_Reason, Day, Time, DocName } = location.state || {};
  const [meetingStatus, setMeetingStatus] = useState(false);
  const meetingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log(DocName);
    if (!meetingStatus || !meetingRef.current) return;

    const startMeeting = async () => {
      const appID = 257538249;
      const serverSecret = "efbd5ef53b35fa77608d3ec23babff3b";

      const roomID = "123";
      const userID = Date.now().toString();

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userID,
        String(DocName),
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: meetingRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
      });
    };

    startMeeting();
  }, [meetingStatus]);

  return (
    <>
      <Header />
      <SideBar />

      <div className={styles.Container}>
        {!meetingStatus && (
          <MeetingPreview
            setMeetingStatus={setMeetingStatus}
            name={name}
            Visit_reason={Visit_Reason}
            Day={Day}
            Time={Time}
          />
        )}

        {meetingStatus && (
          <div ref={meetingRef} style={{ width: "100%", height: "600px" }} />
        )}
      </div>
    </>
  );
}

interface MeetingPreviewProps {
  setMeetingStatus: React.Dispatch<React.SetStateAction<boolean>>;
  name:string;
  Visit_reason:string;
  Day:number;
  Time:string;
}

const MeetingPreview = ({ setMeetingStatus,name,Visit_reason,Day,Time }: MeetingPreviewProps) => {
  return (
    <div className={styles.MeetingPreview}>
      <table className={styles.tableStyle}>
        <tbody>
          <tr>
            <td className={styles.headerCellStyle}>Doctor</td>
            <td className={styles.headerCellStyle}>Patient</td>
            <td className={styles.headerCellStyle}>Appointment Details</td>
            <td className={styles.headerCellStyle}>Action</td>
          </tr>

          {/* Row 2: 1 Column spanning all 3 */}
          <tr>
            <td className={styles.cellStyle}>
              Michael Chan
            </td>
            <td className={styles.cellStyle}>
              {name}
            </td>
            <td className={styles.cellStyle}>
              <div style={{display:"flex",flexDirection:"column"}}>
              <span> <strong> Visit reason:</strong> {Visit_reason} </span>
              <span><strong>Meeting day:</strong> {Day}</span>
              <span><strong>Meeting Time:</strong> {Time}</span>
              </div>
            </td>
            <td className={styles.cellStyle}>
              <button
                onClick={() => setMeetingStatus(true)}
                className={styles.StartMeetingBtn}
              >
                Start Meeting
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};


export default VideoCallPreview;