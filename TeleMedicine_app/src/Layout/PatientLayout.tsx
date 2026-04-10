import { Outlet } from "react-router-dom";
import Header from "../Patients/Header";
import Sidebar from "../Patients/Sidebar";

function PatientLayout() {
  return (
    <>
      <Header />
      <Sidebar />
      <div style={{ marginLeft: "230px", marginTop: "60px" }}>
        <Outlet />
      </div>
    </>
  );
}
export default PatientLayout;
