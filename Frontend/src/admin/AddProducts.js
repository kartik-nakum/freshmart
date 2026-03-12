import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; 
import "../css/admin/addproducts.css"

const AddProducts = ({ vegData, setVegData, categories, isLoggedIn }) => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        weight: "",
        category: "Vegetables",
        price: "",
        oldPrice: "",
        img: "",
        qty: 1,
        stock: "" 
    });

    const [editId, setEditId] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setNewProduct({ ...newProduct, img: reader.result });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch("https://freshmart-25n5.onrender.com/api/products");
            const data = await res.json();
            setVegData(data);
        } catch (err) {
            console.log("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editId) {
                //  UPDATE
                const res = await fetch(`https://freshmart-25n5.onrender.com/api/products/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...newProduct,
                        price: Number(newProduct.price),
                        stock: Number(newProduct.stock),
                    }),
                });

                if (res.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated!',
                        text: 'Product updated successfully!',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            } else {
                // add
                const res = await fetch("https://freshmart-25n5.onrender.com/api/products/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...newProduct,
                        price: Number(newProduct.price),
                        stock: Number(newProduct.stock),
                    }),
                });

                if (res.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'New product added successfully!',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            }

            await fetchProducts();
            setEditId(null);
            setNewProduct({
                name: "",
                weight: "",
                category: "Vegetables",
                price: "",
                oldPrice: "",
                img: "",
                qty: 1,
                stock: "",
            });
        } catch (err) {
            Swal.fire('Error', 'Server error occurred!', 'error');
            console.log(err);
        }
    };

    const startEdit = (item) => {
        setEditId(item._id);
        setNewProduct(item);
        window.scrollTo(0, 0);
    };

    const deleteProduct = async (mongoId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this product!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`https://freshmart-25n5.onrender.com/api/products/${mongoId}`, {
                        method: "DELETE",
                    });

                    if (res.ok) {
                        Swal.fire(
                            'Deleted!',
                            'Product has been deleted.',
                            'success'
                        );
                        await fetchProducts(); 
                    }
                } catch (err) {
                    console.error("Error deleting product", err);
                    Swal.fire('Error', 'Failed to delete product!', 'error');
                }
            }
        });
    };

    return (
        <div className="vagetables_section layout_padding">
            <div className="container">
                <h2 className="text-success fw-bold mb-4 border-bottom pb-2">
                    {editId ? "Update Product" : "Add New Product"}
                </h2>

                <div className="row">
                    <div className="col-md-5 mb-5">
                        <div className="category-sidebar p-4 shadow rounded bg-white">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold d-block mb-2">Product Name</label>
                                    <input type="text" className="form-control" placeholder="e.g. Fresh Tomato" 
                                        value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold d-block mb-2">Weight/Quantity</label>
                                    <input type="text" className="form-control" placeholder="e.g. 500 gm or 1 kg" 
                                        value={newProduct.weight} onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold d-block mb-2">Category</label>
                                    <select className="form-select" value={newProduct.category} 
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                                        {categories.map((cat, i) => {
                                            const name = typeof cat === 'object' ? cat.name : cat;
                                            return <option key={i} value={name}>{name}</option>
                                        })}
                                    </select>
                                </div>
                                
                                <div className="row">
                                    <div className="col-6 mb-3">
                                        <label className="form-label fw-bold d-block mb-2">Current Price (₹)</label>
                                        <input type="number" className="form-control" placeholder="100" 
                                            value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label className="form-label fw-bold d-block mb-2">Old Price (₹)</label>
                                        <input type="number" className="form-control" placeholder="120" 
                                            value={newProduct.oldPrice} onChange={(e) => setNewProduct({ ...newProduct, oldPrice: e.target.value })} />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold d-block mb-2">Available Stock (Quantity)</label>
                                    <input type="number" className="form-control" placeholder="How many items available?" 
                                        value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold text-primary d-block mb-2">Upload Product Image</label>
                                    <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} required={!editId} />
                                    {newProduct.img && (
                                        <div className="mt-2 text-center">
                                            <img src={newProduct.img} alt="Preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px", border: "2px solid #82b440" }} />
                                            <p className="small text-muted mb-0">Image uploaded successfully!</p>
                                        </div>
                                    )}
                                </div>

                                <button className={`btn w-100 rounded-pill fw-bold py-2 ${editId ? "btn-warning" : "btn-success"}`}>
                                    {editId ? "UPDATE PRODUCT" : "ADD PRODUCT"}
                                </button>
                                {editId && (
                                    <button type="button" className="btn btn-light w-100 rounded-pill mt-2 border" 
                                        onClick={() => { setEditId(null); setNewProduct({ name: "", weight: "", category: "Vegetables", price: "", oldPrice: "", img: "", qty: 1, stock: "" }); }}>
                                        Cancel
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="col-md-7">
                        <h4 className="fw-bold mb-3 text-dark">Current Inventory</h4>
                        <div className="table-responsive bg-white shadow-sm rounded">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Item</th>
                                        <th>Stock</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vegData.map((item) => (
                                       <tr key={item._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img src={item.img} alt="" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "5px" }} className="me-2 border" />
                                                    <div>
                                                        <div className="fw-bold">{item.name}</div>
                                                        <small className="text-muted">{item.weight} | <span className="badge bg-light text-dark">{item.category}</span></small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`fw-bold ${item.stock <= 0 ? "text-danger" : "text-dark"}`}>
                                                    {item.stock <= 0 ? "Out of Stock" : item.stock}
                                                </span>
                                            </td>
                                            <td><span className="text-success fw-bold">₹{item.price}</span></td>
                                            <td>
                                                <button className="btn btn-sm bg-primary text-light me-1" onClick={() => startEdit(item)}>Edit</button>
                                                <button className="btn btn-sm bg-danger text-light" onClick={() => deleteProduct(item._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProducts;