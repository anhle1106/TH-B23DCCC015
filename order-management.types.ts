/**
 * THIẾT KẾ MODULE QUẢN LÝ ĐƠN HÀNG (ORDER MANAGEMENT)
 * 
 * --- Giải thích lựa chọn thiết kế ---
 * 1. BaseEntity<T>: Dùng Generic cho ID để linh hoạt kiểu dữ liệu (string/number), kế thừa chung id và timestamp.
 * 2. OrderItem: Lưu unitPrice độc lập (snapshot price tại thời điểm mua) tránh việc đổi giá Product làm sai đơn cũ.
 * 3. Utility Types (Omit, Partial, Pick): Tái sử dụng type gốc để tạo DTOs (Create, Update, Summary) chuẩn hóa dữ liệu.
 */

// 1. Base Entity & Enums (Tùy biến ID linh hoạt bằng Generic T)
export interface BaseEntity<T = string> {
  readonly id: T; // Hỗ trợ cả ID dạng string (UUID) hoặc number (SQL auto-increment)
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

// 2. Core Entities (Khách hàng, Sản phẩm, Chi tiết đơn, Đơn hàng)
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
  unitPrice: number; // Lưu giá tại thời điểm mua (Snapshot price - giữ đúng lịch sử hóa đơn)
}

export interface Order extends BaseEntity {
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
}

// 3. Utility Types (Tái sử dụng & thiết kế DTOs)
// Omit: Tạo mới khách hàng -> Loại bỏ các trường hệ thống tự tạo (id, createdAt, updatedAt)
export type CreateCustomerInput = Omit<Customer, keyof BaseEntity>;

// Partial + Omit: Cập nhật thông tin sản phẩm -> Cho phép sửa từng trường tùy chọn trừ id
export type UpdateProductInput = Partial<Omit<Product, 'id'>>;

// Pick: Rút gọn dữ liệu chỉ lấy các trường cần thiết để hiển thị bảng danh sách đơn hàng cho nhẹ
export type OrderSummary = Pick<Order, 'id' | 'status' | 'totalAmount' | 'createdAt'>;

// 4. Generic API Wrapper
// Generic T giúp tái sử dụng cấu trúc phản hồi API cho mọi entity
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
