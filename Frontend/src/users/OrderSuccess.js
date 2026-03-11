import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaTruck } from 'react-icons/fa';
import Swal from 'sweetalert2'; 
import "../css/ordersuccess.css";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const latestOrderId = location.state?.orderId || "Success";

    useEffect(() => {
       
        Swal.fire({
            icon: 'success',
            title: 'Order Confirmed!',
            text: 'Your order has been placed successfully.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    }, []);

    return (
        <div className="container text-center py-5 mt-5 order-success-page">
            <div className="card shadow-lg p-5 border-0 rounded-4 mx-auto success-card" style={{maxWidth: '600px'}}>
                <div className="mb-4">
                    <FaCheckCircle size={80} className="text-success animate-bounce" />
                </div>
                <h1 className="fw-bold text-dark mb-2">Order Placed Successfully!</h1>
                
                <div className="order-id-badge mb-4">
                    <span className="text-muted">Order ID: </span>
                    <span className="fw-bold text-success">#{latestOrderId}</span>
                </div>

                <p className="text-muted mb-4">
                    Thank you for your purchase! Your order has been received and is currently being processed. You will receive an update once it's on its way.
                </p>
                
                <div className="d-flex flex-column gap-3">
                    <button className="btn btn-success btn-lg rounded-pill py-3 fw-bold shadow-sm" onClick={() => navigate('/myOrders')}>
                         <FaTruck className="me-2" /> View My Orders
                    </button>
                    <button className="btn btn-outline-secondary btn-lg rounded-pill py-3" onClick={() => navigate('/shop')}>
                         <FaShoppingBag className="me-2" /> Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;

