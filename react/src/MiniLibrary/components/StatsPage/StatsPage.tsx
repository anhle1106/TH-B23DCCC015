import { useMemo } from 'react';
import type { Book, BorrowedBook, CategoryCountMap } from '../../types/book.types';
import './StatsPage.css';

export interface StatsPageProps {
  books: Book[];
  borrowedBooks: BorrowedBook[];
  onReturnBook: (bookId: string) => void;
  onNavigateHome: () => void;
}

export function StatsPage({
  books,
  borrowedBooks,
  onReturnBook,
  onNavigateHome,
}: StatsPageProps) {
  const categoryStats = useMemo<CategoryCountMap>(() => {
    const stats: CategoryCountMap = {
      CNTT: 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };

    for (const book of books) {
      stats[book.category] = (stats[book.category] ?? 0) + 1;
    }

    return stats;
  }, [books]);

  const totals = useMemo(() => {
    const totalTitles = books.length;
    const totalPhysicalCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
    const availableCopies = books.reduce((acc, b) => acc + b.availableCopies, 0);
    const outOfStockCount = books.filter((b) => b.availableCopies === 0).length;

    return {
      totalTitles,
      totalPhysicalCopies,
      availableCopies,
      outOfStockCount,
    };
  }, [books]);

  const categories = Object.entries(categoryStats) as [
    keyof CategoryCountMap,
    number
  ][];

  return (
    <div className="stats-page-wrapper" data-testid="stats-page-container">
      <div className="stats-page-header">
        <div>
          <span className="stats-badge">Thống Kê Thư Viện</span>
          <h2 className="stats-title">Thống Kê Đầu Sách & Tình Trạng Mượn/Trả</h2>
          <p className="stats-desc">
            Phân tích số lượng đầu sách theo từng chuyên ngành và quản lý hạn ngạch mượn sách của sinh viên
          </p>
        </div>

        <button
          type="button"
          className="btn-back-home"
          onClick={onNavigateHome}
          aria-label="Quay lại danh mục sách"
        >
          ← Quay lại Tra cứu sách
        </button>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card blue">
          <span className="kpi-label">Tổng số đầu sách</span>
          <span className="kpi-number">{totals.totalTitles}</span>
          <span className="kpi-hint">3 chuyên ngành chính</span>
        </div>

        <div className="kpi-card emerald">
          <span className="kpi-label">Tổng số bản hiện có</span>
          <span className="kpi-number">{totals.totalPhysicalCopies}</span>
          <span className="kpi-hint">Sách vật lý lưu trữ</span>
        </div>

        <div className="kpi-card amber">
          <span className="kpi-label">Sách bạn đang mượn</span>
          <span className="kpi-number">{borrowedBooks.length} / 3</span>
          <span className="kpi-hint">
            {borrowedBooks.length >= 3 ? 'Đã đạt hạn ngạch tối đa' : 'Còn mượn được thêm'}
          </span>
        </div>

        <div className="kpi-card rose">
          <span className="kpi-label">Đầu sách tạm hết bản</span>
          <span className="kpi-number">{totals.outOfStockCount}</span>
          <span className="kpi-hint">Cần thu hồi hoặc bổ sung</span>
        </div>
      </div>

      <div className="stats-main-grid">
        <section className="stats-card">
          <h3 className="card-section-title">
            Phân bố đầu sách theo thể loại
          </h3>
          <p className="card-section-desc">
            Tỷ lệ các đầu sách theo chương trình đào tạo của khoa
          </p>

          <div className="category-stats-list">
            {categories.map(([cat, count]) => {
              const percent =
                totals.totalTitles > 0
                  ? Math.round((count / totals.totalTitles) * 100)
                  : 0;

              const barClass =
                cat === 'CNTT'
                  ? 'bar-cntt'
                  : cat === 'Kinh tế'
                  ? 'bar-kinhte'
                  : 'bar-ngoaingu';

              return (
                <div key={cat} className="category-stat-row">
                  <div className="cat-stat-info">
                    <span className="cat-name">{cat}</span>
                    <span className="cat-count">
                      <strong>{count}</strong> đầu sách ({percent}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className={`progress-fill ${barClass}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="stats-card">
          <h3 className="card-section-title">
            Chi tiết sách sinh viên đang mượn ({borrowedBooks.length}/3 cuốn)
          </h3>
          <p className="card-section-desc">
            Theo dõi thời hạn và hoàn trả sách trực tiếp tại đây
          </p>

          {borrowedBooks.length === 0 ? (
            <div className="no-borrowed-box">
              <span className="check-icon">✓</span>
              <p>Hiện tại bạn không mượn cuốn sách nào từ thư viện.</p>
              <button
                type="button"
                className="btn-browse-now"
                onClick={onNavigateHome}
              >
                Khám phá kho sách
              </button>
            </div>
          ) : (
            <div className="borrowed-table-wrapper">
              <table className="borrowed-table">
                <thead>
                  <tr>
                    <th>Tên sách</th>
                    <th>Thể loại</th>
                    <th>Thời điểm mượn</th>
                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowedBooks.map((item) => (
                    <tr key={item.borrowId}>
                      <td>
                        <span className="table-book-title">{item.bookTitle}</span>
                        <span className="table-book-author">{item.author}</span>
                      </td>
                      <td>
                        <span className="table-category-badge">{item.category}</span>
                      </td>
                      <td className="table-time">
                        {new Date(item.borrowedAt).toLocaleTimeString('vi-VN')} {new Date(item.borrowedAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn-table-return"
                          onClick={() => onReturnBook(item.bookId)}
                          aria-label={`Trả sách ${item.bookTitle}`}
                        >
                          Trả sách
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default StatsPage;
