import { useState } from "react";

function SignUp() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
  });
  return (
    <>
      <div className="form">
        <h2>Register</h2>
        <select
          name="role"
          value={form.role}
          onChange={(e) => {
            setForm({ ...form, role: e.target.value });
          }}
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
        <input type="email" placeholder="Email Address" required />
        <input type="password" placeholder="Password" required />
        <input type="password" placeholder="Confirm Password" required />
        <button className="AuthSubmitBtn">Register</button>
      </div>
    </>
  );
}
export default SignUp;
