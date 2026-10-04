export type ProductCategory =
  | 'All'
  | 'Laptop & PC'
  | 'Smartphone'
  | 'Audio & Hi-Fi'
  | 'Tablet & E-Reader'
  | 'Smartwatch'
  | 'Gaming Gear'
  | 'Camera & Lens'
  | 'Phụ Kiện';

export interface ProductItem {
  id: number;
  sku: string;
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;
  stock: number;
  rating: number;
  salesCount: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  icon: string;
  updatedAt: string;
}

export type SortField = 'id' | 'price' | 'stock' | 'rating' | 'salesCount';
export type SortOrder = 'asc' | 'desc';

export interface PerformanceMetrics {
  renderTimeMs: number;
  domNodesCount: number;
  fps: number;
  totalItems: number;
  filteredItems: number;
}
