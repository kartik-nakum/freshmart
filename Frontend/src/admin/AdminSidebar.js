import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLeaf, FaSignOutAlt, FaTachometerAlt, FaBox, FaTruck, FaThList, FaUsers } from "react-icons/fa";
import Swal from 'sweetalert2';
import "../css/admin/adminsidebar.css"

const AdminSidebar = ({ setIsAdmin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: "Are you sure you want to end your admin session?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear sessions
        sessionStorage.removeItem("isAdmin");
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("userEmail");
        
        if (setIsAdmin) setIsAdmin(false);

        // Success Feedback
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been logged out successfully.',
          timer: 1500,
          showConfirmButton: false
        });

        setTimeout(() => {
          navigate("/admin/alogin");
        }, 1500);
      }
    });
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Products", path: "/admin/products", icon: <FaBox /> },
    { name: "Orders", path: "/admin/orders", icon: <FaTruck /> },
    { name: "Categories", path: "/admin/categories", icon: <FaThList /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
  ];

  return (
    <div className="admin-sidebar shadow">
      <div className="sidebar-header p-4 d-flex align-items-center">
        <span className="logo-icon bg-success text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
          <FaLeaf />
        </span>
        <h3 className="fw-bold text-success m-0">FreshMart</h3>
      </div>

      <ul className="list-unstyled p-2">
        {menuItems.map((item, index) => (
          <li key={index} className="mb-2">
            <Link
              to={item.path}
              className={`nav-link p-3 rounded-pill d-flex align-items-center ${location.pathname === item.path ? "active-admin-link" : ""}`}
            >
              <span className="me-3">{item.icon}</span>
              {item.name}
            </Link>
          </li>
        ))}

        <li className="mt-4">
          <button
            onClick={handleLogout}
            className="nav-link p-3 rounded-pill d-flex align-items-center text-danger border-0 bg-transparent w-100 logout-btn-hover"
          >
            <FaSignOutAlt className="me-3" />
            Logout
          </button>
        </li>
      </ul>

      <div className="sidebar-footer p-4 mt-auto">
        <Link to="/shop" className="btn btn-outline-success w-100 rounded-pill">
          Go to Shop
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;