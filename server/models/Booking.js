const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  payment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  check_in_date: { type: Date, required: true },
  check_out_date: { type: Date, required: true },
  number_of_guests: { type: Number, required: true },
  total_amount: { type: mongoose.Types.Decimal128, required: true },
  status: { 
    type: String, 
    enum: ["Confirmed", "Canceled"], 
    default: "Confirmed" 
  },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
