import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ForgetPass() {
  const NavToLogin = useNavigate();
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [Email,setEmail] = useState("");
  const [Password,setPassword] = useState("");
  const [ResetPassword,SetResetPassword] = useState("");
  return (
    <div className="container">
      <div className="form-container">
        <div className="form">
          <h3 className="ResetpassHeading">Re-set Password</h3>
          <input 
          type="email" 
          placeholder="Enter Email"
          onChange={(e)=>{setEmail(e.target.value)}}
          value={Email}
          />
          <a
            href="#"
            onClick={() => {
              setShowOTPInput(true);
            }}
          >
            Get OTP
          </a>
          {showOTPInput && (
            <div>
              <label style={{ color: "green" }}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  style={{ margin: "10px", width: "92px" }}
                />
                <strong style={{ cursor: "pointer" }}>Verify</strong>
              </label>
            </div>
          )}
          <input 
          type="text" 
          placeholder="Enter Password"  
          onChange={(e)=>{setPassword(e.target.value)}}
          value={Password}
          />
          <input 
          type="text" 
          placeholder="Re-Enter Password"
          onChange={(e)=>{SetResetPassword(e.target.value)}}
          value={ResetPassword}
          />

          <button className="AuthSubmitBtn" onClick={()=>{Email && Password && ResetPassword ? NavToLogin(-1) : alert("Fill all fields") }} >Change Password</button>
          
        </div>
      </div>
    </div>
  );
}
