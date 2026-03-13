import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import "../css/categories.css"; 
import { FaTrash, FaShoppingBag, FaArrowLeft } from "react-icons/fa";

const WishlistPage = ({ wishlist = [], toggleWishlist, addToCart }) => {
    const navigate = useNavigate();

  
    const handleAddToCart = (item) => {
        if (item.stock > 0) {
            addToCart({ ...item, qty: 1 });
            Swal.fire({
                icon: 'success',
                title: 'Added to Cart',
                text: `${item.name} has been added to your shopping bag!`,
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Out of Stock',
                text: 'Sorry, this fresh item is currently unavailable.',
                confirmButtonColor: '#22c55e'
            });
        }
    };

    return (
        <div className="vagetables_section layout_padding">
            <div className="container">
               
                <div className="row align-items-center mb-4">
                    <div className="col-12 text-center">
                        <h1 className="vagetables_taital text-success fw-bold border-bottom pb-2">My Wishlist</h1>
                        <p className="vagetables_text text-muted mb-4">
                            Items you saved to buy later. Freshness guaranteed!
                        </p>
                    </div>
                </div>

                <div className="row mt-4">
                    {wishlist && wishlist.length > 0 ? (
                        wishlist.map((item) => (
                            <div className="col-lg-3 col-md-6 mb-4" key={item._id}>
                                <div className="veg_box shadow-sm border rounded p-3 h-100 bg-white position-relative">
                                    
                                    
                                    <div 
                                        className="wishlist-icon text-danger" 
                                        onClick={() => toggleWishlist(item)}
                                        style={{ 
                                            position: 'absolute', 
                                            top: '15px', 
                                            right: '15px', 
                                            zIndex: '10', 
                                            cursor: 'pointer', 
                                            fontSize: '22px' 
                                        }}
                                        title="Remove from Wishlist"
                                    >
                                        <FaTrash />
                                    </div>

                                    {item.stock <= 0 && (
                                        <div className="sold-out-tag" style={{
                                            position:'absolute', top:'10px', left:'10px', 
                                            background:'#000', color:'#fff', padding:'2px 8px', 
                                            fontSize:'12px', zIndex:'1'
                                        }}>Sold Out</div>
                                    )}

                                    
                                    <div className="hover01 column overflow-hidden rounded mb-3">
                                        <figure className="m-0" onClick={() => navigate(`/product/${item._id}`)} style={{ cursor: 'pointer' }}>
                                            <img 
                                                src={item.img} 
                                                alt={item.name} 
                                                className="img-fluid" 
                                                style={{ 
                                                    height: '180px', 
                                                    objectFit: 'cover', 
                                                    width: '100%', 
                                                    filter: item.stock <= 0 ? 'grayscale(100%)' : 'none',
                                                    opacity: item.stock === 0 ? 0.5 : 1 
                                                }} 
                                            />
                                        </figure>
                                    </div>

                                    <h5 className="fw-bold text-dark">{item.name}</h5>
                                    
                                    <div className="price-section mb-4">
                                        <span className="rate_text h5 fw-bold text-success">
                                            ₹{item.price} <span className="text-muted fw-normal" style={{ fontSize: '14px' }}>/ {item.weight}</span>
                                        </span>
                                    </div>

                                    <button
                                        className={`btn ${item.stock > 0 ? 'btn-success' : 'btn-secondary'} rounded-pill w-100 py-2 fw-bold shadow-sm`}
                                        onClick={() => handleAddToCart(item)}
                                        disabled={item.stock <= 0}
                                    >
                                        <FaShoppingBag className="me-2" /> {item.stock > 0 ? "Move to Cart" : "Unavailable"}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                       
                        <div className="col-12 text-center py-5 mt-5">
                            {/* <FaExclamationCircle size={60} className="text-muted mb-3" /> */}
                            <h2 className="text-muted">Your wishlist is currently empty!</h2>
                            <p className="text-muted mb-4">Explore our products and save your favorites here.</p>
                            <Link to="/shop" className="btn btn-success rounded-pill px-5 py-2 fw-bold shadow-sm">
                                <FaArrowLeft className="me-2" /> Back to Shop
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;