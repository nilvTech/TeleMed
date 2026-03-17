//import type React from "react";

import { useState } from "react";
//import Dashboard from "../DashboardContent/Dashboard";
import { useNavigate } from "react-router-dom";



 interface LoginProps{
        setLogin: (value:boolean)=>void;
        isLogin:boolean;
    }



function Login({setLogin}:LoginProps) {
  
  const NavToDashboard = useNavigate();
  const NavToForgetPass = useNavigate();
  
   const [form,setForm] = useState(
    {
      username:"",
      password:"",
      role:"provider"
    }
   )

   const handleLogin = ()=>{
    if(!form.username && !form.password){
      NavToDashboard('/Dashboard')
    } else{
      alert("Enter Credentials...")
    }
   }
  return (
    <>
      <div className="form">
        <h2>Login</h2>
        <input 
        type="email" 
        placeholder="Username"
        value={form.username}
        onChange={(e)=>{ setForm({...form,username:e.target.value})}}
        />
        <input 
        type="password" 
        placeholder="Password"
        value={form.password}
        onChange={(e)=>{setForm({...form,password:e.target.value})}}
        />

        <a href="#" onClick={(e)=>{
          e.preventDefault();
          NavToForgetPass('/ForgetPassword');
        }}>Forgot Password</a>
        <br />
        <select   
        name="Role"
        value={form.role}
        onChange={(e)=>setForm({...form,role:e.target.value})}
        
        >
          <option>Select Role</option>
          <option>Provider</option>
          <option>Admin</option>    
          <option>Support</option>
        </select>
        <br />
        
        <button className="AuthSubmitBtn" onClick={handleLogin}>Submit</button>
        <br />
        <p>
          New Patient?{" "}
          <a href="#" onClick={() => setLogin(false)}>
            Register →
          </a>
        </p>
      </div>
    </>
  );
}

export default Login;
