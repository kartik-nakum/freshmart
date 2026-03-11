import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingBasket, FaSearch, FaUser, FaSignOutAlt, FaKey, FaUserPlus, FaLeaf,FaHeart } from 'react-icons/fa';
import "./Navbar.css";

const Navbar = ({ searchTerm, setSearchTerm, cartCount, isLoggedIn, setIsLoggedIn ,wishlist = []}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      navigate("/shop");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3">
      <div className="container">
        {/* logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="logo-icon bg-success text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>
            <FaLeaf />
          </span>
          <h3 className="fw-bold text-success m-0">FreshMart</h3>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
         
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-bold text-uppercase">
            <li className="nav-item"><Link className="nav-link mx-2" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link mx-2" to="/shop">Shop</Link></li>
            <li className="nav-item"><Link className="nav-link mx-2" to="/categories">Categories</Link></li>
            <li className="nav-item"><Link className="nav-link mx-2" to="/about">About</Link></li>
            <li className="nav-item"><Link className="nav-link mx-2" to="/contact">Contact</Link></li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <div className="search-box d-none d-lg-flex align-items-center bg-light rounded-pill px-3 py-1">
              <FaSearch className="text-muted me-2" />
              <input 
                type="text" 
                className="form-control border-0 bg-transparent shadow-none" 
                placeholder="Search vegetables..." 
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <Link to="/cart" className="position-relative text-dark mx-2">
              <FaShoppingBasket size={22} className="text-success" />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger qty-badge">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/wishlist" className="position-relative text-dark mx-2">
               <FaHeart size={22} className="text-danger" />
                {wishlist.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '10px'}}>
                    {wishlist.length}
                  </span>
                )}
            </Link>

            <div className="position-relative">
              <div 
                className="user-icon-btn text-success" 
                style={{cursor: 'pointer'}} 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FaUser size={22} />
              </div>

              {showDropdown && (
                <ul className="dropdown-menu show position-absolute end-0 shadow border-0 mt-3 rounded-3 py-2" style={{minWidth: '150px'}}>
                  {isLoggedIn ? (
                    <>
                      <li><Link className="dropdown-item py-2" to="/myOrders" onClick={() => setShowDropdown(false)}>
                           <FaShoppingBasket className="me-2 text-success" /> My Orders</Link>
                      </li>
                      
                      <li>
                        <button className="dropdown-item py-2 text-danger fw-bold" onClick={handleLogout}>
                          <FaSignOutAlt className="me-2" /> Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                   
                      <li>
                        <Link className="dropdown-item py-2" to="/login" onClick={() => setShowDropdown(false)}>
                          <FaKey className="me-2 text-success" /> Login
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/register" onClick={() => setShowDropdown(false)}>
                          <FaUserPlus className="me-2 text-success" /> Register
                        </Link>
                      </li>

                      <li>
                        <Link className="dropdown-item py-2" to="/myOrders" onClick={() => setShowDropdown(false)}>
                              <FaShoppingBasket className="me-2 text-success" /> My Orders
                        </Link>
                      </li>
                      
                    </>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;