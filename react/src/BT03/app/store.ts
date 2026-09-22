import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';

/**
 * ============================================================================
 * REDUX TOOLKIT STORE - BT03
 * Thư mục chuẩn feature-based: app/store.ts
 * Kết hợp 2 reducer: productsReducer và cartReducer
 * ============================================================================
 */
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
