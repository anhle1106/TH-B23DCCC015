import type { ApiResponse, Deadline } from '../types/deadline.types';

/**
 * Hàm sinh ngày theo độ lệch tương đối so với ngày hiện tại (YYYY-MM-DD)
 * Giúp dữ liệu mẫu luôn luôn hiển thị đúng "Còn X ngày" hoặc "Quá hạn Y ngày"
 * khi thầy cô hoặc sinh viên mở app ở bất kỳ thời điểm nào.
 */
function getRelativeDateString(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Danh sách deadline mẫu khởi tạo bám sát các môn học thực tế của sinh viên
 */
const INITIAL_MOCK_DEADLINES: Deadline[] = [
  {
    id: 'dl-1',
    subject: 'Lập trình Web nâng cao',
    title: 'Bài thực hành 01 (Redux Toolkit & Compound Component)',
    dueDate: getRelativeDateString(2), // Còn 2 ngày
    priority: 'high',
    isCompleted: false,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'dl-2',
    subject: 'An toàn & Bảo mật hệ thống',
    title: 'Báo cáo lỗ hổng bảo mật Web & Khai thác SQLi',
    dueDate: getRelativeDateString(-2), // Quá hạn 2 ngày
    priority: 'high',
    isCompleted: false,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'dl-3',
    subject: 'Kiến trúc máy tính',
    title: 'Mô phỏng đường ống lệnh CPU MIPS',
    dueDate: getRelativeDateString(5), // Còn 5 ngày
    priority: 'medium',
    isCompleted: false,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'dl-4',
    subject: 'Nhập môn Học máy',
    title: 'Lab 03: Phân loại dữ liệu với Random Forest & SVM',
    dueDate: getRelativeDateString(8), // Còn 8 ngày
    priority: 'low',
    isCompleted: false,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'dl-5',
    subject: 'Lập trình Web nâng cao',
    title: 'Bài tập tuần 02: Thiết kế Accordion Compound Component',
    dueDate: getRelativeDateString(-3),
    priority: 'medium',
    isCompleted: true, // Đã hoàn thành
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

/**
 * API Giả Lập (Simulated API Service)
 * Trả về ApiResponse<T> theo chuẩn Generic từ Buổi 1,
 * có độ trễ mạng nhân tạo (500ms) để thể hiện rõ trạng thái loading trong Redux Toolkit.
 */
export const mockDeadlinesApi = {
  fetchInitialDeadlines: async (): Promise<ApiResponse<Deadline[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [...INITIAL_MOCK_DEADLINES],
          status: 'success',
          message: 'Lấy danh sách bài tập mẫu thành công',
          timestamp: new Date().toISOString(),
        });
      }, 500);
    });
  },
};
