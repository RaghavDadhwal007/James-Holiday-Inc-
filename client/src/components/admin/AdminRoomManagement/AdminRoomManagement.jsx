import React, { useState, useEffect } from "react";
import Modal from "../../Modal";
import "./adminRoomManagement.css";
import RoomForm from "../../RoomForm";
import RoomTypeForm from "../../RoomTypeForm";

const AdminRoomManagement = () => {
  // Room States
  const [rooms, setRooms] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Room Type States
  const [roomTypes, setRoomTypes] = useState([]);
  const [isAddRoomTypeModalOpen, setIsAddRoomTypeModalOpen] = useState(false);
  const [isEditRoomTypeModalOpen, setIsEditRoomTypeModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  // Common States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form States
  const [formData, setFormData] = useState({
    room_type: "",
    price: "",
    capacity: "",
    amenities: "",
    availabilityStart: "",
    availabilityEnd: "",
    status: "Available",
  });

  const [roomTypeFormData, setRoomTypeFormData] = useState({
    type: "",
    description: "",
  });

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  // Room Fetching Functions
  const fetchRooms = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URI}/rooms`);
      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setError("Failed to fetch rooms");
      console.error("Error fetching rooms:", err);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/roomTypes`
      );
      if (!response.ok) throw new Error("Failed to fetch room types");
      const data = await response.json();
      setRoomTypes(data);
    } catch (err) {
      setError("Failed to fetch room types");
      console.error("Error fetching room types:", err);
    }
  };

  // Room Form Handlers
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const resetForm = () => {
    setFormData({
      room_type: "",
      price: "",
      capacity: "",
      amenities: "",
      availabilityStart: "",
      availabilityEnd: "",
      status: "Available",
    });
  };

  // Room Type Form Handlers
  // const handleRoomTypeInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setRoomTypeFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const resetRoomTypeForm = () => {
    setRoomTypeFormData({
      type: "",
      description: "",
    });
  };

  // Room CRUD Operations
  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/rooms`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to add room");

      await fetchRooms();
      setIsAddModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e, formData) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/rooms/${selectedRoom._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update room");

      await fetchRooms();
      setIsEditModalOpen(false);
      setSelectedRoom(null);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/rooms/${roomId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete room");
      await fetchRooms();
    } catch (err) {
      setError(err.message);
    }
  };

  // Room Type CRUD Operations
  const handleAddRoomType = async (e, formData) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/roomTypes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to add room type");

      await fetchRoomTypes();
      setIsAddRoomTypeModalOpen(false);
      resetRoomTypeForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoomType = async (e, formData) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/roomTypes/${selectedRoomType._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update room type");

      await fetchRoomTypes();
      setIsEditRoomTypeModalOpen(false);
      setSelectedRoomType(null);
      resetRoomTypeForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoomType = async (roomTypeId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this room type? This may affect existing rooms."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/roomTypes/${roomTypeId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete room type");
      await fetchRoomTypes();
    } catch (err) {
      setError(err.message);
    }
  };

  // Component for Modal
  // const Modal = ({ isOpen, onClose, title, children }) => {
  //   if (!isOpen) return null;
  //   console.log('isOpen', isOpen)
  //   return (
  //     <div className="modal-overlay">
  //       <div className="modal-content">
  //         <div className="modal-header">
  //           <h2 className="modal-title">{title}</h2>
  //           <button onClick={onClose} className="modal-close">
  //             ×
  //           </button>
  //         </div>
  //         {children}
  //       </div>
  //     </div>
  //   );
  // };

  // Room Form Component
  // const RoomForm = ({ onSubmit, submitButtonText, onClose }) => (
  //   <form onSubmit={onSubmit} className="room-form">
  //     <div className="form-group">
  //       <label>Room Type</label>
  //       <select
  //         name="room_type"
  //         value={formData.room_type}
  //         onChange={handleInputChange}
  //         required
  //       >
  //         <option value="">Select Room Type</option>
  //         {roomTypes.map((type) => (
  //           <option key={type._id} value={type._id}>
  //             {type.type}
  //           </option>
  //         ))}
  //       </select>
  //     </div>

  //     <div className="form-group">
  //       <label>Price</label>
  //       <input
  //         type="number"
  //         name="price"
  //         // defaultValue={formData.price}
  //         // value={formData.price}
  //         onChange={handleInputChange}
  //         required
  //         min="0"
  //         step="0.01"
  //       />
  //     </div>

  //     <div className="form-group">
  //       <label>Capacity</label>
  //       <input
  //         type="number"
  //         name="capacity"
  //         value={formData.capacity}
  //         onChange={handleInputChange}
  //         required
  //         min="1"
  //       />
  //     </div>

  //     <div className="form-group">
  //       <label>Amenities</label>
  //       <input
  //         type="text"
  //         name="amenities"
  //         value={formData.amenities}
  //         onChange={handleInputChange}
  //         required
  //         placeholder="Enter amenities separated by commas"
  //       />
  //     </div>

  //     <div className="form-group">
  //       <label>Status</label>
  //       <select
  //         name="status"
  //         value={formData.status}
  //         onChange={handleInputChange}
  //         required
  //       >
  //         <option value="Available">Available</option>
  //         <option value="Booked">Booked</option>
  //         <option value="Out of Service">Out of Service</option>
  //       </select>
  //     </div>

  //     <div className="form-actions">
  //       <button type="button" onClick={onClose} className="btn-secondary">
  //         Cancel
  //       </button>
  //       <button type="submit" className="btn-primary" disabled={loading}>
  //         {loading ? "Processing..." : submitButtonText}
  //       </button>
  //     </div>
  //   </form>
  // );

  // Room Type Form Component
  // const RoomTypeForm = ({ onSubmit, submitButtonText, onClose }) => (
  //   <form onSubmit={onSubmit} className="room-form">
  //     <div className="form-group">
  //       <label>Type Name</label>
  //       <input
  //         type="text"
  //         name="type"
  //         value={roomTypeFormData.type}
  //         onChange={handleRoomTypeInputChange}
  //         required
  //         placeholder="Enter room type name"
  //       />
  //     </div>

  //     <div className="form-group">
  //       <label>Description</label>
  //       <textarea
  //         name="description"
  //         value={roomTypeFormData.description}
  //         onChange={handleRoomTypeInputChange}
  //         required
  //         placeholder="Enter room type description"
  //         rows="4"
  //         className="form-textarea"
  //       />
  //     </div>

  //     <div className="form-actions">
  //       <button type="button" onClick={onClose} className="btn-secondary">
  //         Cancel
  //       </button>
  //       <button type="submit" className="btn-primary" disabled={loading}>
  //         {loading ? "Processing..." : submitButtonText}
  //       </button>
  //     </div>
  //   </form>
  // );

  console.log('testing')

  return (
    <div className="admin-room-container">
      <div className="admin-room-content">
        {/* Rooms Section */}
        <div className="section">
          <div className="admin-header">
            <h1>Room Management</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="add-room-btn"
            >
              + Add New Room
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="room-table-container">
            <table className="room-table">
              <thead>
                <tr>
                  <th>Room Type</th>
                  <th>Price</th>
                  <th>Capacity</th>
                  <th>Amenities</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id}>
                    <td>{room.room_type.type}</td>
                    <td>${room.price.$numberDecimal}</td>
                    <td>{room.capacity}</td>
                    <td>{room.amenities}</td>
                    <td>
                      <span
                        className={`status-badge status-${room.status.toLowerCase()}`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => {
                            setSelectedRoom(room);
                            console.log('room', room)
                            // setFormData({
                            //   room_type: room.room_type._id,
                            //   price: room.price.$numberDecimal,
                            //   capacity: room.capacity,
                            //   amenities: room.amenities,
                            //   status: room.status,
                            // });
                            setIsEditModalOpen(true);
                          }}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(room._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Room Types Section */}
        <div className="room-type-section">
          <div className="section-header">
            <h2>Room Types</h2>
            <button
              onClick={() => setIsAddRoomTypeModalOpen(true)}
              className="add-room-btn"
            >
              + Add Room Type
            </button>
          </div>

          <div className="room-table-container">
            <table className="room-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roomTypes.map((roomType) => (
                  <tr key={roomType._id}>
                    <td>{roomType.type}</td>
                    <td>{roomType.description}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => {
                            setSelectedRoomType(roomType);
                            setRoomTypeFormData({
                              type: roomType.type,
                              description: roomType.description,
                            });
                            setIsEditRoomTypeModalOpen(true);
                          }}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRoomType(roomType._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Room Modals */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            resetForm();
          }}
          title="Add New Room"
        >
          <RoomForm
            onSubmit={handleSubmit}
            submitButtonText="Add Room"
            onClose={() => setIsAddModalOpen(false)}
            roomTypes={roomTypes}
            loading={loading}
          />
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRoom(null);
            resetForm();
          }}
          title="Edit Room"
        >
          <RoomForm
            onSubmit={handleEdit}
            submitButtonText="Update Room"
            onClose={() => setIsEditModalOpen(false)}
            roomTypes={roomTypes}
            loading={loading}
            selectedRoom={selectedRoom}
          />
        </Modal>

        {/* Room Type Modals */}
        <Modal
          isOpen={isAddRoomTypeModalOpen}
          onClose={() => {
            setIsAddRoomTypeModalOpen(false);
            resetRoomTypeForm();
          }}
          title="Add New Room Type"
        >
          <RoomTypeForm
            onSubmit={handleAddRoomType}
            submitButtonText="Add Room Type"
            onClose={() => setIsAddRoomTypeModalOpen(false)}
            loading={loading}
            selectedRoom={roomTypeFormData}
          />
        </Modal>

        <Modal
          isOpen={isEditRoomTypeModalOpen}
          onClose={() => {
            setIsEditRoomTypeModalOpen(false);
            setSelectedRoomType(null);
            resetRoomTypeForm();
          }}
          title="Edit Room Type"
        >
          <RoomTypeForm
            onSubmit={handleEditRoomType}
            submitButtonText="Update Room Type"
            onClose={() => setIsEditRoomTypeModalOpen(false)}
            loading={loading}
            selectedRoom={roomTypeFormData}
          />
        </Modal>
      </div>
    </div>
  );
};

export default AdminRoomManagement;
