import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, ShieldCheck, Cpu, User, LogOut, LayoutDashboard, Stethoscope, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkServicesHealth } from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [healthStatus, setHealthStatus] = useState({ backend: false, mlService: false });

  useEffect(() => {
    const check = async () => {
      const res = await checkServicesHealth();
      setHealthStatus(res);
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      backgroundColor: 'rgba(10, 15, 29, 0.85)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px',
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
          }}>
            <Activity size={24} color="#0a0f1d" strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              DiaPredict <span style={{ color: 'var(--primary)', fontWeight: 700 }}>AI</span>
            </span>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              CDC BRFSS Machine Intelligence
            </div>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive('/') ? '#10b981' : 'var(--text-muted)',
              backgroundColor: isActive('/') ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <HomeIcon size={16} /> Home
          </Link>

          <Link
            to="/assess"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/assess') ? '#ffffff' : 'var(--text-muted)',
              backgroundColor: isActive('/assess') ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
              boxShadow: isActive('/assess') ? '0 0 15px var(--primary-glow)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <Stethoscope size={16} /> Assess Risk
          </Link>

          <Link
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive('/dashboard') ? '#10b981' : 'var(--text-muted)',
              backgroundColor: isActive('/dashboard') ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <LayoutDashboard size={16} /> Analytics
          </Link>
        </div>

        {/* Right Status & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Microservice Live Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
          }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: healthStatus.mlService ? '#10b981' : '#ef4444',
              boxShadow: healthStatus.mlService ? '0 0 8px #10b981' : 'none',
            }} />
            <span style={{ color: 'var(--text-muted)' }}>FastAPI ML</span>
          </div>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}>
                <User size={15} color="var(--primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name || 'Clinician'}</span>
              </div>
              <button
                onClick={logout}
                style={{
                  color: 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px',
                  borderRadius: '6px',
                }}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <User size={15} /> Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
