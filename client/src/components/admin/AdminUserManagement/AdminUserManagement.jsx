import React, { useState, useEffect } from "react";
import "./adminUserManagement.css";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    isAdmin: false,
    isVerified: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/users/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url, method, body;

      if (selectedUser) {
        url = `${process.env.REACT_APP_SERVER_URI}/users/${selectedUser._id}`;
        method = "PUT";
        const { password, ...updateData } = formData;
        body = JSON.stringify(updateData);
      } else {
        url = `${process.env.REACT_APP_SERVER_URI}/users/register`;
        method = "POST";
        body = JSON.stringify(formData);
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save user");
      }

      await fetchUsers();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      isAdmin: false,
      isVerified: false,
    });
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="aum-container">
      <div className="aum-content">
        <div className="aum-section">
          <div className="aum-section-header">
            <h1 className="aum-section-title">User Management</h1>
            <div className="aum-header-actions">
              <div className="aum-search-wrapper">
                <span className="aum-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="aum-search-input"
                />
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="aum-add-btn"
              >
                👤 Add User
              </button>
            </div>
          </div>

          {error && <div className="aum-error">{error}</div>}

          <div className="aum-table-container">
            <table className="aum-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="aum-loading-cell">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span
                          className={`aum-badge ${
                            user.isVerified
                              ? "aum-badge-verified"
                              : "aum-badge-unverified"
                          }`}
                        >
                          {user.isVerified ? "✅ Verified" : "❌ Unverified"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`aum-badge ${
                            user.isAdmin ? "aum-badge-admin" : "aum-badge-user"
                          }`}
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td>
                        <div className="aum-actions">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setFormData({
                                name: user.name,
                                email: user.email,
                                phone: user.phone || "",
                                isAdmin: user.isAdmin || false,
                                isVerified: user.isVerified || false,
                              });
                              setIsModalOpen(true);
                            }}
                            className="aum-btn aum-btn-edit"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="aum-btn aum-btn-delete"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="aum-modal-overlay">
          <div className="aum-modal">
            <h2 className="aum-modal-title">
              {selectedUser ? "Edit User" : "Add New User"}
            </h2>

            <form onSubmit={handleSubmit} className="aum-form">
              <div className="aum-form-group">
                <label className="aum-form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="aum-form-input"
                />
              </div>

              <div className="aum-form-group">
                <label className="aum-form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="aum-form-input"
                />
              </div>

              {!selectedUser && (
                <div className="aum-form-group">
                  <label className="aum-form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!selectedUser}
                    className="aum-form-input"
                  />
                </div>
              )}

              <div className="aum-form-group">
                <label className="aum-form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="aum-form-input"
                />
              </div>

              <div className="aum-checkbox-group">
                <label className="aum-checkbox-label">
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={formData.isAdmin}
                    onChange={handleInputChange}
                    className="aum-checkbox"
                  />
                  Admin
                </label>

                <label className="aum-checkbox-label">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleInputChange}
                    className="aum-checkbox"
                  />
                  Verified
                </label>
              </div>

              <div className="aum-form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="aum-btn aum-btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="aum-btn aum-btn-submit">
                  {selectedUser ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
