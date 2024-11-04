import React from "react";
import "../HomePage/homePage.css";
import "./payment.css";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/thankyou"); // Redirect to a thank-you page after successful submission
  };

  return (
    <div className="payment-container">
      <h2>Booking Payment</h2>
      <form onSubmit={handleSubmit}>
        {/* Card Number */}
        <div className="form-group">
          <label htmlFor="card-number">Card Number</label>
          <input
            type="text"
            id="card-number"
            name="card-number"
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            required
          />
        </div>

        {/* Card Holder Name */}
        <div className="form-group">
          <label htmlFor="card-name">Card Holder</label>
          <input
            type="text"
            id="card-name"
            name="card-name"
            placeholder="Name on Card"
            required
          />
        </div>

        {/* Card Expiration and CVC */}
        <div className="card-details">
          <div className="form-group">
            <label htmlFor="expiry">Expiry Date</label>
            <input
              type="text"
              id="expiry"
              name="expiry"
              placeholder="MM/YY"
              maxLength="5"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cvc">CVC</label>
            <input
              type="text"
              id="cvc"
              name="cvc"
              placeholder="123"
              maxLength="3"
              required
            />
          </div>
        </div>

        {/* Billing Info */}
        <div className="form-group">
          <label htmlFor="billing-address">Billing Address</label>
          <input
            type="text"
            id="billing-address"
            name="billing-address"
            placeholder="1234 Main St"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="zip-code">ZIP Code</label>
          <input
            type="text"
            id="zip-code"
            name="zip-code"
            placeholder="ZIP Code"
            required
          />
        </div>

        {/* Pay Now Button */}
        <button type="submit" className="pay-now-btn">Pay Now</button>
      </form>
    </div>
  );
}

export default Payment;
