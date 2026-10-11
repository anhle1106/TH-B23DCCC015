import { screen, fireEvent, act } from '@testing-library/react';
import { CartDrawer } from '../components/CartDrawer/CartDrawer';
import { renderWithProviders } from './test-utils';
import type { Product } from '../types/cart.types';

describe('CartDrawer Component Integration Tests', () => {
  const sampleProduct1: Product = {
    id: 1,
    name: 'MacBook Pro 16" M3 Max',
    category: 'Laptop',
    price: 3499,
    rating: 4.9,
    stock: 3,
    description: 'Chip M3 Max',
    image: '💻',
  };

  const sampleProduct2: Product = {
    id: 2,
    name: 'iPhone 15 Pro Max',
    category: 'Smartphone',
    price: 1399,
    rating: 4.8,
    stock: 10,
    description: 'Titanium',
    image: '📱',
  };

  test('1. does not render anything when cart isOpen is false', () => {
    const { container } = renderWithProviders(<CartDrawer />, {
      preloadedState: {
        cart: {
          items: [],
          isOpen: false,
        },
      },
    });

    expect(container).toBeEmptyDOMElement();
  });

  test('2. renders empty cart state when cart is open without items', () => {
    renderWithProviders(<CartDrawer />, {
      preloadedState: {
        cart: {
          items: [],
          isOpen: true,
        },
      },
    });

    expect(screen.getByText('Giỏ Hàng Của Bạn')).toBeInTheDocument();
    expect(screen.getByText('Giỏ hàng đang trống')).toBeInTheDocument();
    expect(screen.getByText('0 sản phẩm trong giỏ')).toBeInTheDocument();
  });

  test('3. renders cart items and totals summary when cart is open with items', () => {
    renderWithProviders(<CartDrawer />, {
      preloadedState: {
        cart: {
          items: [
            { product: sampleProduct1, quantity: 2 }, // 3499 * 2 = 6998
            { product: sampleProduct2, quantity: 1 }, // 1399 * 1 = 1399 -> total: 8397
          ],
          isOpen: true,
        },
      },
    });

    expect(screen.getByText('3 sản phẩm trong giỏ')).toBeInTheDocument();
    expect(screen.getByText('MacBook Pro 16" M3 Max')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument();
    expect(screen.getByText('$6,998')).toBeInTheDocument();
    expect(screen.getAllByText('$1,399').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('MIỄN PHÍ')).toBeInTheDocument();
    expect(screen.getByText('Thanh toán ngay ($8,397)')).toBeInTheDocument();
  });

  test('4. increments item quantity when clicking "+" button', () => {
    const { store } = renderWithProviders(<CartDrawer />, {
      preloadedState: {
        cart: {
          items: [{ product: sampleProduct1, quantity: 1 }],
          isOpen: true,
        },
      },
    });

    const plusBtn = screen.getByTitle('Tăng số lượng');
    fireEvent.click(plusBtn);

    expect(store.getState().cart.items[0].quantity).toBe(2);
  });

  test('5. disables "+" button when item quantity in cart equals stock limit', () => {
    renderWithProviders(<CartDrawer />, {
      preloadedState: {
        cart: {
          items: [{ product: sampleProduct1, quantity: 3 }], // max stock = 3
          isOpen: true,
        },
      },
    });

    const plusBtn = screen.getByTitle('Đã đạt giới hạn tồn kho');
    expect(plusBtn).toBeDisabled();
  });

  test('6. decrements item quantity when clicking "-" button', () => {
    const { store } = renderWithProviders(<CartDrawer />, {
      preloadedState: {
        cart: {
          items: [{ product: sampleProduct1, quantity: 2 }],
          isOpen: true,
        },
      },
    });

    const minusBtn = screen.getByTitle('Giảm số lượng');
    fireEvent.click(minusBtn);

    expect(store.getState().cart.items[0].quantity).toBe(1);
  });

  test('7. removes item from cart when clicking remove button', () => {
    const { store } = renderWithProviders(<CartDrawer />, {
      preloadedState: {
        cart: {
          items: [{ product: sampleProduct1, quantity: 1 }],
          isOpen: true,
        },
      },
    });

    const removeBtn = screen.getByTitle('Xoá sản phẩm này');
    fireEvent.click(removeBtn);

    expect(store.getState().cart.items).toHaveLength(0);
  });

  test('8. clears entire cart when clicking "Xoá giỏ hàng" button', () => {
    const { store } = renderWithProviders(<CartDrawer />, {
      preloadedState: {
        cart: {
          items: [
            { product: sampleProduct1, quantity: 1 },
            { product: sampleProduct2, quantity: 2 },
          ],
          isOpen: true,
        },
      },
    });

    const clearBtn = screen.getByText('Xoá giỏ hàng');
    fireEvent.click(clearBtn);

    expect(store.getState().cart.items).toHaveLength(0);
  });

  test('9. closes cart when clicking close button "✕"', () => {
    const { store } = renderWithProviders(<CartDrawer />, {
      preloadedState: {
        cart: {
          items: [],
          isOpen: true,
        },
      },
    });

    const closeBtn = screen.getByRole('button', { name: /đóng giỏ hàng/i });
    fireEvent.click(closeBtn);

    expect(store.getState().cart.isOpen).toBe(false);
  });

  test('10. handles checkout flow and clears cart after successful checkout', () => {
    jest.useFakeTimers();

    const { store } = renderWithProviders(<CartDrawer />, {
      preloadedState: {
        cart: {
          items: [{ product: sampleProduct1, quantity: 1 }],
          isOpen: true,
        },
      },
    });

    const checkoutBtn = screen.getByRole('button', { name: /thanh toán ngay/i });
    fireEvent.click(checkoutBtn);

    // Shows success message
    expect(screen.getByText('Đặt Hàng Thành Công!')).toBeInTheDocument();

    // Fast-forward 2000ms timer
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(store.getState().cart.items).toHaveLength(0);
    expect(store.getState().cart.isOpen).toBe(false);

    jest.useRealTimers();
  });

  test('11. closes cart when clicking overlay backdrop and prevents bubbling on modal body', () => {
    const { store } = renderWithProviders(<CartDrawer />, {
      preloadedState: {
        cart: {
          items: [],
          isOpen: true,
        },
      },
    });

    const modalDialog = screen.getByRole('dialog');
    fireEvent.click(modalDialog);
    // Dialog click stopped propagation -> cart still open
    expect(store.getState().cart.isOpen).toBe(true);

    const overlay = modalDialog.parentElement!;
    fireEvent.click(overlay);
    // Overlay backdrop clicked -> cart closed
    expect(store.getState().cart.isOpen).toBe(false);
  });
});
