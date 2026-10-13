import { createContext, useContext, memo, type ReactNode } from 'react';
import type { Deadline } from '../../types/deadline.types';
import { PRIORITY_MAP } from '../../types/deadline.types';
import { useDeadlineCountdown } from '../../hooks/useDeadlineCountdown';
import type { DeadlineCountdownResult } from '../../hooks/useDeadlineCountdown';
import { usePinStore } from '../../store/usePinStore';
import './DeadlineCard.css';

/**
 * ============================================================================
 * PHẦN A & B: AssignmentCard (React.memo + Compound Component + Zustand Pin)
 * ============================================================================
 */

export interface AssignmentCardContextValue {
  deadline: Deadline;
  countdown: DeadlineCountdownResult;
  isPinned: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const AssignmentCardContext = createContext<AssignmentCardContextValue | null>(null);

export function useAssignmentCardContext(): AssignmentCardContextValue {
  const context = useContext(AssignmentCardContext);
  if (!context) {
    throw new Error('AssignmentCard sub-components must be rendered within an AssignmentCard provider');
  }
  return context;
}

export interface AssignmentCardProps {
  deadline: Deadline;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin?: (id: string) => void;
  isPinned?: boolean;
  children?: ReactNode;
}

/**
 * Base Component Implementation
 */
function AssignmentCardBase({
  deadline,
  onToggle,
  onDelete,
  onTogglePin,
  isPinned: propIsPinned,
  children,
}: AssignmentCardProps) {
  const countdown = useDeadlineCountdown(deadline.dueDate, deadline.isCompleted);

  // Lấy trạng thái ghim từ usePinStore nếu không truyền prop trực tiếp
  const storeIsPinned = usePinStore((state) => state.isPinned(deadline.id));
  const storeTogglePin = usePinStore((state) => state.togglePin);

  const isPinned = propIsPinned !== undefined ? propIsPinned : storeIsPinned;
  const handleTogglePin = onTogglePin ?? storeTogglePin;

  const contextValue: AssignmentCardContextValue = {
    deadline,
    countdown,
    isPinned,
    onToggle,
    onDelete,
    onTogglePin: handleTogglePin,
  };

  const cardClass = [
    'deadline-card',
    isPinned ? 'is-pinned' : '',
    deadline.isCompleted ? 'is-completed' : '',
    countdown.isOverdue ? 'is-overdue' : '',
    countdown.isDueToday ? 'is-due-today' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AssignmentCardContext.Provider value={contextValue}>
      <article className={cardClass} data-id={deadline.id} data-testid={`assignment-card-${deadline.id}`}>
        {children || (
          <>
            <AssignmentCardHeader />
            <AssignmentCardBody />
            <AssignmentCardActions />
          </>
        )}
      </article>
    </AssignmentCardContext.Provider>
  );
}

// ----------------------------------------------------------------------------
// Sub-Component 1: Header (Môn học + Badge Ghim + Badge Độ ưu tiên)
// ----------------------------------------------------------------------------
export function AssignmentCardHeader() {
  const { deadline, isPinned } = useAssignmentCardContext();
  const priorityConfig = PRIORITY_MAP[deadline.priority];

  return (
    <div className="card-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="subject-tag">{deadline.subject}</span>
        {isPinned && (
          <span className="pinned-banner" title="Bài tập đã được ghim lên đầu">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 001.5 0v-1.5A.75.75 0 0113 2h1a.75.75 0 01.75.75v3.5a.75.75 0 01-.22.53L12.5 8.81v4.44l1.72 1.72a.75.75 0 01-.53 1.28H10.5v2a.75.75 0 01-1.5 0v-2H6.31a.75.75 0 01-.53-1.28L7.5 13.25V8.81L5.47 6.78A.75.75 0 015.25 6.25V2.75A.75.75 0 016 2h1a.75.75 0 01.75.75v1.5a.75.75 0 001.5 0v-1.5A.75.75 0 0110 2z" />
            </svg>
            Đã ghim
          </span>
        )}
      </div>

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
export function AssignmentCardBody() {
  const { deadline, countdown } = useAssignmentCardContext();
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
// Sub-Component 3: Actions (Nút Hoàn thành + Nút Ghim + Nút Xoá)
// ----------------------------------------------------------------------------
export function AssignmentCardActions() {
  const { deadline, isPinned, onToggle, onDelete, onTogglePin } = useAssignmentCardContext();

  return (
    <div className="card-actions">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Nút Hoàn thành / Bỏ hoàn thành */}
        <button
          type="button"
          data-testid="toggle-complete-btn"
          className={`btn-toggle-status ${deadline.isCompleted ? 'btn-completed' : ''}`}
          onClick={() => onToggle(deadline.id)}
          aria-label={deadline.isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
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
            {deadline.isCompleted ? 'Đã hoàn thành' : 'Hoàn thành'}
          </span>
        </button>

        {/* Nút Ghim / Bỏ ghim (Zustand state) */}
        <button
          type="button"
          data-testid="pin-btn"
          className={`btn-pin ${isPinned ? 'is-pinned-active' : ''}`}
          onClick={() => onTogglePin(deadline.id)}
          aria-label={isPinned ? 'Bỏ ghim bài tập' : 'Ghim bài tập'}
          title={isPinned ? 'Bỏ ghim bài tập này' : 'Ghim bài tập này lên đầu'}
        >
          <svg className="pin-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 001.5 0v-1.5A.75.75 0 0113 2h1a.75.75 0 01.75.75v3.5a.75.75 0 01-.22.53L12.5 8.81v4.44l1.72 1.72a.75.75 0 01-.53 1.28H10.5v2a.75.75 0 01-1.5 0v-2H6.31a.75.75 0 01-.53-1.28L7.5 13.25V8.81L5.47 6.78A.75.75 0 015.25 6.25V2.75A.75.75 0 016 2h1a.75.75 0 01.75.75v1.5a.75.75 0 001.5 0v-1.5A.75.75 0 0110 2z" />
          </svg>
          <span>{isPinned ? 'Đã ghim' : 'Ghim'}</span>
        </button>
      </div>

      {/* Nút Xoá bài tập */}
      <button
        type="button"
        data-testid="delete-btn"
        className="btn-delete"
        onClick={() => {
          let confirmed = true;
          try {
            if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
              confirmed = window.confirm(`Bạn có chắc chắn muốn xoá bài tập "${deadline.title}"?`);
            }
          } catch {
            confirmed = true;
          }
          if (confirmed) {
            onDelete(deadline.id);
          }
        }}
        aria-label="Xoá bài tập"
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

/**
 * PHẦN B: Áp dụng React.memo cho AssignmentCard để tối ưu hiệu năng
 */
export const AssignmentCard = memo(AssignmentCardBase) as unknown as typeof AssignmentCardBase & {
  Header: typeof AssignmentCardHeader;
  Body: typeof AssignmentCardBody;
  Actions: typeof AssignmentCardActions;
};

AssignmentCard.Header = AssignmentCardHeader;
AssignmentCard.Body = AssignmentCardBody;
AssignmentCard.Actions = AssignmentCardActions;

// Compatibility alias
export const DeadlineCard = AssignmentCard;

export default AssignmentCard;
