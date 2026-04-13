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


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaShoppingBag, FaCheckCircle, FaExclamationCircle, FaStar, FaUserCircle, FaPaperPlane } from 'react-icons/fa';
// import Swal from 'sweetalert2';
// import "../css/productdetail.css";

// const ProductDetail = ({ vegData, addToCart, isLoggedIn }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
 
//   const product = vegData.find((item) => item._id === id || item.id === id);

//   const [localQty, setLocalQty] = useState(1);
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [loadingReviews, setLoadingReviews] = useState(true);

//   const fetchProductReviews = async () => {
//     if (!product) return;
//     try {
//       setLoadingReviews(true);
//       const res = await fetch(`http://localhost:5000/api/reviews/${product._id}`);
//       const data = await res.json();
//       setReviews(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Error fetching reviews:", err);
//     } finally {
//       setLoadingReviews(false);
//     }
//   };

//   useEffect(() => {
//     fetchProductReviews();
//   }, [product]);

  
//   const handleLocalQtyChange = (change) => {
//     const newQty = localQty + change;
//     if (newQty >= 1 && newQty <= product.stock) {
//       setLocalQty(newQty);
//     } else if (newQty > product.stock) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Stock Limit',
//         text: `Sorry, only ${product.stock} items are available in stock!`,
//         confirmButtonColor: '#22c55e'
//       });
//     }
//   };

 
//   const handleAddToCartAndNavigate = () => {
//     if (isLoggedIn) {
//       if (product.stock >= localQty) {
//         addToCart({ ...product, qty: localQty });
//         Swal.fire({
//           icon: 'success',
//           title: 'Added to Cart',
//           text: `${product.name} has been added successfully!`,
//           timer: 1500,
//           showConfirmButton: false
//         }).then(() => {
//           navigate('/cart');
//         });
//       }
//     } else {
//       Swal.fire({
//         icon: 'info',
//         title: 'Login Required',
//         text: 'Please log in before proceeding to add items to your cart.',
//         confirmButtonColor: '#22c55e',
//         showCancelButton: true,
//         confirmButtonText: 'Login Now'
//       }).then((result) => {
//         if (result.isConfirmed) {
//           navigate('/login');
//         }
//       });
//     }
//   };

  
//   const handleSubmitReview = async () => {
//     const userEmail = sessionStorage.getItem("userEmail")?.replace(/['"]+/g, '');
//     const userName = sessionStorage.getItem("userName") || userEmail?.split('@')[0];

//     if (!userEmail) {
//       Swal.fire("Login Required", "Please login to post a review!", "warning");
//       return;
//     }
//     if (rating === 0 || !comment.trim()) {
//       Swal.fire("Wait!", "Please provide both rating and comment.", "info");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/reviews/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           productId: product._id, 
//           userId: userEmail, 
//           userName, 
//           rating, 
//           comment 
//         })
//       });
//       const data = await res.json();
//       if (data.success) {
//         Swal.fire("Success", "Review added!", "success");
//         setRating(0); 
//         setComment("");
//         fetchProductReviews();
//       }
//     } catch (error) {
//       Swal.fire("Error", "Server not responding.", "error");
//     }
//   };

//   if (!product) return <div className="container text-center mt-5"><h3>Product not found!</h3></div>;

 
//   const avgRating = reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 0;

//   return (
//     <div className="container mt-5 mb-5 detail-container">
//       <button className="btn back-btn mb-4" onClick={() => navigate(-1)}>
//         <FaArrowLeft className="me-2" /> Back
//       </button>
      
//       <div className="row bg-white p-4 shadow-lg rounded-4 border-0">
//         {/* પ્રોડક્ટ ઈમેજ */}
//         <div className="col-lg-6 text-center">
//           <div className="image-wrapper p-3 border rounded-4 bg-light">
//             <img src={product.img} alt={product.name} className="img-fluid rounded-3" style={{maxHeight: '400px'}} />
//           </div>
//         </div>

//         <div className="col-lg-6 ps-lg-5">
//           <span className="badge bg-success text-white mb-2 px-3 py-2 rounded-pill">
//             {product.category}
//           </span>
//           <h1 className="display-5 fw-bold text-dark mb-1">{product.name}</h1>
//           <p className="text-muted h5 mb-4">{product.weight} - Fresh Organic</p>

//           <div className="price-tag mb-4">
//             <span className="h1 fw-bold text-success">₹{product.price}</span>
//             {product.oldPrice && <span className="text-decoration-line-through text-muted ms-3 h4">₹{product.oldPrice}</span>}
//           </div>

//           <div className="stock-info mb-4">
//             {product.stock > 0 ? (
//               <span className="text-success fw-bold d-flex align-items-center">
//                 <FaCheckCircle className="me-2" /> In Stock ({product.stock} items available)
//               </span>
//             ) : (
//               <span className="text-danger fw-bold d-flex align-items-center">
//                 <FaExclamationCircle className="me-2" /> Out of Stock
//               </span>
//             )}
//           </div>

         
//           {product.stock > 0 && (
//             <div className="d-flex align-items-center mb-4">
//               <span className="fw-bold me-3">Quantity:</span>
//               <div className="qty-pill d-inline-flex align-items-center border px-3 py-2 rounded-pill bg-light">
//                 <button className="btn btn-sm text-success fw-bold p-0" onClick={() => handleLocalQtyChange(-1)}>-</button>
//                 <span className="mx-4 fw-bold">{localQty}</span>
//                 <button className="btn btn-sm text-success fw-bold p-0" onClick={() => handleLocalQtyChange(1)}>+</button>
//               </div>
//             </div>
//           )}

//           <button 
//             className={`btn btn-lg w-100 py-3 fw-bold rounded-pill shadow-sm ${product.stock <= 0 ? 'btn-secondary disabled' : 'btn-success'}`}
//             onClick={handleAddToCartAndNavigate}
//             disabled={product.stock <= 0}
//           >
//             <FaShoppingBag className="me-2" /> 
//             {product.stock <= 0 ? "Unavailable" : `Add ${localQty} to Cart`}
//           </button>
//         </div>
//       </div>

//       <hr className="my-5" />

      
//       <div className="row mt-4">
//         <div className="col-md-7">
//           <h4 className="fw-bold mb-4">Customer Reviews (⭐ {avgRating})</h4>
//           {loadingReviews ? (
//             <p>Loading reviews...</p>
//           ) : reviews.length === 0 ? (
//             <p className="text-muted">No reviews yet. Be the first to review!</p>
//           ) : (
//             reviews.map((r, i) => (
//               <div key={i} className="card border-0 shadow-sm p-3 mb-3 rounded-4 bg-white">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <strong><FaUserCircle className="me-2 text-success" />{r.userName}</strong>
//                   <span className="text-warning">
//                     {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
//                   </span>
//                 </div>
//                 <p className="text-muted mt-2 mb-0">{r.comment}</p>
//               </div>
//             ))
//           )}
//         </div>

//         {/* રિવ્યુ ફોર્મ */}
//         <div className="col-md-5">
//           <div className="card p-4 shadow-sm border-0 rounded-4 bg-light">
//             <h5 className="fw-bold mb-3">Add a Review</h5>
//             <div className="mb-3">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <FaStar 
//                   key={star} 
//                   onClick={() => setRating(star)} 
//                   style={{ 
//                     cursor: 'pointer', 
//                     color: star <= rating ? '#ffc107' : '#e4e5e9', 
//                     fontSize: '25px' 
//                   }} 
//                   className="me-1" 
//                 />
//               ))}
//             </div>
//             <textarea 
//               className="form-control mb-3 rounded-3" 
//               rows="3" 
//               placeholder="Share your experience..." 
//               value={comment} 
//               onChange={(e) => setComment(e.target.value)} 
//             />
//             <button className="btn btn-success w-100 rounded-pill py-2 fw-bold" onClick={handleSubmitReview}>
//               <FaPaperPlane className="me-2" /> Submit Review
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;