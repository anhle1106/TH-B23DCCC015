import type { Book, BorrowRecord } from '@/types/book';

let booksStore: Book[] = [
  {
    id: 'lap-trinh-web-nang-cao',
    title: 'Lập Trình Web Nâng Cao với React & Next.js',
    author: 'TS. Nguyễn Văn Toàn',
    category: 'CNTT',
    publishedYear: 2024,
    availableCopies: 4,
    totalCopies: 5,
    description: 'Giáo trình thực hành kiến trúc Server Components, NextAuth, Server Actions và tối ưu SEO.',
    isbn: '978-604-0-12345-6',
    pages: 420,
    publisher: 'NXB Thông Tin & Truyền Thông',
  },
  {
    id: 'cau-truc-du-lieu-giai-thuat',
    title: 'Cấu Trúc Dữ Liệu và Giải Thuật Ứng Dụng',
    author: 'PGS. TS. Trần Minh Tuấn',
    category: 'CNTT',
    publishedYear: 2022,
    availableCopies: 2,
    totalCopies: 4,
    description: 'Phân tích độ phức tạp thời gian/không gian, giải thuật nâng cao đồ thị và quy hoạch động.',
    isbn: '978-604-0-67890-1',
    pages: 512,
    publisher: 'NXB Giáo Dục Việt Nam',
  },
  {
    id: 'kien-truc-microservices',
    title: 'Kiến Trúc Hệ Thống Phân Tán & Microservices',
    author: 'Lê Hoàng Nam',
    category: 'CNTT',
    publishedYear: 2023,
    availableCopies: 0,
    totalCopies: 3,
    description: 'Thiết kế hệ thống chịu tải cao, Message Queue, Event-driven và Container Orchestration.',
    isbn: '978-604-0-99887-2',
    pages: 380,
    publisher: 'NXB Khoa Học & Kỹ Thuật',
  },
  {
    id: 'kinh-te-vi-mo-hien-dai',
    title: 'Kinh Tế Vi Mô Hiện Đại',
    author: 'GS. TS. Vũ Đình Hùng',
    category: 'Kinh tế',
    publishedYear: 2021,
    availableCopies: 5,
    totalCopies: 6,
    description: 'Lý thuyết hành vi người tiêu dùng, cân bằng thị trường cạnh tranh và phân tích phúc lợi xã hội.',
    isbn: '978-604-1-11223-4',
    pages: 450,
    publisher: 'NXB Tài Chính',
  },
  {
    id: 'quan-tri-tai-chinh',
    title: 'Quản Trị Tài Chính Doanh Nghiệp',
    author: 'ThS. Phạm Thuỳ Dung',
    category: 'Kinh tế',
    publishedYear: 2023,
    availableCopies: 3,
    totalCopies: 4,
    description: 'Định giá tài sản, hoạch định ngân sách vốn đầu tư và tối ưu hoá dòng tiền trong thời đại số.',
    isbn: '978-604-1-44556-7',
    pages: 390,
    publisher: 'NXB Kinh Tế Quốc Dân',
  },
  {
    id: 'english-for-it',
    title: 'English for Information Technology & Engineering',
    author: 'Dr. Sarah Jenkins & ThS. Lê Vy',
    category: 'Ngoại ngữ',
    publishedYear: 2023,
    availableCopies: 4,
    totalCopies: 5,
    description: 'Từ vựng chuyên ngành công nghệ thông tin, cấu trúc viết tài liệu kỹ thuật và email chuyên nghiệp.',
    isbn: '978-604-2-77889-0',
    pages: 320,
    publisher: 'NXB Đại Học Quốc Gia',
  },
];

let borrowRecordsStore: BorrowRecord[] = [
  {
    id: 'borrow-init-01',
    bookId: 'lap-trinh-web-nang-cao',
    userId: 'user-student-01',
    userEmail: 'student@library.edu.vn',
    bookTitle: 'Lập Trình Web Nâng Cao với React & Next.js',
    borrowedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 11 * 24 * 3600 * 1000).toISOString(),
  },
];

export async function getBooks(): Promise<Book[]> {
  return [...booksStore];
}

export async function getBookById(id: string): Promise<Book | undefined> {
  return booksStore.find((b) => b.id === id);
}

export async function addBook(data: Omit<Book, 'id'>): Promise<Book> {
  const slug = data.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const id = `${slug}-${Date.now().toString().slice(-4)}`;
  const newBook: Book = { ...data, id };
  booksStore.unshift(newBook);
  return newBook;
}

export async function deleteBook(id: string): Promise<boolean> {
  const index = booksStore.findIndex((b) => b.id === id);
  if (index === -1) return false;
  booksStore.splice(index, 1);
  return true;
}

export async function borrowBook(bookId: string, userId: string, userEmail: string): Promise<{ ok: boolean; error?: string }> {
  const book = booksStore.find((b) => b.id === bookId);
  if (!book) return { ok: false, error: 'Không tìm thấy sách.' };
  if (book.availableCopies <= 0) return { ok: false, error: 'Sách đã hết bản.' };

  const userBorrows = borrowRecordsStore.filter((r) => r.userId === userId);
  if (userBorrows.length >= 3) {
    return { ok: false, error: 'Bạn đã đạt giới hạn tối đa 3 cuốn sách.' };
  }

  const alreadyBorrowed = userBorrows.some((r) => r.bookId === bookId);
  if (alreadyBorrowed) {
    return { ok: false, error: 'Bạn đang mượn cuốn sách này rồi.' };
  }

  book.availableCopies -= 1;
  borrowRecordsStore.push({
    id: `borrow-${Date.now()}`,
    bookId,
    userId,
    userEmail,
    bookTitle: book.title,
    borrowedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
  });

  return { ok: true };
}

export async function returnBook(bookId: string, userId: string): Promise<{ ok: boolean; error?: string }> {
  const index = borrowRecordsStore.findIndex(
    (r) => r.bookId === bookId && r.userId === userId
  );
  if (index === -1) {
    return { ok: false, error: 'Không tìm thấy bản ghi mượn cuốn sách này.' };
  }

  borrowRecordsStore.splice(index, 1);
  const book = booksStore.find((b) => b.id === bookId);
  if (book) {
    book.availableCopies += 1;
  }

  return { ok: true };
}

export async function getUserBorrows(userId: string): Promise<BorrowRecord[]> {
  return borrowRecordsStore.filter((r) => r.userId === userId);
}
