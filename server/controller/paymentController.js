const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

exports.payment = async (req, res) => {
  try {
    const { amount } = req.body;
    const stripeData = {
      price_data:{
        currency: "cad",
        product_data: { name: 'Room' },
        unit_amount: amount
      },
      quantity: 1
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [stripeData],
      mode:"payment",
      success_url: `${process.env.CLIENT_URI}/success`,
      cancel_url: `${process.env.CLIENT_URI}/failed`,
    })
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error: 'Error creating room' });
  }
};

