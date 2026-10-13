import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

/**
 * ============================================================================
 * PHẦN A: CHỦ ĐỀ SÁNG/TỐI BẰNG CONTEXT NÂNG CAO
 * ============================================================================
 * - Tạo ThemeContext riêng biệt, hoàn toàn độc lập với các Context khác
 * - Bọc giá trị cung cấp (value) bằng useMemo để tránh re-render không cần thiết
 * - Cung cấp hook useTheme() type-safe
 */

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('student_tracker_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return defaultTheme;
  });

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('student_tracker_theme', next);
      }
      return next;
    });
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('student_tracker_theme', mode);
    }
  };

  // Bọc value bằng useMemo theo đúng chuẩn yêu cầu
  const contextValue = useMemo<ThemeContextValue>(() => ({
    theme,
    toggleTheme,
    setTheme,
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={`theme-provider-wrapper theme-${theme}`} data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
