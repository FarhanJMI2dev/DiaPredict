import React from 'react';
import { HelpCircle } from 'lucide-react';

export const BinaryToggle = ({ label, name, value, onChange, tooltip, icon: Icon }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--border-subtle)',
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {Icon && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: value === 1.0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: value === 1.0 ? 'var(--primary)' : 'var(--text-dim)',
          }}>
            <Icon size={18} />
          </div>
        )}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {label}
            </span>
            {tooltip && (
              <span title={tooltip} style={{ cursor: 'help', color: 'var(--text-dim)' }}>
                <HelpCircle size={14} />
              </span>
            )}
          </div>
          {tooltip && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {tooltip}
            </div>
          )}
        </div>
      </div>

      {/* Button Group */}
      <div style={{
        display: 'flex',
        padding: '3px',
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--border-subtle)',
      }}>
        <button
          type="button"
          onClick={() => onChange(name, 0.0)}
          style={{
            padding: '6px 16px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: value === 0.0 ? '#ffffff' : 'var(--text-dim)',
            backgroundColor: value === 0.0 ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
            transition: 'all 0.2s',
          }}
        >
          No
        </button>
        <button
          type="button"
          onClick={() => onChange(name, 1.0)}
          style={{
            padding: '6px 16px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: value === 1.0 ? '#ffffff' : 'var(--text-dim)',
            backgroundColor: value === 1.0 ? '#10b981' : 'transparent',
            boxShadow: value === 1.0 ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Yes
        </button>
      </div>
    </div>
  );
};

export const SliderInput = ({ label, name, value, onChange, min, max, step = 1, unit = '', tooltip, icon: Icon }) => {
  return (
    <div style={{
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {Icon && <Icon size={18} color="var(--primary)" />}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{label}</span>
              {tooltip && (
                <span title={tooltip} style={{ cursor: 'help', color: 'var(--text-dim)' }}>
                  <HelpCircle size={14} />
                </span>
              )}
            </div>
            {tooltip && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tooltip}</span>
            )}
          </div>
        </div>
        <span style={{
          padding: '4px 12px',
          borderRadius: '6px',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          color: 'var(--primary)',
          fontSize: '0.9rem',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
        }}>
          {value} {unit}
        </span>
      </div>

      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(name, parseFloat(e.target.value))}
        style={{
          width: '100%',
          accentColor: '#10b981',
          cursor: 'pointer',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};

export const SelectInput = ({ label, name, value, onChange, options, tooltip, icon: Icon }) => {
  return (
    <div style={{
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {Icon && <Icon size={18} color="var(--primary)" />}
          <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{label}</span>
          {tooltip && (
            <span title={tooltip} style={{ cursor: 'help', color: 'var(--text-dim)' }}>
              <HelpCircle size={14} />
            </span>
          )}
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(name, parseFloat(e.target.value))}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '8px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-main)',
          fontSize: '0.88rem',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: '#0f172a', color: '#fff' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
