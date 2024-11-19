import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./roomDetails.css";
import Header from "../Header";
import Footer from "../Footer";

function RoomDetails() {
  const { id } = useParams();
  const [slideIndex, setSlideIndex] = useState(0);
  const [roomDetailsData, setroomDetailsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking states
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nights, setNights] = useState(0);
  const [roomRate, setRoomRate] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URI}/rooms/${id}`
        );
        const data = await response.json();
        setroomDetailsData(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching room details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  const getRoomTypeImages = () => {
    if (roomDetailsData?.room_type?.images?.length > 0) {
      return roomDetailsData.room_type.images.map(
        (img) => `${process.env.REACT_APP_SERVER_URI}${img.url}`
      );
    }
    return ["/api/placeholder/400/300"]; // Fallback image
  };

  const images = getRoomTypeImages();

  const changeSlide = (direction) => {
    setSlideIndex(
      (prevIndex) => (prevIndex + direction + images.length) % images.length
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "checkIn") {
      setCheckIn(value);
    } else {
      setCheckOut(value);
    }

    // Calculate nights and amounts if both dates are set
    if ((checkIn && name === "checkOut") || (checkOut && name === "checkIn")) {
      const date1 = new Date(name === "checkIn" ? value : checkIn);
      const date2 = new Date(name === "checkOut" ? value : checkOut);
      const differenceInMs = date2 - date1;
      const nightsCount = differenceInMs / (1000 * 60 * 60 * 24);

      if (nightsCount > 0 && roomDetailsData?.price?.$numberDecimal) {
        const rate = nightsCount * roomDetailsData.price.$numberDecimal;
        const taxAmount = rate * 0.13; // 13% tax
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
    const user_id = localStorage.getItem("user_id");
    console.log("user_id", user_id);

    // return;
    try {
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
          body: JSON.stringify({
            user_id,
            room_id: id,
            check_in_date: checkIn,
            check_out_date: checkOut,
            total_amount: totalAmount, // Convert to cents
            number_of_guests: roomDetailsData?.capacity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Payment initiation failed");
      }

      const session = await response.json();
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      setError(error.message);
      console.error("Payment error:", error);
    }
  };

  if (loading) {
    return (
      <div className="rd-page">
        <Header />
        <div className="rd-loading">Loading room details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rd-page">
        <Header />
        <div className="rd-error">{error}</div>
      </div>
    );
  }

  const getAmenityIcon = (amenity) => {
    const amenityIcons = {
      WiFi: "📶",
      TV: "📺",
      "Air Conditioning": "❄️",
      "Mini Bar": "🍷",
      "Room Service": "🍽️",
      "Coffee Maker": "☕",
      "Hair Dryer": "💨",
      Safe: "🔒",
      Bathtub: "🛁",
      Shower: "🚿",
      Iron: "👔",
      "Work Desk": "💼",
      Balcony: "🏞️",
      "Ocean View": "🌊",
      "City View": "🌆",
      "Garden View": "🌳",
      "King Bed": "👑",
      "Queen Bed": "🛏️",
      "Single Bed": "🛏️",
      Telephone: "📞",
      Refrigerator: "❄️",
      Microwave: "📡",
      // Add more amenities as needed
    };

    return amenityIcons[amenity] || "✨"; // Default icon if not found
  };

  const getAmenityDescription = (amenity) => {
    const amenityDescriptions = {
      WiFi: "High-speed internet access",
      TV: "Flat-screen TV with cable channels",
      "Air Conditioning": "Climate control system",
      "Mini Bar": "Stocked mini bar with refreshments",
      "Room Service": "24/7 in-room dining service",
      "Coffee Maker": "Coffee and tea making facilities",
      "Hair Dryer": "Professional hair dryer",
      Safe: "In-room electronic safe",
      Bathtub: "Luxury bathtub",
      Shower: "Rain shower system",
      Iron: "Iron and ironing board",
      "Work Desk": "Spacious work area",
      Balcony: "Private balcony space",
      "Ocean View": "Stunning ocean views",
      "City View": "Panoramic city views",
      "Garden View": "Peaceful garden views",
      "King Bed": "Luxurious king-size bed",
      "Queen Bed": "Comfortable queen-size bed",
      "Single Bed": "Cozy single bed",
      Telephone: "Direct dial telephone",
      Refrigerator: "Mini refrigerator",
      Microwave: "Microwave oven",
      // Add more descriptions as needed
    };

    return amenityDescriptions[amenity] || "Available in this room"; // Default description
  };

  return (
    <div className="rd-page">
      <Header />
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
            <h1>{roomDetailsData?.room_type?.type || "Room"}</h1>
            <p className="rd-description">
              {roomDetailsData?.room_type?.description ||
                "No description available"}
            </p>

            <div className="rd-features">
              <div className="rd-feature">
                <span className="rd-feature-icon">👥</span>
                <span className="rd-feature-label">Occupancy</span>
                <span className="rd-feature-value">
                  Up to {roomDetailsData?.capacity || 0} guests
                </span>
              </div>
              <div className="rd-feature">
                <span className="rd-feature-icon">🛏️</span>
                <span className="rd-feature-label">Room Type</span>
                <span className="rd-feature-value">
                  {roomDetailsData?.room_type?.type || "Standard Room"}
                </span>
              </div>
              <div className="rd-feature">
                <span className="rd-feature-icon">✨</span>
                <span className="rd-feature-label">Status</span>
                <span className="rd-feature-value">
                  {roomDetailsData?.status || "Available"}
                </span>
              </div>
            </div>
          </div>

          <div className="rd-booking-card">
            <div className="rd-price-info">
              <span className="rd-price">
                ${roomDetailsData?.price?.$numberDecimal || "0"}
              </span>
              <span className="rd-per-night">per night</span>
            </div>
            <form className="rd-booking-form" onSubmit={handleSubmit}>
              <div className="rd-date-inputs">
                <div className="rd-input-group">
                  <label>Check In</label>
                  <input
                    name="checkIn"
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="rd-input-group">
                  <label>Check Out</label>
                  <input
                    name="checkOut"
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {nights > 0 && (
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
              )}

              <button
                type="submit"
                className="rd-book-now"
                disabled={!nights || roomDetailsData?.status !== "Available"}
              >
                {roomDetailsData?.status === "Available"
                  ? "Book Now"
                  : "Not Available"}
              </button>
            </form>
          </div>
        </div>
      </section>
      <section className="rd-amenities-section">
        <h2>Room Amenities</h2>
        <div className="rd-amenities-grid">
          {roomDetailsData?.amenities?.split(",").map((amenity, index) => (
            <div key={index} className="rd-amenity-card">
              {getAmenityIcon(amenity.trim())}{" "}
              {/* We'll create this function */}
              <h3>{amenity.trim()}</h3>
              <p>{getAmenityDescription(amenity.trim())}</p>{" "}
              {/* We'll create this function */}
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default RoomDetails;
