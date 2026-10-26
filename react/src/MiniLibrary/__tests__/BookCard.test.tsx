import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard } from '../components/BookCard/BookCard';
import type { Book } from '../types/book.types';

const MOCK_BOOK_AVAILABLE: Book = {
  id: 'book-cntt-01',
  title: 'Lập Trình Web Nâng Cao với React & TypeScript',
  author: 'TS. Nguyễn Văn Toàn',
  category: 'CNTT',
  publishedYear: 2024,
  availableCopies: 3,
  totalCopies: 5,
  description: 'Giáo trình thực hành chuyên sâu về State Management.',
};

const MOCK_BOOK_OUT_OF_STOCK: Book = {
  id: 'book-cntt-03',
  title: 'Kiến Trúc Hệ Thống Phân Tán',
  author: 'Lê Hoàng Nam',
  category: 'CNTT',
  publishedYear: 2023,
  availableCopies: 0,
  totalCopies: 3,
};

describe('BookCard Component', () => {
  test('renders book details accurately', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={MOCK_BOOK_AVAILABLE}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    expect(
      screen.getByText('Lập Trình Web Nâng Cao với React & TypeScript')
    ).toBeInTheDocument();
    expect(screen.getByText(/TS\. Nguyễn Văn Toàn/i)).toBeInTheDocument();
    expect(screen.getByText('CNTT')).toBeInTheDocument();
    expect(screen.getByText(/NXB: 2024/i)).toBeInTheDocument();
    expect(screen.getByText('3 / 5')).toBeInTheDocument();

    const borrowButton = screen.getByRole('button', { name: /mượn sách/i });
    expect(borrowButton).toBeInTheDocument();
    expect(borrowButton).toBeEnabled();
  });

  test('calls onBorrow with book id when borrow button is clicked', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={MOCK_BOOK_AVAILABLE}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowButton = screen.getByRole('button', { name: /mượn sách/i });
    await user.click(borrowButton);

    expect(handleBorrow).toHaveBeenCalledTimes(1);
    expect(handleBorrow).toHaveBeenCalledWith('book-cntt-01');
    expect(handleReturn).not.toHaveBeenCalled();
  });

  test('disables borrow button when out of stock', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={MOCK_BOOK_OUT_OF_STOCK}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const disabledButton = screen.getByRole('button', { name: /hết bản/i });
    expect(disabledButton).toBeInTheDocument();
    expect(disabledButton).toBeDisabled();

    await user.click(disabledButton);
    expect(handleBorrow).not.toHaveBeenCalled();
  });

  test('renders return button and triggers onReturn when borrowed', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={MOCK_BOOK_AVAILABLE}
        isBorrowed={true}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    expect(screen.getByText('Đang mượn')).toBeInTheDocument();

    const returnButton = screen.getByRole('button', { name: /trả sách/i });
    expect(returnButton).toBeInTheDocument();
    expect(returnButton).toBeEnabled();

    await user.click(returnButton);
    expect(handleReturn).toHaveBeenCalledTimes(1);
    expect(handleReturn).toHaveBeenCalledWith('book-cntt-01');
  });
});
