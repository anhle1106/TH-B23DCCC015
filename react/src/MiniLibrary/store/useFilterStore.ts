import { create } from 'zustand';
import type { BookCategory } from '../types/book.types';

export type CategoryFilter = 'Tất cả' | BookCategory;

export interface FilterState {
  keyword: string;
  category: CategoryFilter;
  setKeyword: (keyword: string) => void;
  setCategory: (category: CategoryFilter) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  keyword: '',
  category: 'Tất cả',
  setKeyword: (keyword: string) => set({ keyword }),
  setCategory: (category: CategoryFilter) => set({ category }),
  resetFilters: () => set({ keyword: '', category: 'Tất cả' }),
}));

export default useFilterStore;
