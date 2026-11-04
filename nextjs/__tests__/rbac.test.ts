import { can, PERMISSION_MATRIX } from '@/lib/rbac';
import type { AppAction, UserRole } from '@/types/rbac';

describe('RBAC Authorization Matrix - can(role, action)', () => {
  describe('Ma trận phân quyền chuẩn theo đặc tả bài tập', () => {
    // 1. Action: view_deadlines
    test('Xem deadline (view_deadlines): guest, user, admin đều được phép', () => {
      expect(can('guest', 'view_deadlines')).toBe(true);
      expect(can('user', 'view_deadlines')).toBe(true);
      expect(can('admin', 'view_deadlines')).toBe(true);
      expect(can(undefined, 'view_deadlines')).toBe(true); // default guest
      expect(can(null, 'view_deadlines')).toBe(true); // default guest
    });

    // 2. Action: toggle_complete
    test('Đánh dấu đã xong (toggle_complete): guest bị chặn, user & admin được phép', () => {
      expect(can('guest', 'toggle_complete')).toBe(false);
      expect(can(undefined, 'toggle_complete')).toBe(false);
      expect(can(null, 'toggle_complete')).toBe(false);
      expect(can('user', 'toggle_complete')).toBe(true);
      expect(can('admin', 'toggle_complete')).toBe(true);
    });

    // 3. Action: add_deadline
    test('Thêm deadline (add_deadline): chỉ admin được phép, guest & user bị chặn', () => {
      expect(can('guest', 'add_deadline')).toBe(false);
      expect(can('user', 'add_deadline')).toBe(false);
      expect(can(undefined, 'add_deadline')).toBe(false);
      expect(can(null, 'add_deadline')).toBe(false);
      expect(can('admin', 'add_deadline')).toBe(true);
    });

    // 4. Action: delete_deadline
    test('Xoá deadline (delete_deadline): chỉ admin được phép, guest & user bị chặn', () => {
      expect(can('guest', 'delete_deadline')).toBe(false);
      expect(can('user', 'delete_deadline')).toBe(false);
      expect(can(undefined, 'delete_deadline')).toBe(false);
      expect(can(null, 'delete_deadline')).toBe(false);
      expect(can('admin', 'delete_deadline')).toBe(true);
    });
  });

  describe('Kiểm tra tính toàn vẹn của Ma trận (Single Source of Truth)', () => {
    test('PERMISSION_MATRIX chứa đúng 4 hành động chuẩn', () => {
      const actions = Object.keys(PERMISSION_MATRIX);
      expect(actions).toEqual([
        'view_deadlines',
        'toggle_complete',
        'add_deadline',
        'delete_deadline',
      ]);
    });

    test('Chặn các role không hợp lệ hoặc giả mạo', () => {
      expect(can('hacker', 'add_deadline')).toBe(false);
      expect(can('superadmin', 'delete_deadline')).toBe(false); // strict role
      expect(can('', 'toggle_complete')).toBe(false);
    });

    test('Chặn các action không tồn tại', () => {
      // @ts-expect-error Testing invalid action at runtime
      expect(can('admin', 'drop_database')).toBe(false);
    });
  });
});
