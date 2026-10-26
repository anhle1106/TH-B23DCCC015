import type { Book, ApiResponse } from '../MiniLibrary/types/book.types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-cntt-01',
    title: 'Lập Trình Web Nâng Cao với React & TypeScript',
    author: 'TS. Nguyễn Văn Toàn',
    category: 'CNTT',
    publishedYear: 2024,
    availableCopies: 3,
    totalCopies: 5,
    description: 'Giáo trình thực hành chuyên sâu về State Management, Tối ưu Render và Architecture trong React 19.',
    coverColor: '#0284c7',
  },
  {
    id: 'book-cntt-02',
    title: 'Cấu Trúc Dữ Liệu và Giải Thuật Ứng Dụng',
    author: 'PGS. TS. Trần Minh Tuấn',
    category: 'CNTT',
    publishedYear: 2022,
    availableCopies: 1,
    totalCopies: 4,
    description: 'Phân tích độ phức tạp thời gian/không gian, giải thuật nâng cao đồ thị và quy hoạch động.',
    coverColor: '#0ea5e9',
  },
  {
    id: 'book-cntt-03',
    title: 'Kiến Trúc Hệ Thống Phân Tán & Microservices',
    author: 'Lê Hoàng Nam',
    category: 'CNTT',
    publishedYear: 2023,
    availableCopies: 0,
    totalCopies: 3,
    description: 'Thiết kế hệ thống chịu tải cao, Message Queue, Event-driven và Container Orchestration.',
    coverColor: '#38bdf8',
  },
  {
    id: 'book-kt-01',
    title: 'Kinh Tế Vi Mô Hiện Đại',
    author: 'GS. TS. Vũ Đình Hùng',
    category: 'Kinh tế',
    publishedYear: 2021,
    availableCopies: 4,
    totalCopies: 6,
    description: 'Lý thuyết hành vi người tiêu dùng, cân bằng thị trường cạnh tranh và phân tích phúc lợi xã hội.',
    coverColor: '#10b981',
  },
  {
    id: 'book-kt-02',
    title: 'Quản Trị Tài Chính Doanh Nghiệp',
    author: 'ThS. Phạm Thuỳ Dung',
    category: 'Kinh tế',
    publishedYear: 2023,
    availableCopies: 2,
    totalCopies: 4,
    description: 'Định giá tài sản, hoạch định ngân sách vốn đầu tư và tối ưu hoá dòng tiền trong thời đại số.',
    coverColor: '#059669',
  },
  {
    id: 'book-kt-03',
    title: 'Nguyên Lý Marketing & Chiến Lược Số',
    author: 'Đỗ Quốc Bảo',
    category: 'Kinh tế',
    publishedYear: 2022,
    availableCopies: 0,
    totalCopies: 2,
    description: 'Hành trình trải nghiệm khách hàng, phễu chuyển đổi dữ liệu và chiến lược truyền thông đa kênh.',
    coverColor: '#34d399',
  },
  {
    id: 'book-nn-01',
    title: 'English for Information Technology & Engineering',
    author: 'Dr. Sarah Jenkins & ThS. Lê Vy',
    category: 'Ngoại ngữ',
    publishedYear: 2023,
    availableCopies: 5,
    totalCopies: 5,
    description: 'Từ vựng chuyên ngành công nghệ thông tin, cấu trúc viết tài liệu kỹ thuật và email chuyên nghiệp.',
    coverColor: '#f59e0b',
  },
  {
    id: 'book-nn-02',
    title: 'Tiếng Nhật Chuyên Ngành CNTT (IT Nihongo)',
    author: 'Kenji Tanaka & Nguyễn Thị Mai',
    category: 'Ngoại ngữ',
    publishedYear: 2022,
    availableCopies: 2,
    totalCopies: 3,
    description: 'Thuật ngữ kỹ thuật IT tiếng Nhật chuẩn, hội thoại giao tiếp dự án Offshore và báo cáo tiến độ.',
    coverColor: '#d97706',
  },
  {
    id: 'book-cntt-04',
    title: 'An Toàn Thông Tin & Phòng Thủ Mạng Thực Chiến',
    author: 'Nguyễn Thành Long',
    category: 'CNTT',
    publishedYear: 2024,
    availableCopies: 2,
    totalCopies: 4,
    description: 'Phân tích lỗ hổng phần mềm OWASP, cơ chế mã hoá dữ liệu và kiến trúc mạng Zero Trust.',
    coverColor: '#6366f1',
  },
];

export function fetchBooksApi(
  shouldFail: boolean = false,
  delayMs: number = 500
): Promise<ApiResponse<Book[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Không thể kết nối đến máy chủ thư viện khoa (HTTP 500). Vui lòng thử lại sau!',
        });
      } else {
        resolve({
          ok: true,
          data: JSON.parse(JSON.stringify(INITIAL_BOOKS)),
        });
      }
    }, delayMs);
  });
}
