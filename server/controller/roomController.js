const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
  try {
    const { room_type, price, capacity, amenities, status } = req.body;
    const room = new Room({ room_type, price, capacity, amenities, status });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ error: 'Error creating room' });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const { room_type, minPrice, maxPrice, capacity, status } = req.query;

    let query = {};

    if (room_type) {
      query.room_type = room_type;
    }
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = parseFloat(minPrice); 
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice); 
      }
    }
    if (capacity) {
      query.capacity = capacity; 
    }
    if (status) {
      query.status = status; 
    }

    const rooms = await Room.find(query).populate('room_type');
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving rooms' });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('room_type');
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving room' });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { room_type, price, capacity, amenities, status } = req.body;
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { room_type, price, capacity, amenities, status },
      { new: true }
    );
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Error updating room' });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting room' });
  }
};
