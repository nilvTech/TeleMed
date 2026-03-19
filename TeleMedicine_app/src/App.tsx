import AuthForm from "./Authentication/AuthForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ForgetPass from "./Authentication/ForgetPass";
import "./App.css";
import "bootstrap-4-react";
import Appointment from "./Provider/Appointment/Appointment";
import VideoCallPreview from "./Provider/VideoCall/VideoCallPreview";
import PatientsPage from "./Provider/Patients/PatientsPage";
import PatientDetailsPage from "./Provider/Patients/PatientDetailsPage";
import ProviderLayout from "./Layout/ProviderLayout";
import MainContent from "./Provider/DashboardContent/Dashboard";
import AdminLayout from "./Layout/AdminLayout";
import AdminDashboard from "./Admin/Dashboard";
import PatientLayout from "./Layout/PatientLayout";
import PatientDashboard from "./Patient/Dashboard";
//import MainContent from "./DashboardContent/Maincontent";
//import { Dashboard } from "@mui/icons-material";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/ForgetPassword" element={<ForgetPass />} />

          <Route element={<PatientLayout/>}>
           <Route path="/Patient/Dasboard" element={<PatientDashboard/>}/>
          </Route>

          <Route element={<AdminLayout/>}>
           <Route path="/Admin/Dasboard" element={<AdminDashboard/>}/>
          </Route>

          <Route element={<ProviderLayout />}>
            <Route path="/Dashboard" element={<MainContent />} />
            <Route path="/Appointment" element={<Appointment />} />
            <Route path="/VideoCall" element={<VideoCallPreview />} />
            <Route path="/Patients" element={<PatientsPage />} />
            <Route path="/Patients/:id" element={<PatientDetailsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
