const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  room_type: {
    type: mongoose.Schema.Types.ObjectId, // Reference to RoomType collection
    ref: 'RoomType',
    required: true,
  },
  price: {
    type: mongoose.Types.Decimal128, // For decimal values
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  amenities: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Booked', 'Out of Service'],
    default: 'Available',
    required: true,
  },
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
