//import type React from "react";

import { useState } from "react";
//import Dashboard from "../DashboardContent/Dashboard";
import { useNavigate } from "react-router-dom";
interface LoginProps {
  setLogin: (value: boolean) => void;
  isLogin: boolean;
}

function Login({ setLogin }: LoginProps) {
  const NavToDashboard = useNavigate();
  const NavToForgetPass = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
  });

  const handleLogin = () => {
    if (form.role === "Patient") {
      NavToDashboard("/Patient/Dasboard");
    } else if (form.role === "Provider") {
      NavToDashboard("/Dashboard");
    } else if (form.role === "Admin") {
      NavToDashboard("/Admin/Dasboard");
    } else {
      alert("Please Select the role");
    }
  };
  return (
    <>
      <div className="form">
        <h2>Login</h2>

        <select
          name="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="role"
        >
          <option value="" disabled hidden>
            Select Role
          </option>
          <option value="Patient">Patient</option>
          <option value="Provider">Provider</option>
          <option value="Admin">Admin</option>
        </select>
        <br />
        <input
          type="email"
          placeholder="Username"
          value={form.username}
          onChange={(e) => {
            setForm({ ...form, username: e.target.value });
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });
          }}
        />

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            NavToForgetPass("/ForgetPassword");
          }}
        >
          Forgot Password
        </a>
        <br />

        <button className="AuthSubmitBtn" onClick={handleLogin}>
          Submit
        </button>
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
