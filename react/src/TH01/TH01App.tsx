import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  fetchInitialDeadlines,
  addDeadline,
  toggleDeadline,
  deleteDeadline,
  setFilter,
  setSearchQuery,
  selectFilteredDeadlines,
  selectDeadlinesStatus,
  selectDeadlinesFilter,
  selectDeadlinesSearch,
  selectDeadlinesStats,
} from './features/deadlines/deadlinesSlice';
import type { CreateDeadlineDTO, FilterStatus } from './types/deadline.types';
import { DeadlineCard } from './components/DeadlineCard/DeadlineCard';
import { DeadlineStats } from './components/DeadlineStats/DeadlineStats';
import { FilterTabs } from './components/FilterTabs/FilterTabs';
import { DeadlineForm } from './components/DeadlineForm/DeadlineForm';
import './TH01App.css';

function DeadlineTrackerContent() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectDeadlinesStatus);
  const filter = useAppSelector(selectDeadlinesFilter);
  const searchQuery = useAppSelector(selectDeadlinesSearch);
  const filteredDeadlines = useAppSelector(selectFilteredDeadlines);
  const stats = useAppSelector(selectDeadlinesStats);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Yêu cầu 7: Khi khởi động app, nạp dữ liệu mẫu ban đầu từ API giả lập qua createAsyncThunk
  useEffect(() => {
    dispatch(fetchInitialDeadlines());
  }, [dispatch]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handlers
  const handleToggle = (id: string) => {
    dispatch(toggleDeadline(id));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteDeadline(id));
    showToast('Đã xoá bài tập thành công');
  };

  const handleCreate = (data: CreateDeadlineDTO) => {
    dispatch(addDeadline(data));
    showToast(`Đã thêm bài tập "${data.title}" thành công!`);
  };

  const handleFilterChange = (newFilter: FilterStatus) => {
    dispatch(setFilter(newFilter));
  };

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  return (
    <div className="tracker-wrapper">
      {/* Toast Notification */}
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      {/* Main Header */}
      <header className="tracker-header">
        <div className="header-left">
          <div className="header-pill">
            <span className="live-dot" />
            LTWNC - Bài Thực Hành 01 (N2)
          </div>
          <h1 className="tracker-title">Student Deadline Tracker</h1>
          <p className="tracker-subtitle">
            Hệ thống quản lý deadline bài tập cá nhân giúp sinh viên theo dõi các môn học sắp đến hạn nộp
          </p>
          <div className="tech-badges">
            <span className="tech-badge">Buổi 1: TypeScript Nâng cao</span>
            <span className="tech-badge">Buổi 2: Compound Component &amp; Custom Hook</span>
            <span className="tech-badge">Buổi 3: Redux Toolkit + AsyncThunk</span>
          </div>
        </div>

        <div className="header-right">
          <button
            type="button"
            className="btn-add-main"
            onClick={() => setIsFormOpen(true)}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="btn-icon">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            <span>Thêm bài tập mới</span>
          </button>
        </div>
      </header>

      {/* 4 Thẻ KPI Thống Kê Nhanh (Click để chuyển filter) */}
      <section aria-label="Thống kê deadline">
        <DeadlineStats
          stats={stats}
          activeFilter={filter}
          onSelectFilter={handleFilterChange}
        />
      </section>

      {/* Bộ lọc trạng thái & Thanh tìm kiếm */}
      <section aria-label="Bộ lọc và tìm kiếm">
        <FilterTabs
          currentFilter={filter}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          stats={stats}
        />
      </section>

      {/* Danh sách bài tập */}
      <main className="tracker-main">
        {/* Loading Skeletons */}
        {status === 'loading' && stats.total === 0 ? (
          <div className="deadlines-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="deadline-skeleton-card">
                <div className="skeleton-line skeleton-short" />
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-meta" />
              </div>
            ))}
          </div>
        ) : filteredDeadlines.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="empty-title">Không tìm thấy bài tập nào</h3>
            <p className="empty-desc">
              {searchQuery
                ? `Không có kết quả nào khớp với từ khoá "${searchQuery}". Hãy thử tìm lại.`
                : filter !== 'all'
                ? `Hiện tại bạn không có bài tập nào ở trạng thái này.`
                : 'Bạn chưa có deadline nào. Hãy thêm bài tập mới để bắt đầu quản lý!'}
            </p>
            {filter !== 'all' || searchQuery ? (
              <button
                type="button"
                className="btn-empty-reset"
                onClick={() => {
                  dispatch(setFilter('all'));
                  dispatch(setSearchQuery(''));
                }}
              >
                Xem tất cả bài tập
              </button>
            ) : (
              <button
                type="button"
                className="btn-empty-add"
                onClick={() => setIsFormOpen(true)}
              >
                + Thêm bài tập đầu tiên
              </button>
            )}
          </div>
        ) : (
          /* Yêu cầu 1: Hiển thị danh sách bài tập bằng Compound Component DeadlineCard */
          <div className="deadlines-grid">
            {filteredDeadlines.map((item) => (
              <DeadlineCard
                key={item.id}
                deadline={item}
                onToggle={handleToggle}
                onDelete={handleDelete}
              >
                <DeadlineCard.Header />
                <DeadlineCard.Body />
                <DeadlineCard.Actions />
              </DeadlineCard>
            ))}
          </div>
        )}
      </main>

      {/* Form Modal thêm bài tập */}
      <DeadlineForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Footer ghi chú kỹ thuật cho giảng viên chấm bài */}
      <footer className="tracker-footer">
        <div className="footer-card">
          <h4>📌 Bảng Đối Soát Yêu Cầu Kỹ Thuật LTWNC (Buổi 1, 2, 3)</h4>
          <div className="footer-grid">
            <div className="footer-col">
              <strong>1. Buổi 1 — TypeScript Nâng Cao:</strong>
              <ul>
                <li><code>Generic</code>: <code>ApiResponse&lt;T&gt;</code>, <code>filterItems&lt;T&gt;</code></li>
                <li><code>Utility Types</code>: <code>Pick</code>, <code>Omit</code>, <code>Partial</code>, <code>Record</code></li>
                <li><code>Type Guard</code>: <code>isPriority()</code>, <code>isDeadline()</code></li>
              </ul>
            </div>
            <div className="footer-col">
              <strong>2. Buổi 2 — React Design Pattern:</strong>
              <ul>
                <li><code>Compound Component</code>: <code>DeadlineCard</code> (Header, Body, Actions)</li>
                <li><code>Context API</code>: Chia sẻ state ngầm định, linh hoạt</li>
                <li><code>Custom Hook</code>: <code>useDeadlineCountdown()</code></li>
              </ul>
            </div>
            <div className="footer-col">
              <strong>3. Buổi 3 — Redux Toolkit:</strong>
              <ul>
                <li><code>Feature-based</code>: <code>features/deadlines/deadlinesSlice.ts</code></li>
                <li><code>Typed Hooks</code>: <code>useAppDispatch</code>, <code>useAppSelector</code></li>
                <li><code>createAsyncThunk</code>: Giả lập gọi API lấy data khởi đầu</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * TH01App Entry Component được bọc Redux Provider
 */
export function TH01App() {
  return (
    <Provider store={store}>
      <DeadlineTrackerContent />
    </Provider>
  );
}

export default TH01App;
