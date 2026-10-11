import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  selectCartItems,
  selectIsCartOpen,
  selectCartTotalQuantity,
  selectCartTotalPrice,
  selectItemQuantityInCart,
  type CartState,
} from '../features/cart/cartSlice';
import type { Product } from '../types/cart.types';
import type { RootState } from '../app/store';

describe('cartSlice Unit Tests', () => {
  const initialEmptyState: CartState = {
    items: [],
    isOpen: false,
  };

  const sampleProduct1: Product = {
    id: 1,
    name: 'MacBook Pro 16"',
    category: 'Laptop',
    price: 3499,
    rating: 4.9,
    stock: 3,
    description: 'Chip M3 Max',
    image: '💻',
  };

  const sampleProduct2: Product = {
    id: 2,
    name: 'iPhone 15 Pro',
    category: 'Smartphone',
    price: 1399,
    rating: 4.8,
    stock: 2,
    description: 'Titanium frame',
    image: '📱',
  };

  const outOfStockProduct: Product = {
    id: 99,
    name: 'Hết hàng Phone',
    category: 'Smartphone',
    price: 500,
    rating: 4.0,
    stock: 0,
    description: 'Out of stock item',
    image: '📦',
  };

  describe('Reducer Actions', () => {
    test('1. should return the initial state when passed an empty action', () => {
      expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialEmptyState);
    });

    test('2. should add a new product to empty cart with quantity 1', () => {
      const actual = cartReducer(initialEmptyState, addToCart(sampleProduct1));
      expect(actual.items).toHaveLength(1);
      expect(actual.items[0]).toEqual({
        product: sampleProduct1,
        quantity: 1,
      });
    });

    test('3. should increment quantity when adding an existing product if below stock', () => {
      const stateWithItem: CartState = {
        items: [{ product: sampleProduct1, quantity: 1 }],
        isOpen: false,
      };
      const actual = cartReducer(stateWithItem, addToCart(sampleProduct1));
      expect(actual.items[0].quantity).toBe(2);
    });

    test('4. should not increment quantity beyond product stock limit', () => {
      const stateAtMaxStock: CartState = {
        items: [{ product: sampleProduct1, quantity: 3 }], // stock is 3
        isOpen: false,
      };
      const actual = cartReducer(stateAtMaxStock, addToCart(sampleProduct1));
      expect(actual.items[0].quantity).toBe(3);
    });

    test('5. should not add product if stock is 0', () => {
      const actual = cartReducer(initialEmptyState, addToCart(outOfStockProduct));
      expect(actual.items).toHaveLength(0);
    });

    test('6. should remove product from cart by id', () => {
      const stateWithItems: CartState = {
        items: [
          { product: sampleProduct1, quantity: 1 },
          { product: sampleProduct2, quantity: 2 },
        ],
        isOpen: false,
      };
      const actual = cartReducer(stateWithItems, removeFromCart(sampleProduct1.id));
      expect(actual.items).toHaveLength(1);
      expect(actual.items[0].product.id).toBe(sampleProduct2.id);
    });

    test('7. should update quantity of an existing item', () => {
      const stateWithItem: CartState = {
        items: [{ product: sampleProduct1, quantity: 1 }],
        isOpen: false,
      };
      const actual = cartReducer(
        stateWithItem,
        updateQuantity({ productId: sampleProduct1.id, quantity: 3 })
      );
      expect(actual.items[0].quantity).toBe(3);
    });

    test('8. should remove item if updated quantity is 0 or negative', () => {
      const stateWithItem: CartState = {
        items: [{ product: sampleProduct1, quantity: 2 }],
        isOpen: false,
      };
      const actual = cartReducer(
        stateWithItem,
        updateQuantity({ productId: sampleProduct1.id, quantity: 0 })
      );
      expect(actual.items).toHaveLength(0);
    });

    test('9. should cap quantity to product stock if updated quantity exceeds stock', () => {
      const stateWithItem: CartState = {
        items: [{ product: sampleProduct1, quantity: 1 }], // stock = 3
        isOpen: false,
      };
      const actual = cartReducer(
        stateWithItem,
        updateQuantity({ productId: sampleProduct1.id, quantity: 10 })
      );
      expect(actual.items[0].quantity).toBe(3);
    });

    test('10. should ignore updateQuantity when target product not found in cart', () => {
      const stateWithItem: CartState = {
        items: [{ product: sampleProduct1, quantity: 1 }],
        isOpen: false,
      };
      const actual = cartReducer(
        stateWithItem,
        updateQuantity({ productId: 999, quantity: 5 })
      );
      expect(actual).toEqual(stateWithItem);
    });

    test('11. should clear all items in cart', () => {
      const stateWithItems: CartState = {
        items: [
          { product: sampleProduct1, quantity: 2 },
          { product: sampleProduct2, quantity: 1 },
        ],
        isOpen: true,
      };
      const actual = cartReducer(stateWithItems, clearCart());
      expect(actual.items).toHaveLength(0);
      expect(actual.isOpen).toBe(true);
    });

    test('12. should toggle cart isOpen state', () => {
      const closedState = cartReducer(initialEmptyState, toggleCart());
      expect(closedState.isOpen).toBe(true);

      const openedState = cartReducer(closedState, toggleCart());
      expect(openedState.isOpen).toBe(false);
    });

    test('13. should set cart isOpen explicitly with setCartOpen', () => {
      const actualOpen = cartReducer(initialEmptyState, setCartOpen(true));
      expect(actualOpen.isOpen).toBe(true);

      const actualClose = cartReducer(actualOpen, setCartOpen(false));
      expect(actualClose.isOpen).toBe(false);
    });
  });

  describe('Cart Selectors', () => {
    const mockRootState = {
      cart: {
        items: [
          { product: sampleProduct1, quantity: 2 }, // price: 3499 * 2 = 6998
          { product: sampleProduct2, quantity: 1 }, // price: 1399 * 1 = 1399
        ],
        isOpen: true,
      },
    } as RootState;

    test('14. selectCartItems returns all items in cart', () => {
      expect(selectCartItems(mockRootState)).toEqual(mockRootState.cart.items);
    });

    test('15. selectIsCartOpen returns open status', () => {
      expect(selectIsCartOpen(mockRootState)).toBe(true);
    });

    test('16. selectCartTotalQuantity calculates total items count', () => {
      expect(selectCartTotalQuantity(mockRootState)).toBe(3);
    });

    test('17. selectCartTotalPrice calculates total price accurately', () => {
      expect(selectCartTotalPrice(mockRootState)).toBe(8397);
    });

    test('18. selectItemQuantityInCart returns correct quantity for present and absent items', () => {
      expect(selectItemQuantityInCart(sampleProduct1.id)(mockRootState)).toBe(2);
      expect(selectItemQuantityInCart(999)(mockRootState)).toBe(0);
    });
  });
});
