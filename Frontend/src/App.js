import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Swal from 'sweetalert2'; 

import Navbar from './componets/Navbar';
import Login from "./users/Login"
import Register from './users/Register';
import ForgotPassword from './users/ForgotPassword';
import Home from "./users/Home";
import Shop from "./users/Shop";
import Categories from './users/Categories';
import WishlistPage from './users/WishlistPage';
import CartPage from "./users/CartPage"
import Checkout from './users/Checkout';
import OrderSuccess from './users/OrderSuccess';
import MyOrders from './users/MyOrders';
import ProductDetail from './users/ProductDetail';
import About from "./users/About";
import Contact from "./users/Contact";
import Footer from './componets/Footer';

import AdminLogin from './admin/AdminLogin';
import AdminRegister from './admin/AdminRegister';
import AdminForgotPassword from './admin/AdminForgotPassword';
import AdminSidebar from './admin/AdminSidebar';
import AdminDashboard from './admin/AdminDashboard';
import AddProducts from './admin/AddProducts';
import AdminOrders from './admin/AdminOrders';
import AdminCategory from './admin/AdminCategory';
import AdminUsers from './admin/AdminUsers';

function App() {

  const [vegData, setVegData] = useState(() => {
    try {
      const savedData = localStorage.getItem("myVegData");
      if (savedData && savedData !== "undefined") {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error("Local storage parse error:", error);
    }
    return []; 
  });

  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (vegData && vegData.length > 0) {
      localStorage.setItem("myVegData", JSON.stringify(vegData));
    }
  }, [vegData]);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem("isAdmin") === "true";
  });

  const syncCartToBackend = async (items) => {
    const userSession = sessionStorage.getItem("userEmail");
    const userId = userSession ? userSession.replace(/['"]+/g, '') : "guest";

    try {
      await fetch("http://localhost:5000/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, items }) 
      });
    } catch (err) {
      console.error("Sync error", err);
    }
  };

  const addToCart = async (product) => {
    if (product.stock <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Sold Out!',
        text: 'Sorry, this item is currently out of stock.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    const addedQty = product.qty || 1;

    setCart((prevCart) => {
      let updatedCart;
      const isItemInCart = prevCart.find((item) => 
        (item._id && product._id && item._id === product._id) || 
        (item.id && product.id && item.id === product.id)
      );

      if (isItemInCart) {
        updatedCart = prevCart.map((item) =>
          ((item._id && product._id && item._id === product._id) || (item.id && product.id && item.id === product.id))
            ? { ...item, qty: item.qty + addedQty } 
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, qty: addedQty }];
      }

      syncCartToBackend(updatedCart); 
      return updatedCart;
    });

    const updatedVegData = vegData.map((v) => {
      if (v._id === product._id || v.id === product.id) {
        return { ...v, stock: Math.max(0, v.stock - addedQty) };
      }
      return v;
    });
    
    setVegData(updatedVegData);

    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: `${addedQty} ${product.name} has been added successfully!`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) 
        : item.price;
      return total + (price * item.qty);
    }, 0);
  };

  const [categories, setCategories] = useState(() => {
    try {
      const savedCategories = localStorage.getItem("myCategories");
      if (savedCategories && savedCategories !== "undefined") {
        return JSON.parse(savedCategories);
      }
    } catch (error) {
      console.error("Categories parse error:", error);
    }
    return ["Vegetables", "Fruits", "Organic", "Leafy Greens"]; 
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCats();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

const [wishlist, setWishlist] = useState([]);

useEffect(() => {
  const fetchWishlist = async () => {
    const userSession = sessionStorage.getItem("userEmail");
    
    if (userSession && isLoggedIn) {
      const email = userSession.replace(/['"]+/g, '');
      
      try {
        const res = await fetch(`http://localhost:5000/api/wishlist/${email}`);
        if (res.ok) {
          const data = await res.json();
          console.log("Wishlist Loaded:", data);
          setWishlist(data);
        }
      } catch (err) {
        console.error("Fetch Wishlist Error:", err);
      }
    } else {
      setWishlist([]); 
    }
  };

  fetchWishlist();
}, [isLoggedIn]);


const toggleWishlist = async (product) => {
  if (!isLoggedIn) {
    Swal.fire({ icon: 'info', title: 'Login Required', text: 'Please login to add favorites' });
    return;
  }

  const userSession = sessionStorage.getItem("userEmail");
  const userEmail = userSession ? userSession.replace(/['"]+/g, '') : "";

  try {
    const res = await fetch("http://localhost:5000/api/wishlist/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userEmail, productId: product._id })
    });

    if (res.ok) {
      setWishlist((prevWishlist) => {
        const isExist = prevWishlist.find(item => item._id === product._id);
        if (isExist) {
          return prevWishlist.filter(item => item._id !== product._id);
        } else {
          return [...prevWishlist, product];
        }
      });

      const isExist = wishlist.find(item => item._id === product._id);
      if (!isExist) {
        const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
        Toast.fire({ icon: 'success', title: 'Saved to Wishlist' });
      }
    }
  } catch (err) {
    console.error("Wishlist sync error:", err);
  }
};

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/*" element={
            <> 
              <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              <Routes>
                <Route path="/" element={<Home vegData={vegData} setVegData={setVegData} addToCart={addToCart} isLoggedIn={isLoggedIn} categories={categories} searchTerm={searchTerm} cart={cart} />} />
                <Route path="/shop" element={<Shop vegData={vegData} setVegData={setVegData} addToCart={addToCart} isLoggedIn={isLoggedIn} searchTerm={searchTerm} categories={categories} cart={cart} wishlist={wishlist} toggleWishlist={toggleWishlist}/>} />
                <Route path="/product/:id" element={<ProductDetail vegData={vegData} addToCart={addToCart} isLoggedIn={isLoggedIn} />} />
                <Route path="/categories" element={<Categories vegData={vegData} setVegData={setVegData} addToCart={addToCart} isLoggedIn={isLoggedIn} categories={categories} cart={cart} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
                <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} vegData={vegData} setVegData={setVegData}/>} />
                <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} calculateTotal={calculateTotal} />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/myOrders" element={<MyOrders addToCart={addToCart} isLoggedIn={isLoggedIn}/>} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />} />
              </Routes>
              <Footer />
            </> 
          }/>

          {/* admin side */}
          <Route path="/admin/alogin" element={<AdminLogin setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/*" element={isAdmin === true ? (
            <div className="d-flex">
             <AdminSidebar setIsAdmin={setIsAdmin} />
              <div className="admin-content w-100">
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard vegData={vegData} categories={categories} />} />
                  <Route path="products" element={isAdmin ? (<AddProducts vegData={vegData} setVegData={setVegData} isLoggedIn={isLoggedIn} categories={categories.map(c => typeof c === 'object' ? c.name : c)} />) : (<Navigate to="/admin/alogin" />) } />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="categories" element={<AdminCategory categories={categories} setCategories={setCategories} vegData={vegData} />} />
                  <Route path="users" element={<AdminUsers />} />
                </Routes>
              </div>
            </div>
          ) : (
            <Navigate to="/admin/alogin" replace />
          )} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;