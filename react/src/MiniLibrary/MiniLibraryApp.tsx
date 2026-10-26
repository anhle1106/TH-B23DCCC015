import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  fetchBooks,
  borrowBook,
  returnBook,
  clearWarning,
} from './features/books/booksSlice';
import {
  selectAllBooks,
  selectBorrowedBooks,
  selectBooksStatus,
  selectBooksError,
  selectWarningMessage,
} from './features/books/booksSelectors';
import { useFilterStore } from './store/useFilterStore';
import { useDebounce } from './hooks/useDebounce';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { BookCard } from './components/BookCard/BookCard';
import { FilterBar } from './components/FilterBar/FilterBar';
import { BorrowedDrawer } from './components/BorrowedDrawer/BorrowedDrawer';
import './MiniLibraryApp.css';

const LazyStatsPage = lazy(() => import('./components/StatsPage/StatsPage'));

function StatsFallback() {
  return (
    <div className="lazy-fallback-card" role="status" aria-live="polite">
      <div className="spinner" />
      <p className="loading-text">Đang tải trang Thống kê thư viện...</p>
      <p className="loading-subtext">Vui lòng chờ trong giây lát</p>
    </div>
  );
}

function MiniLibraryDashboard() {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectAllBooks);
  const borrowedBooks = useAppSelector(selectBorrowedBooks);
  const status = useAppSelector(selectBooksStatus);
  const error = useAppSelector(selectBooksError);
  const warningMessage = useAppSelector(selectWarningMessage);

  const { theme, toggleTheme } = useTheme();

  const keyword = useFilterStore((state) => state.keyword);
  const category = useFilterStore((state) => state.category);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const debouncedKeyword = useDebounce(keyword, 300);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [currentRoute, setCurrentRoute] = useState<'home' | 'stats'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/stats' || hash === '#/stats' || hash === '#stats') {
        return 'stats';
      }
    }
    return 'home';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/stats' || hash === '#/stats' || hash === '#stats') {
        setCurrentRoute('stats');
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = useCallback((route: 'home' | 'stats') => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      const newPath = route === 'stats' ? '/stats' : '/';
      try {
        window.history.pushState({}, '', newPath);
      } catch {
        window.location.hash = route === 'stats' ? '#/stats' : '#/';
      }
    }
  }, []);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks(false));
    }
  }, [dispatch, status]);

  const borrowedBookIds = useMemo(() => {
    return new Set(borrowedBooks.map((b) => b.bookId));
  }, [borrowedBooks]);

  const filteredBooks = useMemo(() => {
    const trimmed = debouncedKeyword.trim().toLowerCase();

    return books.filter((book) => {
      const matchesCategory =
        category === 'Tất cả' || book.category === category;
      if (!matchesCategory) return false;

      if (!trimmed) return true;
      const titleMatch = book.title.toLowerCase().includes(trimmed);
      const authorMatch = book.author.toLowerCase().includes(trimmed);
      return titleMatch || authorMatch;
    });
  }, [books, debouncedKeyword, category]);

  const handleBorrow = useCallback(
    (bookId: string) => {
      dispatch(borrowBook(bookId));
    },
    [dispatch]
  );

  const handleReturn = useCallback(
    (bookId: string) => {
      dispatch(returnBook(bookId));
    },
    [dispatch]
  );

  const handleDismissWarning = useCallback(() => {
    dispatch(clearWarning());
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    dispatch(fetchBooks(false));
  }, [dispatch]);

  const handleSimulateApiError = useCallback(() => {
    dispatch(fetchBooks(true));
  }, [dispatch]);

  return (
    <div className="mini-library-container">
      <header className="lib-header" role="banner">
        <div className="lib-header-inner">
          <div className="lib-brand">
            <span className="lib-logo-icon" aria-hidden="true">
              🏛️
            </span>
            <div className="lib-brand-text">
              <h1 className="lib-title">Mini Library - Thư Viện Chuyên Ngành</h1>
              <span className="lib-subtitle">Khoa CNTT - Kiểm tra giữa kỳ LTWNC</span>
            </div>
          </div>

          <nav className="lib-nav-group" aria-label="Điều hướng thư viện">
            <button
              type="button"
              className={`nav-link-btn ${currentRoute === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
              aria-current={currentRoute === 'home' ? 'page' : undefined}
            >
              📖 Tra cứu sách
            </button>

            <button
              type="button"
              className={`nav-link-btn ${currentRoute === 'stats' ? 'active' : ''}`}
              onClick={() => navigateTo('stats')}
              aria-current={currentRoute === 'stats' ? 'page' : undefined}
            >
              📊 Thống kê (/stats)
            </button>

            <button
              type="button"
              className="btn-borrowed-shelf"
              onClick={() => setIsDrawerOpen(true)}
              aria-label={`Xem danh sách sách đang mượn: ${borrowedBooks.length} cuốn`}
            >
              <span>Tủ sách của tôi</span>
              <span
                className={`shelf-count-badge ${
                  borrowedBooks.length >= 3 ? 'limit-reached' : ''
                }`}
              >
                {borrowedBooks.length} / 3
              </span>
            </button>

            <button
              type="button"
              className="btn-theme-toggle"
              onClick={toggleTheme}
              aria-label={`Chuyển sang giao diện ${theme === 'light' ? 'tối' : 'sáng'}`}
              title={`Giao diện hiện tại: ${theme === 'light' ? 'Sáng' : 'Tối'}. Nhấp để đổi.`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </nav>
        </div>
      </header>

      <main className="lib-content-wrap">
        {warningMessage && (
          <div className="warning-alert-banner" role="alert" aria-live="assertive">
            <div className="warning-inner">
              <span className="warning-icon" aria-hidden="true">
                ⚠️
              </span>
              <span>{warningMessage}</span>
            </div>
            <button
              type="button"
              className="btn-close-warning"
              onClick={handleDismissWarning}
              aria-label="Đóng cảnh báo"
            >
              ✕
            </button>
          </div>
        )}

        {currentRoute === 'stats' ? (
          <Suspense fallback={<StatsFallback />}>
            <LazyStatsPage
              books={books}
              borrowedBooks={borrowedBooks}
              onReturnBook={handleReturn}
              onNavigateHome={() => navigateTo('home')}
            />
          </Suspense>
        ) : (
          <>
            <section className="lib-hero-banner" aria-label="Thông tin học phần">
              <div>
                <h2 className="hero-meta-title">Hệ Thống Quản Lý Tra Cứu & Mượn Sách</h2>
                <p className="hero-meta-desc">
                  Mỗi sinh viên được mượn tối đa 3 cuốn sách cùng lúc.
                </p>
              </div>
              <div className="hero-tags">
                <span className="tech-chip">TypeScript</span>
                <span className="tech-chip">Redux Toolkit</span>
                <span className="tech-chip">Zustand</span>
                <span className="tech-chip">Debounce 300ms</span>
              </div>
            </section>

            <FilterBar totalResults={filteredBooks.length} />

            {status === 'loading' && (
              <div className="loading-container" role="status" aria-live="polite">
                <div className="spinner" />
                <p className="loading-text">Đang tải...</p>
                <p className="loading-subtext">Đang truy vấn kho sách từ API thư viện khoa</p>
              </div>
            )}

            {status === 'failed' && (
              <div className="error-container" role="alert">
                <span className="error-icon" aria-hidden="true">
                  ❌
                </span>
                <h3 className="error-title">Không thể tải dữ liệu thư viện</h3>
                <p className="error-msg">{error}</p>
                <div className="error-actions">
                  <button type="button" className="btn-retry" onClick={handleRetry}>
                    Thử lại
                  </button>
                </div>
              </div>
            )}

            {status === 'succeeded' && (
              <div className="books-grid" data-testid="books-grid">
                {filteredBooks.length === 0 ? (
                  <div className="empty-books-state">
                    <span className="empty-books-icon">🔍</span>
                    <h3 className="empty-books-title">Không tìm thấy sách phù hợp</h3>
                    <p className="empty-books-desc">
                      Không có cuốn sách nào khớp với từ khoá hoặc thể loại đã chọn.
                    </p>
                    <button
                      type="button"
                      className="btn-retry"
                      onClick={resetFilters}
                    >
                      Xem tất cả sách
                    </button>
                  </div>
                ) : (
                  filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      isBorrowed={borrowedBookIds.has(book.id)}
                      onBorrow={handleBorrow}
                      onReturn={handleReturn}
                    />
                  ))
                )}
              </div>
            )}

            <footer className="lib-test-tools-footer">
              <span>Kiểm tra giữa kỳ - Mini Library (RIPT1411-20261-02)</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="test-tool-btn"
                  onClick={handleSimulateApiError}
                  title="Giả lập lỗi kết nối máy chủ để kiểm tra trạng thái hiển thị lỗi"
                >
                  Giả lập API Lỗi (HTTP 500)
                </button>
                <button
                  type="button"
                  className="test-tool-btn"
                  onClick={handleRetry}
                  title="Tải lại danh sách sách bình thường"
                >
                  Tải lại bình thường
                </button>
              </div>
            </footer>
          </>
        )}
      </main>

      <BorrowedDrawer
        borrowedBooks={borrowedBooks}
        onReturn={handleReturn}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

export function MiniLibraryApp() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light">
        <MiniLibraryDashboard />
      </ThemeProvider>
    </Provider>
  );
}

export default MiniLibraryApp;
