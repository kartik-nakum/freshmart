import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import "../css/admin/adminlogin.css"
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = ({ setIsLoggedIn, setIsAdmin }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        // Error Dialog
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.error || 'Invalid credentials!',
          confirmButtonColor: '#d33'
        });
        return;
      }

      // Check for Admin Role
      if (data.user.role !== "admin") {
        setLoading(false);
        Swal.fire({
          icon: 'warning',
          title: 'Access Denied',
          text: 'You are not authorized as an Admin!',
          confirmButtonColor: '#f39c12'
        });
        return;
      }

      // Login success
      setIsLoggedIn(true);
      setIsAdmin(true);
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("isAdmin", "true"); 
      sessionStorage.setItem("userName", data.user.fullName);
      sessionStorage.setItem("userEmail", JSON.stringify(data.user.email));

      setLoading(false);

      // Success Dialog
      Swal.fire({
        icon: 'success',
        title: 'Welcome Admin!',
        text: 'Login Successful. Redirecting to dashboard...',
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);

    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Something went wrong. Please try again later.',
      });
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>

        <div className="input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="admin@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="input-group" style={{ position: "relative" }}>
          <label>Password</label>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="********" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            maxLength="8"
            style={{ width: '100%', paddingRight: '40px' }} 
          />
          <span 
            onClick={() => setShowPassword(!showPassword)} 
            style={{
              position: "absolute",
              right: "15px",
              top: "18px",
              cursor: "pointer",
              color: "#22c55e"
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />} 
          </span>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Authorizing..." : "Login Now"}
        </button>
        
        <div className="extra-links">
          <Link to="/admin/forgot-password" style={{ fontWeight: 'bold', textDecoration: 'none' }}>Forgot Password?</Link>
          <p className="mt-3">Don't have an account? <Link to="/admin/register" style={{ fontWeight: 'bold', textDecoration: 'none' }}>Register here</Link></p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;