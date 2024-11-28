import React, { useState } from 'react'

const RoomForm = ({ onSubmit, submitButtonText, onClose, roomTypes=[], loading, selectedRoom={} }) => {
    console.log('room', selectedRoom)
    const [formData, setFormData] = useState({
        room_type: selectedRoom?.room_type?._id || "",
        price: selectedRoom?.price?.$numberDecimal  || "",
        capacity: selectedRoom?.capacity || "",
        amenities: selectedRoom?.amenities || "",
        availabilityStart: "",
        availabilityEnd: "",
        status: selectedRoom?.status || "Available",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
    };    

    return (
    <form onSubmit={(e) => onSubmit(e, formData)} className="room-form">
      <div className="form-group">
        <label>Room Type</label>
        <select
          name="room_type"
          value={formData.room_type}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Room Type</option>
          {roomTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.type}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          name="price"
          // defaultValue={formData.price}
          value={formData.price}
          onChange={handleInputChange}
          required
          min="0"
          step="0.01"
        />
      </div>

      <div className="form-group">
        <label>Capacity</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleInputChange}
          required
          min="1"
        />
      </div>

      <div className="form-group">
        <label>Amenities</label>
        <input
          type="text"
          name="amenities"
          value={formData.amenities}
          onChange={handleInputChange}
          required
          placeholder="Enter amenities separated by commas"
        />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          required
        >
          <option value="Available">Available</option>
          <option value="Booked">Booked</option>
          <option value="Out of Service">Out of Service</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Processing..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}

export default RoomForm