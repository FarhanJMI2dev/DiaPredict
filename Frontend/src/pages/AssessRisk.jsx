import React, { useState } from 'react';
import { submitAssessment } from '../services/api';
import { BinaryToggle, SliderInput, SelectInput } from '../components/FormInput';
import {
  Heart,
  Activity,
  Flame,
  Apple,
  Salad,
  Wine,
  Stethoscope,
  DollarSign,
  Smile,
  Brain,
  Footprints,
  User,
  Calendar,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Printer,
  RotateCcw,
  Calculator,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const AGE_OPTIONS = [
  { value: 1.0, label: 'Age 18 to 24' },
  { value: 2.0, label: 'Age 25 to 29' },
  { value: 3.0, label: 'Age 30 to 34' },
  { value: 4.0, label: 'Age 35 to 39' },
  { value: 5.0, label: 'Age 40 to 44' },
  { value: 6.0, label: 'Age 45 to 49' },
  { value: 7.0, label: 'Age 50 to 54' },
  { value: 8.0, label: 'Age 55 to 59' },
  { value: 9.0, label: 'Age 60 to 64' },
  { value: 10.0, label: 'Age 65 to 69' },
  { value: 11.0, label: 'Age 70 to 74' },
  { value: 12.0, label: 'Age 75 to 79' },
  { value: 13.0, label: 'Age 80 or older' },
];

const GEN_HLTH_OPTIONS = [
  { value: 1.0, label: '1 - Excellent Health' },
  { value: 2.0, label: '2 - Very Good Health' },
  { value: 3.0, label: '3 - Good Health' },
  { value: 4.0, label: '4 - Fair Health' },
  { value: 5.0, label: '5 - Poor Health' },
];

const EDUCATION_OPTIONS = [
  { value: 1.0, label: '1 - Never attended school / Kindergarten only' },
  { value: 2.0, label: '2 - Grades 1 through 8 (Elementary)' },
  { value: 3.0, label: '3 - Grades 9 through 11 (Some high school)' },
  { value: 4.0, label: '4 - Grade 12 or GED (High school graduate)' },
  { value: 5.0, label: '5 - College 1 to 3 years (Some college/tech school)' },
  { value: 6.0, label: '6 - College 4+ years (College graduate)' },
];

const INCOME_OPTIONS = [
  { value: 1.0, label: '1 - Less than $10,000' },
  { value: 2.0, label: '2 - $10,000 to $14,999' },
  { value: 3.0, label: '3 - $15,000 to $19,999' },
  { value: 4.0, label: '4 - $20,000 to $24,999' },
  { value: 5.0, label: '5 - $25,000 to $34,999' },
  { value: 6.0, label: '6 - $35,000 to $49,999' },
  { value: 7.0, label: '7 - $50,000 to $74,999' },
  { value: 8.0, label: '8 - $75,000 or more' },
];

const DEFAULT_FORM = {
  HighBP: 0.0,
  HighChol: 0.0,
  CholCheck: 1.0,
  BMI: 25.0,
  Smoker: 0.0,
  Stroke: 0.0,
  HeartDiseaseorAttack: 0.0,
  PhysActivity: 1.0,
  Fruits: 1.0,
  Veggies: 1.0,
  HvyAlcoholConsump: 0.0,
  AnyHealthcare: 1.0,
  NoDocbcCost: 0.0,
  GenHlth: 2.0,
  MentHlth: 0.0,
  PhysHlth: 0.0,
  DiffWalk: 0.0,
  Sex: 1.0,
  Age: 7.0,
  Education: 5.0,
  Income: 6.0,
};

const AssessRisk = () => {
  const [patientName, setPatientName] = useState('');
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // BMI Helper Calculator state
  const [showBmiModal, setShowBmiModal] = useState(false);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(75);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateBmi = () => {
    if (heightCm > 0 && weightKg > 0) {
      const heightM = heightCm / 100;
      const computed = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
      handleFieldChange('BMI', computed);
      setShowBmiModal(false);
    }
  };

  const loadPreset = (type) => {
    if (type === 'healthy') {
      setPatientName('Alexander Vance (Healthy Profile)');
      setFormData({
        HighBP: 0.0,
        HighChol: 0.0,
        CholCheck: 1.0,
        BMI: 22.4,
        Smoker: 0.0,
        Stroke: 0.0,
        HeartDiseaseorAttack: 0.0,
        PhysActivity: 1.0,
        Fruits: 1.0,
        Veggies: 1.0,
        HvyAlcoholConsump: 0.0,
        AnyHealthcare: 1.0,
        NoDocbcCost: 0.0,
        GenHlth: 1.0,
        MentHlth: 0.0,
        PhysHlth: 0.0,
        DiffWalk: 0.0,
        Sex: 0.0,
        Age: 4.0,
        Education: 6.0,
        Income: 8.0,
      });
    } else if (type === 'moderate') {
      setPatientName('David Miller (Pre-diabetes Profile)');
      setFormData({
        HighBP: 1.0,
        HighChol: 0.0,
        CholCheck: 1.0,
        BMI: 28.5,
        Smoker: 1.0,
        Stroke: 0.0,
        HeartDiseaseorAttack: 0.0,
        PhysActivity: 0.0,
        Fruits: 1.0,
        Veggies: 1.0,
        HvyAlcoholConsump: 0.0,
        AnyHealthcare: 1.0,
        NoDocbcCost: 0.0,
        GenHlth: 3.0,
        MentHlth: 4.0,
        PhysHlth: 2.0,
        DiffWalk: 0.0,
        Sex: 1.0,
        Age: 8.0,
        Education: 4.0,
        Income: 5.0,
      });
    } else if (type === 'high') {
      setPatientName('Robert Sterling (High Risk Profile)');
      setFormData({
        HighBP: 1.0,
        HighChol: 1.0,
        CholCheck: 1.0,
        BMI: 35.8,
        Smoker: 1.0,
        Stroke: 0.0,
        HeartDiseaseorAttack: 1.0,
        PhysActivity: 0.0,
        Fruits: 0.0,
        Veggies: 0.0,
        HvyAlcoholConsump: 0.0,
        AnyHealthcare: 1.0,
        NoDocbcCost: 1.0,
        GenHlth: 4.0,
        MentHlth: 12.0,
        PhysHlth: 18.0,
        DiffWalk: 1.0,
        Sex: 1.0,
        Age: 10.0,
        Education: 3.0,
        Income: 3.0,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await submitAssessment(patientName || 'Anonymous Patient', formData);
      setResult(data);

      if (data.riskLevel === 'Low') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      // Scroll to top of results
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Prediction service error');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low':
        return '#10b981';
      case 'Moderate':
        return '#f59e0b';
      case 'High':
      case 'Critical':
        return '#ef4444';
      default:
        return '#06b6d4';
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={16} /> CDC BRFSS Clinical Form
        </div>
        <h1 style={{ fontSize: '2.2rem', marginTop: '4px' }}>Comprehensive Diabetes Risk Screening</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Complete the 21 health indicator questionnaire below to run the Random Forest prediction pipeline.
        </p>
      </div>

      {/* Preset Profiles Quick Bar */}
      <div className="glass-panel" style={{
        padding: '16px 24px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
          <Sparkles size={16} color="var(--primary)" /> Quick Benchmark Presets:
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => loadPreset('healthy')}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            🟢 Healthy Profile
          </button>
          <button
            type="button"
            onClick={() => loadPreset('moderate')}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            🟡 Pre-Diabetes Profile
          </button>
          <button
            type="button"
            onClick={() => loadPreset('high')}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            🔴 High Risk Profile
          </button>
        </div>
      </div>

      {/* Results Display if available */}
      {result && (
        <div className="glass-panel" style={{
          padding: '36px',
          marginBottom: '40px',
          border: `2px solid ${getRiskColor(result.riskLevel)}`,
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          boxShadow: `0 0 40px -10px ${getRiskColor(result.riskLevel)}40`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
            <div>
              <span className={`badge badge-${result.riskLevel.toLowerCase()}`}>
                {result.riskLevel} Risk Tier
              </span>
              <h2 style={{ fontSize: '1.8rem', marginTop: '8px' }}>
                {result.outcome}
              </h2>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                Screened for: <strong style={{ color: '#fff' }}>{result.patientName}</strong> • {new Date(result.createdAt || result.timestamp).toLocaleString()}
              </div>
            </div>

            {/* Score Ring / Pill */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: `4px solid ${getRiskColor(result.riskLevel)}`,
              boxShadow: `0 0 20px ${getRiskColor(result.riskLevel)}33`,
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff' }}>
                {result.riskScorePercentage}%
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Risk Probability
              </span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '20px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Risk Factors */}
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#f59e0b" /> Contributing Risk Factors
              </h4>
              {result.keyRiskFactors && result.keyRiskFactors.length > 0 ? (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.keyRiskFactors.map((rf, idx) => (
                    <li key={idx} style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <span style={{ color: '#f59e0b' }}>•</span> {rf}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#34d399',
                  fontSize: '0.88rem',
                }}>
                  No elevated clinical risk factors detected.
                </div>
              )}
            </div>

            {/* Clinical Recommendations */}
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--primary)" /> Clinical & Lifestyle Guidance
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.recommendations && result.recommendations.map((rec, idx) => (
                  <li key={idx} style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    fontSize: '0.88rem',
                  }}>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              <Printer size={16} /> Print Diagnostic Summary
            </button>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              <RotateCcw size={16} /> New Assessment
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Patient Name Bar */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>
            Patient Identification / Full Name (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. John Doe / Clinic ID #8841"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Section 1: Clinical & Vitals */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={20} color="var(--primary)" /> 1. Clinical Vitals & Measurements
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <BinaryToggle
              label="High Blood Pressure"
              name="HighBP"
              value={formData.HighBP}
              onChange={handleFieldChange}
              tooltip="Ever told by a doctor or health professional you have high BP?"
              icon={Heart}
            />
            <BinaryToggle
              label="High Cholesterol"
              name="HighChol"
              value={formData.HighChol}
              onChange={handleFieldChange}
              tooltip="Ever told by a health professional you have high cholesterol?"
              icon={Activity}
            />
            <BinaryToggle
              label="Cholesterol Checked in 5 Yrs"
              name="CholCheck"
              value={formData.CholCheck}
              onChange={handleFieldChange}
              tooltip="Have you had your cholesterol checked within the past 5 years?"
              icon={Stethoscope}
            />
            <div style={{ position: 'relative' }}>
              <SliderInput
                label="Body Mass Index (BMI)"
                name="BMI"
                value={formData.BMI}
                onChange={handleFieldChange}
                min={12}
                max={60}
                step={0.5}
                tooltip="Calculated from weight and height. Normal: 18.5-24.9, Overweight: 25-29.9, Obese: 30+"
              />
              <button
                type="button"
                onClick={() => setShowBmiModal(true)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '100px',
                  fontSize: '0.75rem',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Calculator size={13} /> Calculate
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Lifestyle & Habits */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="var(--accent-cyan)" /> 2. Lifestyle & Nutrition Habits
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <BinaryToggle
              label="Smoker (>= 100 cigarettes in life)"
              name="Smoker"
              value={formData.Smoker}
              onChange={handleFieldChange}
              tooltip="Have you smoked at least 100 cigarettes in your entire life?"
              icon={Flame}
            />
            <BinaryToggle
              label="Physical Activity in Past 30 Days"
              name="PhysActivity"
              value={formData.PhysActivity}
              onChange={handleFieldChange}
              tooltip="Engaged in exercise/sports outside of job in last 30 days?"
              icon={Activity}
            />
            <BinaryToggle
              label="Fruit Consumption (>= 1/day)"
              name="Fruits"
              value={formData.Fruits}
              onChange={handleFieldChange}
              tooltip="Consume whole fruit or fruit juice at least once daily?"
              icon={Apple}
            />
            <BinaryToggle
              label="Vegetable Consumption (>= 1/day)"
              name="Veggies"
              value={formData.Veggies}
              onChange={handleFieldChange}
              tooltip="Consume vegetables (dark leafy greens, carrots, etc.) at least once daily?"
              icon={Salad}
            />
            <BinaryToggle
              label="Heavy Alcohol Consumption"
              name="HvyAlcoholConsump"
              value={formData.HvyAlcoholConsump}
              onChange={handleFieldChange}
              tooltip="Men: >= 14 drinks/week, Women: >= 7 drinks/week"
              icon={Wine}
            />
            <BinaryToggle
              label="Health Care Coverage"
              name="AnyHealthcare"
              value={formData.AnyHealthcare}
              onChange={handleFieldChange}
              tooltip="Do you have any health insurance or prepaid plans?"
              icon={Stethoscope}
            />
            <BinaryToggle
              label="Avoided Doctor Due to Cost"
              name="NoDocbcCost"
              value={formData.NoDocbcCost}
              onChange={handleFieldChange}
              tooltip="Was there a time in past 12 months you needed a doctor but couldn't afford it?"
              icon={DollarSign}
            />
          </div>
        </div>

        {/* Section 3: Medical History & Functional Well-being */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Brain size={20} color="var(--accent-purple)" /> 3. Medical History & General Well-being
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <BinaryToggle
              label="History of Stroke"
              name="Stroke"
              value={formData.Stroke}
              onChange={handleFieldChange}
              tooltip="Ever told by a medical professional that you had a stroke?"
            />
            <BinaryToggle
              label="Coronary Heart Disease or MI"
              name="HeartDiseaseorAttack"
              value={formData.HeartDiseaseorAttack}
              onChange={handleFieldChange}
              tooltip="Ever told you had coronary heart disease, angina, or heart attack?"
            />
            <BinaryToggle
              label="Difficulty Walking / Climbing Stairs"
              name="DiffWalk"
              value={formData.DiffWalk}
              onChange={handleFieldChange}
              tooltip="Do you have serious difficulty walking or climbing stairs?"
              icon={Footprints}
            />
            <SelectInput
              label="General Health Self-Assessment"
              name="GenHlth"
              value={formData.GenHlth}
              onChange={handleFieldChange}
              options={GEN_HLTH_OPTIONS}
              tooltip="Scale 1 (Excellent) to 5 (Poor)"
              icon={Smile}
            />
            <SliderInput
              label="Days of Poor Mental Health (0-30)"
              name="MentHlth"
              value={formData.MentHlth}
              onChange={handleFieldChange}
              min={0}
              max={30}
              unit="days"
              tooltip="Days in past 30 days mental health was not good (stress, depression, emotions)"
            />
            <SliderInput
              label="Days of Poor Physical Health (0-30)"
              name="PhysHlth"
              value={formData.PhysHlth}
              onChange={handleFieldChange}
              min={0}
              max={30}
              unit="days"
              tooltip="Days in past 30 days physical health was not good (illness, injury)"
            />
          </div>
        </div>

        {/* Section 4: Demographics & Socioeconomic */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={20} color="#f59e0b" /> 4. Demographic & Socioeconomic Indicators
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
            }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>Biological Sex</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleFieldChange('Sex', 0.0)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: formData.Sex === 0.0 ? '#ffffff' : 'var(--text-dim)',
                    backgroundColor: formData.Sex === 0.0 ? 'var(--accent-purple)' : 'transparent',
                  }}
                >
                  Female
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange('Sex', 1.0)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: formData.Sex === 1.0 ? '#ffffff' : 'var(--text-dim)',
                    backgroundColor: formData.Sex === 1.0 ? 'var(--accent-cyan)' : 'transparent',
                  }}
                >
                  Male
                </button>
              </div>
            </div>

            <SelectInput
              label="Age Category"
              name="Age"
              value={formData.Age}
              onChange={handleFieldChange}
              options={AGE_OPTIONS}
              icon={Calendar}
            />
            <SelectInput
              label="Highest Education Level"
              name="Education"
              value={formData.Education}
              onChange={handleFieldChange}
              options={EDUCATION_OPTIONS}
              icon={GraduationCap}
            />
            <SelectInput
              label="Household Income Tier"
              name="Income"
              value={formData.Income}
              onChange={handleFieldChange}
              options={INCOME_OPTIONS}
              icon={DollarSign}
            />
          </div>
        </div>

        {error && (
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            marginBottom: '24px',
            fontSize: '0.9rem',
          }}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              padding: '16px 48px',
              fontSize: '1.1rem',
              minWidth: '280px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span>Running ML Model...</span>
            ) : (
              <>
                Compute Diabetes Risk <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* BMI Calculator Modal */}
      {showBmiModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '420px', width: '90%' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>BMI Auto-Calculator</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Height (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Weight (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowBmiModal(false)}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={calculateBmi}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              >
                Apply BMI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessRisk;
