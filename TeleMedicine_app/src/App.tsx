import AuthForm from "./Authentication/AuthForm"
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import ForgetPass from "./Authentication/ForgetPass";
import './App.css'
import "bootstrap-4-react"
import Appointment from "./Appointment/Appointment";
import Dashboard from "./DashboardContent/Dashboard";
import VideoCallPreview from "./VideoCall/VideoCallPreview";
import PatientsPage from "./Patients/PatientsPage";
import PatientDetailsPage from "./Patients/PatientDetailsPage";
//import MainContent from "./DashboardContent/Maincontent";
//import { Dashboard } from "@mui/icons-material";

function App() {

  return (
    <div>
      <BrowserRouter>
    <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/ForgetPassword" element={<ForgetPass />} />
        <Route path="/Appointment" element={<Appointment/>}/>
        <Route path="/VideoCall" element={<VideoCallPreview/>}/>
        <Route path="/Patients" element={<PatientsPage/>}/>
        <Route path="/Patients/:id" element={<PatientDetailsPage/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
