import type { Middleware } from '@reduxjs/toolkit';
import { borrowBook, setWarning, type BooksState } from './booksSlice';
import type { BorrowedBook } from '../../types/book.types';

export interface MiddlewareRootState {
  books: BooksState;
}

export const MAX_BORROW_LIMIT = 3;

export const borrowLimitMiddleware: Middleware<unknown, MiddlewareRootState> =
  (storeApi) => (next) => (action) => {
    if (borrowBook.match(action)) {
      const state = storeApi.getState();
      const borrowedList: BorrowedBook[] = state.books.borrowedBooks;
      const targetBookId: string = action.payload;

      const isAlreadyBorrowed = borrowedList.some(
        (item: BorrowedBook) => item.bookId === targetBookId
      );
      if (isAlreadyBorrowed) {
        storeApi.dispatch(
          setWarning(
            'Bạn hiện đang giữ một bản của cuốn sách này! Không thể mượn thêm bản trùng lặp.'
          )
        );
        return;
      }

      if (borrowedList.length >= MAX_BORROW_LIMIT) {
        storeApi.dispatch(
          setWarning(
            `Mỗi sinh viên chỉ được mượn tối đa ${MAX_BORROW_LIMIT} cuốn cùng lúc! Vui lòng trả bớt sách trước khi mượn thêm.`
          )
        );
        return;
      }
    }

    return next(action);
  };

export default borrowLimitMiddleware;
