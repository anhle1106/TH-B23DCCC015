import type { BorrowedBook } from '../../types/book.types';
import './BorrowedDrawer.css';

export interface BorrowedDrawerProps {
  borrowedBooks: BorrowedBook[];
  onReturn: (bookId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function BorrowedDrawer({
  borrowedBooks,
  onReturn,
  isOpen,
  onClose,
}: BorrowedDrawerProps) {
  if (!isOpen) return null;

  const count = borrowedBooks.length;
  const isFull = count >= 3;

  return (
    <div
      className="drawer-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="borrowed-drawer-title"
      onClick={onClose}
    >
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h2 id="borrowed-drawer-title" className="drawer-title">
              📚 Sách Đang Mượn
            </h2>
            <p className="drawer-subtitle">
              Theo dõi và trả sách chuyên ngành đã mượn
            </p>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Đóng bảng sách đang mượn"
          >
            ✕
          </button>
        </div>

        <div className="borrow-limit-box">
          <div className="limit-header">
            <span>Hạn mức mượn sinh viên:</span>
            <strong className={isFull ? 'limit-max' : 'limit-normal'}>
              {count} / 3 cuốn
            </strong>
          </div>
          <div className="limit-progress-bar">
            <div
              className={`limit-progress-fill ${isFull ? 'full' : ''}`}
              style={{ width: `${(count / 3) * 100}%` }}
            />
          </div>
          {isFull && (
            <p className="limit-warning-note">
              Bạn đã mượn tối đa 3 cuốn. Vui lòng trả bớt sách trước khi mượn thêm cuốn mới.
            </p>
          )}
        </div>

        <div className="borrowed-list-content">
          {borrowedBooks.length === 0 ? (
            <div className="borrowed-empty-state">
              <span className="empty-icon">📖</span>
              <h3>Bạn chưa mượn cuốn sách nào</h3>
              <p>Khám phá kho sách khoa và nhấn "Mượn sách" để bắt đầu mượn.</p>
            </div>
          ) : (
            <ul className="borrowed-items-list">
              {borrowedBooks.map((item) => (
                <li key={item.borrowId} className="borrowed-item-card">
                  <div className="item-details">
                    <span className="item-category-tag">{item.category}</span>
                    <h4 className="item-title">{item.bookTitle}</h4>
                    <p className="item-author">Tác giả: {item.author}</p>
                    <time className="item-date">
                      Mượn lúc: {new Date(item.borrowedAt).toLocaleTimeString('vi-VN')} {new Date(item.borrowedAt).toLocaleDateString('vi-VN')}
                    </time>
                  </div>
                  <button
                    type="button"
                    className="btn-return-drawer"
                    onClick={() => onReturn(item.bookId)}
                    aria-label={`Trả cuốn ${item.bookTitle}`}
                  >
                    Trả sách
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default BorrowedDrawer;
