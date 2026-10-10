import React, { useState, useEffect } from 'react';
import { fetchScreeningHistory, fetchStats } from '../services/api';
import MetricsCard from '../components/MetricsCard';
import {
  Users,
  AlertTriangle,
  HeartPulse,
  Activity,
  Calendar,
  Eye,
  RefreshCw,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalScreenings: 0,
    highRiskCount: 0,
    moderateRiskCount: 0,
    lowRiskCount: 0,
    avgRiskScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [histData, statsData] = await Promise.all([
        fetchScreeningHistory(),
        fetchStats(),
      ]);
      setHistory(histData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>Clinical Intelligence & Screening Logs</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Real-time population health trends and machine learning screening logs.
          </p>
        </div>
        <button
          onClick={loadData}
          className="btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          <RefreshCw size={16} /> Refresh Records
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        <MetricsCard
          title="Total Screenings"
          value={stats.totalScreenings}
          subtitle="Processed via Random Forest"
          icon={Users}
          color="#3b82f6"
        />
        <MetricsCard
          title="High Risk Cases"
          value={stats.highRiskCount}
          subtitle="Probability >= 55%"
          icon={AlertTriangle}
          color="#ef4444"
        />
        <MetricsCard
          title="Avg Patient Risk"
          value={`${stats.avgRiskScore}%`}
          subtitle="Across all evaluations"
          icon={HeartPulse}
          color="#f59e0b"
        />
        <MetricsCard
          title="Low Risk / Healthy"
          value={stats.lowRiskCount}
          subtitle="Preventive target"
          icon={CheckCircle2}
          color="#10b981"
        />
      </div>

      {/* Population Health Risk Distribution */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Population Risk Distribution Breakdown</h3>
        <div style={{
          display: 'flex',
          height: '24px',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          marginBottom: '16px',
        }}>
          <div
            style={{
              width: stats.totalScreenings > 0 ? `${(stats.lowRiskCount / stats.totalScreenings) * 100}%` : '33%',
              backgroundColor: '#10b981',
              transition: 'width 0.5s ease',
            }}
            title={`Low Risk: ${stats.lowRiskCount}`}
          />
          <div
            style={{
              width: stats.totalScreenings > 0 ? `${(stats.moderateRiskCount / stats.totalScreenings) * 100}%` : '33%',
              backgroundColor: '#f59e0b',
              transition: 'width 0.5s ease',
            }}
            title={`Moderate Risk: ${stats.moderateRiskCount}`}
          />
          <div
            style={{
              width: stats.totalScreenings > 0 ? `${(stats.highRiskCount / stats.totalScreenings) * 100}%` : '34%',
              backgroundColor: '#ef4444',
              transition: 'width 0.5s ease',
            }}
            title={`High Risk: ${stats.highRiskCount}`}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10b981' }} />
            <span>Low Risk: <strong>{stats.lowRiskCount}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#f59e0b' }} />
            <span>Moderate / Pre-diabetes: <strong>{stats.moderateRiskCount}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#ef4444' }} />
            <span>High Risk: <strong>{stats.highRiskCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Screenings Table */}
      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={20} color="var(--primary)" /> Recent Clinical Screenings
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading screening history...
          </div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No screening logs available yet. Perform an assessment from the "Assess Risk" tab!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Patient / Identifier</th>
                <th style={{ padding: '12px 16px' }}>Risk Score</th>
                <th style={{ padding: '12px 16px' }}>Diagnosis Tier</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr
                  key={record._id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '16px', fontWeight: 600 }}>
                    {record.patientName || 'Anonymous Patient'}
                  </td>
                  <td style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    <span style={{ color: getRiskColor(record.riskLevel) }}>
                      {record.riskScorePercentage}%
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge badge-${record.riskLevel?.toLowerCase() || 'low'}`}>
                      {record.riskLevel || 'Low'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    {new Date(record.createdAt).toLocaleDateString()} {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      <Eye size={14} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{
            padding: '32px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
          }}>
            <button
              onClick={() => setSelectedRecord(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                color: 'var(--text-muted)',
              }}
            >
              <X size={22} />
            </button>

            <div style={{ marginBottom: '20px' }}>
              <span className={`badge badge-${selectedRecord.riskLevel?.toLowerCase()}`}>
                {selectedRecord.riskLevel} Risk Tier
              </span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '6px' }}>{selectedRecord.patientName}</h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                Evaluated: {new Date(selectedRecord.createdAt).toLocaleString()}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              marginBottom: '20px',
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Risk Probability</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: getRiskColor(selectedRecord.riskLevel) }}>
                  {selectedRecord.riskScorePercentage}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Model Classification</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {selectedRecord.outcome}
                </div>
              </div>
            </div>

            {/* Key Risk Factors */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Key Risk Factors Detected
              </h4>
              {selectedRecord.keyRiskFactors && selectedRecord.keyRiskFactors.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedRecord.keyRiskFactors.map((f, i) => (
                    <div key={i} style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.1)', fontSize: '0.85rem' }}>
                      • {f}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>None recorded.</div>
              )}
            </div>

            {/* Clinical Recommendations */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Clinical & Lifestyle Recommendations
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedRecord.recommendations?.map((r, i) => (
                  <div key={i} style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.1)', fontSize: '0.85rem' }}>
                    ✔ {r}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setSelectedRecord(null)}
                className="btn-primary"
                style={{ padding: '8px 24px', fontSize: '0.9rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
