import type { FilterStatus } from '../../types/deadline.types';
import './DeadlineStats.css';

interface DeadlineStatsProps {
  stats: {
    total: number;
    pending: number;
    overdue: number;
    completed: number;
  };
  activeFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
}

export function DeadlineStats({ stats, activeFilter, onSelectFilter }: DeadlineStatsProps) {
  return (
    <div className="stats-grid">
      {/* 1. Tổng số */}
      <button
        type="button"
        className={`stat-card stat-all ${activeFilter === 'all' ? 'is-active' : ''}`}
        onClick={() => onSelectFilter('all')}
      >
        <div className="stat-content">
          <span className="stat-label">Tổng bài tập</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-icon-wrapper icon-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </button>

      {/* 2. Chưa hoàn thành */}
      <button
        type="button"
        className={`stat-card stat-pending ${activeFilter === 'pending' ? 'is-active' : ''}`}
        onClick={() => onSelectFilter('pending')}
      >
        <div className="stat-content">
          <span className="stat-label">Đang thực hiện</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
        <div className="stat-icon-wrapper icon-pending">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
      </button>

      {/* 3. Quá hạn */}
      <button
        type="button"
        className={`stat-card stat-overdue ${activeFilter === 'overdue' ? 'is-active' : ''}`}
        onClick={() => onSelectFilter('overdue')}
      >
        <div className="stat-content">
          <span className="stat-label">Quá hạn nộp</span>
          <span className="stat-value overdue-accent">{stats.overdue}</span>
        </div>
        <div className="stat-icon-wrapper icon-overdue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
      </button>

      {/* 4. Đã hoàn thành */}
      <button
        type="button"
        className={`stat-card stat-completed ${activeFilter === 'completed' ? 'is-active' : ''}`}
        onClick={() => onSelectFilter('completed')}
      >
        <div className="stat-content">
          <span className="stat-label">Đã hoàn thành</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
        <div className="stat-icon-wrapper icon-completed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
      </button>
    </div>
  );
}
