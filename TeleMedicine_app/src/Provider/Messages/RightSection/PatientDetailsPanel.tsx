import AttachmentList from "./AttachmentList";
import styles from "../CSS/RightSectionCSS/PatientDetailsPanel.module.css";
import QuickActions from "./QuickActions";
import PatientInformationCard from "./PatientInformationCard";

interface Props{
    isOpen:boolean;
}
const PatientDetailsPanel = ({isOpen}:Props)=>{

    return(
        <div 
        className={`${styles.panel} ${isOpen? styles.open : styles.closed}`}
        >
            <PatientInformationCard/>
            <AttachmentList/>
            <QuickActions/>
        </div>
    )
}
export default PatientDetailsPanel;