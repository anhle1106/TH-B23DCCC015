export type BookCategory = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  publishedYear: number;
  availableCopies: number;
  totalCopies: number;
  description: string;
  isbn: string;
  pages: number;
  publisher: string;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  userEmail: string;
  bookTitle: string;
  borrowedAt: string;
  dueDate: string;
}
