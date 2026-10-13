import { useState, useEffect } from 'react';

/**
 * ============================================================================
 * PHẦN B: CUSTOM HOOK useDebounce
 * ============================================================================
 * Trì hoãn việc cập nhật giá trị trong một khoảng thời gian delay (mặc định 300ms).
 * Giúp tối ưu ô tìm kiếm, hạn chế tính toán và re-render liên tục khi người dùng gõ phím.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
