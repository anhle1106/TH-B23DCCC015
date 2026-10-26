export type BookCategory = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';

export const BOOK_CATEGORIES: readonly BookCategory[] = [
  'CNTT',
  'Kinh tế',
  'Ngoại ngữ',
] as const;

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  publishedYear: number;
  availableCopies: number;
  totalCopies: number;
  description?: string;
  coverColor?: string;
}

export interface BorrowedBook {
  borrowId: string;
  bookId: string;
  bookTitle: string;
  category: BookCategory;
  author: string;
  borrowedAt: string;
}

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function isApiSuccess<T>(
  response: ApiResponse<T>
): response is { ok: true; data: T } {
  return response.ok === true;
}

export function isApiError<T>(
  response: ApiResponse<T>
): response is { ok: false; error: string } {
  return response.ok === false;
}

export type BookSummary = Pick<Book, 'id' | 'title' | 'author' | 'availableCopies'>;

export type CreateBookPayload = Omit<Book, 'id'>;

export type CategoryCountMap = Record<BookCategory, number>;

export type BookFilterOptions = Partial<Pick<Book, 'category' | 'author' | 'publishedYear'>>;
