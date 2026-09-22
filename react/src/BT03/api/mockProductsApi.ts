import type { Product } from '../types/cart.types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'MacBook Pro 16" M3 Max',
    category: 'Laptop',
    price: 3499,
    rating: 4.9,
    stock: 8,
    description: 'Chip M3 Max 16-core CPU, 40-core GPU, 48GB RAM, màn hình Liquid Retina XDR.',
    image: '💻',
  },
  {
    id: 2,
    name: 'iPhone 15 Pro Max 512GB',
    category: 'Smartphone',
    price: 1399,
    rating: 4.8,
    stock: 15,
    description: 'Khung viền Titanium chuẩn hàng không vũ trụ, chip A17 Pro và camera 5x Optical Zoom.',
    image: '📱',
  },
  {
    id: 3,
    name: 'Sony WH-1000XM5 Wireless',
    category: 'Audio',
    price: 399,
    rating: 4.7,
    stock: 20,
    description: 'Tai nghe chống ồn chủ động đỉnh cao, thời lượng pin 30 giờ, âm thanh Hi-Res Audio.',
    image: '🎧',
  },
  {
    id: 4,
    name: 'iPad Pro 13" M4 Ultra-Thin',
    category: 'Tablet',
    price: 1299,
    rating: 4.9,
    stock: 10,
    description: 'Màn hình OLED Ultra Retina Tandem đột phá, thiết kế siêu mỏng nhẹ chỉ 5.1mm.',
    image: '📟',
  },
  {
    id: 5,
    name: 'Apple Watch Ultra 2 Titanium',
    category: 'Smartwatch',
    price: 799,
    rating: 4.8,
    stock: 12,
    description: 'Đồng hồ thể thao chuyên nghiệp, định vị GPS tần số kép, pin 72 giờ ở chế độ tiết kiệm.',
    image: '⌚',
  },
  {
    id: 6,
    name: 'Bàn phím cơ Keychron Q1 Pro',
    category: 'Phụ kiện',
    price: 199,
    rating: 4.6,
    stock: 25,
    description: 'Thân nhôm CNC nguyên khối, kết nối không dây Bluetooth 5.1, mạch xuôi hot-swappable.',
    image: '⌨️',
  },
];

/**
 * API giả lập phục vụ cho createAsyncThunk trong productsSlice
 */
export const mockProductsApi = {
  fetchProducts: async (): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...INITIAL_PRODUCTS]);
      }, 500);
    });
  },
};
