import React, { useState ,useEffect} from 'react';
import { useNavigate,useLocation } from "react-router-dom";
import Swal from 'sweetalert2'; 
import "../css/categories.css"
import {  FaExclamationCircle, FaHeart, FaRegHeart } from "react-icons/fa"; 

const Shop = ({ vegData, setVegData, addToCart, isLoggedIn, categories, searchTerm, cart, wishlist = [], toggleWishlist }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  const handleAddToCart = (item) => {
  if (isLoggedIn) {
    
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    const currentCartQty = existingItem ? existingItem.qty : 0;

    if (currentCartQty + item.qty > item.stock) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock Limit Reached',
        text: `You already have ${currentCartQty} items in your cart. You can only add ${item.stock - currentCartQty} more.`,
        confirmButtonColor: '#22c55e'
      });
      return;
    }

    addToCart(item);
    navigate("/cart");
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
        navigate("/login");
      }
    });
  }
};


  const updateQuantity = (id, change) => {
  const updatedData = vegData.map((item) => {
 
    if (item._id === id) { 
      const newQty = item.qty + change;
      if (change > 0 && newQty > item.stock) {
        Swal.fire({
          icon: 'error',
          title: 'Out of Stock',
          text: `Sorry, only ${item.stock} items available!`,
          timer: 2000,
          showConfirmButton: false
        });
        return item; 
      }
      if (newQty < 1) return item;
      return { ...item, qty: newQty };
    }
    return item;
  });
  setVegData(updatedData);
};

  let filteredProducts = vegData.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm?.toLowerCase() || "");
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await fetch("https://freshmart-25n5.onrender.com/api/products");
            const data = await response.json();
            setVegData(data); 
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    fetchProducts();
}, [setVegData]);

 const location = useLocation();

useEffect(() => {
  
  if (location.state && location.state.selectedCategory) {
    setSelectedCategory(location.state.selectedCategory);
    
    window.history.replaceState({}, document.title);
  }
}, [location.state]);

  return (
    <div className="vagetables_section layout_padding">
      <div className="container">
        <div className="row align-items-center">
         <div className="row">
          <div className="col-12 text-center"> 
                 <h1 className="vagetables_taital text-success mb-4 fw-bold border-bottom pb-2">Our Fresh Products</h1>
            <p className="vagetables_text text-muted mb-5">
                Healthy and organic vegetables directly from farm to your home.
           </p>
          </div>
         </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-3">
            <div className="category-sidebar p-4 shadow-sm rounded bg-white border">
              <h4 className="fw-bold mb-4 text-success border-bottom pb-2">Categories</h4>
              <ul className="list-unstyled">
                <li 
                    className={`category-item p-2 mb-2 d-flex align-items-center rounded ${selectedCategory === "All" ? 'active-cat bg-success text-white' : 'bg-light'}`}
                    onClick={() => setSelectedCategory("All")}
                    style={{ cursor: 'pointer' }}
                >
                    <span>All Products</span>
                </li>

                {categories.map((cat, index) => {
                    const name = typeof cat === 'object' ? cat.name : cat;
                    const img = typeof cat === 'object' ? cat.img : "";

                    return (
                        <li
                            key={index}
                            className={`category-item p-2 mb-2 d-flex align-items-center rounded ${selectedCategory === name ? 'active-cat bg-success text-white' : 'bg-light'}`}
                            onClick={() => setSelectedCategory(name)}
                            style={{ cursor: 'pointer', transition: '0.3s' }}>
                           
                            {img && <img src={img} alt="" style={{ width: '25px', height: '25px', marginRight: '10px', borderRadius: '4px', objectFit: 'cover' }} />}
                            
                            <span className="flex-grow-1">{name}</span>
                            
                            <span className={`badge rounded-pill shadow-sm ms-2 ${selectedCategory === name ? 'bg-white text-dark' : 'bg-success text-white'}`}>
                                {vegData.filter(i => i.category === name).length}
                            </span>
                        </li>
                    );
                })}
              </ul>
            </div>
          </div>

          <div className="col-md-9">
            <div className="row">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => {
                  const isFavourite = wishlist.some(fav => fav._id === item._id);

                  return (
                    <div className="col-lg-4 col-md-6 mb-4" key={item._id}>
                      <div className="veg_box shadow-sm border rounded p-3 h-100 bg-white position-relative">
  
                        <div 
                          className="wishlist-icon" 
                          onClick={() => toggleWishlist(item)}
                          style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            zIndex: '10',
                            cursor: 'pointer',
                            fontSize: '22px',
                            transition: '0.3s'
                          }}
                        >
                          {isFavourite ? (
                            <FaHeart className="text-danger" /> 
                          ) : (
                            <FaRegHeart className="text-muted" />
                          )}
                        </div>

                        {item.stock <= 0 && (
                          <div className="sold-out-tag" style={{position:'absolute', top:'10px', left:'10px', background:'#000', color:'#fff', padding:'2px 8px', fontSize:'12px', zIndex:'1'}}>Sold Out</div>
                        )}

                        <div className="hover01 column overflow-hidden rounded mb-3">
                          <figure className="m-0" onClick={() => item.stock > 0 && navigate(`/product/${item._id}`)} style={{ cursor: 'pointer' }}>
                            <img 
                              src={item.img} 
                              alt={item.name} 
                              className="img-fluid" 
                              style={{ height: '180px', objectFit: 'cover', width: '100%',filter: item.stock <= 0 ? 'grayscale(100%)' : 'none', opacity: item.stock === 0 ? 0.5 : 1 }} 
                            />
                          </figure>
                        </div>
                        
                        <h5 className="fw-bold text-dark">{item.name}</h5>
                        <div className="price-section mb-4">
                          <span className="rate_text h5 fw-bold text-success">
                            ₹{item.price} <span className="text-muted fw-normal" style={{ fontSize: '14px' }}>/ {item.weight}</span>
                          </span>
                        </div>

                          {/* jo oldprice batvi hoy to */}
                      
                      {/* <h5 className="fw-bold text-dark">{item.name}({item.weight})</h5>
                      <div className="price-section mb-4">
                        <span className="text-decoration-line-through text-muted me-2 small ">₹{item.oldPrice}</span>
                        <span className="rate_text h5 fw-bold text-success">₹{item.price}</span>
                      </div> */}

                        {item.stock > 0 ? (
                          <>
                            <div className="quantity-box d-flex align-items-center justify-content-between border rounded-pill mb-3 p-1 px-3">
                              <button className="btn btn-sm btn-outline-success border-0 fw-bold" onClick={() => updateQuantity(item._id, -1)}>-</button>
                              <span className="fw-bold">{item.qty}</span>
                              <button className="btn btn-sm btn-outline-success border-0 fw-bold" onClick={() => updateQuantity(item._id, 1)}>+</button>
                            </div>

                            <button
                              className="btn btn-success rounded-pill w-100 py-2 fw-bold shadow-sm"
                              onClick={() => handleAddToCart(item)}
                            >
                              <i className="fa fa-shopping-bag me-2"></i> Add to cart
                            </button>
                          </>
                        ) : (
                          <button className="btn btn-secondary rounded-pill w-100 py-2 fw-bold shadow-sm" disabled style={{background: '#c5d3b1', borderColor: '#c5d3b1'}}>
                            Unavailable
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center py-5">
                   <FaExclamationCircle size={50} className="text-muted mb-3" />
                   <h3 className="text-muted">No products found matching "{searchTerm}"</h3>
                   <button className="btn btn-outline-success mt-3" onClick={() => setSelectedCategory("All")}>Clear Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;