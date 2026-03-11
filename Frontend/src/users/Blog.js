import React from 'react'
import "../css/blog.css"
import blogImg from "../images/img-3.png"

const Blog = () => {
  return (
    
    <div className="blog_section layout_padding">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h1 className="blog_taital">Our Blog</h1>
            <p className="blog_text">
              Passages of Lorem Ipsum available, but the majority have suffered alteration
            </p>
          </div>
        </div>
        <div className="blog_section_2">
          <div className="row d-flex align-items-center">
            <div className="col-md-6">
              <div className="blog_content_box">
                <h2 className="blog_taital_1">Our Blog</h2>
                <p className="ipsum_text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                  enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                  in reprehenderit in voluptate velit esse cillum dolore.
                </p>
                <div className="readmore_bt">
                  <a href="#">Read More</a>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="blog_img_box">
                <img src={blogImg} alt="Blog Content" className="styled_blog_img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog