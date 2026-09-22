import React, { createContext, useContext } from 'react';
import type { Deadline } from '../../types/deadline.types';
import { PRIORITY_MAP } from '../../types/deadline.types';
import { useDeadlineCountdown } from '../../hooks/useDeadlineCountdown';
import type { DeadlineCountdownResult } from '../../hooks/useDeadlineCountdown';
import './DeadlineCard.css';

/**
 * ============================================================================
 * BUỔI 2: REACT COMPOUND COMPONENT PATTERN - DeadlineCard
 * ============================================================================
 * Cấu trúc gồm:
 * - DeadlineCard (Parent Provider)
 * - DeadlineCard.Header
 * - DeadlineCard.Body
 * - DeadlineCard.Actions
 * Chia sẻ state ngầm định qua Context API, không gây prop-drilling
 */

interface DeadlineContextValue {
  deadline: Deadline;
  countdown: DeadlineCountdownResult;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const DeadlineContext = createContext<DeadlineContextValue | null>(null);

function useDeadlineContext(): DeadlineContextValue {
  const context = useContext(DeadlineContext);
  if (!context) {
    throw new Error('DeadlineCard sub-components must be rendered within a DeadlineCard provider');
  }
  return context;
}

export interface DeadlineCardProps {
  deadline: Deadline;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  children?: React.ReactNode;
}

export function DeadlineCard({ deadline, onToggle, onDelete, children }: DeadlineCardProps) {
  const countdown = useDeadlineCountdown(deadline.dueDate, deadline.isCompleted);

  const contextValue: DeadlineContextValue = {
    deadline,
    countdown,
    onToggle,
    onDelete,
  };

  const cardClass = [
    'deadline-card',
    deadline.isCompleted ? 'is-completed' : '',
    countdown.isOverdue ? 'is-overdue' : '',
    countdown.isDueToday ? 'is-due-today' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <DeadlineContext.Provider value={contextValue}>
      <article className={cardClass} data-id={deadline.id}>
        {children || (
          <>
            <DeadlineCard.Header />
            <DeadlineCard.Body />
            <DeadlineCard.Actions />
          </>
        )}
      </article>
    </DeadlineContext.Provider>
  );
}

// ----------------------------------------------------------------------------
// Sub-Component 1: Header (Môn học + Badge Độ ưu tiên)
// ----------------------------------------------------------------------------
function Header() {
  const { deadline } = useDeadlineContext();
  const priorityConfig = PRIORITY_MAP[deadline.priority];

  return (
    <div className="card-header">
      <span className="subject-tag">{deadline.subject}</span>
      <span className={`priority-badge ${priorityConfig.badgeClass}`}>
        <span className="priority-dot" style={{ backgroundColor: priorityConfig.dotColor }} />
        {priorityConfig.label}
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Sub-Component 2: Body (Tên bài tập + Countdown Urgency Pill)
// ----------------------------------------------------------------------------
function Body() {
  const { deadline, countdown } = useDeadlineContext();

  const urgencyPillClass = `urgency-pill urgency-${countdown.urgencyLevel}`;

  return (
    <div className="card-body">
      <h3 className={`task-title ${deadline.isCompleted ? 'task-title-completed' : ''}`}>
        {deadline.title}
      </h3>

      <div className="task-meta">
        <div className="due-date-info">
          <svg className="meta-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
              clipRule="evenodd"
            />
          </svg>
          <span>Hạn nộp: {countdown.formattedDueDate}</span>
        </div>

        {/* Yêu cầu 6: Hiển thị "Còn X ngày" hoặc "Quá hạn Y ngày" */}
        <span className={urgencyPillClass}>
          {countdown.isOverdue && (
            <svg className="pill-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {countdown.countdownText}
        </span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Sub-Component 3: Actions (Toggle hoàn thành + Xoá bài tập)
// ----------------------------------------------------------------------------
function Actions() {
  const { deadline, onToggle, onDelete } = useDeadlineContext();

  return (
    <div className="card-actions">
      {/* Yêu cầu 3: Đánh dấu hoàn thành / bỏ đánh dấu */}
      <button
        type="button"
        className={`btn-toggle-status ${deadline.isCompleted ? 'btn-completed' : ''}`}
        onClick={() => onToggle(deadline.id)}
        title={deadline.isCompleted ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu đã hoàn thành'}
      >
        <span className="custom-checkbox">
          {deadline.isCompleted && (
            <svg viewBox="0 0 20 20" fill="currentColor" className="check-icon">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
        <span className="action-label">
          {deadline.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
        </span>
      </button>

      {/* Yêu cầu 4: Xoá bài tập */}
      <button
        type="button"
        className="btn-delete"
        onClick={() => {
          if (window.confirm(`Bạn có chắc chắn muốn xoá bài tập "${deadline.title}"?`)) {
            onDelete(deadline.id);
          }
        }}
        title="Xoá bài tập này"
      >
        <svg className="trash-icon" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
            clipRule="evenodd"
          />
        </svg>
        <span>Xoá</span>
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Gắn các sub-components vào DeadlineCard (Compound Pattern chuẩn)
// ----------------------------------------------------------------------------
DeadlineCard.Header = Header;
DeadlineCard.Body = Body;
DeadlineCard.Actions = Actions;
