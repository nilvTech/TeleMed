import { Outlet } from "react-router-dom";
import Header from "../Admin/Header";
import SideBar from "../Admin/Sidebar";

function AdminLayout(){
    return(
        <>
        <Header/>
        <SideBar/>
        <div style={{marginLeft:"230px",marginTop:"60px"}}>
            <Outlet/>
        </div>
        </>
    )
}
export default AdminLayout;