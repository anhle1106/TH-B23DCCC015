// 1. Base Entity & Enums (Dùng Generic T cho ID)
export interface BaseEntity<T = string> {
  readonly id: T; // Linh hoạt giữa string (UUID) hoặc number
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// 2. Core Entities
export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product extends BaseEntity {
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number; // Lưu giá tại thời điểm mua (tránh đổi giá Product làm sai lệch lịch sử đơn)
}

export interface Order extends BaseEntity {
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
}

// 3. Utility Types (Tái sử dụng type)
// Omit: Tạo mới khách hàng (hệ thống tự sinh id và timestamp)
export type CreateCustomerInput = Omit<Customer, keyof BaseEntity>;

// Partial + Omit: Cập nhật sản phẩm (cho phép sửa từng trường trừ id)
export type UpdateProductInput = Partial<Omit<Product, 'id'>>;

// Pick: Rút gọn dữ liệu để hiển thị bảng danh sách đơn hàng
export type OrderSummary = Pick<Order, 'id' | 'status' | 'totalAmount' | 'createdAt'>;

// 4. Generic API Wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
