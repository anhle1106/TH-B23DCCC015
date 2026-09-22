import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/cart.types';
import { mockProductsApi } from '../../api/mockProductsApi';
import type { RootState } from '../../app/store';

export interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedCategory: string;
  searchKeyword: string;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  selectedCategory: 'All',
  searchKeyword: '',
};

/**
 * Yêu cầu: productsSlice dùng createAsyncThunk lấy danh sách sản phẩm từ API giả lập
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await mockProductsApi.fetchProducts();
      return data;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Không thể tải danh sách sản phẩm'
      );
    }
  }
);

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchKeyword = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Lỗi khi tải sản phẩm';
      });
  },
});

export const { setSelectedCategory, setSearchKeyword } = productsSlice.actions;

// Selectors
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectSelectedCategory = (state: RootState) => state.products.selectedCategory;
export const selectSearchKeyword = (state: RootState) => state.products.searchKeyword;

export const selectFilteredProducts = (state: RootState): Product[] => {
  const { items, selectedCategory, searchKeyword } = state.products;
  const keyword = searchKeyword.trim().toLowerCase();

  return items.filter((product) => {
    const matchCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchKeyword =
      keyword === '' ||
      product.name.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword);

    return matchCategory && matchKeyword;
  });
};

export default productsSlice.reducer;
