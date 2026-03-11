import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingBasket, FaArrowLeft } from "react-icons/fa"; 
import Swal from 'sweetalert2'; 
import "../css/cartpage.css"

const CartPage = ({ cart, setCart, vegData, setVegData }) => {

  const navigate = useNavigate();
  const [discount, setDiscount] = useState(0); 
  const FREE_SHIPPING_LIMIT = 200;

  const userSession = sessionStorage.getItem("userEmail");
  const userId = userSession ? userSession.replace(/['"]+/g, '') : "guest_user"; 

  const syncWithBackend = async (updatedCart) => {
    if (userId === "guest_user") return;
    try {
      await fetch("http://localhost:5000/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, items: updatedCart }),
      });
    } catch (err) {
      console.log("Sync error:", err);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (userId === "guest_user") return;
      try {
        const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setCart(data);
        }
      } catch (err) {
        console.log("Cart fetch error:", err);
      }
    };
    fetchCart();
  }, [userId, setCart]);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  const subtotal = calculateSubtotal();
  const amountToFree = FREE_SHIPPING_LIMIT - subtotal; 

  const updateCartQuantity = (id, change) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item._id === id || item.id === id) {
          const newQty = item.qty + change;

          if (change > 0 && newQty > item.stock) {
            Swal.fire({
              icon: 'warning',
              title: 'Stock Limit',
              text: `Sorry, only ${item.stock} items are available in stock.`,
              confirmButtonColor: '#22c55e'
            });
            return item;
          }
          
          if (newQty < 1) return item;
          return { ...item, qty: newQty };
        }
        return item;
      });
      syncWithBackend(updated); 
      return updated;
    });
  };

  const removeItem = (id) => {
    Swal.fire({
      title: 'Remove Item?',
      text: "Are you sure you want to remove this product from your cart?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cart.filter(item => (item._id !== id && item.id !== id));
        setCart(updatedCart);
        syncWithBackend(updatedCart);
        
        Swal.fire({
          title: 'Removed!',
          text: 'Item has been removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const clearCart = async () => {
    Swal.fire({
      title: 'Clear Cart?',
      text: "This will remove all items from your cart. Do you want to proceed?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear all!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setCart([]);
        setDiscount(0);
        await syncWithBackend([]);
        
        Swal.fire({
          title: 'Cart Cleared',
          text: 'Your cart is now empty.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleProceedToCheckout = async () => {
    await syncWithBackend(cart); 
    navigate("/checkout");
  };

  const shippingCharge = subtotal >= FREE_SHIPPING_LIMIT ? 0 : 40;
  const totalAmount = subtotal - discount + shippingCharge;

  return (
    <div className="container mt-5 mb-5">
      
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success fw-bold m-0"><FaShoppingBasket className="me-2"/>My Cart</h2>
        {cart.length > 0 && (
          <button className="btn bg-danger text-light btn-sm rounded-pill px-3" onClick={clearCart}>
            <FaTrash className="me-1"/> Clear Cart
          </button>
        )}
      </div>
     
      {cart.length > 0 && (
        <div className="text-center p-3 mb-4 rounded-3 shadow-sm border" 
             style={{ backgroundColor: subtotal >= FREE_SHIPPING_LIMIT ? '#e8f5e9' : '#fff3e0', borderColor: subtotal >= FREE_SHIPPING_LIMIT ? '#c8e6c9' : '#ffe0b2' }}>
          
          {subtotal >= FREE_SHIPPING_LIMIT ? (
            <h2 className="text-success fw-bold m-0">
              🎉 Congratulations! You got FREE Shipping.
            </h2>
          ) : (
            <div>
              <h4 className="text-dark m-0">
                Add <span className="text-danger fw-bold">₹{amountToFree}</span> more to get <b>FREE Shipping!</b>
              </h4>
              <p className="text-muted mb-0 small">Free shipping on orders above ₹200</p>
              
              {/* <div className="progress mt-2" style={{ height: '10px' }}>
                <div 
                  className="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                  role="progressbar"
                  style={{ width: `${(subtotal / FREE_SHIPPING_LIMIT) * 100}%` }}
                ></div>
              </div> */}
            </div>
          )}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-5 shadow-sm rounded bg-white border">
          <p className="h4 text-muted mb-4">Your cart is currently empty.</p>
          <Link to="/shop" className="btn btn-success rounded-pill px-5 py-2 fw-bold shadow-sm">
            <FaArrowLeft className="me-2"/> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="table-responsive shadow-sm rounded border bg-white overflow-hidden mb-4">
              <table className="table align-middle mb-0">
                <thead className="table-dark text-center border-bottom">
                  <tr>
                    <th className="text-start ps-4 py-3">Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id || item.id} className="text-center cart-row">
                      <td className="text-start ps-4 py-3">
                        <div className="d-flex align-items-center">
                          <img src={item.img} alt={item.name} className="rounded border me-3 shadow-sm" style={{width: "70px", height: "70px", objectFit: "cover"}}/>
                          <div>
                            <span className="fw-bold d-block text-dark">{item.name}</span>
                            <small className="text-muted">{item.weight}</small>
                          </div>
                        </div>
                      </td>
                      <td className="fw-500">₹{item.price}</td>
                      <td>
                        <div className="qty-pill d-inline-flex align-items-center border px-3 py-1">
                          <button className="qty-btn" onClick={() => updateCartQuantity(item._id || item.id, -1)}>-</button>
                          <span className="mx-3 fw-bold qty-val">{item.qty}</span>
                          <button 
                            className="qty-btn" 
                            onClick={() => updateCartQuantity(item._id || item.id, 1)}
                            disabled={item.qty >= item.stock}
                            style={{ opacity: item.qty >= item.stock ? 0.3 : 1 }}
                          >+</button>
                        </div>
                      </td>
                      <td className="fw-bold text-success">₹{item.price * item.qty}</td>
                      <td>
                        <button className="btn btn-link text-danger p-0 delete-icon" onClick={() => removeItem(item._id || item.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Link to="/shop" className="text-success text-decoration-none fw-bold hover-link">
                <FaArrowLeft className="me-2"/> Continue Shopping
              </Link>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card summary-card border-0 shadow-lg p-4 sticky-top" style={{top: "100px"}}>
              <h4 className="fw-bold border-bottom pb-3 mb-4 text-center">Order Summary</h4>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Subtotal</span>
                <span className="fw-bold">₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                <span className="text-muted">Shipping Fee</span>
                <span className={shippingCharge === 0 ? "text-success fw-bold" : " text-danger fw-bold"}>
                  {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                </span>
              </div>
              <div className="d-flex justify-content-between h3 fw-bold text-dark mt-2">
                <span>Total</span>
                <span className="text-success">₹{totalAmount.toFixed(2)}</span>
              </div>
              <button onClick={handleProceedToCheckout} className="btn btn-success w-100 mt-4 py-3 fw-bold rounded-pill proceed-btn shadow">
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;