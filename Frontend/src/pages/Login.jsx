import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password });
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{
      paddingTop: '60px',
      paddingBottom: '80px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 160px)',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '36px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            marginBottom: '12px',
          }}>
            <ShieldCheck size={24} />
          </div>
          <h2 style={{ fontSize: '1.6rem' }}>
            {isRegister ? 'Clinician Account Intake' : 'Sign in to DiaPredict'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            {isRegister ? 'Register your medical account to log patient evaluations' : 'Access your patient history & AI predictions'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            marginBottom: '20px',
            fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Full Name / Doctor Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-dim)" style={{ position: 'absolute', top: '14px', left: '12px' }} />
                <input
                  type="text"
                  required
                  placeholder="Dr. John Carter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', top: '14px', left: '12px' }} />
              <input
                type="email"
                required
                placeholder="doctor@hospital.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', top: '14px', left: '12px' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : isRegister ? 'Complete Registration' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                style={{ color: 'var(--primary)', fontWeight: 600 }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                style={{ color: 'var(--primary)', fontWeight: 600 }}
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
