import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../../TH02/types/product';

/**
 * ============================================================================
 * LTWNC - BÀI TẬP TUẦN 4 - ZUSTAND STORE
 * Quản lý trạng thái "Sản phẩm yêu thích" (favoritesStore)
 * ============================================================================
 */

export interface FavoritesState {
  favorites: Product[];
  // Actions
  toggleFavorite: (product: Product) => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  clearFavorites: () => void;
  isFavorite: (productId: number) => boolean;
  getTotalFavorites: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      /**
       * Thêm hoặc bỏ 1 sản phẩm khỏi danh sách yêu thích
       */
      toggleFavorite: (product: Product) => {
        const { favorites } = get();
        const exists = favorites.some((item) => item.id === product.id);

        if (exists) {
          set({
            favorites: favorites.filter((item) => item.id !== product.id),
          });
        } else {
          set({
            favorites: [...favorites, product],
          });
        }
      },

      /**
       * Thêm sản phẩm vào danh sách yêu thích
       */
      addFavorite: (product: Product) => {
        const { favorites } = get();
        if (!favorites.some((item) => item.id === product.id)) {
          set({ favorites: [...favorites, product] });
        }
      },

      /**
       * Bỏ sản phẩm khỏi danh sách yêu thích
       */
      removeFavorite: (productId: number) => {
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== productId),
        }));
      },

      /**
       * Xoá toàn bộ danh sách yêu thích
       */
      clearFavorites: () => {
        set({ favorites: [] });
      },

      /**
       * Kiểm tra xem sản phẩm có trong danh sách yêu thích không
       */
      isFavorite: (productId: number) => {
        return get().favorites.some((item) => item.id === productId);
      },

      /**
       * Đếm tổng số sản phẩm yêu thích
       */
      getTotalFavorites: () => {
        return get().favorites.length;
      },
    }),
    {
      name: 'ltwnc-favorites-storage', // Lưu vào localStorage để duy trì trạng thái khi F5
    }
  )
);
