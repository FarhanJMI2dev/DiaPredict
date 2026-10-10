import React from 'react';

const MetricsCard = ({ title, value, subtitle, icon: Icon, color = '#10b981', trend }) => {
  return (
    <div className="glass-panel" style={{
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow orb */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: color,
        opacity: 0.12,
        filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.03em',
          color: '#ffffff',
        }}>
          {value}
        </span>
        {trend && (
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: trend > 0 ? '#ef4444' : '#10b981',
          }}>
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '6px' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default MetricsCard;
