import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './payment.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;

  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    saveCard: false
  });

  // Get card type based on first digit
  const getCardType = (number) => {
    const firstNum = number.charAt(0);
    switch (firstNum) {
      case '4':
        return 'VISA';
      case '5':
        return 'MASTERCARD';
      case '3':
        return 'AMEX';
      default:
        return '';
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
    const onlyNumbers = value.replace(/[^\d]/g, '');

    return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
      [$1, $2, $3, $4].filter(group => !!group).join(' ')
    );
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})/);
    if (!match) return '';
    const month = match[1];
    const year = match[2];
    
    if (month && year) {
      return `${month}/${year}`;
    } else if (month) {
      return month;
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'expiry') {
      const formattedValue = formatExpiry(value);
      setCardDetails(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'number') {
      const formattedValue = formatCardNumber(value);
      setCardDetails(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setCardDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your payment processing logic here
    navigate('/confirmation', { 
      state: { 
        ...bookingDetails, 
        paymentDetails: cardDetails 
      }
    });
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h1>Payment Details</h1>
        
        <div className="payment-options">
          <h2>Select Payment Method</h2>
          <div className="card-type-options">
            <div 
              className={`card-option ${paymentMethod === 'credit' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('credit')}
            >
              <span className="card-icon">💳</span>
              <span>Credit Card</span>
              {paymentMethod === 'credit' && <span className="check-icon">✓</span>}
            </div>
            <div 
              className={`card-option ${paymentMethod === 'debit' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('debit')}
            >
              <span className="card-icon">💳</span>
              <span>Debit Card</span>
              {paymentMethod === 'debit' && <span className="check-icon">✓</span>}
            </div>
          </div>
        </div>

        <div className="card-details">
          <h2>Enter Card Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name On Card</label>
              <input
                type="text"
                name="name"
                value={cardDetails.name}
                onChange={handleInputChange}
                placeholder="Enter name as shown on card"
                required
              />
            </div>

            <div className="form-group">
              <label>Card Number</label>
              <div className="card-number-input">
                <input
                  type="text"
                  name="number"
                  value={cardDetails.number}
                  onChange={handleInputChange}
                  placeholder="XXXX XXXX XXXX XXXX"
                  maxLength="19"
                  required
                />
                {cardDetails.number && (
                  <span className="card-type-text">
                    {getCardType(cardDetails.number)}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label>Valid Until</label>
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>
              <div className="form-group half">
                <label>CVV Code <span className="info-tooltip" title="3-digit security code on the back of your card">?</span></label>
                <input
                  type="password"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleInputChange}
                  placeholder="***"
                  maxLength="3"
                  required
                />
              </div>
            </div>

            <div className="save-card">
              <input
                type="checkbox"
                id="saveCard"
                checked={cardDetails.saveCard}
                onChange={(e) => setCardDetails(prev => ({
                  ...prev,
                  saveCard: e.target.checked
                }))}
              />
              <label htmlFor="saveCard">
                Securely save this card for a faster checkout next time
              </label>
            </div>

            <button type="submit" className="pay-button">
              Pay ${bookingDetails?.total?.toFixed(2) || '0.00'}
            </button>
          </form>
        </div>
      </div>

      <div className="booking-summary">
        <h2>Booking Summary</h2>
        
        <div className="booking-details">
          <div className="room-info-box">
            <div className="room-type-badge">{bookingDetails?.roomType} Room</div>
            <div className="stay-duration">
              {bookingDetails?.totalNights} Night{bookingDetails?.totalNights !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="details-group">
            <h3>Stay Details</h3>
            <div className="detail-item">
              <span>Check-in</span>
              <span>{new Date(bookingDetails?.checkIn).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span>Check-out</span>
              <span>{new Date(bookingDetails?.checkOut).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span>Guests</span>
              <span>{bookingDetails?.guests} Person(s)</span>
            </div>
          </div>

          <div className="price-summary">
            <div className="summary-item">
              <span>Room Rate ({bookingDetails?.totalNights} Nights)</span>
              <span>${bookingDetails?.subtotal?.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Taxes (12%)</span>
              <span>${bookingDetails?.tax?.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Service Charge</span>
              <span>${bookingDetails?.serviceCharge?.toFixed(2)}</span>
            </div>
            
            <div className="promo-code">
              <input type="text" placeholder="Enter promo code" />
              <button type="button">Apply</button>
            </div>

            <div className="summary-item total">
              <span>Total Amount</span>
              <span>${bookingDetails?.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;