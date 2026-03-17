import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2'; 
import "../css/admin/adminorders.css";
import { FaSearch } from "react-icons/fa"; 

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://freshmart-25n5.onrender.com/api/shop/all-orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Fetch error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Fetch Error',
        text: 'Failed to load orders from server.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const updateStatus = async (mongoId, newStatus) => {
    try {
      const res = await fetch(`https://freshmart-25n5.onrender.com/api/shop/update-status/${mongoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Order status changed to ${newStatus}`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        fetchAllOrders(); 
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

    const filteredOrders = orders.filter((order) => {
    const name = order.customerDetails?.fullName?.toLowerCase() || "";
    const email = order.customerDetails?.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  if (loading) {
    return (
      <div className="container text-center mt-5 py-5">
        <div className="spinner-border text-success" role="status"></div>
        <h4 className="mt-3 text-muted">Loading Customer Orders...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h2 className="text-success fw-bold m-0">Customer Order Management</h2>

        <div className="position-relative" style={{ width: "300px" }}>
          <input 
            type="text" 
            className="form-control ps-5 rounded-pill shadow-sm" 
            placeholder="Search by Name or Email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
        </div>
      </div>

      <div className="table-responsive shadow rounded bg-white">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>Customer Name & Email</th> 
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th className="text-center">Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <div className="fw-bold">{order.customerDetails?.fullName}</div>
                    <div className="small text-muted">{order.customerDetails?.email}</div>
                  </td>
                  <td>
                     {order.items.map((item, i) => (
                        <div key={i} className="small">• {item.name} (x{item.qty})</div>
                     ))}
                  </td>
                  <td className="fw-bold text-success">₹{order.totalAmount}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                  <td className="text-center">
                    <span className={`badge rounded-pill px-3 ${
                                order.status === "Delivered" ? "bg-success" : 
                                order.status === "Cancelled" ? "bg-danger" : 
                                order.status === "Success" ? "bg-secondary" : 
                                order.status === "Shipped" ? "bg-primary" :
                                order.status === "Processing" ? "bg-info" :
                                 "bg-warning text-light"}`}>
                              {order.status}
                      </span>
                  </td>
                  <td>
                    <select className="form-select form-select-sm" value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
                      <option value="Success">Success</option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">No orders found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;