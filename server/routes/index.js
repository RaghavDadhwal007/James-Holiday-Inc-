var express = require('express');
var router = express.Router();
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');

const generateQRCode = async (bookingId) => {
  try {
    const url = `${process.env.CLIENT_URI}/checkin/${bookingId}`;
    const qrCodeData = await QRCode.toDataURL(url); // Generates a Base64 string
    console.log('qrCodeData', qrCodeData)
    const qrCodeBuffer = await QRCode.toBuffer(url); // Generates a buffer
    return {qrCodeBuffer, qrCodeData};
    // return qrCodeData;
  } catch (error) {
    console.error('Failed to generate QR Code:', error);
  }
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  // port: process.env.EMAIL_PORT,
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("Welcome to JHINC.");
});

router.post('/qr', async (req, res) => {
  const { bookingId, customerEmail } = req.body;
  try {
    const {qrCodeBuffer, qrCodeData} = await generateQRCode(bookingId);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Your Hotel Check-In QR Code',
      html: `
        <h2>Check-In Information</h2>
        <p>Use the following QR code to check in:</p>
        <img src="${qrCodeData}" alt="Check-In QR Code" />
      `,
      attachments: [
        {
          filename: 'checkin_qrcode.png',
          content: qrCodeBuffer,
          contentType: 'image/png',
        },
      ],
  };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email" });
      }
      res.status(200).json({ message: "Check-in email sent successfully." });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
