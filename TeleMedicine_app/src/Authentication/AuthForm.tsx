import { useState } from 'react';
import './login.css';
import SignUp from './SignUp';
import Login from './Login';

function AuthForm() {
  const [isLogin, setLogin] = useState(true);

  return (
    <div className="container">
      {/* Container for the whole card */}
      <div className="form-container" style={{ overflow: 'hidden', padding: 0 }}>
        
        {/* Header: Full width, Teal background */}
        <div className='form-header' style={{
          backgroundColor: '#00897B', 
          color: 'white',
          padding: '15px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          {/* Optional: Add a small hospital icon here to match the image */}
          <span style={{ fontSize: '1.2rem' }}>🏥</span>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>PulseLink</h2>
        </div>

        {/* Inner Content: This holds your toggles and forms */}
        <div style={{ padding: '20px' }}>
          <div className='form-toggle'>
            <button className={isLogin ? 'active' : ''} onClick={() => setLogin(true)}>Login</button>
            <button className={!isLogin ? 'active' : ''} onClick={() => setLogin(false)}>Register</button>
          </div>
          
          {isLogin ? <Login isLogin={isLogin} setLogin={setLogin}/> : <SignUp />}
        </div>
        
      </div>
    </div>
  );
}

export default AuthForm;