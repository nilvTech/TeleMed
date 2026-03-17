import Header from "../DashboardContent/Header";
import SideBar from "../DashboardContent/SideBar";
import PatientList from "./PatientList";

function PatientsPage() {
  return (
    <div>
      <Header />
      <SideBar />
      <PatientList/>
    </div>
  );
}
export default PatientsPage;
