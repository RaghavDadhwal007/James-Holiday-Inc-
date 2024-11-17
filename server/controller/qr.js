const QRCode = require('qrcode');

const generateQRCode = async (bookingId) => {
  try {
    const url = `https://yourhotelwebsite.com/checkin?bookingId=${bookingId}`;
    const qrCodeData = await QRCode.toDataURL(url); // Generates a Base64 string
    return qrCodeData;
  } catch (error) {
    console.error('Failed to generate QR Code:', error);
  }
};

app.post('/confirmBooking', async (req, res) => {
  const { bookingId, customerEmail } = req.body;
  try {
    const qrCodeData = await generateQRCode(bookingId);
    await sendCheckInEmail(customerEmail, qrCodeData);
    res.status(200).json({ message: 'Booking confirmed and email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});
