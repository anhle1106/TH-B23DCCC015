import { useState } from 'react';
import { usePagination } from '../../hooks/usePagination';
import type { Product } from '../../types/product';
import './ProductList.css';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);

  const {
    currentPage,
    totalPages,
    currentData,
    totalItems,
    startIndex,
    endIndex,
    canNext,
    canPrev,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination<Product>(products, itemsPerPage, 1);

  return (
    <div className="product-list-container">
      {/* Header điều khiển và thông tin phân trang */}
      <div className="product-list-header">
        <div>
          <h2 className="section-title">Danh sách Sản phẩm</h2>
          <p className="pagination-info">
            Hiển thị <strong>{totalItems > 0 ? startIndex + 1 : 0}</strong> - <strong>{endIndex}</strong> trong tổng số <strong>{totalItems}</strong> sản phẩm
          </p>
        </div>

        <div className="items-per-page-selector">
          <label htmlFor="itemsPerPage">Hiển thị / trang:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={3}>3 sản phẩm</option>
            <option value={4}>4 sản phẩm</option>
            <option value={6}>6 sản phẩm</option>
            <option value={8}>8 sản phẩm</option>
          </select>
        </div>
      </div>

      {/* Grid danh sách sản phẩm */}
      <div className="product-grid">
        {currentData.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <span className="product-icon">{product.image}</span>
              <span className="product-category">{product.category}</span>
            </div>
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-desc">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">${product.price.toLocaleString()}</span>
                <span className="product-rating">⭐ {product.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thanh chuyển trang (Pagination Controls) */}
      <div className="pagination-controls">
        <button
          type="button"
          className="btn-page btn-nav"
          onClick={prevPage}
          disabled={!canPrev}
          aria-label="Trang trước"
        >
          &larr; Trước
        </button>

        <div className="page-numbers">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                className={`btn-page btn-number ${isActive ? 'active' : ''}`}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="btn-page btn-nav"
          onClick={nextPage}
          disabled={!canNext}
          aria-label="Trang sau"
        >
          Sau &rarr;
        </button>
      </div>
    </div>
  );
}
