import type { Book, BorrowedBook, CategoryCountMap } from '../../types/book.types';
import type { BooksState } from './booksSlice';

export interface RootStateWithBooks {
  books: BooksState;
}

export const selectAllBooks = (state: RootStateWithBooks): Book[] => state.books.books;

export const selectBorrowedBooks = (state: RootStateWithBooks): BorrowedBook[] =>
  state.books.borrowedBooks;

export const selectBooksStatus = (state: RootStateWithBooks) => state.books.status;

export const selectBooksError = (state: RootStateWithBooks): string | null =>
  state.books.error;

export const selectWarningMessage = (state: RootStateWithBooks): string | null =>
  state.books.warningMessage;

export const selectCategoryStats = (state: RootStateWithBooks): CategoryCountMap => {
  const books: Book[] = state.books.books;
  const stats: CategoryCountMap = {
    CNTT: 0,
    'Kinh tế': 0,
    'Ngoại ngữ': 0,
  };

  for (const book of books) {
    const cat = book.category;
    stats[cat] = (stats[cat] ?? 0) + 1;
  }

  return stats;
};

export const selectIsBookBorrowed =
  (bookId: string) =>
  (state: RootStateWithBooks): boolean =>
    state.books.borrowedBooks.some((item: BorrowedBook) => item.bookId === bookId);
