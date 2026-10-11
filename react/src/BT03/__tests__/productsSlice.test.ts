import productsReducer, {
  setSelectedCategory,
  setSearchKeyword,
  fetchProducts,
  selectAllProducts,
  selectProductsStatus,
  selectProductsError,
  selectSelectedCategory,
  selectSearchKeyword,
  selectFilteredProducts,
  type ProductsState,
} from '../features/products/productsSlice';
import { mockProductsApi } from '../api/mockProductsApi';
import type { Product } from '../types/cart.types';
import type { RootState } from '../app/store';

// Mock mockProductsApi module
jest.mock('../api/mockProductsApi', () => ({
  mockProductsApi: {
    fetchProducts: jest.fn(),
  },
}));

describe('productsSlice Unit & Async Thunk Tests', () => {
  const initialProductsState: ProductsState = {
    items: [],
    status: 'idle',
    error: null,
    selectedCategory: 'All',
    searchKeyword: '',
  };

  const sampleProducts: Product[] = [
    {
      id: 1,
      name: 'MacBook Pro 16"',
      category: 'Laptop',
      price: 3499,
      rating: 4.9,
      stock: 8,
      description: 'Chip M3 Max',
      image: '💻',
    },
    {
      id: 2,
      name: 'iPhone 15 Pro Max',
      category: 'Smartphone',
      price: 1399,
      rating: 4.8,
      stock: 15,
      description: 'Khung viền Titanium',
      image: '📱',
    },
    {
      id: 3,
      name: 'Sony WH-1000XM5',
      category: 'Audio',
      price: 399,
      rating: 4.7,
      stock: 20,
      description: 'Tai nghe chống ồn',
      image: '🎧',
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Synchronous Reducers', () => {
    test('1. should return initial state when passed an empty action', () => {
      expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialProductsState);
    });

    test('2. should set selected category', () => {
      const actual = productsReducer(initialProductsState, setSelectedCategory('Laptop'));
      expect(actual.selectedCategory).toBe('Laptop');
    });

    test('3. should set search keyword', () => {
      const actual = productsReducer(initialProductsState, setSearchKeyword('apple'));
      expect(actual.searchKeyword).toBe('apple');
    });
  });

  describe('Async Thunk: fetchProducts with Mocked API', () => {
    test('4. should handle fetchProducts.pending state', () => {
      const action = { type: fetchProducts.pending.type };
      const state = productsReducer(initialProductsState, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    test('5. should fetch products successfully and handle fetchProducts.fulfilled', async () => {
      (mockProductsApi.fetchProducts as jest.Mock).mockResolvedValueOnce(sampleProducts);

      const dispatch = jest.fn();
      const thunk = fetchProducts();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(mockProductsApi.fetchProducts).toHaveBeenCalledTimes(1);
      expect(result.type).toBe('products/fetchProducts/fulfilled');
      expect(result.payload).toEqual(sampleProducts);

      const state = productsReducer(
        initialProductsState,
        fetchProducts.fulfilled(sampleProducts, 'requestId', undefined)
      );
      expect(state.status).toBe('succeeded');
      expect(state.items).toEqual(sampleProducts);
    });

    test('6. should handle fetchProducts.rejected when API throws an Error', async () => {
      const errorMessage = 'Lỗi kết nối máy chủ';
      (mockProductsApi.fetchProducts as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const dispatch = jest.fn();
      const thunk = fetchProducts();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(mockProductsApi.fetchProducts).toHaveBeenCalledTimes(1);
      expect(result.type).toBe('products/fetchProducts/rejected');
      expect(result.payload).toBe(errorMessage);

      const state = productsReducer(
        initialProductsState,
        {
          type: fetchProducts.rejected.type,
          payload: errorMessage,
          error: { message: errorMessage },
        }
      );
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });

    test('7. should handle fetchProducts.rejected with fallback message for non-Error rejection', async () => {
      (mockProductsApi.fetchProducts as jest.Mock).mockRejectedValueOnce('Network down');

      const dispatch = jest.fn();
      const thunk = fetchProducts();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe('products/fetchProducts/rejected');
      expect(result.payload).toBe('Không thể tải danh sách sản phẩm');
    });

    test('8. should fallback error message in reducer when payload is absent', () => {
      const stateWithError = productsReducer(initialProductsState, {
        type: fetchProducts.rejected.type,
        error: { message: 'Network error from action.error' },
      });
      expect(stateWithError.error).toBe('Network error from action.error');

      const stateWithDefault = productsReducer(initialProductsState, {
        type: fetchProducts.rejected.type,
        error: {},
      });
      expect(stateWithDefault.error).toBe('Lỗi khi tải sản phẩm');
    });
  });

  describe('Products Selectors', () => {
    const mockRootState = {
      products: {
        items: sampleProducts,
        status: 'succeeded' as const,
        error: null,
        selectedCategory: 'All',
        searchKeyword: '',
      },
    } as RootState;

    test('8. basic selectors retrieve correct slice states', () => {
      expect(selectAllProducts(mockRootState)).toEqual(sampleProducts);
      expect(selectProductsStatus(mockRootState)).toBe('succeeded');
      expect(selectProductsError(mockRootState)).toBeNull();
      expect(selectSelectedCategory(mockRootState)).toBe('All');
      expect(selectSearchKeyword(mockRootState)).toBe('');
    });

    test('9. selectFilteredProducts filters by category', () => {
      const stateWithCategory = {
        products: {
          ...mockRootState.products,
          selectedCategory: 'Laptop',
        },
      } as RootState;

      const filtered = selectFilteredProducts(stateWithCategory);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe('Laptop');
    });

    test('10. selectFilteredProducts filters by search keyword (case-insensitive in name/description)', () => {
      const stateWithKeyword = {
        products: {
          ...mockRootState.products,
          searchKeyword: 'TITANIUM',
        },
      } as RootState;

      const filtered = selectFilteredProducts(stateWithKeyword);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe(2);
    });

    test('11. selectFilteredProducts returns empty array when no products match filter', () => {
      const stateWithNoMatch = {
        products: {
          ...mockRootState.products,
          selectedCategory: 'Laptop',
          searchKeyword: 'NonExistent',
        },
      } as RootState;

      const filtered = selectFilteredProducts(stateWithNoMatch);
      expect(filtered).toHaveLength(0);
    });
  });
});
