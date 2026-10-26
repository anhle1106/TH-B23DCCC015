import { configureStore } from '@reduxjs/toolkit';
import booksReducer, { type BooksState } from '../features/books/booksSlice';
import { borrowLimitMiddleware } from '../features/books/borrowLimitMiddleware';

export interface RootState {
  books: BooksState;
}

export const store = configureStore({
  reducer: {
    books: booksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(borrowLimitMiddleware),
});

export type AppDispatch = typeof store.dispatch;

export default store;
