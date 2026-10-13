import type { Deadline } from '../types/deadline.types';

/**
 * ============================================================================
 * DEADLINE / ASSIGNMENT UTILITY HELPERS
 * ============================================================================
 */

export interface DeadlineStatsResult {
  total: number;
  pending: number;
  overdue: number;
  completed: number;
  bySubject: Record<string, number>;
}

/**
 * Helper: Tính số ngày còn lại đến hạn nộp (dựa trên mốc 00:00:00)
 * - Trả về số dương: còn X ngày
 * - Trả về 0: hạn chót trong hôm nay
 * - Trả về số âm: quá hạn |X| ngày
 */
export function calcDaysLeft(dueDate: string): number {
  if (!dueDate || typeof dueDate !== 'string') return 0;
  const parts = dueDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return 0;

  const [year, month, day] = parts;
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = targetDate.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Helper: Kiểm tra bài tập có bị quá hạn hay không
 * - Nếu đã hoàn thành (isCompleted = true) -> không bao giờ tính là quá hạn
 * - Nếu chưa hoàn thành và ngày hạn < ngày hiện tại -> quá hạn (true)
 * - Trường hợp biên: chuỗi ngày rỗng, không hợp lệ -> false
 */
export function isOverdue(dueDate: string, isCompleted: boolean = false): boolean {
  if (isCompleted) return false;
  if (!dueDate || typeof dueDate !== 'string') return false;

  const daysLeft = calcDaysLeft(dueDate);
  return daysLeft < 0;
}

// Alias for backward compatibility
export const isDeadlineOverdue = isOverdue;

/**
 * Helper: Tính toán thống kê chi tiết từ danh sách bài tập
 * Bao gồm: tổng số, đang chờ, quá hạn, đã hoàn thành, và phân loại theo từng môn học
 */
export function calcStats(items: Deadline[]): DeadlineStatsResult {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      total: 0,
      pending: 0,
      overdue: 0,
      completed: 0,
      bySubject: {},
    };
  }

  let total = 0;
  let pending = 0;
  let overdue = 0;
  let completed = 0;
  const bySubject: Record<string, number> = {};

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    total++;

    // Group by subject
    const subject = item.subject || 'Khác';
    bySubject[subject] = (bySubject[subject] || 0) + 1;

    if (item.isCompleted) {
      completed++;
    } else if (isOverdue(item.dueDate, item.isCompleted)) {
      overdue++;
    } else {
      pending++;
    }
  }

  return {
    total,
    pending,
    overdue,
    completed,
    bySubject,
  };
}

/**
 * Helper: Sinh 10.000 bài tập mẫu cho chế độ Stress test hiệu năng
 */
export function generateMockAssignments(count: number = 10000): Deadline[] {
  const subjects = [
    'Lập trình Web nâng cao',
    'An toàn & Bảo mật hệ thống',
    'Kiến trúc máy tính',
    'Nhập môn Học máy',
    'Cơ sở dữ liệu phân tán',
    'Mạng máy tính & Truyền thông',
    'Phân tích thiết kế hệ thống',
    'Trí tuệ nhân tạo',
  ];

  const taskPrefixes = [
    'Bài tập lớn',
    'Báo cáo lab',
    'Bài thực hành',
    'Mini project',
    'Đồ án môn học',
    'Quiz trắc nghiệm',
    'Review mã nguồn',
    'Kiểm thử ứng dụng',
  ];

  const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
  const now = Date.now();
  const dayMs = 86400000;

  const result: Deadline[] = [];

  for (let i = 0; i < count; i++) {
    const subject = subjects[i % subjects.length];
    const prefix = taskPrefixes[i % taskPrefixes.length];
    const priority = priorities[i % priorities.length];

    // Tạo các mốc thời gian đa dạng từ quá hạn 30 ngày đến còn hạn 60 ngày
    const daysOffset = (i % 90) - 30;
    const dateObj = new Date(now + daysOffset * dayMs);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const dueDate = `${yyyy}-${mm}-${dd}`;

    const isCompleted = i % 4 === 0;

    result.push({
      id: `task-stress-${i + 1}`,
      subject,
      title: `${prefix} #${i + 1} - ${subject}`,
      dueDate,
      priority,
      isCompleted,
      createdAt: new Date(now - (i % 15) * dayMs).toISOString(),
    });
  }

  return result;
}
