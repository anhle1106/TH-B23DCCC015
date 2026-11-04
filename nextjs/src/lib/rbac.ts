import { UserRole, AppAction } from '@/types/rbac';

/**
 * Authorization Matrix (Ma trận phân quyền duy nhất)
 * Hành động            | guest | user | admin
 * ---------------------|-------|------|------
 * Xem deadline         |   ✓   |  ✓   |  ✓
 * Đánh dấu đã xong     |   ✗   |  ✓   |  ✓
 * Thêm deadline        |   ✗   |  ✗   |  ✓
 * Xoá deadline         |   ✗   |  ✗   |  ✓
 */
export const PERMISSION_MATRIX: Record<AppAction, readonly UserRole[]> = {
  view_deadlines: ['guest', 'user', 'admin'],
  toggle_complete: ['user', 'admin'],
  add_deadline: ['admin'],
  delete_deadline: ['admin'],
} as const;

/**
 * Hàm kiểm tra quyền duy nhất của toàn bộ hệ thống
 * @param role Vai trò người dùng ('admin' | 'user' | 'guest' | undefined | null)
 * @param action Hành động muốn thực hiện
 * @returns boolean true nếu được phép, false nếu bị cấm
 */
export function can(role: string | null | undefined, action: AppAction): boolean {
  const normalizedRole: UserRole =
    role === 'admin' ? 'admin' : role === 'user' ? 'user' : 'guest';

  const allowedRoles = PERMISSION_MATRIX[action];
  if (!allowedRoles) {
    return false;
  }

  return allowedRoles.includes(normalizedRole);
}
