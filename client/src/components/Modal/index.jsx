import React from 'react'

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    console.log('isOpen', isOpen)
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button onClick={onClose} className="modal-close">
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

export default Modal