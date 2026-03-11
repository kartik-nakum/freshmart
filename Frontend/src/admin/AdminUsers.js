import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2'; 
import "../css/admin/adminusers.css";
import { FaSearch, FaUserCircle, FaTrashAlt } from "react-icons/fa";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/all-users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      Swal.fire({
        icon: 'error',
        title: 'Fetch Error',
        text: 'Failed to load users from server.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    
    Swal.fire({
      title: 'Are you sure?',
      text: "This user will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete user!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:5000/api/delete-user/${userId}`, {
            method: "DELETE",
          });

          if (res.ok) {
            Swal.fire(
              'Deleted!',
              'User has been deleted successfully.',
              'success'
            );
            fetchUsers(); 
          }
        } catch (err) {
          Swal.fire('Error', 'Failed to delete user.', 'error');
        }
      }
    });
  };

  const filteredUsers = users.filter((user) => {
    const fullName = user?.fullName || "";
    const email = user?.email || "";
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="container text-center mt-5 py-5">
        <div className="spinner-border text-success" role="status"></div>
        <h4 className="mt-3 text-muted">Loading Registered Users...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="text-success fw-bold m-0">User Management</h2>
        <span className="badge bg-success p-2">Total Users: {users.length}</span>
      </div>

      <div className="mb-4 position-relative">
        <input 
          type="text" 
          className="form-control ps-5 rounded-pill shadow-sm" 
          placeholder="Search by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
      </div>

      <div className="table-responsive shadow-sm rounded bg-white">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>Profile</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Phone</th>
              <th>Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <FaUserCircle className="text-success fs-3" />
                  </td>
                  <td className="fw-bold">{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`badge rounded-pill px-3 ${user.role === 'admin' ? 'bg-danger' : 'bg-info'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="text-center">
                    <button 
                      className="btn bg-danger text-light btn-sm rounded-pill px-3" 
                      onClick={() => deleteUser(user._id)}
                    >
                      <FaTrashAlt className="me-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">No users found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;