const axios = require('axios');
const DiabetesRecord = require('../models/DiabetesRecord');
const { getDBStatus } = require('../config/db');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

// In-memory records fallback when MongoDB is not connected
const inMemoryRecords = [];

// @desc    Process a diabetes risk prediction via FastAPI ML Microservice
// @route   POST /api/diabetes/predict
// @access  Public (Optional User Auth)
const predictDiabetes = async (req, res) => {
  try {
    const features = req.body.features || req.body;
    const patientName = req.body.patientName || (req.user ? req.user.name : 'Anonymous Patient');

    // 1. Call FastAPI Microservice
    let mlResponse;
    try {
      mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, features, {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (mlErr) {
      console.error('[ML SERVICE ERROR]', mlErr.message);
      return res.status(502).json({
        success: false,
        message: `Machine Learning Microservice unavailable at ${ML_SERVICE_URL}. Ensure FastAPI is running.`,
        error: mlErr.message,
      });
    }

    const {
      prediction,
      outcome,
      risk_score_percentage,
      risk_level,
      key_risk_factors,
      recommendations,
      timestamp,
    } = mlResponse.data;

    const recordData = {
      user: req.user ? req.user._id : null,
      patientName,
      features,
      prediction,
      outcome,
      riskScorePercentage: risk_score_percentage,
      riskLevel: risk_level,
      keyRiskFactors: key_risk_factors,
      recommendations,
      createdAt: new Date(),
    };

    // 2. Persist record to MongoDB or in-memory array
    let savedRecord;
    if (getDBStatus()) {
      savedRecord = await DiabetesRecord.create(recordData);
    } else {
      savedRecord = {
        _id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        ...recordData,
      };
      inMemoryRecords.unshift(savedRecord);
    }

    return res.status(200).json({
      success: true,
      data: savedRecord,
    });
  } catch (error) {
    console.error('[DIABETES CONTROLLER ERROR]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during risk evaluation',
    });
  }
};

// @desc    Get user screening history
// @route   GET /api/diabetes/history
// @access  Private / Public
const getHistory = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;

    if (getDBStatus()) {
      const query = userId ? { user: userId } : {};
      const records = await DiabetesRecord.find(query).sort({ createdAt: -1 }).limit(50);
      return res.json({ success: true, count: records.length, data: records });
    } else {
      const filtered = userId
        ? inMemoryRecords.filter((r) => String(r.user) === String(userId))
        : inMemoryRecords;
      return res.json({ success: true, count: filtered.length, data: filtered });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single screening record by ID
// @route   GET /api/diabetes/record/:id
// @access  Public
const getRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const record = await DiabetesRecord.findById(id);
      if (!record) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }
      return res.json({ success: true, data: record });
    } else {
      const record = inMemoryRecords.find((r) => r._id === id);
      if (!record) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }
      return res.json({ success: true, data: record });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get overall analytics / statistics
// @route   GET /api/diabetes/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    let totalScreenings = 0;
    let highRiskCount = 0;
    let moderateRiskCount = 0;
    let lowRiskCount = 0;
    let avgRiskScore = 0;

    if (getDBStatus()) {
      const records = await DiabetesRecord.find({});
      totalScreenings = records.length;
      if (totalScreenings > 0) {
        highRiskCount = records.filter((r) => r.riskLevel === 'High' || r.riskLevel === 'Critical').length;
        moderateRiskCount = records.filter((r) => r.riskLevel === 'Moderate').length;
        lowRiskCount = records.filter((r) => r.riskLevel === 'Low').length;
        avgRiskScore = records.reduce((acc, r) => acc + (r.riskScorePercentage || 0), 0) / totalScreenings;
      }
    } else {
      totalScreenings = inMemoryRecords.length;
      if (totalScreenings > 0) {
        highRiskCount = inMemoryRecords.filter((r) => r.riskLevel === 'High' || r.riskLevel === 'Critical').length;
        moderateRiskCount = inMemoryRecords.filter((r) => r.riskLevel === 'Moderate').length;
        lowRiskCount = inMemoryRecords.filter((r) => r.riskLevel === 'Low').length;
        avgRiskScore = inMemoryRecords.reduce((acc, r) => acc + (r.riskScorePercentage || 0), 0) / totalScreenings;
      }
    }

    return res.json({
      success: true,
      stats: {
        totalScreenings,
        highRiskCount,
        moderateRiskCount,
        lowRiskCount,
        avgRiskScore: Math.round(avgRiskScore * 10) / 10,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  predictDiabetes,
  getHistory,
  getRecordById,
  getStats,
};
