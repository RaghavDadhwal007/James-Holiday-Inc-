import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./roomsList.css";
import Header from "../Header";
import Footer from "../Footer";

// Utility function to parse search parameters
const parseSearchParams = (search) => {
  const searchParams = new URLSearchParams(search);
  return {
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    capacity: searchParams.get("capacity") || "",
    roomType: "",
    status: searchParams.get("status") || "Available",
  };
};

// Utility function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

// Utility function to get room type image
const getRoomTypeImage = (roomType) => {
  return `${process.env.REACT_APP_SERVER_URI}` + roomType.images[0].url;
  if (roomType?.images?.length > 0) {
    const primaryImage =
      roomType.images.find((img) => img.isPrimary) || roomType.images[0];
    return `${process.env.REACT_APP_SERVER_URI}${primaryImage.url}`;
  }
  return "";
};

const RoomsList = () => {
  const location = useLocation();
  const [roomsData, setRoomsData] = useState([]);
  const [roomTypeData, setRoomTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(() =>
    parseSearchParams(location.search)
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch room types
        const roomTypesResponse = await fetch(
          `${process.env.REACT_APP_SERVER_URI}/roomTypes`
        );
        if (!roomTypesResponse.ok) {
          throw new Error("Failed to fetch room types");
        }
        const roomTypesData = await roomTypesResponse.json();
        setRoomTypeData(roomTypesData);

        // Handle room type filtering
        const searchParams = new URLSearchParams(location.search);
        const roomTypeId = searchParams.get("room_type");
        if (roomTypeId) {
          const roomType = roomTypesData.find((rt) => rt._id === roomTypeId);
          if (roomType) {
            setFilters((prev) => ({ ...prev, roomType: roomType.type }));
          }
        }

        // Construct rooms fetch URL
        let roomsUrl = new URL(`${process.env.REACT_APP_SERVER_URI}/rooms`);
        searchParams.forEach((value, key) => {
          roomsUrl.searchParams.append(key, value);
        });

        // Ensure available status if not specified
        if (!searchParams.has("status")) {
          roomsUrl.searchParams.append("status", "Available");
        }

        const roomsResponse = await fetch(roomsUrl.toString());
        if (!roomsResponse.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const roomsData = await roomsResponse.json();
        setRoomsData(roomsData);

        // Update filters from URL params
        setFilters((prev) => ({
          ...prev,
          ...parseSearchParams(location.search),
        }));
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [location.search]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const searchParams = new URLSearchParams();

      // Add filters to search params
      if (filters.roomType) {
        const roomTypeObj = roomTypeData.find(
          (rt) => rt.type === filters.roomType
        );
        if (roomTypeObj) {
          searchParams.append("room_type", roomTypeObj._id);
        }
      }

      if (filters.capacity) {
        searchParams.append("capacity", filters.capacity);
      }

      if (filters.checkIn) {
        searchParams.append("checkIn", filters.checkIn);
      }

      if (filters.checkOut) {
        searchParams.append("checkOut", filters.checkOut);
      }

      // Always include status=Available
      searchParams.append("status", "Available");

      // Update URL
      window.history.pushState(
        {},
        "",
        `${window.location.pathname}?${searchParams.toString()}`
      );

      // Fetch filtered rooms
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/rooms?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data = await response.json();
      setRoomsData(data);
    } catch (error) {
      setError("Error searching rooms. Please try again.");
      console.error("Error searching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rl-container">
      <Header />

      <section className="rl-hero">
        <div className="rl-hero-content">
          <h1>Discover Our Rooms</h1>
          <p>
            Experience luxury and comfort in our carefully designed
            accommodations
          </p>
        </div>
      </section>

      <section className="rl-search-section">
        <div className="rl-search-container">
          <div className="rl-search-input">
            <span className="rl-input-icon">📅</span>
            <input
              type="date"
              value={filters.checkIn}
              onChange={(e) =>
                setFilters({ ...filters, checkIn: e.target.value })
              }
              min={getTodayDate()}
              placeholder="Check-in Date"
            />
          </div>

          <div className="rl-search-input">
            <span className="rl-input-icon">📅</span>
            <input
              type="date"
              value={filters.checkOut}
              onChange={(e) =>
                setFilters({ ...filters, checkOut: e.target.value })
              }
              min={filters.checkIn || getTodayDate()}
              placeholder="Check-out Date"
            />
          </div>

          <div className="rl-search-input">
            <span className="rl-input-icon">👥</span>
            <input
              type="number"
              value={filters.capacity}
              onChange={(e) =>
                setFilters({ ...filters, capacity: e.target.value })
              }
              min="1"
              max="10"
              placeholder="Number of Guests"
            />
          </div>

          <div className="rl-search-input">
            <span className="rl-input-icon">🏨</span>
            <select
              value={filters.roomType}
              onChange={(e) =>
                setFilters({ ...filters, roomType: e.target.value })
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

          <button className="rl-search-button" onClick={handleSearch}>
            <span>🔍</span> Search Rooms
          </button>
        </div>
      </section>

      {error && <div className="rl-error-message">{error}</div>}

      {loading ? (
        <div className="rl-loading">
          <div className="rl-spinner"></div>
          <p>Loading rooms...</p>
        </div>
      ) : roomsData.length === 0 ? (
        <div className="rl-no-results">
          <h3>No Rooms Found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      ) : (
        <section className="rl-rooms-grid">
          {roomsData.map((room) => (
            <div key={room._id} className="rl-room-card">
              <div className="rl-room-image">
                <img
                  src={getRoomTypeImage(room.room_type)}
                  alt={room.room_type?.type}
                  // onError={(e) => {
                  //   e.target.onerror = null;
                  //   e.target.src = {room.images[0].url};
                  // }}
                />
                <div className="rl-room-price">
                  ${room.price?.$numberDecimal || "0"}
                  <span>/night</span>
                </div>
              </div>
              <div className="rl-room-info">
                <h3>{room.room_type?.type || "Room"}</h3>
                <div className="rl-room-details">
                  <span>👥 Up to {room.capacity} guests</span>
                  <span
                    className={`rl-status-badge rl-status-${room.status?.toLowerCase()}`}
                  >
                    {room.status}
                  </span>
                </div>
                <div className="rl-room-amenities">
                  {room.amenities?.split(",").map((amenity, index) => (
                    <span key={index} className="rl-amenity-tag">
                      ✓ {amenity.trim()}
                    </span>
                  ))}
                </div>
                <div className="rl-room-actions">
                  <Link
                    to={`/roomDetails/${room._id}`}
                    className="rl-view-details-btn"
                  >
                    View Details
                  </Link>
                  {room.status === "Available" && (
                    <Link
                      to={`/roomDetails/${room._id}`}
                      className="rl-book-now-btn"
                    >
                      Book Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      <Footer />
    </div>
  );
};

export default RoomsList;
