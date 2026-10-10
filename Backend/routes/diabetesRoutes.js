const express = require('express');
const router = express.Router();
const {
  predictDiabetes,
  getHistory,
  getRecordById,
  getStats,
} = require('../controllers/diabetesController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');

router.post('/predict', optionalAuth, predictDiabetes);
router.get('/history', optionalAuth, getHistory);
router.get('/stats', getStats);
router.get('/record/:id', getRecordById);

module.exports = router;
