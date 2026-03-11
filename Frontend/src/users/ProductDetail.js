import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingBag, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import "../css/productdetail.css"

const ProductDetail = ({ vegData, addToCart, isLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = vegData.find((item) => item._id === id || item.id === id);
  const [localQty, setLocalQty] = useState(1);

  if (!product) {
    return (
      <div className="container text-center mt-5 py-5">
        <h3 className="text-muted">Product not found!</h3>
        <button className="btn btn-success mt-3" onClick={() => navigate('/shop')}>Back to Shop</button>
      </div>
    );
  }

  const handleLocalQtyChange = (change) => {
    const newQty = localQty + change;
    if (newQty >= 1 && newQty <= product.stock) {
      setLocalQty(newQty);
    } else if (newQty > product.stock) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock Limit',
        text: `Sorry, only ${product.stock} items are available in stock!`,
        confirmButtonColor: '#22c55e'
      });
    }
  };

  const handleAddToCartAndNavigate = () => {
    if (isLoggedIn) {
      if (product.stock >= localQty) {
        addToCart({ ...product, qty: localQty });
        Swal.fire({
          icon: 'success',
          title: 'Added to Cart',
          text: `${product.name} has been added successfully!`,
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate('/cart');
        });
      }
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please log in before proceeding to add items to your cart.',
        confirmButtonColor: '#22c55e',
        showCancelButton: true,
        confirmButtonText: 'Login Now'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    }
  };

  return (
    <div className="container mt-5 mb-5 detail-container">
      <button className="btn back-btn mb-4" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" /> Back to Products
      </button>
      
      <div className="row bg-white p-4 shadow-lg rounded-4 border-0">
        <div className="col-lg-6 text-center mb-4 mb-lg-0">
          <div className="image-wrapper p-3 border rounded-4 bg-light">
            <img src={product.img} alt={product.name} className="img-fluid rounded-3 main-product-img" style={{maxHeight: '400px'}} />
          </div>
        </div>

        <div className="col-lg-6 ps-lg-5">
          <span className="badge bg-success text-white mb-2 px-3 py-2 rounded-pill">
            {product.category}
          </span>
          <h1 className="display-5 fw-bold text-dark mb-1">{product.name}</h1>
          <p className="text-muted h5 mb-4">{product.weight} - Fresh Organic</p>

          <div className="price-tag mb-4">
            <span className="h1 fw-bold text-success">₹{product.price}</span>
            {product.oldPrice && <span className="text-decoration-line-through text-muted ms-3 h4">₹{product.oldPrice}</span>}
          </div>

          <div className="stock-info mb-4">
            {product.stock > 0 ? (
              <span className="text-success fw-bold d-flex align-items-center">
                <FaCheckCircle className="me-2" /> In Stock ({product.stock} items available)
              </span>
            ) : (
              <span className="text-danger fw-bold d-flex align-items-center">
                <FaExclamationCircle className="me-2" /> Out of Stock
              </span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="d-flex align-items-center mb-4">
              <span className="fw-bold me-3">Quantity:</span>
              <div className="qty-pill d-inline-flex align-items-center border px-3 py-2 rounded-pill bg-light">
                <button className="btn btn-sm text-success fw-bold p-0" onClick={() => handleLocalQtyChange(-1)}>-</button>
                <span className="mx-4 fw-bold">{localQty}</span>
                <button className="btn btn-sm text-success fw-bold p-0" onClick={() => handleLocalQtyChange(1)}>+</button>
              </div>
            </div>
          )}

          <button 
            className={`btn btn-lg w-100 py-3 fw-bold rounded-pill shadow-sm ${product.stock <= 0 ? 'btn-secondary disabled' : 'btn-success'}`}
            onClick={handleAddToCartAndNavigate}
            disabled={product.stock <= 0}
          >
            <FaShoppingBag className="me-2" /> 
            {product.stock <= 0 ? "Unavailable" : `Add ${localQty} to Cart`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;