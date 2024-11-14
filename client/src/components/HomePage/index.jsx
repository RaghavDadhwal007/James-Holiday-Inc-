import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./homePage.css";
import Header from "../Header";
import Footer from "../Footer";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945";

const HomePage = () => {
  const [roomTypeData, setRoomTypeData] = useState([]);
  const [searchData, setSearchData] = useState({
    checkIn: "",
    checkOut: "",
    capacity: "",
    roomType: "",
  });
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getRoomImage = (roomType) => {
    try {
      if (roomType?.images?.length > 0) {
        const primaryImage =
          roomType.images.find((img) => img.isPrimary) || roomType.images[0];
        return `${process.env.REACT_APP_SERVER_URI}${primaryImage.url}`;
      }
      return FALLBACK_IMAGE;
    } catch (error) {
      console.error("Error getting room image:", error);
      return FALLBACK_IMAGE;
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both rooms and room types
        const [roomsResponse, roomTypesResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_SERVER_URI}/rooms?status=Available`),
          fetch(`${process.env.REACT_APP_SERVER_URI}/roomTypes`),
        ]);

        if (!roomsResponse.ok || !roomTypesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const roomsData = await roomsResponse.json();
        const roomTypesData = await roomTypesResponse.json();

        // Get one room per type and sort by price
        const uniqueRoomTypes = new Map();

        // Sort rooms by price before filtering
        const sortedRooms = roomsData.sort(
          (a, b) =>
            parseFloat(a.price.$numberDecimal) -
            parseFloat(b.price.$numberDecimal)
        );

        sortedRooms.forEach((room) => {
          if (!uniqueRoomTypes.has(room.room_type._id)) {
            // Count available rooms of this type
            const availableRoomsOfType = roomsData.filter(
              (r) =>
                r.room_type._id === room.room_type._id &&
                r.status === "Available"
            ).length;

            uniqueRoomTypes.set(room.room_type._id, {
              ...room,
              isLastAvailable: availableRoomsOfType === 1,
              totalAvailable: availableRoomsOfType,
            });
          }
        });

        // Convert Map values to array
        const filteredRooms = Array.from(uniqueRoomTypes.values());

        setFeaturedRooms(filteredRooms);
        setRoomTypeData(roomTypesData);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const searchParams = new URLSearchParams();

      if (searchData.roomType) {
        const roomTypeObj = roomTypeData.find(
          (roomType) => roomType.type === searchData.roomType
        );
        if (roomTypeObj) {
          searchParams.append("room_type", roomTypeObj._id);
        }
      }

      if (searchData.capacity) {
        searchParams.append("capacity", searchData.capacity);
      }

      if (searchData.checkIn) {
        searchParams.append("checkIn", searchData.checkIn);
      }

      if (searchData.checkOut) {
        searchParams.append("checkOut", searchData.checkOut);
      }

      // Always include status=Available
      searchParams.append("status", "Available");

      // Navigate to rooms list with search params
      window.location.href = `/roomsList?${searchParams.toString()}`;
    } catch (error) {
      setError("Error processing search. Please try again.");
      console.error("Error processing search:", error);
    }
  };

  const RoomCard = ({ room }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="room-card">
        <div className="room-image">
          <img
            src={imageError ? FALLBACK_IMAGE : getRoomImage(room.room_type)}
            alt={room.room_type?.type || "Hotel Room"}
            onError={() => setImageError(true)}
            loading="lazy"
          />
          <div className="room-price">
            ${room.price?.$numberDecimal || "0"}
            <span>/night</span>
          </div>
        </div>
        <div className="room-info">
          <h3>{room.room_type?.type || "Room"}</h3>
          <div className="room-details">
            <span>👥 Up to {room.capacity} guests</span>
            <div className="status-badges">
              <span
                className={`status-badge status-${room.status?.toLowerCase()}`}
              >
                {room.status}
              </span>
              {room.isLastAvailable && (
                <span className="status-badge status-last-available">
                  Last Available
                </span>
              )}
              {room.totalAvailable > 1 && (
                <span className="status-badge status-count">
                  {room.totalAvailable} rooms available
                </span>
              )}
            </div>
          </div>
          <div className="room-amenities">
            {room.amenities?.split(",").map((amenity, index) => (
              <span key={index} className="amenity-tag">
                ✓ {amenity.trim()}
              </span>
            ))}
          </div>
          <div className="room-actions">
            <Link to={`/roomDetails/${room._id}`} className="view-details-btn">
              View Details
            </Link>
            <Link to={`/roomDetails/${room._id}`} className="book-now-btn">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="homepage">
      <Header />
      <section className="hero">
        <img
          src={FALLBACK_IMAGE}
          alt="Luxury Hotel View"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Experience Luxury Living</h1>
          <p>Discover comfort and elegance at its finest</p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-container">
              <div className="search-input">
                <span className="input-icon">📅</span>
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) =>
                    setSearchData({ ...searchData, checkIn: e.target.value })
                  }
                  min={getTodayDate()}
                  placeholder="Check-in Date"
                  required
                />
              </div>

              <div className="search-input">
                <span className="input-icon">📅</span>
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) =>
                    setSearchData({ ...searchData, checkOut: e.target.value })
                  }
                  min={searchData.checkIn || getTodayDate()}
                  placeholder="Check-out Date"
                  required
                />
              </div>

              <div className="search-input">
                <span className="input-icon">👥</span>
                <input
                  type="number"
                  value={searchData.capacity}
                  onChange={(e) =>
                    setSearchData({ ...searchData, capacity: e.target.value })
                  }
                  min="1"
                  max="10"
                  placeholder="Number of Guests"
                  required
                />
              </div>

              <div className="search-input">
                <span className="input-icon">🏨</span>
                <select
                  value={searchData.roomType}
                  onChange={(e) =>
                    setSearchData({ ...searchData, roomType: e.target.value })
                  }
                >
                  <option value="">All Room Types</option>
                  {roomTypeData.map((roomType) => (
                    <option key={roomType._id} value={roomType.type}>
                      {roomType.type}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="search-button">
                <span>🔍</span> Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="featured-rooms">
        <h2>Our Available Rooms</h2>
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : featuredRooms.length === 0 ? (
          <div className="no-results">
            <h3>No Rooms Available</h3>
            <p>Please check back later for available rooms</p>
          </div>
        ) : (
          <div className="room-grid">
            {featuredRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </section>

      <section className="amenities">
        <h2>Our Amenities</h2>
        <div className="amenities-grid">
          <div className="amenity-card">
            <span className="amenity-icon">🏊‍♂️</span>
            <h3>Swimming Pool</h3>
            <p>Outdoor infinity pool with ocean view</p>
          </div>
          <div className="amenity-card">
            <span className="amenity-icon">🍽️</span>
            <h3>Restaurant</h3>
            <p>24/7 fine dining experience</p>
          </div>
          <div className="amenity-card">
            <span className="amenity-icon">💆‍♂️</span>
            <h3>Spa Center</h3>
            <p>Relaxation and wellness treatments</p>
          </div>
          <div className="amenity-card">
            <span className="amenity-icon">🏋️‍♂️</span>
            <h3>Fitness Center</h3>
            <p>Modern equipment and trainers</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
