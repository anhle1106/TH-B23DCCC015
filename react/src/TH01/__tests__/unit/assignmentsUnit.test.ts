import {
  isOverdue,
  calcDaysLeft,
  calcStats,
  generateMockAssignments,
} from '../../utils/deadlineHelpers';
import {
  deadlinesSlice,
  addDeadline,
  toggleDeadline,
  deleteDeadline,
  setFilter,
  setSearchQuery,
  generateStressDeadlines,
  clearAllDeadlines,
  fetchInitialDeadlines,
  initialState,
} from '../../features/deadlines/deadlinesSlice';
import type { Deadline } from '../../types/deadline.types';

describe('PHẦN C: UNIT TESTS - HELPERS & ASSIGNMENT REDUCER', () => {
  // --------------------------------------------------------------------------
  // 1. UNIT TEST: calcDaysLeft
  // --------------------------------------------------------------------------
  describe('calcDaysLeft', () => {
    it('tính chính xác số ngày còn lại đến hạn nộp trong tương lai', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const yyyy = futureDate.getFullYear();
      const mm = String(futureDate.getMonth() + 1).padStart(2, '0');
      const dd = String(futureDate.getDate()).padStart(2, '0');

      const daysLeft = calcDaysLeft(`${yyyy}-${mm}-${dd}`);
      expect(daysLeft).toBe(5);
    });

    it('trả về 0 khi hạn nộp là ngày hôm nay', () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');

      const daysLeft = calcDaysLeft(`${yyyy}-${mm}-${dd}`);
      expect(daysLeft).toBe(0);
    });

    it('trả về số âm khi bài tập đã quá hạn nộp', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 3);
      const yyyy = pastDate.getFullYear();
      const mm = String(pastDate.getMonth() + 1).padStart(2, '0');
      const dd = String(pastDate.getDate()).padStart(2, '0');

      const daysLeft = calcDaysLeft(`${yyyy}-${mm}-${dd}`);
      expect(daysLeft).toBe(-3);
    });

    it('xử lý trường hợp biên: chuỗi ngày rỗng hoặc sai định dạng', () => {
      expect(calcDaysLeft('')).toBe(0);
      expect(calcDaysLeft('invalid-date')).toBe(0);
      // @ts-expect-error test non-string input
      expect(calcDaysLeft(null)).toBe(0);
    });
  });

  // --------------------------------------------------------------------------
  // 2. UNIT TEST: isOverdue
  // --------------------------------------------------------------------------
  describe('isOverdue', () => {
    it('trả về true khi ngày nộp trong quá khứ và bài tập chưa hoàn thành', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 2);
      const yyyy = pastDate.getFullYear();
      const mm = String(pastDate.getMonth() + 1).padStart(2, '0');
      const dd = String(pastDate.getDate()).padStart(2, '0');

      expect(isOverdue(`${yyyy}-${mm}-${dd}`, false)).toBe(true);
    });

    it('trả về false khi bài tập đã hoàn thành kể cả ngày nộp trong quá khứ', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      const yyyy = pastDate.getFullYear();
      const mm = String(pastDate.getMonth() + 1).padStart(2, '0');
      const dd = String(pastDate.getDate()).padStart(2, '0');

      expect(isOverdue(`${yyyy}-${mm}-${dd}`, true)).toBe(false);
    });

    it('trả về false khi ngày nộp trong tương lai', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const yyyy = futureDate.getFullYear();
      const mm = String(futureDate.getMonth() + 1).padStart(2, '0');
      const dd = String(futureDate.getDate()).padStart(2, '0');

      expect(isOverdue(`${yyyy}-${mm}-${dd}`, false)).toBe(false);
    });

    it('xử lý trường hợp biên: ngày rỗng hoặc undefined', () => {
      expect(isOverdue('', false)).toBe(false);
      // @ts-expect-error test invalid date
      expect(isOverdue(undefined, false)).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // 3. UNIT TEST: calcStats
  // --------------------------------------------------------------------------
  describe('calcStats', () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 4);
    const pastStr = `${pastDate.getFullYear()}-${String(pastDate.getMonth() + 1).padStart(2, '0')}-${String(pastDate.getDate()).padStart(2, '0')}`;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 4);
    const futureStr = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}-${String(futureDate.getDate()).padStart(2, '0')}`;

    it('tính toán chính xác các chỉ số tổng quan và phân loại theo môn', () => {
      const mockList: Deadline[] = [
        {
          id: '1',
          subject: 'Lập trình Web',
          title: 'Bài 1',
          dueDate: futureStr,
          priority: 'high',
          isCompleted: false,
          createdAt: '',
        },
        {
          id: '2',
          subject: 'Lập trình Web',
          title: 'Bài 2',
          dueDate: pastStr,
          priority: 'medium',
          isCompleted: false,
          createdAt: '',
        },
        {
          id: '3',
          subject: 'An toàn mạng',
          title: 'Bài 3',
          dueDate: pastStr,
          priority: 'low',
          isCompleted: true,
          createdAt: '',
        },
        {
          id: '4',
          subject: 'Học máy',
          title: 'Bài 4',
          dueDate: todayStr,
          priority: 'high',
          isCompleted: false,
          createdAt: '',
        },
      ];

      const stats = calcStats(mockList);

      expect(stats.total).toBe(4);
      expect(stats.completed).toBe(1);
      expect(stats.overdue).toBe(1); // bài 2 quá hạn và chưa hoàn thành
      expect(stats.pending).toBe(2); // bài 1 (tương lai) và bài 4 (hôm nay)
      expect(stats.bySubject).toEqual({
        'Lập trình Web': 2,
        'An toàn mạng': 1,
        'Học máy': 1,
      });
    });

    it('xử lý trường hợp biên: danh sách rỗng hoặc đầu vào không hợp lệ', () => {
      expect(calcStats([])).toEqual({
        total: 0,
        pending: 0,
        overdue: 0,
        completed: 0,
        bySubject: {},
      });

      // @ts-expect-error test non-array
      expect(calcStats(null)).toEqual({
        total: 0,
        pending: 0,
        overdue: 0,
        completed: 0,
        bySubject: {},
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4. UNIT TEST: generateMockAssignments (Stress Test Generator)
  // --------------------------------------------------------------------------
  describe('generateMockAssignments', () => {
    it('sinh đúng số lượng 10.000 bài tập mẫu với đầy đủ trường dữ liệu', () => {
      const items = generateMockAssignments(100);
      expect(items).toHaveLength(100);
      expect(items[0]).toHaveProperty('id');
      expect(items[0]).toHaveProperty('subject');
      expect(items[0]).toHaveProperty('title');
      expect(items[0]).toHaveProperty('dueDate');
      expect(items[0]).toHaveProperty('priority');
      expect(items[0]).toHaveProperty('isCompleted');
    });
  });

  // --------------------------------------------------------------------------
  // 5. UNIT TEST: assignmentsSlice / deadlinesSlice Reducer & Trường hợp biên
  // --------------------------------------------------------------------------
  describe('assignmentsSlice / deadlinesSlice Reducer', () => {
    it('thêm bài tập mới vào đầu danh sách (addDeadline)', () => {
      const state = deadlinesSlice.reducer(
        initialState,
        addDeadline({
          subject: 'Lập trình Web',
          title: 'Test Assignment',
          dueDate: '2026-12-01',
          priority: 'high',
        })
      );

      expect(state.items).toHaveLength(1);
      expect(state.items[0].title).toBe('Test Assignment');
      expect(state.items[0].isCompleted).toBe(false);
      expect(state.items[0].id).toBeDefined();
    });

    it('đảo trạng thái hoàn thành (toggleDeadline)', () => {
      const startingState = {
        ...initialState,
        items: [
          {
            id: 'dl-1',
            subject: 'Lập trình Web',
            title: 'Task 1',
            dueDate: '2026-10-20',
            priority: 'medium' as const,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };

      const nextState = deadlinesSlice.reducer(startingState, toggleDeadline('dl-1'));
      expect(nextState.items[0].isCompleted).toBe(true);

      const revertedState = deadlinesSlice.reducer(nextState, toggleDeadline('dl-1'));
      expect(revertedState.items[0].isCompleted).toBe(false);
    });

    it('trường hợp biên: toggleDeadline với id không tồn tại không làm thay đổi state', () => {
      const startingState = {
        ...initialState,
        items: [
          {
            id: 'dl-1',
            subject: 'Lập trình Web',
            title: 'Task 1',
            dueDate: '2026-10-20',
            priority: 'medium' as const,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };

      const nextState = deadlinesSlice.reducer(startingState, toggleDeadline('non-existent-id'));
      expect(nextState.items[0].isCompleted).toBe(false);
    });

    it('xoá bài tập theo id (deleteDeadline)', () => {
      const startingState = {
        ...initialState,
        items: [
          {
            id: 'dl-1',
            subject: 'Lập trình Web',
            title: 'Task 1',
            dueDate: '2026-10-20',
            priority: 'medium' as const,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'dl-2',
            subject: 'An toàn mạng',
            title: 'Task 2',
            dueDate: '2026-10-22',
            priority: 'low' as const,
            isCompleted: true,
            createdAt: new Date().toISOString(),
          },
        ],
      };

      const nextState = deadlinesSlice.reducer(startingState, deleteDeadline('dl-1'));
      expect(nextState.items).toHaveLength(1);
      expect(nextState.items[0].id).toBe('dl-2');
    });

    it('trường hợp biên: deleteDeadline với id không tồn tại', () => {
      const startingState = {
        ...initialState,
        items: [
          {
            id: 'dl-1',
            subject: 'Lập trình Web',
            title: 'Task 1',
            dueDate: '2026-10-20',
            priority: 'medium' as const,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };

      const nextState = deadlinesSlice.reducer(startingState, deleteDeadline('invalid-id'));
      expect(nextState.items).toHaveLength(1);
    });

    it('thay đổi bộ lọc filter và searchQuery', () => {
      let state = deadlinesSlice.reducer(initialState, setFilter('overdue'));
      expect(state.filter).toBe('overdue');

      state = deadlinesSlice.reducer(state, setSearchQuery('React'));
      expect(state.searchQuery).toBe('React');
    });

    it('sinh 10.000 bài tập mẫu cho stress test (generateStressDeadlines)', () => {
      const state = deadlinesSlice.reducer(initialState, generateStressDeadlines(100));
      expect(state.items).toHaveLength(100);
      expect(state.status).toBe('succeeded');
    });

    it('xoá toàn bộ bài tập (clearAllDeadlines)', () => {
      const stateWithItems = deadlinesSlice.reducer(initialState, generateStressDeadlines(10));
      const clearedState = deadlinesSlice.reducer(stateWithItems, clearAllDeadlines());
      expect(clearedState.items).toHaveLength(0);
    });

    it('xử lý các trạng thái extraReducers (fetchInitialDeadlines)', () => {
      // Pending
      let state = deadlinesSlice.reducer(initialState, {
        type: fetchInitialDeadlines.pending.type,
      });
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();

      // Fulfilled
      const mockPayload: Deadline[] = [
        {
          id: 'test-1',
          subject: 'Toán rời rạc',
          title: 'Bài tập 1',
          dueDate: '2026-11-11',
          priority: 'low',
          isCompleted: false,
          createdAt: '',
        },
      ];
      state = deadlinesSlice.reducer(state, {
        type: fetchInitialDeadlines.fulfilled.type,
        payload: mockPayload,
      });
      expect(state.status).toBe('succeeded');
      expect(state.items).toEqual(mockPayload);

      // Rejected
      state = deadlinesSlice.reducer(state, {
        type: fetchInitialDeadlines.rejected.type,
        payload: 'Lỗi mạng giả lập',
        error: { message: 'Lỗi mạng giả lập' },
      });
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Lỗi mạng giả lập');
    });

    it('thunk fetchInitialDeadlines thực thi và gọi mockDeadlinesApi thành công', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = fetchInitialDeadlines();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('deadlines/fetchInitialDeadlines/fulfilled');
      expect(Array.isArray(result.payload)).toBe(true);
    });

    it('kiểm tra toàn bộ Redux selectors trong deadlinesSlice', () => {
      const mockRootState = {
        deadlines: {
          items: [
            {
              id: '1',
              subject: 'Web nâng cao',
              title: 'Bài thực hành 1',
              dueDate: '2026-11-20',
              priority: 'high' as const,
              isCompleted: false,
              createdAt: '',
            },
            {
              id: '2',
              subject: 'An toàn mạng',
              title: 'Báo cáo bảo mật',
              dueDate: '2026-10-01', // quá hạn
              priority: 'medium' as const,
              isCompleted: false,
              createdAt: '',
            },
            {
              id: '3',
              subject: 'Web nâng cao',
              title: 'Bài tập tuần 2',
              dueDate: '2026-10-01',
              priority: 'low' as const,
              isCompleted: true, // đã hoàn thành
              createdAt: '',
            },
          ],
          status: 'succeeded' as const,
          filter: 'all' as const,
          searchQuery: '',
          error: null,
        },
      };

      const {
        selectAllDeadlines,
        selectDeadlinesStatus,
        selectDeadlinesFilter,
        selectDeadlinesSearch,
        selectDeadlinesError,
        selectFilteredDeadlines,
        selectDeadlinesStats,
      } = require('../../features/deadlines/deadlinesSlice');

      expect(selectAllDeadlines(mockRootState)).toHaveLength(3);
      expect(selectDeadlinesStatus(mockRootState)).toBe('succeeded');
      expect(selectDeadlinesFilter(mockRootState)).toBe('all');
      expect(selectDeadlinesSearch(mockRootState)).toBe('');
      expect(selectDeadlinesError(mockRootState)).toBeNull();

      // Test selectFilteredDeadlines với các điều kiện lọc
      expect(selectFilteredDeadlines(mockRootState)).toHaveLength(3);

      // Lọc theo search title
      const stateWithSearch = {
        deadlines: { ...mockRootState.deadlines, searchQuery: 'bảo mật' },
      };
      expect(selectFilteredDeadlines(stateWithSearch)).toHaveLength(1);

      // Lọc theo search subject
      const stateWithSubjectSearch = {
        deadlines: { ...mockRootState.deadlines, searchQuery: 'Web nâng cao' },
      };
      expect(selectFilteredDeadlines(stateWithSubjectSearch)).toHaveLength(2);

      // Lọc theo filter: completed
      const stateCompleted = {
        deadlines: { ...mockRootState.deadlines, filter: 'completed' },
      };
      expect(selectFilteredDeadlines(stateCompleted)).toHaveLength(1);

      // Lọc theo filter: overdue
      const stateOverdue = {
        deadlines: { ...mockRootState.deadlines, filter: 'overdue' },
      };
      expect(selectFilteredDeadlines(stateOverdue)).toHaveLength(1);

      // Lọc theo filter: pending
      const statePending = {
        deadlines: { ...mockRootState.deadlines, filter: 'pending' },
      };
      expect(selectFilteredDeadlines(statePending)).toHaveLength(1);

      // Test selectDeadlinesStats
      const stats = selectDeadlinesStats(mockRootState);
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.overdue).toBe(1);
      expect(stats.pending).toBe(1);
    });
  });
});
