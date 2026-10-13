import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../../hooks/useDebounce';
import { useDeadlineCountdown } from '../../hooks/useDeadlineCountdown';

describe('PHẦN C: HOOK TESTS (renderHook & fake timers)', () => {
  // --------------------------------------------------------------------------
  // 1. HOOK TEST: useDebounce với Fake Timers
  // --------------------------------------------------------------------------
  describe('useDebounce Custom Hook', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('khởi tạo với giá trị ban đầu ngay lập tức', () => {
      const { result } = renderHook(() => useDebounce('initial', 300));
      expect(result.current).toBe('initial');
    });

    it('trì hoãn cập nhật giá trị mới cho đến khi đủ thời gian delay 300ms', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        {
          initialProps: { value: 'first', delay: 300 },
        }
      );

      expect(result.current).toBe('first');

      // Thay đổi giá trị truyền vào
      rerender({ value: 'second', delay: 300 });

      // Chưa đủ 300ms (ví dụ sau 150ms), giá trị debounced vẫn giữ nguyên giá trị cũ
      act(() => {
        jest.advanceTimersByTime(150);
      });
      expect(result.current).toBe('first');

      // Trôi qua tiếp 150ms nữa (tổng 300ms), giá trị mới được cập nhật
      act(() => {
        jest.advanceTimersByTime(150);
      });
      expect(result.current).toBe('second');
    });

    it('huỷ timer cũ khi người dùng gõ liên tục và chỉ cập nhật giá trị cuối cùng sau 300ms', () => {
      const { result, rerender } = renderHook(
        ({ query }) => useDebounce(query, 300),
        {
          initialProps: { query: 'R' },
        }
      );

      // Gõ 'Re' sau 100ms
      act(() => {
        jest.advanceTimersByTime(100);
      });
      rerender({ query: 'Re' });

      // Gõ 'Rea' sau 100ms
      act(() => {
        jest.advanceTimersByTime(100);
      });
      rerender({ query: 'Rea' });

      // Gõ 'React' sau 100ms
      act(() => {
        jest.advanceTimersByTime(100);
      });
      rerender({ query: 'React' });

      // Lúc này chưa đủ 300ms kể từ lần gõ cuối cùng 'React', giá trị vẫn là 'R'
      expect(result.current).toBe('R');

      // Chờ đủ 300ms sau lần gõ cuối cùng
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(result.current).toBe('React');
    });
  });

  // --------------------------------------------------------------------------
  // 2. HOOK TEST: useDeadlineCountdown
  // --------------------------------------------------------------------------
  describe('useDeadlineCountdown Custom Hook', () => {
    it('trả về nhãn "Đã hoàn thành" khi isCompleted = true', () => {
      const { result } = renderHook(() =>
        useDeadlineCountdown('2026-10-15', true)
      );

      expect(result.current.countdownText).toBe('Đã hoàn thành');
      expect(result.current.urgencyLevel).toBe('completed');
      expect(result.current.isOverdue).toBe(false);
    });

    it('trả về nhãn "Quá hạn X ngày" khi hạn nộp đã qua', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 4);
      const yyyy = pastDate.getFullYear();
      const mm = String(pastDate.getMonth() + 1).padStart(2, '0');
      const dd = String(pastDate.getDate()).padStart(2, '0');

      const { result } = renderHook(() =>
        useDeadlineCountdown(`${yyyy}-${mm}-${dd}`, false)
      );

      expect(result.current.isOverdue).toBe(true);
      expect(result.current.countdownText).toBe('Quá hạn 4 ngày');
      expect(result.current.urgencyLevel).toBe('overdue');
    });

    it('trả về nhãn "Hạn chót hôm nay" khi hạn nộp là ngày hiện tại', () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');

      const { result } = renderHook(() =>
        useDeadlineCountdown(`${yyyy}-${mm}-${dd}`, false)
      );

      expect(result.current.isDueToday).toBe(true);
      expect(result.current.countdownText).toBe('Hạn chót hôm nay');
      expect(result.current.urgencyLevel).toBe('urgent');
    });

    it('trả về nhãn "Còn X ngày" khi còn hạn nộp trong tương lai', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const yyyy = futureDate.getFullYear();
      const mm = String(futureDate.getMonth() + 1).padStart(2, '0');
      const dd = String(futureDate.getDate()).padStart(2, '0');

      const { result } = renderHook(() =>
        useDeadlineCountdown(`${yyyy}-${mm}-${dd}`, false)
      );

      expect(result.current.isOverdue).toBe(false);
      expect(result.current.countdownText).toBe('Còn 5 ngày');
      expect(result.current.formattedDueDate).toBeDefined();
    });
  });
});
