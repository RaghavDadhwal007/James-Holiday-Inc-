import React, { useState } from 'react'

const RoomTypeForm = ({ onSubmit, submitButtonText, onClose, loading, selectedRoom={} }) => {
    console.log('room', selectedRoom)
    const [formData, setFormData] = useState({
        type: selectedRoom?.type || "",
        description: selectedRoom?.description  || "",
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
        <label>Type Name</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          required
          placeholder="Enter room type name"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          placeholder="Enter room type description"
          rows="4"
          className="form-textarea"
        />
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

export default RoomTypeForm