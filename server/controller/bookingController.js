const Booking = require('../models/Booking');

exports.list = async (req, res) => {
  try {
    const booking = await Booking.find();
    res.status(200).json(booking);
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error: 'Error getting booking list' });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.body;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const bookingId = session.metadata.booking_id;
      console.log(session, 'bookingId', bookingId)

      await Payment.findOneAndUpdate(
        { booking_id: bookingId },
        { status: "Completed", amount: session.amount_total / 100, payment_method: "Stripe" }
      );

      await Booking.findByIdAndUpdate(bookingId, { status: "Confirmed" });

      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error confirming payment" });
  }
};