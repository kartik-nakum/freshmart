import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import "../css/register.css"
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const inputRefs = [useRef(), useRef(), useRef(), useRef()]; 
  
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: ""
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpArray, setOtpArray] = useState(["", "", "", ""]); 
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return; 
    const newOtp = [...otpArray];
    newOtp[index] = value.substring(value.length - 1);
    setOtpArray(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtpEmail = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otpCode);

    const templateParams = {
      user_name: formData.fullName,
      user_email: formData.email,
      otp: otpCode,
      time: new Date().toLocaleString()
    };

    emailjs.send('service_eb0xv0d', 'template_s05nabc', templateParams, '0866rLw2H2Ww8qXrQ')
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'OTP Sent',
        text: 'OTP has been sent to your email!',
        confirmButtonColor: '#22c55e'
      });
      setIsOtpSent(true);
      setTimer(30);
    })
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error sending email: ' + err.text
      });
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const finalOtp = otpArray.join("");     

    if (finalOtp !== generatedOtp) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid OTP',
        text: 'Please check your OTP and try again.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: "user"
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: 'warning',
          title: 'Registration Failed',
          text: data.message
        });
        return;
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Registration Successful!',
        confirmButtonColor: '#22c55e'
      }).then(() => {
        navigate("/login");
      });

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Error saving data. Please try again later.'
      });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="login-container">
      {!isOtpSent ? (
        <form className="login-form" onSubmit={sendOtpEmail}>
          <h2>Create Account</h2>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" name="fullName" onChange={handleChange} required placeholder="Full Name" />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" name="email" onChange={handleChange} required placeholder="example@mail.com"/>
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input type="text" name="phone" onChange={handleChange} required maxLength="10" placeholder="Phone Number"/>
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="******" 
                onChange={handleChange} 
                required 
                maxLength="8" 
                style={{ width: "100%", paddingRight: "40px" }} 
              />
              <span onClick={() => setShowPassword(!showPassword)} style={{position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#22c55e" }}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="input-group" style={{ position: "relative" }}>
            <label>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                placeholder="******" 
                onChange={handleChange} 
                required 
                maxLength="8" 
                style={{ width: "100%", paddingRight: "40px" }} 
              />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#22c55e"}}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
           
          <button type="submit" className="submit-btn">Send OTP</button>
        </form>
      ) : (
        <form className="login-form text-center" onSubmit={handleRegister}>
          <h2 className="text-danger fw-bold mb-2">Verify OTP</h2>
          <p className="small text-muted mb-4">OTP sent to: <b>{formData.email}</b></p>
          
          <div className="otp-box-container d-flex justify-content-center gap-2 mb-4">
            {otpArray.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={inputRefs[index]}
                className="otp-input-box"
                value={data}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <div className="mb-4">
            {timer > 0 ? (
              <span className="resend-text">Resend in: <b className="text-success">00:{timer < 10 ? `0${timer}` : timer}</b></span>
            ) : (
              <button type="button" className="btn btn-link text-success p-0 fw-bold" onClick={sendOtpEmail}>Resend OTP</button>
            )}
          </div>
          <button type="submit" className="submit-btn">Verify & Register</button>
        </form>
      )}
    </div>
  );
};

export default Register;