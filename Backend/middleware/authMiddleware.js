const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_diabetes_ai_2026');
      
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        // Fallback user object if DB is not active
        req.user = { _id: decoded.id, email: decoded.email, name: decoded.name || 'User' };
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_diabetes_ai_2026');
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        req.user = { _id: decoded.id, email: decoded.email, name: decoded.name || 'User' };
      }
    } catch (error) {
      // Ignore token invalidity for optional auth
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
