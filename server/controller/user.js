const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require("../models/User.js");
require('dotenv').config();

// console.log(process.env.e/m)

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
          return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({ name, email, password: await bcrypt.hash(password, 10) });


      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Please click on link to verify!',
        text: `${user.name}, Success Link`,
      };

      transporter.sendMail(mailOptions, async (error) => {
          if (error) {
              console.error('Error sending welcome email:', error);
              return res.status(500).json({ msg: 'User registered but email not sent' });
          }
        await user.save();
        res.json({ token, msg: 'User registered successfully and welcome email sent' });
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
}

exports.forgotUser = async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ msg: 'No user found with this email' });
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
      await user.save();

      const resetUrl = `${process.env.RESET_PASSWORD_URL}/${resetToken}`;
      const mailOptions = {
          to: user.email,
          from: process.env.EMAIL_USER,
          subject: 'Password Reset Request',
          text: `You are receiving this because you have requested to reset your password. Please click the link to reset: ${resetUrl}`,
      };

      transporter.sendMail(mailOptions, (error) => {
          if (error) {
              return res.status(500).json({ msg: 'Error sending email' });
          }
          res.json({ msg: 'Email sent with password reset instructions' });
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
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
