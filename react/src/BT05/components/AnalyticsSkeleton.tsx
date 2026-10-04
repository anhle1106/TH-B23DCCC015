import React from 'react';

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <div className="analytics-modal-backdrop">
      <div className="analytics-modal-content skeleton-modal">
        <div className="skeleton-line title" />
        <div className="skeleton-grid">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
        <div className="skeleton-line chart" />
        <div className="skeleton-line chart" />
      </div>
    </div>
  );
};
