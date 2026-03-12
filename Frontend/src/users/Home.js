import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShippingFast, FaLeaf, FaHeadset, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import Swal from 'sweetalert2'; 

import bannerImg from "../images/Group-5.png";
import aboutImg from "../images/about-img.png";

import "../css/home.css";
import "../css/categories.css"
import "../css/contact.css"

const Home = ({ vegData, setVegData, addToCart, isLoggedIn, categories, searchTerm, cart }) => {

  const navigate = useNavigate();


  const handleCategoryClick = (categoryName) => {
    
    navigate("/shop", { state: { selectedCategory: categoryName } });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://freshmart-25n5.onrender.com/api/products");
        const data = await response.json();
        setVegData(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [setVegData]);

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
          icon: 'success',
          title: 'Message Sent!',
          text: `Thank you ${formData.name}! Your message has been received successfully.`,
          confirmButtonColor: '#22c55e'
        });
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: data.error || "Something went wrong!"
        });
      }
    } catch (err) {
      console.error("Contact error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Unable to connect to the server.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <br />
      <div className="banner_section">
        <div className="home-container">
          <section className="hero-section">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-5 hero-text">
                  <span className="badge bg-success-soft text-success mb-3 px-3 py-2">100% Organic & Fresh</span>
                  <h1 className="display-3 fw-bold mb-4">
                    Fresh <span className="text-success">Vegetables</span> <br />
                    at Your Doorstep
                  </h1>
                  <p className="lead text-muted mb-5">
                    We deliver fresh, organic, and hand-picked vegetables and fruits directly from local farms to your kitchen. Healthy living starts here.
                  </p>
                </div>
                <div className="col-lg-6 hero-image mt-5 mt-lg-0">
                  <div className="image-blob shadow-lg">
                    <img src={bannerImg} alt="Fresh Vegetables" className="img-fluid rounded-4" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="features-section py-5 bg-light">
            <div className="container">
              <div className="row text-center">
                <div className="col-md-4 mb-4">
                  <div className="feature-card p-4 shadow-sm bg-white rounded-4 h-100">
                    <div className="feature-icon mb-3"><FaLeaf size={40} className="text-success" /></div>
                    <h4 className="fw-bold">100% Organic</h4>
                    <p className="text-muted">No pesticides, only natural products for your family's health.</p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="feature-card p-4 shadow-sm bg-white rounded-4 h-100">
                    <div className="feature-icon mb-3"><FaShippingFast size={40} className="text-success" /></div>
                    <h4 className="fw-bold">Fast Delivery</h4>
                    <p className="text-muted">Same day delivery in your city to keep vegetables fresh.</p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="feature-card p-4 shadow-sm bg-white rounded-4 h-100">
                    <div className="feature-icon mb-3"><FaHeadset size={40} className="text-success" /></div>
                    <h4 className="fw-bold">24/7 Support</h4>
                    <p className="text-muted">Dedicated support team to help you with your orders anytime.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="featured-categories py-5 bg-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0 text-dark">Featured Categories</h2>
            <div className="category-arrows d-none d-md-block">
              <button className="btn btn-light rounded-circle shadow-sm me-2 border" onClick={() => document.querySelector('.category-scroll-wrapper').scrollBy({left: -200, behavior: 'smooth'})}>
                <i className="fa fa-chevron-left"></i>
              </button>
              <button className="btn btn-success rounded-circle shadow-sm" onClick={() => document.querySelector('.category-scroll-wrapper').scrollBy({left: 200, behavior: 'smooth'})}>
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div className="category-scroll-wrapper d-flex overflow-auto pb-3" style={{ gap: '20px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div 
              className={`cat-card p-4 rounded-4 text-center shadow-sm border border-transparent`}
              style={{ minWidth: '160px', backgroundColor: '#f1fcf2', cursor: 'pointer', transition: '0.3s' }}
              onClick={() => handleCategoryClick("All")} 
            >
              <div className="cat-img-box mb-3" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={bannerImg} alt="All" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <h6 className="fw-bold mb-1">All Products</h6>
              <span className="text-muted small">({vegData.length})</span>
            </div>

            {categories.map((cat, index) => {
              const name = typeof cat === 'object' ? cat.name : cat;
              const img = typeof cat === 'object' ? cat.img : "";
              const colors = ['#fdf2ff', '#fff5f0', '#f1fcf2', '#fff9e5', '#f2faff'];
              const bgColor = colors[index % colors.length];

              return (
                <div 
                  key={index} 
                  className={`cat-card p-4 rounded-4 text-center shadow-sm border border-transparent`}
                  style={{ minWidth: '160px', backgroundColor: bgColor, cursor: 'pointer', transition: '0.3s' }}
                  onClick={() => handleCategoryClick(name)}
                >
                  <div className="cat-img-box mb-3" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={img || bannerImg} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: '130px' }}>{name}</h6>
                  <span className="text-muted small">({vegData.filter(i => i.category === name).length})</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="about_section layout_padding">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-left">
              <h1 className="about_taital text-success mb-4 fw-bold border-bottom pb-2">About Us</h1>
            </div>
          </div>
          <div className="about_section_2">
            <div className="row d-flex align-items-center">
              <div className="col-md-6">
                <div className="about_img_container">
                  <img src={aboutImg} alt="Fresh Vegetables" className="styled_about_img" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="content_box">
                  <h2 className="fresh_taital">Fresh Quality</h2>
                  <p className="ipsum_text">
                    FreshMart is not just an online store, but a symbol of purity. By promoting local farming, we deliver freshness directly from the farm to your home.
                    We conduct strict quality checks every day to ensure that you and your family always receive the best nutrition. Our service is transparent, and we consider customer satisfaction as the true measure of our success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  <div className="icon-box bg-success text-white rounded-circle me-3 text-center" style={{ width: '40px', height: '40px', lineHeight: '40px' }}>
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
                  <div className="icon-box bg-success text-white rounded-circle me-3 text-center" style={{ width: '40px', height: '40px', lineHeight: '40px' }}>
                    <FaEnvelope />
                  </div>
                  <div>
                    <h6 className="m-0 fw-bold">Email Us</h6>
                    <p className="m-0 text-muted">nakumkartik1@gmail.com</p>
                  </div>
                </div>
              </div>
              <div className="contact-info-card p-4 shadow-sm rounded-4 bg-white border-start border-success border-4">
                <div className="d-flex align-items-center">
                  <div className="icon-box bg-success text-white rounded-circle me-3 text-center" style={{ width: '40px', height: '40px', lineHeight: '40px' }}>
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h6 className="m-0 fw-bold">Our Location</h6>
                    <p className="m-0 text-muted">310, Relief Shopping Centre, Nr.gpo, Salapose Road, Jamnagar</p>
                  </div>
                </div>
              </div>
            </div>
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
                      <input type="text" className="form-control rounded-3 py-2" name="phone" value={formData.phone} onChange={handleChange} maxLength="10" placeholder="Enter phone number" required />
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

      <style>{`
        .category-scroll-wrapper::-webkit-scrollbar { display: none; }
        .cat-card:hover { transform: translateY(-5px) !important; box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
};

export default Home;