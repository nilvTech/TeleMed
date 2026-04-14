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
import MainContent from "./Provider/DashboardContent/ProviderDashboard/Dashboard";
import AdminLayout from "./Layout/AdminLayout";
import AdminDashboard from "./Admin/Dashboard";
import PatientLayout from "./Layout/PatientLayout";
import PatientDashboard from "./Patients/Dashboard/PatientDashboard";
import Documents from "./Provider/Patients/PatientDetailsTab/Documents";
import Orders from "./Provider/Patients/PatientDetailsTab/Orders";
import DocumentList from "./Provider/Patients/PatientDetailsTab/DocumentList";
import Payments from "./Provider/Patients/PatientDetailsTab/Payment/Payments";
import PatientForm from "./Provider/Patients/PatientForm";
import MessagesPage from "./Provider/Messages/MessagesPage";
import BillingDashboard from "./Provider/Billing/BillingDashboard";
import ChargesPage from "./Provider/Billing/ChargesPage";
import InvoicePage from "./Provider/Billing/Invoice";
import MedicalHistory from "./Provider/Clinical/MedicalRecords";
import Prescriptions from "./Provider/Clinical/Prescription";
import VisitNotes from "./Provider/Clinical/VisitNotes";
import ProgressPage from "./Provider/Monitoring/Progress";
// import FilesPage from "./Provider/Files/Files";
import SettingPage from "./Provider/Setting/Setting";
import SupportPage from "./Provider/Support/SupportPage";
import PatientAppointments from "./Patients/Appointment/PatientAppointment";
import PatientVisitNotes from "./Patients/MedicalRecords/VisitNotes";
import { Presentation } from "lucide-react";
import Prescription from "./Patients/MedicalRecords/Prescription";
import PatientLabOrders from "./Patients/MedicalRecords/LabOrders";
import PatientPrescription from "./Patients/MedicalRecords/Prescription";

//import MainContent from "./DashboardContent/Maincontent";
//import { Dashboard } from "@mui/icons-material";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/ForgetPassword" element={<ForgetPass />} />

          <Route element={<PatientLayout />}>
            <Route path="/Patient/Dasboard" element={<PatientDashboard />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/Admin/Dasboard" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProviderLayout />}>
            <Route path="/Dashboard" element={<MainContent />} />
            <Route path="/Appointment" element={<Appointment />} />
            <Route path="/VideoCall" element={<VideoCallPreview />} />
            <Route path="/Patients" element={<PatientsPage />} />
            <Route path="/Patients/:id" element={<PatientDetailsPage />} />
            <Route path="/Patients/documents" element={<Documents />} />
            <Route path="/Patients/Orders" element={<Orders />} />
            <Route path="/document-list" element={<DocumentList />} />
            <Route path="/Patients/payments" element={<Payments />} />
            <Route path="/Patients/Form" element={<PatientForm />} />
            <Route path="/Message" element={<MessagesPage />} />
            <Route path="/Billing" element={<BillingDashboard />} />
            <Route path="/Charges" element={<ChargesPage />} />
            <Route path="/Invoice" element={<InvoicePage />} />
            <Route
              path="/Clinical/MedicalRecords"
              element={<MedicalHistory />}
            />
            <Route path="/Clinical/Prescriptions" element={<Prescriptions />} />
            <Route path="/Clinical/VisitNotes" element={<VisitNotes />} />
            <Route path="/Monitoring/Progress" element={<ProgressPage />} />
            <Route path="/Setting/Profile" element={<SettingPage />} />
            <Route path="/Support" element={<SupportPage />} />
            {/* <Route path="/Files" element={<FilesPage/>} /> */}
          </Route>

          <Route element={<PatientLayout />}>
            <Route path="/Patient/Dasboard" element={<PatientDashboard />} />
            <Route path="/Patient/Appointment" element={<PatientAppointments />} />
            <Route path="/MedicalRecords/VisitNotes" element={<PatientVisitNotes/>} />
            <Route path="/MedicalRecords/Prescription" element={<PatientPrescription/>} />
            <Route path="/MedicalRecords/LabOrders" element={<PatientLabOrders/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
