import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  fetchProducts,
  selectFilteredProducts,
  selectProductsStatus,
  selectSelectedCategory,
  selectSearchKeyword,
  setSelectedCategory,
  setSearchKeyword,
} from './features/products/productsSlice';
import {
  selectCartTotalQuantity,
  selectCartTotalPrice,
  setCartOpen,
} from './features/cart/cartSlice';
import { ProductCard } from './components/ProductCard/ProductCard';
import { CartDrawer } from './components/CartDrawer/CartDrawer';
import { SubmissionNote } from './components/SubmissionNote/SubmissionNote';
import './BT03App.css';

const CATEGORIES = ['All', 'Laptop', 'Smartphone', 'Audio', 'Tablet', 'Smartwatch', 'Phụ kiện'];

function TechStoreDashboard() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectFilteredProducts);
  const status = useAppSelector(selectProductsStatus);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const searchKeyword = useAppSelector(selectSearchKeyword);
  const totalCartQty = useAppSelector(selectCartTotalQuantity);
  const totalCartPrice = useAppSelector(selectCartTotalPrice);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="bt03-wrapper">
      {/* Header chính */}
      <header className="bt03-header">
        <div className="header-info">
          <div className="header-badge-row">
            <span className="bt03-badge">LTWNC - Bài Tập Tuần 3</span>
            <span className="tech-tag">Redux Toolkit Feature-Based (cartSlice + productsSlice)</span>
          </div>
          <h1 className="bt03-title">TechStore &amp; Module Giỏ Hàng</h1>
          <p className="bt03-subtitle">
            Hệ thống giỏ hàng hoàn chỉnh với Redux Toolkit, <code>createAsyncThunk</code> và Typed Hooks.
          </p>
        </div>

        {/* Nút giỏ hàng nổi bật */}
        <div className="header-actions">
          <button
            type="button"
            className="btn-header-cart"
            onClick={() => dispatch(setCartOpen(true))}
            aria-label="Xem giỏ hàng"
          >
            <span className="cart-icon-symbol">🛒</span>
            <div className="cart-btn-info">
              <span className="cart-btn-label">Giỏ hàng</span>
              <span className="cart-btn-amount">${totalCartPrice.toLocaleString()}</span>
            </div>
            {totalCartQty > 0 && <span className="cart-badge-bounce">{totalCartQty}</span>}
          </button>
        </div>
      </header>

      {/* Thanh lọc danh mục & Tìm kiếm */}
      <div className="bt03-filter-bar">
        <div className="category-pills" role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => dispatch(setSelectedCategory(cat))}
            >
              {cat === 'All' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>

        <div className="search-input-box">
          <svg viewBox="0 0 20 20" fill="currentColor" className="search-svg">
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            className="search-field"
            placeholder="Tìm theo tên sản phẩm..."
            value={searchKeyword}
            onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
          />
          {searchKeyword && (
            <button
              type="button"
              className="btn-clear-query"
              onClick={() => dispatch(setSearchKeyword(''))}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Product List Showcase */}
      <main className="bt03-main">
        {status === 'loading' ? (
          <div className="products-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="product-skeleton-card">
                <div className="skeleton-box skeleton-top" />
                <div className="skeleton-box skeleton-img" />
                <div className="skeleton-box skeleton-text" />
                <div className="skeleton-box skeleton-btn" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-search-state">
            <span className="empty-search-icon">🔍</span>
            <h3>Không tìm thấy sản phẩm nào</h3>
            <p>Không có sản phẩm nào khớp với từ khoá hoặc danh mục đã chọn.</p>
            <button
              type="button"
              className="btn-reset-filters"
              onClick={() => {
                dispatch(setSelectedCategory('All'));
                dispatch(setSearchKeyword(''));
              }}
            >
              Xem lại tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Bảng báo cáo kỹ thuật nộp bài */}
      <SubmissionNote />

      {/* Drawer Giỏ Hàng trượt */}
      <CartDrawer />
    </div>
  );
}

export function BT03App() {
  return (
    <Provider store={store}>
      <TechStoreDashboard />
    </Provider>
  );
}

export default BT03App;
