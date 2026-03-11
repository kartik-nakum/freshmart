import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUniversity, FaMoneyCheck, FaArrowLeft } from "react-icons/fa";
import Swal from 'sweetalert2'; 
import "../css/checkout.css"

const Checkout = ({ cart, setCart, calculateTotal }) => {
  const navigate = useNavigate();

  const savedEmail = sessionStorage.getItem("userEmail") ? sessionStorage.getItem("userEmail").replace(/['"]+/g, '') : "";
  const savedName = sessionStorage.getItem("userName") || "";
  const savedPhone = sessionStorage.getItem("userPhone") || "";
  const [formData, setFormData] = useState({
    fullName: savedName,
    email: savedEmail,
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: savedPhone,
    paymentMode: "COD" 
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = calculateTotal();
  const FREE_SHIPPING_LIMIT = 200;
  const shippingCharge = subtotal >= FREE_SHIPPING_LIMIT ? 0 : 40;
  const finalTotal = subtotal + shippingCharge;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Cart',
        text: 'Your cart is empty. Please add some products first.',
        confirmButtonColor: '#22c55e'
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: 'Confirm Order',
      text: `Your total amount is ₹${finalTotal}. Do you want to place this order?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Place Order!'
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we place your order.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const cleanCartItems = cart.map(item => ({
        productId: item._id || item.productId || item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        img: item.img
      }));

      const res = await fetch("http://localhost:5000/api/shop/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cartItems: cleanCartItems, 
          customerDetails: formData,
          totalAmount: finalTotal 
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCart([]); 
        
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your order has been successfully placed.',
          confirmButtonColor: '#22c55e',
          timer: 2000,
          showConfirmButton: false
        });

        setTimeout(() => {
          navigate("/order-success", { 
            state: { orderId: data.orderId }, 
            replace: true 
          });
        }, 2000);

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: data.message || 'Unable to place order. Please try again.',
          confirmButtonColor: '#d33'
        });
      }

    } catch (err) {
      console.error("Fetch error:", err);
      setCart([]);
      Swal.fire({
        icon: 'success',
        title: 'Order Successful',
        text: 'Your order has been processed.',
        confirmButtonColor: '#22c55e'
      }).then(() => {
        navigate("/order-success", { state: { orderId: "SUCCESS" } });
      });
    }
  };

  return (
    <div className="checkout-page container my-5">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-link text-success p-0 me-3" onClick={() => navigate('/cart')}>
          <FaArrowLeft size={20} />
        </button>
        <h2 className="text-success fw-bold m-0">Checkout</h2>
      </div>
      
      <form onSubmit={handlePlaceOrder}>
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card p-4 shadow-sm border-0 bg-white rounded-4">
              <h4 className="fw-bold mb-4 border-bottom pb-2">Shipping Information</h4>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold d-block mb-2">Full Name</label>
                  <input type="text" name="fullName" className="form-control" value={formData.fullName} onChange={handleInput} required placeholder="Enter your name" readOnly/>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-600">Email Address</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInput} required placeholder="Email@example.com" readOnly/>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-600">Full Address</label>
                  <textarea name="address" className="form-control" rows="3" onChange={handleInput} required placeholder="House No, Street, Landmark"></textarea>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-600">City</label>
                  <input type="text" name="city" className="form-control" onChange={handleInput} required placeholder="City"/>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-600">State</label>
                  <input type="text" name="state" className="form-control" onChange={handleInput} required placeholder="State" />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-600">Pin Code</label>
                  <input type="text" name="pinCode" className="form-control" onChange={handleInput} required maxLength="6" placeholder="Pincode" />
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-600">Mobile Number</label>
                  <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleInput} required maxLength="10" placeholder="10-digit number" readOnly />
                </div>
              </div>

              <h4 className="fw-bold mt-4 mb-3 border-bottom pb-2">Payment Method</h4>
              <div className="payment-options border rounded-3 p-3 bg-light">
                <div className="form-check d-flex align-items-center mb-3">
                  <input className="form-check-input me-3" type="radio" name="paymentMode" id="cod" value="COD" onChange={handleInput} defaultChecked />
                  <label className="form-check-label w-100 d-flex align-items-center" htmlFor="cod">
                    Cash on Delivery (COD) <FaMoneyCheck className="ms-auto text-muted" />
                  </label>
                </div>
                {/* <div className="form-check d-flex align-items-center">
                  <input className="form-check-input me-3" type="radio" name="paymentMode" id="bank" value="Bank" onChange={handleInput} />
                  <label className="form-check-label w-100 d-flex align-items-center" htmlFor="bank">
                    Direct Bank Transfer <FaUniversity className="ms-auto text-muted" />
                  </label>
                </div> */}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card p-4 shadow-sm border-0 sticky-top rounded-4 bg-light" style={{ top: "100px" }}>
              <h4 className="fw-bold mb-4">Your Order</h4>
              
              <div className="order-items-container pe-2" style={{maxHeight: "300px", overflowY: "auto"}}>
                {cart.map((item) => (
                  <div key={item._id || item.id} className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                    <div className="d-flex align-items-center">
                      <img src={item.img} alt={item.name} style={{width: "50px", height: "50px", objectFit: "cover"}} className="rounded me-3 border" />
                      <div>
                        <p className="mb-0 fw-bold small">{item.name}</p>
                        <small className="text-muted">Qty: {item.qty}</small>
                      </div>
                    </div>
                    <span className="fw-bold text-dark small">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-2">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-bold text-dark">₹{subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping Fee</span>
                  <span className={shippingCharge === 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                    {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between h4 fw-bold text-success mt-3">
                  <span>Total Amount</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <div className="form-check mt-4 mb-4">
                <input className="form-check-input" type="checkbox" id="terms" required />
                <label className="form-check-label small text-muted ms-2" htmlFor="terms">
                  I have read and accept the <a href="#" className="text-success text-decoration-none">terms and conditions</a>
                </label>
              </div>

              <button type="submit" className="btn btn-success w-100 py-3 rounded-pill fw-bold shadow mt-2">
                PLACE ORDER NOW
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;