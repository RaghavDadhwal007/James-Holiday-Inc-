import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./roomDetails.css";
import Header from "../Header";

function RoomDetails() {
  const { id } = useParams();
  const [slideIndex, setSlideIndex] = useState(0);
  const [roomDetailsData, setroomDetailsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nights, setNights] = useState(0);
  const [roomRate, setRoomRate] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URI}/rooms/${id}`
        );
        const data = await response.json();
        setroomDetailsData(data);
      } catch (error) {
        console.error("Error fetching featured rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRooms();
  }, [id]);

  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-9adA4eaOlSpe_LJEKzxGJjigLJtjGs8ATg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU8wtCeoV6WwgF7AxMZ7Pb1WbRtWcSnaXY0g&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD6Kn6DuellFmvWWhJAmHXTedcQTEyJP8wgg&s",
  ];

  const changeSlide = (direction) => {
    setSlideIndex(
      (prevIndex) => (prevIndex + direction + images.length) % images.length
    );
  };

  const roomDetails = {
    name: "Luxury Ocean Suite",
    description:
      "Experience unparalleled luxury in our meticulously designed ocean-view suite. This spacious accommodation offers the perfect blend of comfort and sophistication, with breathtaking views and world-class amenities.",
    price: 200,
    size: "45 m²",
    occupancy: "2 Adults, 1 Child",
    bedType: "King Size",
    view: "Ocean View",
    amenities: [
      {
        icon: "🛏️",
        name: "King-sized Bed",
        description: "Premium mattress and linens",
      },
      {
        icon: "📶",
        name: "High-speed WiFi",
        description: "Complimentary high-speed internet",
      },
      {
        icon: "🏊‍♂️",
        name: "Pool Access",
        description: "Exclusive infinity pool access",
      },
      { icon: "🍽️", name: "Room Service", description: "24/7 in-room dining" },
      {
        icon: "🚿",
        name: "Luxury Bathroom",
        description: "Rain shower and premium amenities",
      },
      {
        icon: "❄️",
        name: "Climate Control",
        description: "Individual temperature control",
      },
      { icon: "📺", name: "Entertainment", description: "55-inch Smart TV" },
      {
        icon: "☕",
        name: "Mini Bar",
        description: "Complimentary refreshments",
      },
    ],
  };

  const handleChange = (e) => {
    if (e.target.name === "checkIn") {
      setCheckIn(e.target.value);
    } else {
      setCheckOut(e.target.value);
    }

    // Calculate nights and amounts if both dates are set
    if (
      (checkIn && e.target.name === "checkOut") ||
      (checkOut && e.target.name === "checkIn")
    ) {
      const date1 = new Date(
        e.target.name === "checkIn" ? e.target.value : checkIn
      );
      const date2 = new Date(
        e.target.name === "checkOut" ? e.target.value : checkOut
      );
      const differenceInMs = date2 - date1;
      const nightsCount = differenceInMs / (1000 * 60 * 60 * 24);

      if (nightsCount > 0) {
        const rate = nightsCount * roomDetailsData.price.$numberDecimal;
        const taxAmount = rate * 0.13;
        const total = rate + taxAmount;

        setNights(nightsCount);
        setRoomRate(rate);
        setTaxes(taxAmount);
        setTotalAmount(total);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stripe = await loadStripe(
      "pk_test_51QH8UhDVCApEbmXH0V05yN5isrK6roHA6ix4SyzpaxA1cWrfhPJSkWCI3fuTImeCVCgfjBCBkOn2i1ysZBov9vc500rvVtvsjX"
    );
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URI}/payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalAmount * 100 }), // Convert to cents for Stripe
      }
    );
    const session = await response.json();

    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div className="rd-page">
      <Header />
      {loading ? (
        <p>Loading featured rooms...</p>
      ) : (
        <>
          <section className="rd-hero">
            <div className="rd-carousel">
              <div
                className="rd-slides"
                style={{ transform: `translateX(-${slideIndex * 100}%)` }}
              >
                {images.map((src, index) => (
                  <div className="rd-slide" key={index}>
                    <img src={src} alt={`Room View ${index + 1}`} />
                  </div>
                ))}
              </div>
              <button
                className="rd-carousel-btn rd-prev"
                onClick={() => changeSlide(-1)}
              >
                ❮
              </button>
              <button
                className="rd-carousel-btn rd-next"
                onClick={() => changeSlide(1)}
              >
                ❯
              </button>
              <div className="rd-carousel-dots">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`rd-dot ${slideIndex === index ? "active" : ""}`}
                    onClick={() => setSlideIndex(index)}
                  ></span>
                ))}
              </div>
            </div>
          </section>

          <section className="rd-info-section">
            <div className="rd-info-container">
              <div className="rd-main-info">
                <h1>{roomDetailsData.room_type.type}</h1>
                <p className="rd-description">
                  {roomDetailsData.room_type.description}
                </p>

                <div className="rd-features">
                  <div className="rd-feature">
                    <span className="rd-feature-icon">📏</span>
                    <span className="rd-feature-label">Size</span>
                    <span className="rd-feature-value">{roomDetails.size}</span>
                  </div>
                  <div className="rd-feature">
                    <span className="rd-feature-icon">👥</span>
                    <span className="rd-feature-label">Occupancy</span>
                    <span className="rd-feature-value">
                      {roomDetailsData.capacity}
                    </span>
                  </div>
                  <div className="rd-feature">
                    <span className="rd-feature-icon">🛏️</span>
                    <span className="rd-feature-label">Bed Type</span>
                    <span className="rd-feature-value">
                      {roomDetails.bedType}
                    </span>
                  </div>
                  <div className="rd-feature">
                    <span className="rd-feature-icon">🌅</span>
                    <span className="rd-feature-label">View</span>
                    <span className="rd-feature-value">{roomDetails.view}</span>
                  </div>
                </div>
              </div>

              <div className="rd-booking-card">
                <div className="rd-price-info">
                  <span className="rd-price">
                    ${roomDetailsData.price.$numberDecimal}
                  </span>
                  <span className="rd-per-night">per night</span>
                </div>
                <form className="rd-booking-form">
                  <div className="rd-date-inputs">
                    <div className="rd-input-group">
                      <label>Check In</label>
                      <input
                        name="checkIn"
                        type="date"
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div className="rd-input-group">
                      <label>Check Out</label>
                      <input
                        name="checkOut"
                        type="date"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="rd-price-breakdown">
                    <div className="rd-price-item">
                      <span>Room Rate ({nights} Nights)</span>
                      <span>${roomRate.toFixed(2)}</span>
                    </div>
                    <div className="rd-price-item">
                      <span>Taxes (13%)</span>
                      <span>${taxes.toFixed(2)}</span>
                    </div>
                    <div className="rd-price-item total">
                      <span>Total Amount</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="rd-book-now"
                    onClick={handleSubmit}
                  >
                    Book Now
                  </button>
                </form>
              </div>
            </div>

            <div className="rd-amenities">
              <h2>Room Amenities</h2>
              <div className="rd-amenities-grid">
                {roomDetails.amenities.map((amenity, index) => (
                  <div key={index} className="rd-amenity-card">
                    <span className="rd-amenity-icon">{amenity.icon}</span>
                    <h3>{amenity.name}</h3>
                    <p>{amenity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default RoomDetails;
