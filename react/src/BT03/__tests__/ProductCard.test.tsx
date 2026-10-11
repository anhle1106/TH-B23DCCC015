import { screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { renderWithProviders } from './test-utils';
import type { Product } from '../types/cart.types';

describe('ProductCard Component Integration Tests', () => {
  const mockProduct: Product = {
    id: 1,
    name: 'MacBook Pro 16" M3 Max',
    category: 'Laptop',
    price: 3499,
    rating: 4.9,
    stock: 5,
    description: 'Chip M3 Max siêu mạnh mẽ',
    image: '💻',
  };

  test('1. renders product information correctly (name, category, price, stock, rating)', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('MacBook Pro 16" M3 Max')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('$3,499')).toBeInTheDocument();
    expect(screen.getByText('Còn 5 sản phẩm')).toBeInTheDocument();
    expect(screen.getByText('⭐ 4.9')).toBeInTheDocument();
    expect(screen.getByText('Chip M3 Max siêu mạnh mẽ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /thêm vào giỏ hàng/i })).toBeEnabled();
  });

  test('2. dispatches addToCart when clicking add to cart button', () => {
    const { store } = renderWithProviders(<ProductCard product={mockProduct} />);

    const addButton = screen.getByRole('button', { name: /thêm vào giỏ hàng/i });
    fireEvent.click(addButton);

    const cartState = store.getState().cart;
    expect(cartState.items).toHaveLength(1);
    expect(cartState.items[0].product.id).toBe(mockProduct.id);
    expect(cartState.items[0].quantity).toBe(1);
  });

  test('3. renders out-of-stock state when stock is 0', () => {
    const outOfStockProduct: Product = {
      ...mockProduct,
      id: 99,
      stock: 0,
    };

    renderWithProviders(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText('Hết hàng')).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /tạm hết hàng/i });
    expect(btn).toBeDisabled();
  });

  test('4. renders in-cart indicator and allows adding more when below stock', () => {
    renderWithProviders(<ProductCard product={mockProduct} />, {
      preloadedState: {
        cart: {
          items: [{ product: mockProduct, quantity: 2 }],
          isOpen: false,
        },
      },
    });

    expect(screen.getByText('+ Thêm tiếp')).toBeInTheDocument();
    expect(screen.getByText('Đã có 2')).toBeInTheDocument();
  });

  test('5. disables button when item quantity in cart reaches stock limit', () => {
    renderWithProviders(<ProductCard product={mockProduct} />, {
      preloadedState: {
        cart: {
          items: [{ product: mockProduct, quantity: 5 }], // max stock = 5
          isOpen: false,
        },
      },
    });

    const maxButton = screen.getByRole('button', { name: /đã đạt tối đa kho \(5\)/i });
    expect(maxButton).toBeDisabled();
  });
});
