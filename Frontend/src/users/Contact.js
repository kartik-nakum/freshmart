import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import Swal from 'sweetalert2'; 
import "../css/contact.css"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://freshmart-25n5.onrender.com/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
       
        Swal.fire({
          title: 'Success!',
          text: `Thank you ${formData.name}! Your message has been received.`,
          icon: 'success',
          confirmButtonColor: '#28a745',
          confirmButtonText: 'OK'
        });
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
       
        Swal.fire({
          title: 'Error!',
          text: data.error || "Something went wrong!",
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    } catch (err) {
      console.error("Contact error:", err);
      Swal.fire('Error', 'Unable to connect to the server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page-wrapper py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="contact_taital text-success mb-4 fw-bold border-bottom pb-2">Get In Touch</h1>
          <p className="text-muted">We are always ready to listen to your questions and feedback.</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="contact-info-card p-4 shadow-sm rounded-4 mb-3 bg-white border-start border-success border-4">
              <div className="d-flex align-items-center">
                <div className="icon-box bg-success text-white rounded-circle me-3 text-center" style={{width:'40px', height:'40px', lineHeight:'40px'}}>
                  <FaPhoneAlt />
                </div>
                <div>
                  <h6 className="m-0 fw-bold">Call Us</h6>
                  <p className="m-0 text-muted">+91 98244 64564</p>
                </div>
              </div>
            </div>
            <div className="contact-info-card p-4 shadow-sm rounded-4 mb-3 bg-white border-start border-success border-4">
              <div className="d-flex align-items-center">
                <div className="icon-box bg-success text-white rounded-circle me-3 text-center" style={{width:'40px', height:'40px', lineHeight:'40px'}}>
                  <FaEnvelope />
                </div>
                <div>
                  <h6 className="m-0 fw-bold ">Email Us</h6>
                  <p className="m-0 text-muted"> nakumkartik1@gmail.com</p>
                </div>
              </div>
            </div>

              <div className="contact-info-card p-4 shadow-sm rounded-4 mb-3 bg-white border-start border-success border-4">
              <div className="d-flex align-items-center">
                <div className="icon-box bg-success text-white rounded-circle me-3 text-center" style={{width:'40px', height:'40px', lineHeight:'40px'}}>
                 <FaMapMarkerAlt />
                </div>
                <div>
                  <h6 className="m-0 fw-bold">Our Location</h6>
                  <p className="m-0 text-muted">310, Relief Shopping Centre, Nr.gpo, Salapose Road, Jamnagar</p>
                </div>
              </div>
            </div>
          </div>

          {/* contact from */}
          <div className="col-lg-8">
            <div className="contact-form-container p-4 p-md-5 shadow-lg rounded-4 bg-white">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Full Name</label>
                    <input type="text" className="form-control rounded-3 py-2" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Phone Number</label>
                    <input type="text" className="form-control rounded-3 py-2" name="phone" maxLength="10" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" required />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label fw-bold">Email Address</label>
                    <input type="email" className="form-control rounded-3 py-2" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" required />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label fw-bold">Message</label>
                    <textarea className="form-control rounded-3" name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="How can we help you?"></textarea>
                  </div>
                  <div className="col-md-12">
                    <button type="submit" className="btn btn-success btn-lg w-100 rounded-pill shadow-sm py-3 fw-bold" disabled={loading}>
                      <FaPaperPlane className="me-2" /> {loading ? "SENDING..." : "SEND MESSAGE"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;