import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AssessRisk from './pages/AssessRisk';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/assess" element={<AssessRisk />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          {/* Global Footer */}
          <footer style={{
            borderTop: '1px solid var(--border-subtle)',
            padding: '24px 0',
            backgroundColor: 'rgba(10, 15, 29, 0.95)',
            textAlign: 'center',
            color: 'var(--text-dim)',
            fontSize: '0.82rem',
          }}>
            <div className="container">
              DiaPredict AI • CDC BRFSS Machine Learning Pipeline • Powered by FastAPI & Random Forest Classifier
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
