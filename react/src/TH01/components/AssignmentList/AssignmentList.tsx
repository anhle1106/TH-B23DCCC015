import { List } from 'react-window';
import type { Deadline } from '../../types/deadline.types';
import { AssignmentCard } from '../DeadlineCard/AssignmentCard';
import './AssignmentList.css';

/**
 * ============================================================================
 * PHẦN B: TỐI ƯU HIỆU NĂNG - VIRTUALIZATION VỚI REACT-WINDOW
 * ============================================================================
 * - Virtualization: Chỉ render các phần tử thực sự hiển thị trong viewport.
 *   Xử lý mượt mà danh sách 10.000 bài tập mà không gây lag trình duyệt.
 * - Hỗ trợ đầy đủ các trạng thái bất đồng bộ: loading, succeeded, failed, empty.
 */

export interface AssignmentListProps {
  items: Deadline[];
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
  searchQuery?: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onResetFilters?: () => void;
  onOpenCreateForm?: () => void;
  useVirtualization?: boolean;
}

export function AssignmentList({
  items,
  status = 'succeeded',
  error = null,
  searchQuery = '',
  onToggle,
  onDelete,
  onTogglePin,
  onResetFilters,
  onOpenCreateForm,
  useVirtualization = false,
}: AssignmentListProps) {
  // 1. Trạng thái Đang tải (Loading State)
  if (status === 'loading' && items.length === 0) {
    return (
      <div className="deadlines-grid" data-testid="loading-skeleton">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="deadline-skeleton-card" data-testid="skeleton-item">
            <div className="skeleton-line skeleton-short" />
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-meta" />
          </div>
        ))}
      </div>
    );
  }

  // 2. Trạng thái Thất bại / Lỗi kết nối (Error State)
  if (status === 'failed') {
    return (
      <div className="error-state-card" data-testid="error-message" role="alert">
        <div className="error-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="error-title">Không thể tải danh sách bài tập</h3>
        <p className="error-desc">{error || 'Đã xảy ra lỗi không xác định từ máy chủ.'}</p>
        {onResetFilters && (
          <button type="button" className="btn-retry" onClick={onResetFilters}>
            Thử tải lại
          </button>
        )}
      </div>
    );
  }

  // 3. Trạng thái Danh sách trống (Empty State)
  if (items.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-state">
        <div className="empty-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="empty-title">Không tìm thấy bài tập nào</h3>
        <p className="empty-desc">
          {searchQuery
            ? `Không có bài tập nào khớp với từ khoá "${searchQuery}".`
            : 'Hiện tại chưa có bài tập nào trong danh sách này.'}
        </p>
        {searchQuery && onResetFilters ? (
          <button type="button" className="btn-empty-reset" onClick={onResetFilters}>
            Xem tất cả bài tập
          </button>
        ) : onOpenCreateForm ? (
          <button type="button" className="btn-empty-add" onClick={onOpenCreateForm}>
            + Thêm bài tập mới
          </button>
        ) : null}
      </div>
    );
  }

  // 4. Trạng thái Thành công: Danh sách có dữ liệu (Virtualization react-window)
  // Khi bật virtualization (hoặc danh sách lớn >= 50 items)
  if (useVirtualization) {
    return (
      <div className="virtualized-list-wrapper" data-testid="virtualized-list">
        <div className="virtualized-header-info">
          <span>
            ⚡ Đang ảo hoá <strong>{items.length.toLocaleString('vi-VN')}</strong> bài tập bằng{' '}
            <code>react-window</code> (Chỉ ~10 DOM nodes được mount cùng lúc)
          </span>
        </div>
        <List
          rowCount={items.length}
          rowHeight={165}
          rowProps={{}}
          style={{ height: 640, width: '100%' }}
          className="virtualized-window"
          rowComponent={({ index, style }) => {
            const item = items[index];
            if (!item) return null;
            return (
              <div style={{ ...style, paddingBottom: '12px', boxSizing: 'border-box' }}>
                <AssignmentCard
                  deadline={item}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onTogglePin={onTogglePin}
                />
              </div>
            );
          }}
        />
      </div>
    );
  }

  // 5. Trạng thái Thành công: Lưới thông thường (Standard Grid)
  return (
    <div className="deadlines-grid" data-testid="deadlines-grid">
      {items.map((item) => (
        <AssignmentCard
          key={item.id}
          deadline={item}
          onToggle={onToggle}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  );
}

export default AssignmentList;
