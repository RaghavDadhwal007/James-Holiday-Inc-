const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require("../models/User.js");
require('dotenv').config();
const redisClient = require('../redis');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  // port: process.env.EMAIL_PORT,
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
});

exports.registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
      let user = await User.findOne({ email });
      if (user) {
          return res.status(400).json({ success: false, message: 'User already exists' });
      }

      user = new User({ name, email, password: await bcrypt.hash(password, 10), phone });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Please click on link to verify!',
        text: `${user.name}, Please Click on this link to verify ${process.env.CLIENT_URI}/verify/${token}`,
      };

      transporter.sendMail(mailOptions, async (error) => {
          if (error) {
              console.error('Error sending welcome email:', error);
              return res.status(500).json({ success: false, message: 'User registered but email not sent' });
          }
        await user.save();
        res.json({ success: true, message: 'User registered successfully and welcome email sent' });
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
}

exports.verifyUser = async (req, res) => {
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ success: true, message: "User verified successfully" });

  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: "User not verified. Please check your email for verification link." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success:false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "5h" });

    res.status(200).json({ success: true, token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `${process.env.CLIENT_URI}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset your password",
      text: `Click the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email" });
      }
      res.status(200).json({ message: "Password reset link sent to your email." });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset link expired" });
    }
    res.status(500).json({ message: "Invalid or expired reset link" });
  }
}

exports.updateUser = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}

exports.deleteUser = async (req,res,next)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}

exports.getUser = async (req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

exports.getUsers = async (req,res,next)=>{
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

exports.getUser = async (req,res,next)=>{
  const userId = req.params.id;

  const cachedUser = await redisClient.get(`user:${userId}`);
  
  if (cachedUser) {
    return res.json(JSON.parse(cachedUser));
  }

  try {
    const user = await User.findById(userId);
    
    if (user) {
      await redisClient.setEx(`user:${userId}`, 3600, JSON.stringify(user)); // Cache data for 1 hour
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
