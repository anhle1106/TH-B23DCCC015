import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product, UpdateQuantityPayload } from '../../types/cart.types';
import type { RootState } from '../../app/store';

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Yêu cầu: Thêm sản phẩm vào giỏ hàng
     */
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.product.id === product.id);

      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity += 1;
        }
      } else {
        if (product.stock > 0) {
          state.items.push({ product, quantity: 1 });
        }
      }
    },

    /**
     * Yêu cầu: Xoá sản phẩm khỏi giỏ hàng
     */
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
    },

    /**
     * Yêu cầu: Cập nhật số lượng sản phẩm trong giỏ
     */
    updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
      const { productId, quantity } = action.payload;
      const targetItem = state.items.find((item) => item.product.id === productId);

      if (!targetItem) return;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== productId);
      } else {
        targetItem.quantity = Math.min(quantity, targetItem.product.stock);
      }
    },

    /**
     * Xoá toàn bộ giỏ hàng
     */
    clearCart: (state) => {
      state.items = [];
    },

    /**
     * Đóng / mở giao diện giỏ hàng
     */
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen;

export const selectCartTotalQuantity = (state: RootState): number => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};

export const selectCartTotalPrice = (state: RootState): number => {
  return state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

export const selectItemQuantityInCart = (productId: number) => (state: RootState): number => {
  const item = state.cart.items.find((i) => i.product.id === productId);
  return item ? item.quantity : 0;
};

export default cartSlice.reducer;
