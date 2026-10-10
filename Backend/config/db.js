const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/diabetes_prediction_db', {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[DATABASE] MongoDB Connection Warning: ${error.message}. (Backend will continue running; database persistence is disabled until MongoDB is available).`);
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
