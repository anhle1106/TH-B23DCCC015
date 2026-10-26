import React from 'react';
import type { Book } from '../../types/book.types';
import './BookCard.css';

export interface BookCardProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
}

export const BookCard = React.memo(function BookCard({
  book,
  isBorrowed,
  onBorrow,
  onReturn,
}: BookCardProps) {
  const isOutOfStock = book.availableCopies <= 0;

  const handleBorrowClick = () => {
    if (!isOutOfStock && !isBorrowed) {
      onBorrow(book.id);
    }
  };

  const handleReturnClick = () => {
    onReturn(book.id);
  };

  const categoryBadgeClass =
    book.category === 'CNTT'
      ? 'badge-cntt'
      : book.category === 'Kinh tế'
      ? 'badge-kinhte'
      : 'badge-ngoaingu';

  return (
    <article
      className={`book-card ${isBorrowed ? 'borrowed-card' : ''}`}
      data-testid={`book-card-${book.id}`}
      aria-label={`Sách: ${book.title}`}
    >
      <div className="book-card-header">
        <span className={`category-tag ${categoryBadgeClass}`}>
          {book.category}
        </span>
        <span className="book-year">NXB: {book.publishedYear}</span>
      </div>

      <div className="book-card-body">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>
        <p className="book-author">
          <span className="author-icon" aria-hidden="true">✍️</span>
          <span>{book.author}</span>
        </p>
        {book.description && (
          <p className="book-description">{book.description}</p>
        )}
      </div>

      <div className="book-card-footer">
        <div className="copies-info">
          <span className="copies-label">Số bản còn:</span>
          <span
            className={`copies-count ${
              isOutOfStock ? 'copies-empty' : 'copies-available'
            }`}
          >
            {book.availableCopies} / {book.totalCopies}
          </span>
        </div>

        <div className="card-actions">
          {isBorrowed ? (
            <div className="borrowed-status-group">
              <span className="borrowed-badge" title="Bạn đang giữ cuốn sách này">
                Đang mượn
              </span>
              <button
                type="button"
                className="btn-action btn-return"
                onClick={handleReturnClick}
                data-testid={`return-btn-${book.id}`}
                aria-label={`Trả sách ${book.title}`}
              >
                Trả sách
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-action btn-borrow"
              onClick={handleBorrowClick}
              disabled={isOutOfStock}
              data-testid={`borrow-btn-${book.id}`}
              aria-label={
                isOutOfStock
                  ? `Sách ${book.title} đã hết bản`
                  : `Mượn sách ${book.title}`
              }
            >
              {isOutOfStock ? 'Hết bản' : 'Mượn sách'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
});

export default BookCard;
