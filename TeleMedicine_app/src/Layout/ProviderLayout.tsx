import { Outlet } from "react-router-dom";
import Header from "../Provider/DashboardContent/Header";
import SideBar from "../Provider/DashboardContent/SideBar";

function ProviderLayout(){
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

export default ProviderLayout;  