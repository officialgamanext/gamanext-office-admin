import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, User, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import '../CSS/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    const envUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    setTimeout(() => {
      if (username === envUsername && password === envPassword) {
        localStorage.setItem('isAdminLoggedIn', 'true');
        toast.success('Login successful! Welcome Admin.');
        navigate('/');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="login-wrapper">
      <div className="login-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <ShieldCheck size={32} color="var(--primary)" />
          </div>
          <h1>GamaNext Admin</h1>
          <p>Please enter your credentials to continue</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="Enter username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Login to Dashboard"}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 GamaNext Management System</p>
          <p className="security-tag">Strict Security Enabled</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
