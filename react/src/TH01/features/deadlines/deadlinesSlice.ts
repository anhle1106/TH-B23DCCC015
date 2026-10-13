import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { CreateDeadlineDTO, Deadline, FilterStatus } from '../../types/deadline.types';
import { isOverdue, generateMockAssignments } from '../../utils/deadlineHelpers';
import { mockDeadlinesApi } from '../../api/mockDeadlinesApi';
import type { RootState } from '../../store';

/**
 * ============================================================================
 * REDUX TOOLKIT: DEADLINES / ASSIGNMENTS SLICE (TH01 & TH02)
 * ============================================================================
 */

export interface DeadlinesState {
  items: Deadline[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  filter: FilterStatus;
  searchQuery: string;
  error: string | null;
}

export const initialState: DeadlinesState = {
  items: [],
  status: 'idle',
  filter: 'all',
  searchQuery: '',
  error: null,
};

/**
 * Async Thunk: Nạp danh sách bài tập ban đầu từ mock API
 */
export const fetchInitialDeadlines = createAsyncThunk(
  'deadlines/fetchInitialDeadlines',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockDeadlinesApi.fetchInitialDeadlines();
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ giả lập'
      );
    }
  }
);

export const deadlinesSlice = createSlice({
  name: 'deadlines',
  initialState,
  reducers: {
    /** Thêm bài tập mới */
    addDeadline: (state, action: PayloadAction<CreateDeadlineDTO>) => {
      const newDeadline: Deadline = {
        id: `dl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ...action.payload,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newDeadline);
    },

    /** Đánh dấu hoàn thành / bỏ hoàn thành */
    toggleDeadline: (state, action: PayloadAction<string>) => {
      const target = state.items.find((item) => item.id === action.payload);
      if (target) {
        target.isCompleted = !target.isCompleted;
      }
    },

    /** Xoá bài tập */
    deleteDeadline: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    /** Đặt bộ lọc trạng thái (all, pending, overdue, completed) */
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filter = action.payload;
    },

    /** Đặt từ khoá tìm kiếm */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    /** Gán toàn bộ danh sách bài tập */
    setDeadlines: (state, action: PayloadAction<Deadline[]>) => {
      state.items = action.payload;
      state.status = 'succeeded';
    },

    /** PHẦN B: Chế độ Stress Test - Sinh 10.000 bài tập mẫu */
    generateStressDeadlines: (state, action: PayloadAction<number | undefined>) => {
      const count = action.payload ?? 10000;
      state.items = generateMockAssignments(count);
      state.status = 'succeeded';
    },

    /** Xoá toàn bộ bài tập (tiện cho test / reset) */
    clearAllDeadlines: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialDeadlines.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInitialDeadlines.fulfilled, (state, action: PayloadAction<Deadline[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchInitialDeadlines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Lỗi tải dữ liệu';
      });
  },
});

export const {
  addDeadline,
  toggleDeadline,
  deleteDeadline,
  setFilter,
  setSearchQuery,
  setDeadlines,
  generateStressDeadlines,
  clearAllDeadlines,
} = deadlinesSlice.actions;

// Compatibility alias for assignments
export const assignmentsSlice = deadlinesSlice;
export const assignmentsReducer = deadlinesSlice.reducer;

// Selectors
export const selectAllDeadlines = (state: RootState) => state.deadlines.items;
export const selectDeadlinesStatus = (state: RootState) => state.deadlines.status;
export const selectDeadlinesFilter = (state: RootState) => state.deadlines.filter;
export const selectDeadlinesSearch = (state: RootState) => state.deadlines.searchQuery;
export const selectDeadlinesError = (state: RootState) => state.deadlines.error;

/**
 * Selector lọc danh sách bài tập theo FilterStatus và SearchQuery
 */
export const selectFilteredDeadlines = (state: RootState): Deadline[] => {
  const { items, filter, searchQuery } = state.deadlines;
  const query = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    // 1. Lọc theo từ khoá
    const matchSearch =
      query === '' ||
      item.title.toLowerCase().includes(query) ||
      item.subject.toLowerCase().includes(query);

    if (!matchSearch) return false;

    // 2. Lọc theo trạng thái
    const overdue = isOverdue(item.dueDate, item.isCompleted);

    switch (filter) {
      case 'completed':
        return item.isCompleted;
      case 'overdue':
        return !item.isCompleted && overdue;
      case 'pending':
        return !item.isCompleted && !overdue;
      case 'all':
      default:
        return true;
    }
  });
};

/**
 * Selector tính toán thống kê tổng quan
 */
export const selectDeadlinesStats = (state: RootState) => {
  const items = state.deadlines.items;
  let total = 0;
  let pending = 0;
  let overdue = 0;
  let completed = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    total++;
    if (item.isCompleted) {
      completed++;
    } else if (isOverdue(item.dueDate, item.isCompleted)) {
      overdue++;
    } else {
      pending++;
    }
  }

  return { total, pending, overdue, completed };
};

export default deadlinesSlice.reducer;
