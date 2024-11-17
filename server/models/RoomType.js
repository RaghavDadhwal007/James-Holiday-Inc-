const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String, 
    required: true,
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }]
});

const RoomType = mongoose.model('RoomType', roomTypeSchema);
module.exports = RoomType;
