import { useEffect, useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  fetchInitialDeadlines,
  addDeadline,
  toggleDeadline,
  deleteDeadline,
  setFilter,
  generateStressDeadlines,
  selectAllDeadlines,
  selectDeadlinesStatus,
  selectDeadlinesFilter,
  selectDeadlinesError,
} from './features/deadlines/deadlinesSlice';
import type { CreateDeadlineDTO, FilterStatus } from './types/deadline.types';
import { isOverdue, calcStats } from './utils/deadlineHelpers';
import { usePinStore } from './store/usePinStore';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useDebounce } from './hooks/useDebounce';
import { DeadlineStats } from './components/DeadlineStats/DeadlineStats';
import { FilterTabs } from './components/FilterTabs/FilterTabs';
import { DeadlineForm } from './components/DeadlineForm/DeadlineForm';
import { AssignmentList } from './components/AssignmentList/AssignmentList';
import { BenchmarkModal } from './components/BenchmarkModal/BenchmarkModal';
import './TH01App.css';

/**
 * ============================================================================
 * PHẦN B: KỸ THUẬT 4 - CODE-SPLITTING VỚI REACT.LAZY & SUSPENSE
 * ============================================================================
 * Tách trang Thống kê chi tiết thành chunk riêng biệt, chỉ tải khi cần thiết
 */
const LazyStatsPage = lazy(() => import('./components/StatsPage/StatsPage'));

function StatsLoadingFallback() {
  return (
    <div className="deadline-skeleton-card" style={{ padding: '3rem', textAlign: 'center' }}>
      <div className="skeleton-line skeleton-title" style={{ margin: '0 auto 1rem auto' }} />
      <div className="skeleton-line skeleton-meta" style={{ margin: '0 auto' }} />
      <p style={{ color: '#64748b', marginTop: '1rem', fontWeight: 600 }}>
        ⏳ Đang tải mô-đun Báo cáo Thống kê qua React.lazy &amp; Suspense...
      </p>
    </div>
  );
}

/**
 * Content Component bên trong Redux Provider & ThemeProvider
 */
function DeadlineTrackerContent() {
  const dispatch = useAppDispatch();
  const allDeadlines = useAppSelector(selectAllDeadlines);
  const status = useAppSelector(selectDeadlinesStatus);
  const filter = useAppSelector(selectDeadlinesFilter);
  const error = useAppSelector(selectDeadlinesError);

  // PHẦN A: Context nâng cao - Theme sáng/tối
  const { theme, toggleTheme } = useTheme();

  // PHẦN A: Quản lý ghim bằng Zustand usePinStore
  const pinnedIds = usePinStore((state) => state.pinnedIds);
  const togglePin = usePinStore((state) => state.togglePin);

  // UI Local States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'stats'>('list');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // PHẦN B: Kỹ thuật 2 - useDebounce (300ms) cho ô tìm kiếm
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchQuery = useDebounce(searchInput, 300);

  // PHẦN B: Kỹ thuật 3 - Virtualization bằng react-window (tự động bật khi >= 50 bài hoặc có thể toggle)
  const [forceVirtualization, setForceVirtualization] = useState<boolean | null>(null);
  const isVirtualizationActive =
    forceVirtualization !== null ? forceVirtualization : allDeadlines.length >= 50;

  // Nạp 5 bài tập mẫu ban đầu qua createAsyncThunk khi khởi động app
  useEffect(() => {
    if (allDeadlines.length === 0 && status === 'idle') {
      dispatch(fetchInitialDeadlines());
    }
  }, [dispatch, allDeadlines.length, status]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // PHẦN B: Kỹ thuật 1 - useCallback cho các handlers truyền xuống component con
  const handleToggle = useCallback(
    (id: string) => {
      dispatch(toggleDeadline(id));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(deleteDeadline(id));
      showToast('Đã xoá bài tập thành công');
    },
    [dispatch, showToast]
  );

  const handleTogglePin = useCallback(
    (id: string) => {
      togglePin(id);
      const isNowPinned = !pinnedIds.includes(id);
      showToast(isNowPinned ? '📌 Đã ghim bài tập lên đầu danh sách' : 'Đã bỏ ghim bài tập');
    },
    [togglePin, pinnedIds, showToast]
  );

  const handleCreate = useCallback(
    (data: CreateDeadlineDTO) => {
      dispatch(addDeadline(data));
      showToast(`Đã thêm bài tập "${data.title}" thành công!`);
    },
    [dispatch, showToast]
  );

  const handleFilterChange = useCallback(
    (newFilter: FilterStatus) => {
      dispatch(setFilter(newFilter));
    },
    [dispatch]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchInput(query);
  }, []);

  // Sinh 10.000 bài tập mẫu để stress test
  const handleGenerateStressTest = useCallback(() => {
    dispatch(generateStressDeadlines(10000));
    showToast('🚀 Đã sinh thành công 10.000 bài tập mẫu!');
  }, [dispatch, showToast]);

  const handleResetToDefaults = useCallback(() => {
    dispatch(fetchInitialDeadlines());
    showToast('↺ Đã khôi phục danh sách bài tập mẫu ban đầu');
  }, [dispatch, showToast]);

  // PHẦN B: Kỹ thuật 2 - useMemo cho phần lọc và ghim (Pinned luôn lên đầu)
  const processedDeadlines = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();

    // 1. Lọc theo từ khoá và bộ lọc trạng thái
    const filtered = allDeadlines.filter((item) => {
      const matchSearch =
        query === '' ||
        item.title.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query);

      if (!matchSearch) return false;

      const overdue = isOverdue(item.dueDate, item.isCompleted);

      switch (filter) {
        case 'completed':
          return item.isCompleted;
        case 'overdue':
          return !item.isCompleted && overdue;
        case 'pending':
          return !item.isCompleted && !overdue;
        case 'all':
        default:
          return true;
      }
    });

    // 2. Bài tập đã ghim luôn hiện lên đầu danh sách
    return filtered.sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id);
      const bPinned = pinnedIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [allDeadlines, debouncedSearchQuery, filter, pinnedIds]);

  // Thống kê nhanh dùng cho 4 thẻ KPI và FilterTabs
  const stats = useMemo(() => {
    return calcStats(allDeadlines);
  }, [allDeadlines]);

  return (
    <div className="tracker-wrapper">
      {/* Toast thông báo */}
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      {/* Main Header */}
      <header className="tracker-header">
        <div className="header-left">
          <div className="header-pill">
            <span className="live-dot" />
            LTWNC - Bài Thực Hành 02 (N2) • Nâng Cấp Toàn Diện
          </div>
          <h1 className="tracker-title">Student Deadline Tracker</h1>
          <p className="tracker-subtitle">
            Hệ thống quản lý deadline sinh viên với Zustand Pin, Theme Context, Redux-logger, Stress Test 10.000 items và Virtualization.
          </p>
          <div className="tech-badges">
            <span className="tech-badge">Zustand Pin Store</span>
            <span className="tech-badge">Theme Context (useMemo)</span>
            <span className="tech-badge">Redux-Logger Middleware</span>
            <span className="tech-badge">React.memo + useCallback</span>
            <span className="tech-badge">useDebounce (300ms)</span>
            <span className="tech-badge">react-window Virtualization</span>
            <span className="tech-badge">React.lazy &amp; Suspense</span>
          </div>
        </div>

        <div className="header-right">
          {/* Nút chuyển đổi Light / Dark mode */}
          <button
            type="button"
            className="btn-theme-toggle"
            onClick={toggleTheme}
            aria-label="Chuyển đổi giao diện sáng/tối"
            title="Chuyển đổi Light / Dark theme"
          >
            {theme === 'dark' ? '☀️ Giao diện Sáng' : '🌙 Giao diện Tối'}
          </button>

          {/* Nút mở Modal thêm bài tập mới */}
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

      {/* Thanh điều khiển tối ưu hiệu năng (Performance Optimization Toolbar) */}
      <section className="optimization-toolbar" aria-label="Thanh công cụ tối ưu hiệu năng">
        <div className="toolbar-group">
          {/* Nút Stress Test 10k items */}
          <button
            type="button"
            className="btn-toolbar btn-stress"
            onClick={handleGenerateStressTest}
            title="Sinh 10.000 bài tập ngẫu nhiên để stress test hiệu năng"
          >
            ⚡ Tạo 10.000 bài tập mẫu
          </button>

          {/* Nút Reset */}
          <button
            type="button"
            className="btn-toolbar"
            onClick={handleResetToDefaults}
            title="Khôi phục lại 5 bài tập mẫu ban đầu"
          >
            ↺ Khôi phục bài tập mẫu
          </button>

          {/* Nút mở Bảng so sánh Trước & Sau tối ưu */}
          <button
            type="button"
            className="btn-toolbar btn-benchmark"
            onClick={() => setIsBenchmarkOpen(true)}
          >
            📊 So sánh hiệu năng trước/sau
          </button>
        </div>

        <div className="toolbar-group">
          {/* Nút bật/tắt Chế độ xem: Danh sách vs Thống kê Lazy */}
          <button
            type="button"
            className={`btn-toolbar ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 Danh sách
          </button>
          <button
            type="button"
            className={`btn-toolbar ${viewMode === 'stats' ? 'active' : ''}`}
            onClick={() => setViewMode('stats')}
          >
            📈 Thống kê (React.lazy)
          </button>

          {/* Toggle Virtualization */}
          <button
            type="button"
            className={`btn-toolbar ${isVirtualizationActive ? 'active' : ''}`}
            onClick={() => setForceVirtualization(!isVirtualizationActive)}
            title="Bật/Tắt Ảo hoá bằng react-window"
          >
            {isVirtualizationActive ? '⚡ Ảo hoá: Bật' : 'Lưới: Tắt ảo hoá'}
          </button>

          <span className={`toolbar-pill ${allDeadlines.length >= 1000 ? 'stress-active' : ''}`}>
            Tổng: {allDeadlines.length.toLocaleString('vi-VN')} bài
          </span>
        </div>
      </section>

      {/* View Switch: Danh sách bài tập HOẶC Thống kê Lazy */}
      {viewMode === 'stats' ? (
        <section aria-label="Trang Thống kê Lazy">
          <Suspense fallback={<StatsLoadingFallback />}>
            <LazyStatsPage items={allDeadlines} onBack={() => setViewMode('list')} />
          </Suspense>
        </section>
      ) : (
        <>
          {/* 4 Thẻ KPI Thống Kê Nhanh */}
          <section aria-label="Thống kê nhanh">
            <DeadlineStats
              stats={stats}
              activeFilter={filter}
              onSelectFilter={handleFilterChange}
            />
          </section>

          {/* Bộ lọc trạng thái & Ô tìm kiếm (Debounce 300ms) */}
          <section aria-label="Bộ lọc và tìm kiếm">
            <FilterTabs
              currentFilter={filter}
              onFilterChange={handleFilterChange}
              searchQuery={searchInput}
              onSearchChange={handleSearchChange}
              stats={stats}
            />
          </section>

          {/* Danh sách bài tập (Virtualization với react-window) */}
          <main className="tracker-main">
            <AssignmentList
              items={processedDeadlines}
              status={status}
              error={error}
              searchQuery={searchInput}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
              onResetFilters={() => {
                dispatch(setFilter('all'));
                setSearchInput('');
              }}
              onOpenCreateForm={() => setIsFormOpen(true)}
              useVirtualization={isVirtualizationActive}
            />
          </main>
        </>
      )}

      {/* Form Modal thêm bài tập mới */}
      <DeadlineForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Modal Bảng so sánh hiệu năng trước & sau tối ưu */}
      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />

      {/* Footer Đối soát Tiêu chí Đề bài */}
      <footer className="tracker-footer">
        <div className="footer-card">
          <h4>📌 Đối Soát Yêu Cầu Kỹ Thuật - Bài Thực Hành Số 2 (N2)</h4>
          <div className="footer-grid">
            <div className="footer-col">
              <strong>Phần A: Quản lý State</strong>
              <ul>
                <li>
                  <code>Zustand</code>: <code>usePinStore</code> (pinnedIds, togglePin, isPinned), bài tập ghim luôn lên đầu
                </li>
                <li>
                  <code>ThemeContext</code>: Tách riêng, bọc value bằng <code>useMemo</code>, hỗ trợ Light/Dark mode
                </li>
                <li>
                  <code>Middleware Redux</code>: <code>redux-logger</code> kích hoạt độc quyền trong development
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <strong>Phần B: Tối Ưu Hiệu Năng (4 Kỹ Thuật)</strong>
              <ul>
                <li>
                  <code>React.memo + useCallback</code>: Ngăn AssignmentCard re-render dư thừa
                </li>
                <li>
                  <code>useDebounce (300ms) + useMemo</code>: Trì hoãn lọc tìm kiếm, gõ phím tức thì
                </li>
                <li>
                  <code>react-window Virtualization</code>: Xử lý mượt 10.000 items, chỉ render ~10 DOM nodes
                </li>
                <li>
                  <code>React.lazy &amp; Suspense</code>: Tách tải module trang Thống kê chi tiết
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <strong>Phần C: Kiểm Thử Đầy Đủ</strong>
              <ul>
                <li>
                  <code>Unit Test</code>: isOverdue, calcDaysLeft, calcStats, assignmentsSlice reducer
                </li>
                <li>
                  <code>Component Test</code>: AssignmentCard (hiển thị, toggle, pin), DeadlineForm
                </li>
                <li>
                  <code>Bất đồng bộ &amp; Hook</code>: AssignmentList (loading, success, error) &amp; useDebounce
                </li>
                <li>
                  <code>Coverage</code>: &gt;= 70% statements thư mục <code>features/</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * TH01App Entry Component được bọc Redux Provider & ThemeProvider
 */
export function TH01App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <DeadlineTrackerContent />
      </ThemeProvider>
    </Provider>
  );
}

export default TH01App;
