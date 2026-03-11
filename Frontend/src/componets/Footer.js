import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import "../componets/footer.css";

const Footer = () => {
    return (
        <footer className="footer bg-light text-white pt-5 pb-4">
            <div className="container text-center text-md-start">
                <div className="row">
                   
                    <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3 text-dark">
                        <h5 className="text-uppercase mb-4 font-weight-bold text-success ">FreshMart</h5>
                        <p>We deliver fresh and organic vegetables directly from the farm to your home. Freshness and quality are our identity.</p>
                    </div>

                    <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4 font-weight-bold text-success">Quick Links</h5>
                        <p><Link to="/" className="text-dark text-decoration-none">Home</Link></p>
                        <p><Link to="/shop" className="text-dark text-decoration-none">Shop</Link></p>
                        <p><Link to="/about" className="text-dark text-decoration-none">About Us</Link></p>
                        <p><Link to="/contact" className="text-dark text-decoration-none">Contact</Link></p>
                    </div>

                    <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3 text-dark">
                        <h5 className="text-uppercase mb-4 font-weight-bold text-success">Contact</h5>
                        <p><FaMapMarkerAlt className="me-2 text-dark" /> Jamnagar, Gujarat, India. </p>
                        <p><FaEnvelope className="me-2 text-dark" /> nakumkartik1@gmail.com</p>
                        <p><FaPhoneAlt className="me-2 text-dark" /> +91 98244 64564 </p>
                    </div>

                    <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4 font-weight-bold text-success">Follow Us</h5>
                        <div className="d-flex gap-3 fs-4">
                            <a href="https://www.facebook.com/home.php" className="text-dark"><FaFacebook /></a>
                            {/* <a href="#" className="text-white"><FaTwitter /></a> */}
                            <a href="https://www.instagram.com/" className="text-dark"><FaInstagram /></a>
                            <a href="https://www.linkedin.com/feed/" className="text-dark"><FaLinkedin /></a>
                        </div>
                    </div>
                </div>

                <hr className="mb-4 mt-5" />
                <div className="row">
                   <div className="col-md-12 text-center text-dark"> 
                     <p className="small mb-0">© {new Date().getFullYear()} All Rights Reserved by:
                         <strong className="text-success"> FreshMart</strong>
                     </p>
                   </div>
               </div>
            </div>
        </footer>
    );
};

export default Footer;