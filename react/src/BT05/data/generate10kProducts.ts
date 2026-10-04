import type { ProductCategory, ProductItem } from '../types';

const CATEGORIES: Exclude<ProductCategory, 'All'>[] = [
  'Laptop & PC',
  'Smartphone',
  'Audio & Hi-Fi',
  'Tablet & E-Reader',
  'Smartwatch',
  'Gaming Gear',
  'Camera & Lens',
  'Phụ Kiện',
];

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Dell', 'Asus ROG', 'Logitech', 'Canon', 'Xiaomi', 'Anker', 'Lenovo Legion'];

const CATEGORY_ICONS: Record<Exclude<ProductCategory, 'All'>, string> = {
  'Laptop & PC': '💻',
  'Smartphone': '📱',
  'Audio & Hi-Fi': '🎧',
  'Tablet & E-Reader': '📟',
  'Smartwatch': '⌚',
  'Gaming Gear': '🎮',
  'Camera & Lens': '📷',
  'Phụ Kiện': '🔌',
};

const PRODUCT_MODELS: Record<Exclude<ProductCategory, 'All'>, string[]> = {
  'Laptop & PC': ['MacBook Pro M3 Max', 'Dell XPS 16 OLED', 'ThinkPad X1 Carbon Gen 12', 'Asus ROG Zephyrus G16', 'HP Spectre x360', 'MacBook Air M3', 'Alienware m18 R2'],
  'Smartphone': ['iPhone 16 Pro Max', 'Samsung Galaxy S24 Ultra', 'Google Pixel 9 Pro XL', 'Xiaomi 14 Ultra', 'OnePlus 12', 'Sony Xperia 1 VI', 'Asus ROG Phone 8'],
  'Audio & Hi-Fi': ['Sony WH-1000XM5', 'AirPods Max 2', 'Bose QuietComfort Ultra', 'Sennheiser Momentum 4', 'Marshall Stanmore III', 'Audio-Technica ATH-M50x'],
  'Tablet & E-Reader': ['iPad Pro M4 OLED 13"', 'Galaxy Tab S9 Ultra', 'iPad Air 11" M2', 'Kindle Scribe 10.2"', 'Xiaomi Pad 6S Pro', 'Remarkable 2 Paper'],
  'Smartwatch': ['Apple Watch Ultra 2', 'Galaxy Watch 6 Classic', 'Garmin Fenix 7 Pro Sapphire', 'Huawei Watch GT 4', 'Amazfit T-Rex Ultra'],
  'Gaming Gear': ['Bàn phím cơ Custom Keychron Q1 Pro', 'Chuột Logitech G Pro X Superlight 2', 'Màn hình ASUS ROG Swift OLED 360Hz', 'Tay cầm PS5 DualSense Edge'],
  'Camera & Lens': ['Sony A7R V Mirrorless', 'Canon EOS R5 Mark II', 'Fujifilm X-T5 Silver', 'Nikon Z8', 'Lens Sony FE 24-70mm f/2.8 GM II'],
  'Phụ Kiện': ['Củ sạc nhanh Anker GaNPrime 140W', 'Cáp Thunderbolt 4 Pro 2m', 'Hub USB-C 10-in-1 HyperDrive', 'Đế tản nhiệt nhôm gấp gọn Ergonomic'],
};

export function generate10kProducts(): ProductItem[] {
  const products: ProductItem[] = [];
  const now = new Date();

  for (let i = 0; i < 10000; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const brand = BRANDS[(i * 3 + 7) % BRANDS.length];
    const modelList = PRODUCT_MODELS[category];
    const baseModel = modelList[i % modelList.length];
    const sku = `PRD-${(100000 + i).toString()}`;
    const price = Math.floor(((i * 73) % 4500) + 49);
    const stock = (i * 17) % 250;
    const rating = Number((3.5 + ((i % 16) / 10)).toFixed(1));
    const salesCount = ((i * 31) % 1500) + 12;

    let status: ProductItem['status'] = 'In Stock';
    if (stock === 0) {
      status = 'Out of Stock';
    } else if (stock < 20) {
      status = 'Low Stock';
    }

    products[i] = {
      id: i + 1,
      sku,
      name: `${brand} ${baseModel} #${i + 1}`,
      category,
      brand,
      price,
      stock,
      rating: Math.min(5.0, rating),
      salesCount,
      status,
      icon: CATEGORY_ICONS[category],
      updatedAt: new Date(now.getTime() - ((i * 100000) % (30 * 86400000))).toLocaleDateString('vi-VN'),
    };
  }

  return products;
}

// Singleton cached dataset để tránh tạo lại 10.000 phần tử liên tục mỗi re-render
export const GLOBAL_10K_PRODUCTS = generate10kProducts();
