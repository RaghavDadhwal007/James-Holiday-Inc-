const RoomType = require('../models/RoomType');

// Create RoomType
exports.createRoomType = async (req, res) => {
  try {
    const { type, description } = req.body;
    const roomType = new RoomType({ type, description });
    await roomType.save();
    res.status(201).json(roomType);
  } catch (error) {
    res.status(500).json({ error: 'Error creating room type' });
  }
};

// Get All RoomTypes
exports.getRoomTypes = async (req, res) => {
  try {
    const roomTypes = await RoomType.find();
    res.status(200).json(roomTypes);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving room types' });
  }
};

// Get RoomType by ID
exports.getRoomTypeById = async (req, res) => {
  try {
    const roomType = await RoomType.findById(req.params.id);
    if (!roomType) return res.status(404).json({ error: 'Room type not found' });
    res.status(200).json(roomType);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving room type' });
  }
};

// Update RoomType
exports.updateRoomType = async (req, res) => {
  try {
    const { type, description } = req.body;
    const roomType = await RoomType.findByIdAndUpdate(
      req.params.id,
      { type, description },
      { new: true }
    );
    if (!roomType) return res.status(404).json({ error: 'Room type not found' });
    res.status(200).json(roomType);
  } catch (error) {
    res.status(500).json({ error: 'Error updating room type' });
  }
};

// Delete RoomType
exports.deleteRoomType = async (req, res) => {
  try {
    const roomType = await RoomType.findByIdAndDelete(req.params.id);
    if (!roomType) return res.status(404).json({ error: 'Room type not found' });
    res.status(200).json({ message: 'Room type deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting room type' });
  }
};
