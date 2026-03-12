import React, { useState } from "react";
import "../css/login.css"
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from 'sweetalert2'; 

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://freshmart-25n5.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.error || 'Invalid credentials, please try again.',
          confirmButtonColor: '#d33'
        });
        return;
      }

      setIsLoggedIn(true);
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userName", data.user.fullName);
      sessionStorage.setItem("userEmail", data.user.email);
      sessionStorage.setItem("userPhone", data.user.phone);
      sessionStorage.setItem("userEmail", JSON.stringify(email));

      setLoading(false);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back to FreshMart.',
        confirmButtonColor: '#22c55e',
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => {
        navigate("/shop");
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
        <h2>Login</h2>

        <div className="input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="example@mail.com" 
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
          {loading ? "Logging in..." : "Login Now"}
        </button>
        
        <div className="extra-links">
          <Link to="/forgot-password" style={{ fontWeight: 'bold', textDecoration: 'none' }}>Forgot Password?</Link>
          <p className="mt-3">Don't have an account? <Link to="/register" style={{ fontWeight: 'bold', textDecoration: 'none' }}>Register here</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;