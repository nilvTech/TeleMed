//import type React from "react";

import { useRef, useState } from "react";
//import Dashboard from "../DashboardContent/Dashboard";
import { useNavigate } from "react-router-dom";
interface LoginProps {
  setLogin: (value: boolean) => void;
  isLogin: boolean;
}

function Login({ setLogin }: LoginProps) {
  const NavToDashboard = useNavigate();
  const NavToForgetPass = useNavigate();
  const [RoleError, setRoleError] = useState("");
  const [UsernameError, setUsernameError] = useState("");
  const [PasswordError, setPasswordError] = useState("");
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
  });
  const roleRef = useRef<HTMLSelectElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleLogin = () => {
    if (!form.role) {
      setRoleError("Please select a role!");
      roleRef.current?.focus();
      return;
    }
    if (!form.username) {
      setUsernameError("Please enter a username!");
      usernameRef.current?.focus();
      return;
    }
    if (!form.password) {
      setPasswordError("Please enter a password!");
      passwordRef.current?.focus();
      return;
    }

    setRoleError("");
    if (form.role === "Patient") {
      NavToDashboard("/Patient/Dasboard");
    } else if (form.role === "Provider") {
      NavToDashboard("/Dashboard");
    } else if (form.role === "Admin") {
      NavToDashboard("/Admin/Dashboard");
    }
  };

  return (
    <>
      <div className="form">
        <h2>Login</h2>

        <select
          name="role"
          value={form.role}
          onChange={(e) => {
            setForm({ ...form, role: e.target.value });
            setRoleError("");
          }}
          className={`role ${RoleError ? "error-border" : ""}`}
          ref={roleRef}
        >
          <option value="" disabled hidden>
            Select Role
          </option>
          <option value="Patient">Patient</option>
          <option value="Provider">Provider</option>
          <option value="Admin">Admin</option>
        </select>
        {RoleError && <p className="error-text">{RoleError}</p>}
        <br />
        <input
          type="email"
          placeholder="Username"
          value={form.username}
          onChange={(e) => {
            setForm({ ...form, username: e.target.value });
            setUsernameError("");
          }}
          className={` ${UsernameError ? "error-border" : ""}`}
          ref={usernameRef}
        />
        {UsernameError && <p className="error-text">{UsernameError}</p>}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });
            setPasswordError("");
          }}
          className={`role ${PasswordError ? "error-border" : ""}`}
          ref={passwordRef}
        />
        {PasswordError && <p className="error-text">{PasswordError}</p>}

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
