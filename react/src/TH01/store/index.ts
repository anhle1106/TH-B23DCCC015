import { configureStore } from '@reduxjs/toolkit';
import deadlinesReducer from '../features/deadlines/deadlinesSlice';
import logger from 'redux-logger';

/**
 * ============================================================================
 * PHẦN A: MIDDLEWARE REDUX - REDUX-LOGGER (CHỈ BẬT TRONG DEVELOPMENT)
 * ============================================================================
 */
const isDev =
  (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.NODE_ENV === 'development') ||
  Boolean((import.meta as any)?.env?.DEV);

export const store = configureStore({
  reducer: {
    deadlines: deadlinesReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware();
    // redux-logger chỉ kích hoạt ở môi trường development để ghi lại hoạt động thêm, xoá, hoàn thành
    if (isDev) {
      return middleware.concat(logger);
    }
    return middleware;
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
