import React from 'react';
import "../css/about.css"
import aboutImg from "../images/about-img.png";

const About = () => {
  return (
    <div className="container-fluid">
      <div className="layout_border">
        <div className="about_section layout_padding">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-left">
                
                <h1 className="about_taital text-success mb-4 fw-bold border-bottom pb-2">About Us</h1>
                {/* <p className="about_text">
                  While multiple variations can be found, we believe in delivering consistent and high-quality information to our users.
                </p> */}
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
                    <h2 className="fresh_taital">Fresh any</h2>
                    <p className="ipsum_text">
                        FreshMart is not just an online store, but a symbol of purity. By promoting local farming, we deliver freshness directly from the farm to your home.
                        We conduct strict quality checks every day to ensure that you and your family always receive the best nutrition. Our service is transparent, and we consider customer satisfaction as the true measure of our success.
                    </p>
                    {/* <div className="read_bt">
                      <a href="#">Read More</a>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      
    
    
  );
};

export default About;