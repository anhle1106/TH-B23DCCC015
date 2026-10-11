import { mockProductsApi } from '../api/mockProductsApi';

describe('mockProductsApi Unit Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return list of initial products after simulated network delay', async () => {
    const promise = mockProductsApi.fetchProducts();

    // Fast-forward simulated delay of 500ms
    jest.advanceTimersByTime(500);

    const products = await promise;
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('price');
    expect(products[0]).toHaveProperty('stock');
  });
});
