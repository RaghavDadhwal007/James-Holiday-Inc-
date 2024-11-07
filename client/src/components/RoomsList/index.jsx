import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./roomsList.css";
import Header from "../Header";

const RoomsList = () => {
  const [roomsData, setRoomsData] = useState([]);
  const [roomTypeData, setRoomTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    checkIn: "",
    checkOut: "",
    capacity: "",
    roomType: "",
    roomTypeID: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URI}/rooms`
        );
        const responseData = await fetch(
          `${process.env.REACT_APP_SERVER_URI}/roomTypes`
        );
        const data = await response.json();
        const typeData = await responseData.json();
        setRoomsData(data);
        setRoomTypeData(typeData);
      } catch (error) {
        console.error("Error fetching featured rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const rooms = [
    {
      title: "Deluxe Room",
      price: 200,
      imgSrc:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-9adA4eaOlSpe_LJEKzxGJjigLJtjGs8ATg&s",
      link: "/roomdetails/Deluxe",
      amenities: ["Free Wi-Fi", "Ocean View", "Mini Bar", "Room Service"],
      size: "45 m²",
      maxGuests: 2,
    },
    {
      title: "Luxury Suite",
      price: 350,
      imgSrc:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD6Kn6DuellFmvWWhJAmHXTedcQTEyJP8wgg&s",
      link: "/roomdetails/LuxurySuite",
      amenities: [
        "Free Wi-Fi",
        "Ocean View",
        "Mini Bar",
        "Room Service",
        "Jacuzzi",
      ],
      size: "75 m²",
      maxGuests: 4,
    },
    {
      title: "Luxury Suite",
      price: 350,
      imgSrc:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD6Kn6DuellFmvWWhJAmHXTedcQTEyJP8wgg&s",
      link: "/roomdetails/LuxurySuite",
      amenities: [
        "Free Wi-Fi",
        "Ocean View",
        "Mini Bar",
        "Room Service",
        "Jacuzzi",
      ],
      size: "75 m²",
      maxGuests: 4,
    },
    {
      title: "Luxury Suite",
      price: 350,
      imgSrc:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD6Kn6DuellFmvWWhJAmHXTedcQTEyJP8wgg&s",
      link: "/roomdetails/LuxurySuite",
      amenities: [
        "Free Wi-Fi",
        "Ocean View",
        "Mini Bar",
        "Room Service",
        "Jacuzzi",
      ],
      size: "75 m²",
      maxGuests: 4,
    },
    // ... Add similar detailed objects for other rooms
  ];

  const handleSearch = async () => {
    console.log(roomTypeData, "filters", filters);
    const roomTypeID = roomTypeData.find(
      (roomType) => roomType.type === filters.roomType
    )._id;
    console.log("roomTypeID", roomTypeID);
    const obj = {
      room_type: roomTypeID,
      capacity: filters.capacity,
      status: "Available",
    };
    const params = new URLSearchParams(obj);
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URI}/rooms?${params.toString()}`
    );
    const data = await response.json();
    console.log("data", data);
    setRoomsData(data);
  };

  return (
    <div className="rooms-page">
      {/* Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="rooms-hero">
        <div className="hero-content">
          <h1>Discover Our Rooms</h1>
          <p>
            Experience luxury and comfort in our carefully designed
            accommodations
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-input">
            <span className="input-icon">📅</span>
            <input
              type="date"
              value={filters.checkIn}
              onChange={(e) =>
                setFilters({ ...filters, checkIn: e.target.value })
              }
              placeholder="Check-in Date"
            />
          </div>

          <div className="search-input">
            <span className="input-icon">📅</span>
            <input
              type="date"
              value={filters.checkOut}
              onChange={(e) =>
                setFilters({ ...filters, checkOut: e.target.value })
              }
              placeholder="Check-out Date"
            />
          </div>

          <div className="search-input">
            <span className="input-icon">👥</span>
            <input
              type="number"
              value={filters.capacity}
              onChange={(e) =>
                setFilters({ ...filters, capacity: e.target.value })
              }
              min="1"
              placeholder="Guests"
            />
          </div>

          <div className="search-input">
            <span className="input-icon">🏨</span>
            <select
              value={filters.roomType}
              onChange={(e) =>
                setFilters({ ...filters, roomType: e.target.value })
              }
            >
              <option value="">Select Room Type</option>
              {roomTypeData.map((roomType) => (
                <option key={roomType._id} value={roomType.type}>
                  {roomType.type}
                </option>
              ))}
            </select>
          </div>

          <button className="search-button" onClick={handleSearch}>
            <span>🔍</span> Search Rooms
          </button>
        </div>
      </section>

      {/* Rooms Grid */}
      {loading ? (
        <p>Loading featured rooms...</p>
      ) : (
        <section className="rooms-grid">
          {roomsData.map((room, index) => (
            <div key={room._id} className="room-card">
              <div className="room-image">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD6Kn6DuellFmvWWhJAmHXTedcQTEyJP8wgg&s"
                  alt={room.room_type.type}
                />
                <div className="room-price">
                  ${room.price.$numberDecimal}
                  <span>/night</span>
                </div>
              </div>
              <div className="room-info">
                <h3>{room.room_type.type}</h3>
                <div className="room-details">
                  <span>📏 {room.size}</span>
                  <span>👥 Up to {room.capacity} guests</span>
                </div>
                <div className="room-amenities">
                  <span className="amenity-tag">✓ {room.amenities}</span>
                </div>
                <div className="room-actions">
                  <Link
                    to={`/roomDetails/${room._id}`}
                    className="view-details-btn"
                  >
                    View Details
                  </Link>
                  <Link to="/" className="book-now-btn"></Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>James Holiday Inc.</h3>
            <p>Experience luxury and comfort</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/faq">FAQs</Link>
              </li>
              <p className="footer-section">
                &copy; 2024 James Holiday Inc. All rights reserved.
              </p>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>📞 +1 234 567 890</p>
            <p>📧 info@jamesholiday.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RoomsList;
