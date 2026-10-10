const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');

// In-memory user store fallback if MongoDB is not connected
const inMemoryUsers = new Map();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'super_secret_jwt_key_diabetes_ai_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (getDBStatus()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        age,
        gender,
      });

      return res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          gender: user.gender,
        },
        token: generateToken(user),
      });
    } else {
      // Fallback in-memory registration for local dev when Mongo is offline
      const normalizedEmail = email.toLowerCase();
      if (inMemoryUsers.has(normalizedEmail)) {
        return res.status(400).json({ success: false, message: 'User already exists in session' });
      }
      const fakeUser = {
        _id: 'user_' + Date.now(),
        name,
        email: normalizedEmail,
        password, // For test fallback
        age: age || 35,
        gender: gender || 'other',
      };
      inMemoryUsers.set(normalizedEmail, fakeUser);

      return res.status(201).json({
        success: true,
        user: {
          _id: fakeUser._id,
          name: fakeUser.name,
          email: fakeUser.email,
          age: fakeUser.age,
          gender: fakeUser.gender,
        },
        token: generateToken(fakeUser),
        notice: 'Registered in in-memory session (MongoDB disconnected)',
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (getDBStatus()) {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            gender: user.gender,
          },
          token: generateToken(user),
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      // Fallback in-memory login
      const normalizedEmail = email.toLowerCase();
      const user = inMemoryUsers.get(normalizedEmail);
      if (user && user.password === password) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            gender: user.gender,
          },
          token: generateToken(user),
        });
      }
      // If user doesn't exist, create demo quick login
      const demoUser = {
        _id: 'user_demo_' + Date.now(),
        name: email.split('@')[0] || 'Demo Clinician',
        email: normalizedEmail,
        password,
        age: 40,
        gender: 'male',
      };
      inMemoryUsers.set(normalizedEmail, demoUser);
      return res.json({
        success: true,
        user: {
          _id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          age: demoUser.age,
          gender: demoUser.gender,
        },
        token: generateToken(demoUser),
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
