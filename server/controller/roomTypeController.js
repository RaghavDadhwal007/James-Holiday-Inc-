const RoomType = require('../models/RoomType');
const fs = require('fs');
const path = require('path');

// Create RoomType
exports.createRoomType = async (req, res) => {
  try {
    const { type, description } = req.body;
    const images = req.files ? req.files.map((file, index) => ({
      url: `/uploads/roomTypes/${file.filename}`,
      alt: `${type} image ${index + 1}`,
      isPrimary: req.body[`isPrimary[${index}]`] === 'true'
    })) : [];

    const roomType = new RoomType({
      type,
      description,
      images
    });
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
    console.error('Error retrieving room types:', error);
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
    console.error('Error retrieving room type:', error);
    res.status(500).json({ error: 'Error retrieving room type' });
  }
};

// Update RoomType
exports.updateRoomType = async (req, res) => {
  try {
    const { type, description } = req.body;

    const existingRoomType = await RoomType.findById(req.params.id);
    if (!existingRoomType) {
      return res.status(404).json({ error: 'Room type not found' });
    }

    // Handle new image files
    let images = existingRoomType.images || [];
    
    if (req.files && req.files.length > 0) {
      // Delete old images from filesystem
      existingRoomType.images.forEach(image => {
        const imagePath = path.join(__dirname, '../public', image.url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      // Add new images
      images = req.files.map((file, index) => ({
        url: `/uploads/roomTypes/${file.filename}`,
        alt: `${type} image ${index + 1}`,
        isPrimary: req.body[`isPrimary[${index}]`] === 'true'
      }));
    }

    const roomType = await RoomType.findByIdAndUpdate(
      req.params.id,
      { type, description, images },
      { new: true }
    );
    if (!roomType) return res.status(404).json({ error: 'Room type not found' });
    res.status(200).json(roomType);
  } catch (error) {
    console.error('Error updating room type:', error);
    res.status(500).json({ error: 'Error updating room type' });
  }
};

// Delete RoomType
exports.deleteRoomType = async (req, res) => {
  try {
    const roomType = await RoomType.findByIdAndDelete(req.params.id);
    if (!roomType) return res.status(404).json({ error: 'Room type not found' });
    res.status(200).json({ message: 'Room type deleted successfully' });
     // Delete associated images from filesystem
     roomType.images.forEach(image => {
      const imagePath = path.join(__dirname, '../public', image.url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await RoomType.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room type deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting room type' });
  }
};
