import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; 
import "../css/admin/adminforget.css"

const AdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    try {
      const res = await fetch("https://freshmart-25n5.onrender.com/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Reset Failed',
          text: data.error || 'Something went wrong!',
          confirmButtonColor: '#d33'
        });
        return;
      }

      // Success Dialog
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Admin password reset successful!',
        confirmButtonColor: '#22c55e',
      }).then(() => {
        navigate("/admin/alogin");
      });

    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Unable to connect to the server. Please try again later.',
        confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleReset}>
        <h2>Admin Reset Password</h2>
        <p>Enter your registered email and set a new admin password.</p>
        
        {/* Email Input */}
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

        {/* New Password */}
        <div className="input-group">
          <label>New Password</label>
          <input 
            type="password" 
            placeholder="Enter new password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required 
          />
        </div>

        {/* Confirm Password */}
        <div className="input-group">
          <label>Confirm Password</label>
          <input 
            type="password" 
            placeholder="Confirm your new password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="submit-btn">RESET PASSWORD</button>
        
        <div className="extra-links">
          <span>Remembered it? <Link to="/admin/alogin" style={{ fontWeight: 'bold', textDecoration: 'none' }}>Back to Login</Link></span>
        </div>
      </form>
    </div>
  );
};

export default AdminForgotPassword;