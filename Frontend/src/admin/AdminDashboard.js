import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import "../css/admin/admindashbord.css"
import { FaShoppingCart, FaUsers, FaBoxOpen, FaRupeeSign, FaArrowRight } from "react-icons/fa";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Swal from 'sweetalert2'; 

const AdminDashboard = ({ vegData, categories }) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  });
  
  const [allOrders, setAllOrders] = useState([]); 
  const [recentOrders, setRecentOrders] = useState([]); 
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const ordersRes = await fetch("http://localhost:5000/api/shop/all-orders");
      const usersRes = await fetch("http://localhost:5000/api/all-users");
      
      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();

      if (ordersRes.ok && usersRes.ok) {
        const sales = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        setAllOrders(ordersData);
        setRecentOrders(ordersData.slice(0, 5)); 

        setStats({
          totalSales: sales,
          totalOrders: ordersData.length,
          totalUsers: usersData.length,
          totalProducts: vegData.length
        });
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [vegData]);

  const processData = () => {
    if (!allOrders || allOrders.length === 0) return [];

    const monthlySales = {};
    allOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString('default', { month: 'short' }); 
      monthlySales[month] = (monthlySales[month] || 0) + (order.totalAmount || 0);
    });

    return Object.keys(monthlySales).map(month => ({
      name: month,
      sales: monthlySales[month]
    }));
  };

  const chartData = processData();

  if (loading) {
    return (
      <div className="container text-center mt-5 py-5">
        <div className="spinner-border text-success" role="status"></div>
        <h4 className="mt-3 text-muted">Loading Dashboard Analytics...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h2 className="text-success fw-bold m-0">Admin Dashboard</h2>
        <span className="text-muted small">
          Today: {new Date().toLocaleDateString()}
        </span>
      </div>
      
      <div className="row g-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 stat-card bg-success text-white p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div><h6>Total Earnings</h6><h3>₹{stats.totalSales}</h3></div>
              <FaRupeeSign size={35} className="opacity-25" />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 stat-card bg-primary text-white p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div><h6>Total Orders</h6><h3>{stats.totalOrders}</h3></div>
              <FaShoppingCart size={35} className="opacity-25" />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 stat-card bg-info text-white p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div><h6>Users</h6><h3>{stats.totalUsers}</h3></div>
              <FaUsers size={35} className="opacity-25" />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 stat-card bg-warning text-white p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div><h6>Inventory</h6><h3>{stats.totalProducts}</h3></div>
              <FaBoxOpen size={35} className="opacity-25" />
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-8">
          {/* Recent Activity Table */}
          {/* <div className="card shadow-sm border-0 p-4 mb-4 bg-white rounded-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0 text-dark">Recent Activity</h5>
              <Link to="/admin/orders" className="text-success text-decoration-none small fw-bold">
                View All <FaArrowRight />
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order, i) => (
                      <tr key={i}>
                        <td className="fw-bold">#{order.orderId}</td>
                        <td>{order.customerDetails?.fullName}</td>
                        <td className="text-success fw-bold">₹{order.totalAmount}</td>
                        <td>
                          <span className={`badge rounded-pill px-3 ${
                              order.status === "Delivered" ? "bg-success" : 
                              order.status === "Cancelled" ? "bg-danger" : 
                              order.status === "Shipped" ? "bg-primary" : "bg-warning text-light"}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="text-center p-4">No recent orders found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div> */}

          {/* Monthly Sales Chart */}
          <div className="card shadow-sm border-0 p-4 bg-white rounded-3">
            <h5 className="fw-bold mb-4 text-success">Monthly Sales Report (₹)</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#82b440" fill="#82b440" fillOpacity={0.2} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stock Breakdown */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 bg-white rounded-3">
            <h5 className="fw-bold mb-4">Stock Breakdown</h5>
            {categories.map((cat, i) => {
              const categoryName = typeof cat === 'object' ? cat.name : cat;
              const count = vegData.filter(item => item.category === categoryName).length;
              const percentage = stats.totalProducts > 0 ? (count / stats.totalProducts) * 100 : 0;
              return (
                <div key={i} className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="small fw-bold text-secondary">{categoryName}</span>
                    <span className="badge bg-light text-dark border">{count} Items</span>
                  </div>
                  <div className="progress" style={{height: "8px"}}>
                    <div className="progress-bar bg-success" style={{width: `${percentage}%`}}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;