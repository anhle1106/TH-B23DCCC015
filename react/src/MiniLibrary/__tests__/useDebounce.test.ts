import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('delays updating value until delay expires', () => {
    const delay = 300;
    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebounce<string>(value, delayMs),
      {
        initialProps: { value: 'React', delayMs: delay },
      }
    );

    expect(result.current).toBe('React');

    rerender({ value: 'TypeScript', delayMs: delay });
    expect(result.current).toBe('React');

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('React');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('TypeScript');
  });

  test('cancels previous timer on rapid value changes', () => {
    const delay = 300;
    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebounce<string>(value, delayMs),
      {
        initialProps: { value: 'a', delayMs: delay },
      }
    );

    rerender({ value: 'ab', delayMs: delay });
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('a');

    rerender({ value: 'abc', delayMs: delay });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('abc');
  });
});
