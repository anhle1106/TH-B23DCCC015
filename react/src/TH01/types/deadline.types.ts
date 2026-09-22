/**
 * ============================================================================
 * BUỔI 1: TYPESCRIPT NÂNG CAO
 * Minh họa đầy đủ:
 * 1. Generics (ApiResponse<T>, filterItems<T>)
 * 2. Utility Types (Omit, Pick, Partial, Record)
 * 3. Type Guards (isPriority, isDeadline, isDeadlineOverdue)
 * ============================================================================
 */

// 1. Core Unions & Enums
export type Priority = 'low' | 'medium' | 'high';
export type FilterStatus = 'all' | 'pending' | 'overdue' | 'completed';
export type UrgencyLevel = 'overdue' | 'urgent' | 'warning' | 'normal' | 'completed';

// 2. Base Entity
export interface Deadline {
  id: string;
  subject: string;      // Tên môn học (vd: Lập trình Web nâng cao, An toàn thông tin)
  title: string;        // Tên bài tập (vd: Bài thực hành 01, Báo cáo đồ án)
  dueDate: string;      // Ngày hạn nộp định dạng YYYY-MM-DD
  priority: Priority;   // Mức độ ưu tiên
  isCompleted: boolean; // Trạng thái hoàn thành
  createdAt: string;    // Ngày tạo ISO string
}

// 3. Utility Types: Omit, Pick, Partial, Record
/** DTO dùng khi tạo mới deadline (bỏ qua id, createdAt, isCompleted vì do hệ thống sinh) */
export type CreateDeadlineDTO = Omit<Deadline, 'id' | 'createdAt' | 'isCompleted'>;

/** DTO dùng khi cập nhật deadline (cho phép cập nhật một phần các trường có thể chỉnh sửa) */
export type UpdateDeadlineDTO = Partial<CreateDeadlineDTO>;

/** Rút gọn thông tin hiển thị tóm tắt */
export type DeadlineSummary = Pick<Deadline, 'id' | 'title' | 'dueDate' | 'isCompleted'>;

/** Cấu hình hiển thị theo mức độ ưu tiên sử dụng Record */
export interface PriorityConfig {
  label: string;
  badgeClass: string;
  dotColor: string;
}

export const PRIORITY_MAP: Record<Priority, PriorityConfig> = {
  low: {
    label: 'Thấp',
    badgeClass: 'badge-priority-low',
    dotColor: '#10b981', // emerald
  },
  medium: {
    label: 'Trung bình',
    badgeClass: 'badge-priority-medium',
    dotColor: '#f59e0b', // amber
  },
  high: {
    label: 'Cao',
    badgeClass: 'badge-priority-high',
    dotColor: '#ef4444', // rose/red
  },
};

// 4. Generics: Generic API Response & Generic Collection Filter
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

/**
 * Generic Utility: Lọc danh sách bất kỳ theo điều kiện type-safe
 */
export function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

// 5. Custom Type Guards
/**
 * Type Guard kiểm tra một giá trị bất kỳ có phải Priority hợp lệ hay không
 */
export function isPriority(val: unknown): val is Priority {
  return typeof val === 'string' && ['low', 'medium', 'high'].includes(val);
}

/**
 * Type Guard kiểm tra cấu trúc của đối tượng có đúng chuẩn Deadline hay không
 */
export function isDeadline(item: unknown): item is Deadline {
  if (typeof item !== 'object' || item === null) return false;
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.subject === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.dueDate === 'string' &&
    isPriority(candidate.priority) &&
    typeof candidate.isCompleted === 'boolean'
  );
}

/**
 * Type-safe helper xác định xem bài tập đã bị quá hạn hay chưa
 */
export function isDeadlineOverdue(dueDate: string, isCompleted: boolean): boolean {
  if (isCompleted) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dueDate.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate.getTime() < today.getTime();
}
