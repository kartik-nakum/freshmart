import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; 
import "../css/admin/admincategory.css"
import { FaSearch, FaTags, FaEdit, FaTrash, FaCloudUploadAlt } from 'react-icons/fa';

const AdminCategory = ({ categories, setCategories, vegData }) => {
    const [newCategory, setNewCategory] = useState("");
    const [categoryImg, setCategoryImg] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.log("Error fetching categories:", err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCategoryImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getProductCount = (categoryName) => {
        return vegData.filter(item => item.category === categoryName).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newCategory.trim() === "") return;

        if (categoryImg && categoryImg.length > 2000000) { 
            Swal.fire({
                icon: 'warning',
                title: 'Image too large',
                text: 'Please use a smaller icon (under 2MB).',
                confirmButtonColor: '#28a745'
            });
            return;
        }

        const categoryData = { name: newCategory, img: categoryImg };

        try {
            let response;
            if (editIndex !== null) {
                const categoryId = filteredCategories[editIndex]._id; 
                response = await fetch(`http://localhost:5000/api/categories/update/${categoryId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(categoryData),
                });
            } else {
                response = await fetch("http://localhost:5000/api/categories/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(categoryData),
                });
            }

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: editIndex !== null ? 'Updated!' : 'Saved!',
                    text: `Category ${editIndex !== null ? 'updated' : 'added'} successfully.`,
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchCategories();
                setNewCategory("");
                setCategoryImg("");
                setEditIndex(null);
            }
        } catch (err) {
            Swal.fire('Error', 'Server error occurred!', 'error');
        }
    };

    const deleteCategory = async (index, catName) => {
        const categoryId = categories[index]._id;
        const count = getProductCount(catName);

        if (count > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Action Denied',
                text: `This category contains ${count} products. Please move or delete them first.`,
                confirmButtonColor: '#d33'
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "You want to delete this category permanently?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
                        method: "DELETE",
                    });
                    if (res.ok) {
                        Swal.fire('Deleted!', 'Category has been removed.', 'success');
                        fetchCategories();
                    }
                } catch (err) {
                    Swal.fire('Error', 'Failed to delete category.', 'error');
                }
            }
        });
    };

    const filteredCategories = categories.filter(cat => {
        const name = typeof cat === 'object' ? cat.name : cat;
        return name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="container mt-5">
            <h2 className="text-success fw-bold mb-4 border-bottom pb-2">
                <FaTags className="me-2" /> Category Management
            </h2>

            <div className="row">
                <div className="col-md-5 mb-4">
                    <div className="category-sidebar p-4 shadow-sm rounded bg-white border-top border-success border-4">
                        <h5 className="fw-bold mb-3">{editIndex !== null ? "Edit Category" : "Create New"}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">CATEGORY NAME</label>
                                <input
                                    type="text"
                                    className="form-control shadow-none"
                                    placeholder="e.g. Organic Greens"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">CATEGORY IMAGE/ICON</label>
                                <div className="image-upload-wrapper border rounded p-3 text-center position-relative" style={{ borderStyle: 'dashed', borderColor: '#28a745', backgroundColor: '#f8f9fa' }}>
                                    <input
                                        type="file"
                                        className="position-absolute opacity-0 w-100 h-100 start-0 top-0"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ cursor: 'pointer', zIndex: 10 }}
                                    />
                                    {categoryImg ? (
                                        <img src={categoryImg} alt="Preview" style={{ height: '80px', borderRadius: '5px' }} />
                                    ) : (
                                        <div className="text-muted">
                                            <FaCloudUploadAlt size={30} className="mb-1" />
                                            <p className="mb-0 small">Click to upload icon</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button className={`btn w-100 rounded-pill fw-bold py-2 ${editIndex !== null ? "btn-warning" : "btn-success"}`}>
                                {editIndex !== null ? "UPDATE" : "SAVE CATEGORY"}
                            </button>
                            {editIndex !== null && (
                                <button type="button" className="btn btn-link w-100 text-decoration-none mt-2 text-muted"
                                    onClick={() => { setEditIndex(null); setNewCategory(""); setCategoryImg(""); }}>
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold m-0">Existing Categories ({categories.length})</h5>

                        <div className="admin-search-group shadow-sm">
                            <div className="search-icon-box">
                                <FaSearch />
                            </div>
                            <input
                                type="text"
                                className="admin-search-input"
                                placeholder="Search category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white shadow-sm rounded overflow-hidden">
                        <ul className="list-group list-group-flush">
                            {filteredCategories.map((cat, index) => {
                                const name = cat.name || cat; 
                                const img = cat.img || "";
                                const id = cat._id || index;

                                return (
                                    <li key={id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="me-3 border rounded p-1 bg-light d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                                <img src={img || "https://via.placeholder.com/40"} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                            </div>
                                            <div>
                                                <span className="fw-bold text-dark">{name}</span>
                                                <div className="small text-muted">{getProductCount(name)} Products</div>
                                            </div>
                                        </div>
                                        <div className="btn-group">
                                            <button className="btn btn-sm btn-outline-primary border-0" onClick={() => { setEditIndex(categories.indexOf(cat)); setNewCategory(name); setCategoryImg(img); }}>
                                                <FaEdit />
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger border-0" onClick={() => deleteCategory(categories.indexOf(cat), name)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCategory;