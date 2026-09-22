import { useState } from 'react';
import { TH01App } from './TH01/TH01App';
import { TH02App } from './TH02/TH02App';
import { BT03App } from './BT03/BT03App';
import { BT04App } from './BT04/BT04App';

export function App() {
  const [activeTab, setActiveTab] = useState<'BT03' | 'BT04' | 'TH01' | 'TH02'>('BT03');

  return (
    <div className="main-app-container">
      {/* Top Global Navigation Bar */}
      <nav className="global-navbar" aria-label="Điều hướng bài thực hành & bài tập">
        <div className="navbar-brand">
          <span className="brand-logo">🎓</span>
          <span className="brand-title">LTWNC Labs Hub</span>
        </div>

        <div className="navbar-tabs">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'BT03' ? 'active' : ''}`}
            onClick={() => setActiveTab('BT03')}
          >
            <span className="tab-indicator purple" />
            BT03: Redux Cart
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'BT04' ? 'active' : ''}`}
            onClick={() => setActiveTab('BT04')}
          >
            <span className="tab-indicator red" />
            BT04: Zustand Favorites
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'TH01' ? 'active' : ''}`}
            onClick={() => setActiveTab('TH01')}
          >
            <span className="tab-indicator blue" />
            TH01: Deadline Tracker
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'TH02' ? 'active' : ''}`}
            onClick={() => setActiveTab('TH02')}
          >
            TH02: Component Patterns
          </button>
        </div>
      </nav>

      {/* Dynamic Tab Content */}
      <div className="tab-content">
        {activeTab === 'BT03' && <BT03App />}
        {activeTab === 'BT04' && <BT04App />}
        {activeTab === 'TH01' && <TH01App />}
        {activeTab === 'TH02' && <TH02App />}
      </div>

      <style>{`
        .main-app-container {
          min-height: 100vh;
          background-color: #f8fafc;
        }

        .global-navbar {
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(8px);
          background-color: rgba(255, 255, 255, 0.95);
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .brand-logo {
          font-size: 1.25rem;
        }

        .brand-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .navbar-tabs {
          display: flex;
          align-items: center;
          background-color: #f1f5f9;
          padding: 0.25rem;
          border-radius: 8px;
          gap: 0.25rem;
          overflow-x: auto;
        }

        .nav-tab-btn {
          background: transparent;
          border: none;
          padding: 0.4rem 0.875rem;
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          white-space: nowrap;
        }

        .nav-tab-btn:hover {
          color: #0f172a;
        }

        .nav-tab-btn.active {
          background-color: #ffffff;
          color: #0f172a;
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .tab-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .tab-indicator.purple {
          background-color: #8b5cf6;
        }

        .tab-indicator.red {
          background-color: #ef4444;
        }

        .tab-indicator.blue {
          background-color: #2563eb;
        }

        @media (max-width: 768px) {
          .global-navbar {
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
