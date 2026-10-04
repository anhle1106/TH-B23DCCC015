import React from 'react';
import type { ProductItem } from '../types';

interface ProductRowProps {
  product: ProductItem;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onQuickUpdateStock: (id: number, delta: number) => void;
  isOptimizedMode: boolean;
}

const BaseProductRow: React.FC<ProductRowProps> = ({
  product,
  isSelected,
  onToggleSelect,
  onQuickUpdateStock,
}) => {
  return (
    <tr className={`product-table-row ${isSelected ? 'row-selected' : ''}`}>
      <td className="col-checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(product.id)}
          aria-label={`Chọn sản phẩm ${product.name}`}
        />
      </td>
      <td className="col-sku">
        <span className="sku-tag">{product.sku}</span>
      </td>
      <td className="col-info">
        <div className="product-title-cell">
          <span className="product-icon">{product.icon}</span>
          <div className="product-text-meta">
            <span className="product-name">{product.name}</span>
            <span className="product-brand">{product.brand}</span>
          </div>
        </div>
      </td>
      <td className="col-category">
        <span className="category-pill">{product.category}</span>
      </td>
      <td className="col-price">${product.price.toLocaleString()}</td>
      <td className="col-stock">
        <div className="stock-control-group">
          <button
            type="button"
            className="btn-stock-adjust"
            onClick={() => onQuickUpdateStock(product.id, -1)}
            disabled={product.stock <= 0}
            title="Giảm tồn kho"
          >
            -
          </button>
          <span className="stock-number">{product.stock}</span>
          <button
            type="button"
            className="btn-stock-adjust"
            onClick={() => onQuickUpdateStock(product.id, 1)}
            title="Tăng tồn kho"
          >
            +
          </button>
        </div>
      </td>
      <td className="col-rating">
        <span className="rating-pill">⭐ {product.rating.toFixed(1)}</span>
      </td>
      <td className="col-status">
        <span
          className={`status-badge ${
            product.status === 'In Stock'
              ? 'status-in'
              : product.status === 'Low Stock'
              ? 'status-low'
              : 'status-out'
          }`}
        >
          {product.status}
        </span>
      </td>
    </tr>
  );
};

// Component được bọc React.memo dùng khi bật chế độ tối ưu (Optimized Mode)
export const MemoizedProductRow = React.memo(
  BaseProductRow,
  (prev, next) =>
    prev.product.id === next.product.id &&
    prev.product.stock === next.product.stock &&
    prev.product.price === next.product.price &&
    prev.isSelected === next.isSelected
);

// Component không bọc memo để đo đạc và minh họa hiện tượng Unnecessary Re-render (Unoptimized Mode)
export const UnmemoizedProductRow = BaseProductRow;
