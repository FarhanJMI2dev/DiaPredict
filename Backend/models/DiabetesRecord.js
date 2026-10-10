const mongoose = require('mongoose');

const diabetesRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional to allow anonymous quick assessments
    },
    patientName: {
      type: String,
      default: 'Anonymous Patient',
    },
    // Clinical & Lifestyle inputs (21 indicators)
    features: {
      HighBP: { type: Number, required: true },
      HighChol: { type: Number, required: true },
      CholCheck: { type: Number, required: true },
      BMI: { type: Number, required: true },
      Smoker: { type: Number, required: true },
      Stroke: { type: Number, required: true },
      HeartDiseaseorAttack: { type: Number, required: true },
      PhysActivity: { type: Number, required: true },
      Fruits: { type: Number, required: true },
      Veggies: { type: Number, required: true },
      HvyAlcoholConsump: { type: Number, required: true },
      AnyHealthcare: { type: Number, required: true },
      NoDocbcCost: { type: Number, required: true },
      GenHlth: { type: Number, required: true },
      MentHlth: { type: Number, required: true },
      PhysHlth: { type: Number, required: true },
      DiffWalk: { type: Number, required: true },
      Sex: { type: Number, required: true },
      Age: { type: Number, required: true },
      Education: { type: Number, required: true },
      Income: { type: Number, required: true },
    },
    // ML Prediction Outputs
    prediction: {
      type: Number,
      required: true,
    },
    outcome: {
      type: String,
      required: true,
    },
    riskScorePercentage: {
      type: Number,
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Critical'],
      required: true,
    },
    keyRiskFactors: [String],
    recommendations: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('DiabetesRecord', diabetesRecordSchema);
