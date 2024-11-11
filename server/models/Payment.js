const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  amount: { type: mongoose.Types.Decimal128, required: true },
  payment_date: { type: Date, default: Date.now },
  payment_method: { 
    type: String, 
    enum: ["Stripe"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Completed", "Pending", "Failed"], 
    default: "Pending" 
  },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
