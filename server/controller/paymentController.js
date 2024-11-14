const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

exports.payment = async (req, res) => {
  try {
    const { user_id, room_id, check_in_date, check_out_date, number_of_guests, total_amount } = req.body;
    const booking = new Booking({
        user_id,
        room_id,
        check_in_date,
        check_out_date,
        number_of_guests,
        total_amount,
        status: "Confirmed",
    });
    await booking.save();

    const payment = new Payment({
        booking_id: booking._id,
        amount: total_amount,
        payment_method: "Stripe",
        status: "Pending",
    });
    await payment.save();

    booking.payment_id = payment._id;
    await booking.save();

    // const { amount } = req.body;
    const stripeData = {
      price_data:{
        currency: "cad",
        product_data: { name: 'Room' },
        unit_amount: total_amount * 100
      },
      quantity: 1
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [stripeData],
      mode:"payment",
      success_url: `${process.env.CLIENT_URI}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URI}/failed`,
      metadata: {
        booking_id: booking._id.toString()
      }
    })
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error: 'Error creating room' });
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
