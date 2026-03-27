import AttachmentList from "./AttachmentList";
import styles from "../CSS/RightSectionCSS/PatientDetailsPanel.module.css";
import QuickActions from "./QuickActions";
import PatientInformationCard from "./PatientInformationCard";

import { useMessageStore } from "../Store/MessageStore";

const PatientDetailsPanel = ()=>{
    const isOpen = useMessageStore((state) => state.isDetailsOpen);
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