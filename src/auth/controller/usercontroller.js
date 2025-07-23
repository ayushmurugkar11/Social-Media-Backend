// routes/authRoutes.js
import express from 'express';
import User from '../modles/user.js'; // ✅ corrected
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import verifyToken from '../middleware/jwtmiddleware.js'

const usercontroller = express.Router();


usercontroller.get('/verify-token', verifyToken, (req, res) => {
  res.json({
    message: 'Welcome to the protected home page!',
    user: req.user,
  });
});

usercontroller.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user (validation + password hash will happen in model)
    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id,
    });
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

usercontroller.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_default_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default usercontroller;
