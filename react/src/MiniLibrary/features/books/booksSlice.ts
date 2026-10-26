import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { Book, BorrowedBook } from '../../types/book.types';
import { isApiSuccess } from '../../types/book.types';
import { fetchBooksApi } from '../../../api/booksApi';

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface BooksState {
  books: Book[];
  borrowedBooks: BorrowedBook[];
  status: LoadingStatus;
  error: string | null;
  warningMessage: string | null;
}

export const initialBooksState: BooksState = {
  books: [],
  borrowedBooks: [],
  status: 'idle',
  error: null,
  warningMessage: null,
};

export const fetchBooks = createAsyncThunk<
  Book[],
  boolean | undefined,
  { rejectValue: string }
>('books/fetchBooks', async (shouldFail = false, { rejectWithValue }) => {
  const response = await fetchBooksApi(shouldFail);
  if (isApiSuccess(response)) {
    return response.data;
  }
  return rejectWithValue(response.error);
});

export const booksSlice = createSlice({
  name: 'books',
  initialState: initialBooksState,
  reducers: {
    borrowBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const targetBook = state.books.find((b) => b.id === bookId);

      if (!targetBook) {
        return;
      }

      if (targetBook.availableCopies <= 0) {
        state.warningMessage = `Sách "${targetBook.title}" hiện đã hết bản trong thư viện!`;
        return;
      }

      targetBook.availableCopies -= 1;
      state.borrowedBooks.push({
        borrowId: `borrow-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        bookId: targetBook.id,
        bookTitle: targetBook.title,
        category: targetBook.category,
        author: targetBook.author,
        borrowedAt: new Date().toISOString(),
      });
      state.warningMessage = null;
    },

    returnBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const borrowIndex = state.borrowedBooks.findIndex((b) => b.bookId === bookId);

      if (borrowIndex === -1) {
        return;
      }

      state.borrowedBooks.splice(borrowIndex, 1);
      const targetBook = state.books.find((b) => b.id === bookId);
      if (targetBook) {
        targetBook.availableCopies += 1;
      }
      state.warningMessage = null;
    },

    setWarning: (state, action: PayloadAction<string>) => {
      state.warningMessage = action.payload;
    },

    clearWarning: (state) => {
      state.warningMessage = null;
    },

    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        state.books = action.payload;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Không thể tải danh sách sách từ máy chủ.';
      });
  },
});

export const {
  borrowBook,
  returnBook,
  setWarning,
  clearWarning,
  setBooks,
} = booksSlice.actions;

export default booksSlice.reducer;
