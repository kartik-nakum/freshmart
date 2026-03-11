import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import "../css/forgetpassword.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

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
      const res = await fetch("http://localhost:5000/api/forgot-password", {
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

      Swal.fire({
        icon: 'success',
        title: 'Successful!',
        text: 'Password reset successful! You can now login with your new password.',
        confirmButtonColor: '#22c55e',
      }).then(() => {
        navigate("/login");
      });

    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Server error, please try again later.',
        confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleReset}>
        <h2>Reset Password</h2>
        <p>Enter your email and set a new password for your account.</p>
        
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

        <div className="input-group">
          <label>Confirm Password</label>
          <input 
            type="password" 
            placeholder="Confirm your password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="submit-btn">Reset Password</button>
        
        <div className="extra-links">
          <span>Remembered it? <Link to="/login" style={{ fontWeight: 'bold', textDecoration: 'none' }}>Back to Login</Link></span>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;