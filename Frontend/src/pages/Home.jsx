import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Brain, ArrowRight, CheckCircle2, Zap, BarChart3, Database, HeartPulse } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{
        paddingTop: '60px',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '880px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#34d399',
            marginBottom: '24px',
          }}>
            <Zap size={15} /> Powered by FastAPI & Scikit-Learn Random Forest
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            lineHeight: 1.15,
            marginBottom: '20px',
            fontWeight: 800,
          }}>
            Clinical AI Intelligence for <br />
            <span className="gradient-text-emerald">Precision Diabetes Risk Prediction</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '36px',
          }}>
            Leveraging 21 CDC Behavioral Risk Factor Surveillance System (BRFSS) clinical indicators and machine learning algorithms to compute early diabetes onset probabilities with actionable preventive insights.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/assess" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              <HeartPulse size={20} /> Launch Risk Assessment <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <BarChart3 size={18} /> View Analytics Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '60px',
        }}>
          {/* Card 1 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '20px',
            }}>
              <Brain size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Random Forest Classifier</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Trained on balanced health survey data with 100 decision trees, standard feature scaling, and calibrated probability outputs.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              marginBottom: '20px',
            }}>
              <Activity size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>21 CDC BRFSS Indicators</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Comprehensive multidimensional screening covering hypertension, cholesterol, BMI, physical activity, and socioeconomic metrics.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)',
              marginBottom: '20px',
            }}>
              <Database size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Microservice Architecture</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Decoupled Python FastAPI inference service communicating seamlessly with the Node.js Express backend and React client.
            </p>
          </div>
        </div>

        {/* Diagnostic Workflow Card */}
        <div className="glass-panel" style={{
          padding: '40px',
          background: 'linear-gradient(135deg, rgba(18, 26, 47, 0.9) 0%, rgba(13, 20, 36, 0.9) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Clinical Screening Process
              </span>
              <h2 style={{ fontSize: '1.8rem', marginTop: '6px', marginBottom: '16px' }}>
                How DiaPredict Evaluates Risk
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
                Patients and clinicians answer standard CDC health questionnaire parameters. The system scales each metric and runs ensemble inference to produce real-time risk scores and customized preventive recommendations.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" /> <span>Real-time probability scoring (0-100%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" /> <span>Key risk factor isolation & weighting</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" /> <span>Actionable lifestyle & nutrition interventions</span>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '14px',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
            }}>
              <div style={{ color: 'var(--text-dim)', marginBottom: '12px' }}>// Sample Microservice Inference</div>
              <div style={{ color: '#06b6d4' }}>POST /predict HTTP/1.1</div>
              <div style={{ color: 'var(--text-muted)', margin: '8px 0' }}>
                {"{"} <br />
                &nbsp;&nbsp;"HighBP": 1.0, "BMI": 32.0,<br />
                &nbsp;&nbsp;"GenHlth": 4.0, "Age": 9.0 ...<br />
                {"}"}
              </div>
              <div style={{ color: '#10b981', marginTop: '12px' }}>HTTP/1.1 200 OK</div>
              <div style={{ color: '#a7f3d0' }}>
                {"{"} "risk_score": 42.0%, "level": "Moderate" {"}"}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
