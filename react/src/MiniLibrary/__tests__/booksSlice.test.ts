import booksReducer, {
  initialBooksState,
  borrowBook,
  returnBook,
  setWarning,
  clearWarning,
  fetchBooks,
  setBooks,
  type BooksState,
} from '../features/books/booksSlice';
import type { Book } from '../types/book.types';
import { configureStore } from '@reduxjs/toolkit';
import { borrowLimitMiddleware } from '../features/books/borrowLimitMiddleware';

const MOCK_SAMPLE_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Lập Trình Web Nâng Cao',
    author: 'TS. Nguyễn Văn Toàn',
    category: 'CNTT',
    publishedYear: 2024,
    availableCopies: 3,
    totalCopies: 5,
  },
  {
    id: 'b2',
    title: 'Kinh Tế Vi Mô Hiện Đại',
    author: 'GS. TS. Vũ Đình Hùng',
    category: 'Kinh tế',
    publishedYear: 2021,
    availableCopies: 1,
    totalCopies: 2,
  },
  {
    id: 'b3',
    title: 'Kiến Trúc Microservices',
    author: 'Lê Hoàng Nam',
    category: 'CNTT',
    publishedYear: 2023,
    availableCopies: 0,
    totalCopies: 2,
  },
];

describe('booksSlice Reducer & Custom Middleware', () => {
  test('returns initial state for unknown action', () => {
    const state = booksReducer(undefined, { type: 'unknown/action' });
    expect(state).toEqual(initialBooksState);
    expect(state.books).toHaveLength(0);
    expect(state.borrowedBooks).toHaveLength(0);
    expect(state.status).toBe('idle');
    expect(state.error).toBeNull();
    expect(state.warningMessage).toBeNull();
  });

  test('handles fetchBooks.fulfilled', () => {
    const prevState = { ...initialBooksState, status: 'loading' as const };
    const action = {
      type: fetchBooks.fulfilled.type,
      payload: MOCK_SAMPLE_BOOKS,
    };
    const nextState = booksReducer(prevState, action);

    expect(nextState.status).toBe('succeeded');
    expect(nextState.books).toHaveLength(3);
    expect(nextState.books[0].title).toBe('Lập Trình Web Nâng Cao');
    expect(nextState.error).toBeNull();
  });

  test('handles fetchBooks.rejected', () => {
    const prevState = { ...initialBooksState, status: 'loading' as const };
    const errorMessage = 'Máy chủ thư viện bảo trì';
    const action = {
      type: fetchBooks.rejected.type,
      payload: errorMessage,
    };
    const nextState = booksReducer(prevState, action);

    expect(nextState.status).toBe('failed');
    expect(nextState.error).toBe(errorMessage);
  });

  test('decrements availableCopies and appends borrowedBooks on borrowBook', () => {
    const startingState: BooksState = {
      ...initialBooksState,
      books: JSON.parse(JSON.stringify(MOCK_SAMPLE_BOOKS)),
    };

    const nextState = booksReducer(startingState, borrowBook('b1'));

    const targetBook = nextState.books.find((b) => b.id === 'b1');
    expect(targetBook?.availableCopies).toBe(2);
    expect(nextState.borrowedBooks).toHaveLength(1);
    expect(nextState.borrowedBooks[0].bookId).toBe('b1');
    expect(nextState.borrowedBooks[0].bookTitle).toBe('Lập Trình Web Nâng Cao');
  });

  test('increments availableCopies and removes item on returnBook', () => {
    const startingState: BooksState = {
      ...initialBooksState,
      books: [
        {
          id: 'b1',
          title: 'Lập Trình Web Nâng Cao',
          author: 'TS. Nguyễn Văn Toàn',
          category: 'CNTT',
          publishedYear: 2024,
          availableCopies: 2,
          totalCopies: 5,
        },
      ],
      borrowedBooks: [
        {
          borrowId: 'borrow-test-1',
          bookId: 'b1',
          bookTitle: 'Lập Trình Web Nâng Cao',
          category: 'CNTT',
          author: 'TS. Nguyễn Văn Toàn',
          borrowedAt: new Date().toISOString(),
        },
      ],
    };

    const nextState = booksReducer(startingState, returnBook('b1'));

    expect(nextState.books[0].availableCopies).toBe(3);
    expect(nextState.borrowedBooks).toHaveLength(0);
  });

  test('handles setWarning and clearWarning', () => {
    const warningMsg = 'Bạn đã đạt giới hạn mượn sách!';
    const stateWithWarning = booksReducer(initialBooksState, setWarning(warningMsg));
    expect(stateWithWarning.warningMessage).toBe(warningMsg);

    const clearedState = booksReducer(stateWithWarning, clearWarning());
    expect(clearedState.warningMessage).toBeNull();
  });

  test('borrowLimitMiddleware blocks 4th book and dispatches warning', () => {
    const testStore = configureStore({
      reducer: { books: booksReducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(borrowLimitMiddleware),
    });

    testStore.dispatch(
      setBooks([
        { id: 'b1', title: 'Sách 1', author: 'A1', category: 'CNTT', publishedYear: 2024, availableCopies: 5, totalCopies: 5 },
        { id: 'b2', title: 'Sách 2', author: 'A2', category: 'CNTT', publishedYear: 2024, availableCopies: 5, totalCopies: 5 },
        { id: 'b3', title: 'Sách 3', author: 'A3', category: 'CNTT', publishedYear: 2024, availableCopies: 5, totalCopies: 5 },
        { id: 'b4', title: 'Sách 4', author: 'A4', category: 'CNTT', publishedYear: 2024, availableCopies: 5, totalCopies: 5 },
      ])
    );

    testStore.dispatch(borrowBook('b1'));
    testStore.dispatch(borrowBook('b2'));
    testStore.dispatch(borrowBook('b3'));

    expect(testStore.getState().books.borrowedBooks).toHaveLength(3);
    expect(testStore.getState().books.warningMessage).toBeNull();

    testStore.dispatch(borrowBook('b4'));

    const finalState = testStore.getState().books;
    expect(finalState.borrowedBooks).toHaveLength(3);
    const book4 = finalState.books.find((b) => b.id === 'b4');
    expect(book4?.availableCopies).toBe(5);
    expect(finalState.warningMessage).toMatch(/tối đa 3 cuốn/i);
  });
});
