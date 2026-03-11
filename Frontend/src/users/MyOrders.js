import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaSync, FaTruck, FaCheckCircle } from "react-icons/fa";
import Swal from 'sweetalert2'; 
import "../css/myorders.css";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(""); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyOrders = async () => {
            const userSession = sessionStorage.getItem("userEmail");
            if (!userSession) {
                setError("Please log in to view your orders.");
                setLoading(false);
                return;
            }
            const currentUser = userSession.replace(/['"]+/g, '');
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:5000/api/shop/my-orders/${encodeURIComponent(currentUser)}`);
                const data = await res.json();
                if (res.ok) {
                    setOrders(data); 
                    setError(""); 
                } else {
                    setError(data.message || "Failed to load orders.");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Unable to connect to the server.");
            } finally {
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    const handleCancelOrder = async (mongoId) => {
        Swal.fire({
            title: 'Cancel Order?',
            text: "Are you sure you want to cancel this order?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:5000/api/shop/update-status/${mongoId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "Cancelled" }),
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                        Swal.fire('Cancelled!', 'Your order has been cancelled successfully.', 'success');
                        setOrders(prev => prev.map(o => o._id === mongoId ? { ...o, status: "Cancelled" } : o));
                    } else {
                        Swal.fire('Error', data.message || "Could not update status", 'error');
                    }
                } catch (err) {
                    console.error("Cancel error:", err);
                    Swal.fire('Error', 'Server error!');
                }
            }
        });
    };

    const renderTrackingBar = (status) => {
        const steps = [
            { label: "Pending", icon: <FaBoxOpen /> },
            { label: "Processing", icon: <FaSync /> },
            { label: "Shipped", icon: <FaTruck /> },
            { label: "Delivered", icon: <FaCheckCircle /> }
        ];
        
        const statusLabels = steps.map(s => s.label);
        const currentStepIndex = statusLabels.indexOf(status);
        
        if (status === "Cancelled") {
            return <div className="alert alert-danger py-2 text-center mt-3 fw-bold">Order Cancelled</div>;
        }

        const progressWidth = (currentStepIndex / (steps.length - 1)) * 100;

        return (
            <div className="mt-2 mb-5 px-3">
                <div className="d-flex justify-content-center">
                    <span className="badge bg-light text-dark border mb-4 px-3 py-2 text-uppercase letter-spacing-1 shadow-sm" style={{fontSize: '11px', borderRadius: '5px', fontWeight: '600'}}>ORDER PROGRESS</span>
                </div>
                <div className="tracking-container">
                    <div className="tracking-line">
                        <div className="tracking-line-progress" style={{ width: `${progressWidth}%` }}></div>
                    </div>
                    {steps.map((step, index) => (
                        <div key={index} className={`tracking-step ${index <= currentStepIndex ? "active" : ""}`}>
                            <div className="step-dot">{step.icon}</div>
                            <div className="step-label mt-2">{step.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="container my-5">
            <h2 className="text-success mb-4 fw-bold border-bottom pb-2">My Orders History</h2>
            {orders.length === 0 ? (
                <div className="text-center p-5 border rounded bg-light shadow-sm">
                    <h4 className="text-muted">You haven't placed any orders yet!</h4>
                    <button onClick={() => navigate("/shop")} className="btn btn-success rounded-pill px-4 mt-3">Start Shopping</button>
                </div>
            ) : (
                <div className="row">
                    {orders.map((order) => (
                        <div className="col-md-12 mb-5" key={order._id}>
                            <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
                                <div className="card-header bg-success text-white d-flex justify-content-between align-items-center py-3">
                                    <div>
                                        <span className="fw-bold">Order ID: #{order.orderId}</span> 
                                        <span className="ms-3 badge bg-white text-success border-0 px-3">{order.status}</span>
                                    </div>
                                    <span className="small opacity-75 fw-bold">{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                                </div>
                                
                                <div className="card-body bg-white pt-5">
                                    <div className="row mb-5">
                                        <div className="col-12">
                                            {renderTrackingBar(order.status)}
                                        </div>
                                    </div>
                                    <div className="row px-3">
                                        <div className="col-md-8">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="d-flex align-items-center mb-4">
                                                    <img 
                                                        src={item.img || "https://via.placeholder.com/60"} 
                                                        alt={item.name} 
                                                        style={{ width: "75px", height: "75px", objectFit: "cover", borderRadius: "10px" }} 
                                                        className="me-4 border shadow-sm" 
                                                    />
                                                    <div>
                                                        <h5 className="text-dark fw-bold mb-1">{item.name}</h5>
                                                        <p className="text-muted mb-0">₹{item.price} x {item.qty} = <span className="text-success fw-bold">₹{item.price * item.qty}</span></p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="card-footer bg-white border-top py-3 mt-3 d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="badge bg-light text-dark p-2 border">Total Amount: <span className="h5 fw-bold ms-1">₹{order.totalAmount}</span></span>
                                        </div>
                                        <div>
                                            {(order.status === "Pending" || order.status === "Processing"|| order.status === "Shipped")&&(
                                                <button className="btn btn-danger btn-sm rounded-pill px-4 shadow-sm me-2" onClick={() => handleCancelOrder(order._id)}>Cancel Order</button>
                                            )}
                                             <button className="btn btn-success btn-sm rounded-pill px-4 shadow-sm" onClick={() => navigate('/shop')}>Buy Again</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;