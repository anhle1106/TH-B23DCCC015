import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { CreateDeadlineDTO, Deadline, FilterStatus } from '../../types/deadline.types';
import { isDeadlineOverdue } from '../../types/deadline.types';
import { mockDeadlinesApi } from '../../api/mockDeadlinesApi';
import type { RootState } from '../../store';

/**
 * ============================================================================
 * BUỔI 3: REDUX TOOLKIT + TYPESCRIPT (FEATURE-BASED STRUCTURE)
 * ============================================================================
 */

export interface DeadlinesState {
  items: Deadline[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  filter: FilterStatus;
  searchQuery: string;
  error: string | null;
}

const initialState: DeadlinesState = {
  items: [],
  status: 'idle',
  filter: 'all',
  searchQuery: '',
  error: null,
};

/**
 * Yêu cầu 7: createAsyncThunk nạp danh sách ban đầu từ API giả lập
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
    /** Yêu cầu 2: Thêm bài tập mới */
    addDeadline: (state, action: PayloadAction<CreateDeadlineDTO>) => {
      const newDeadline: Deadline = {
        id: `dl-${Date.now()}`,
        ...action.payload,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newDeadline);
    },

    /** Yêu cầu 3: Đánh dấu hoàn thành / bỏ đánh dấu */
    toggleDeadline: (state, action: PayloadAction<string>) => {
      const target = state.items.find((item) => item.id === action.payload);
      if (target) {
        target.isCompleted = !target.isCompleted;
      }
    },

    /** Yêu cầu 4: Xoá bài tập */
    deleteDeadline: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    /** Yêu cầu 5: Lọc theo trạng thái */
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filter = action.payload;
    },

    /** Tìm kiếm theo từ khoá môn học hoặc tên bài */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
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
} = deadlinesSlice.actions;

// Selectors
export const selectAllDeadlines = (state: RootState) => state.deadlines.items;
export const selectDeadlinesStatus = (state: RootState) => state.deadlines.status;
export const selectDeadlinesFilter = (state: RootState) => state.deadlines.filter;
export const selectDeadlinesSearch = (state: RootState) => state.deadlines.searchQuery;

/**
 * Selector lọc danh sách theo FilterStatus và SearchQuery
 */
export const selectFilteredDeadlines = (state: RootState): Deadline[] => {
  const { items, filter, searchQuery } = state.deadlines;
  const query = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    // 1. Kiểm tra lọc theo từ khóa tìm kiếm
    const matchSearch =
      query === '' ||
      item.title.toLowerCase().includes(query) ||
      item.subject.toLowerCase().includes(query);

    if (!matchSearch) return false;

    // 2. Kiểm tra lọc theo trạng thái
    const overdue = isDeadlineOverdue(item.dueDate, item.isCompleted);

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
 * Selector tính toán thống kê số lượng bài tập theo các nhóm
 */
export const selectDeadlinesStats = (state: RootState) => {
  const items = state.deadlines.items;
  let total = 0;
  let pending = 0;
  let overdue = 0;
  let completed = 0;

  for (const item of items) {
    total++;
    if (item.isCompleted) {
      completed++;
    } else if (isDeadlineOverdue(item.dueDate, item.isCompleted)) {
      overdue++;
    } else {
      pending++;
    }
  }

  return { total, pending, overdue, completed };
};

export default deadlinesSlice.reducer;
