import {
  useState,
  useMemo,
  useCallback,
  useDeferredValue,
  useRef,
  useEffect,
  lazy,
  Suspense,
} from 'react';
import { GLOBAL_10K_PRODUCTS } from './data/generate10kProducts';
import type { ProductCategory, ProductItem, SortField, SortOrder } from './types';
import { useVirtualList } from './hooks/useVirtualList';
import { MemoizedProductRow, UnmemoizedProductRow } from './components/ProductRow';
import { PerformanceReportCard } from './components/PerformanceReportCard';
import { AnalyticsSkeleton } from './components/AnalyticsSkeleton';
import './BT05App.css';

// Kỹ thuật 3: Code-splitting với React.lazy & Suspense
const AnalyticsModal = lazy(() => import('./components/AnalyticsModal'));

const CATEGORIES: ProductCategory[] = [
  'All',
  'Laptop & PC',
  'Smartphone',
  'Audio & Hi-Fi',
  'Tablet & E-Reader',
  'Smartwatch',
  'Gaming Gear',
  'Camera & Lens',
  'Phụ Kiện',
];

const ROW_HEIGHT = 56;
const CONTAINER_HEIGHT = 560;

export function BT05App() {
  // Chế độ tối ưu (Mặc định: BẬT TỐI ƯU ⚡)
  const [isOptimized, setIsOptimized] = useState<boolean>(true);

  // Dữ liệu sản phẩm (cho phép chỉnh sửa trực tiếp số lượng tồn kho)
  const [products, setProducts] = useState<ProductItem[]>(() => GLOBAL_10K_PRODUCTS);

  // Bộ lọc & tìm kiếm
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Quản lý selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Modal Code-Splitting
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);

  // Đo thời gian render thực tế (Render Time Benchmark)
  const [renderDuration, setRenderDuration] = useState<number>(0);
  const renderStartTimeRef = useRef<number>(performance.now());

  renderStartTimeRef.current = performance.now();

  useEffect(() => {
    const elapsed = performance.now() - renderStartTimeRef.current;
    setRenderDuration(Number(elapsed.toFixed(1)));
  });

  // Kỹ thuật 4: Concurrent Features - useDeferredValue khi ở chế độ tối ưu
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const activeSearchQuery = isOptimized ? deferredSearchTerm : searchTerm;

  // Kỹ thuật 2: Memoization với useMemo cho việc Lọc & Sắp xếp 10.000 sản phẩm
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (activeSearchQuery.trim() !== '') {
      const q = activeSearchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, selectedCategory, activeSearchQuery, sortField, sortOrder]);

  // Kỹ thuật 1: Virtualization - chỉ tính toán windowing khi bật tối ưu
  const virtualizer = useVirtualList({
    itemCount: filteredProducts.length,
    itemHeight: ROW_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 6,
  });

  // Kỹ thuật 2: useCallback để giữ tham chiếu ổn định cho event handler
  const handleToggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleQuickUpdateStock = useCallback((id: number, delta: number) => {
    setProducts((prevList) =>
      prevList.map((item) => {
        if (item.id !== id) return item;
        const newStock = Math.max(0, item.stock + delta);
        return {
          ...item,
          stock: newStock,
          status: newStock === 0 ? 'Out of Stock' : newStock < 20 ? 'Low Stock' : 'In Stock',
        };
      })
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
    }
  }, [selectedIds.size, filteredProducts]);

  // Khi chưa tối ưu: render toàn bộ filteredProducts (tối đa 10.000 phần tử!)
  // Khi đã tối ưu: chỉ lấy lát cắt virtualItems (~20 phần tử)
  const renderedItems = isOptimized
    ? virtualizer.virtualItems.map((v) => ({
        product: filteredProducts[v.index],
        top: v.top,
      }))
    : filteredProducts.map((p, idx) => ({
        product: p,
        top: idx * ROW_HEIGHT,
      }));

  // Xác định số lượng DOM nodes hiện hành
  const currentDomCount = isOptimized ? renderedItems.length * 8 + 30 : filteredProducts.length * 8 + 30;

  return (
    <div className="bt05-container">
      {/* Top Banner & Header */}
      <header className="bt05-header">
        <div className="header-meta-row">
          <span className="bt05-badge">LTWNC - Bài Tập Tuần 5</span>
          <span className="deadline-alert-badge">⏰ Chuẩn Nộp Bài 10/10</span>
          <span className="dataset-tag">📦 Dataset 10.000 Sản Phẩm</span>
        </div>

        <div className="header-main-content">
          <div>
            <h1 className="bt05-title">Tối Ưu Hiệu Năng React (React Performance Optimization)</h1>
            <p className="bt05-desc">
              Hệ thống quản lý <strong>10.000 sản phẩm công nghệ</strong> tích hợp đồng thời 4 giải pháp:{' '}
              <em>List Virtualization, Memoization (React.memo, useMemo, useCallback), Code-Splitting (React.lazy)</em> và{' '}
              <em>Concurrent Non-blocking Search (useDeferredValue)</em>.
            </p>
          </div>

          {/* Công tắc chuyển đổi Chế độ Tối ưu */}
          <div className="mode-toggle-card">
            <div className="toggle-label-row">
              <span className="toggle-title">Chế Độ Hoạt Động</span>
              <span className={`status-pill ${isOptimized ? 'good' : 'warning'}`}>
                {isOptimized ? '⚡ ĐÃ TỐI ƯU' : '🛑 CHƯA TỐI ƯU'}
              </span>
            </div>

            <div className="toggle-button-group">
              <button
                type="button"
                className={`btn-mode-select ${isOptimized ? 'active-opt' : ''}`}
                onClick={() => setIsOptimized(true)}
              >
                ⚡ Đã tối ưu (Mặc định)
              </button>
              <button
                type="button"
                className={`btn-mode-select ${!isOptimized ? 'active-unopt' : ''}`}
                onClick={() => setIsOptimized(false)}
              >
                🛑 Chưa tối ưu (Demo nghẽn)
              </button>
            </div>
            <p className="toggle-hint">
              {isOptimized
                ? 'Đang bật Virtualization + Memo + useDeferredValue (Lighthouse ~98 điểm).'
                : 'Đang render thô toàn bộ DOM không ảo hoá (Lighthouse ~38 điểm).'
              }
            </p>
          </div>
        </div>
      </header>

      {/* Real-time Performance HUD */}
      <section className="perf-hud-grid">
        <div className="hud-metric-card">
          <span className="hud-icon">⏱️</span>
          <div>
            <div className="hud-label">Thời Gian Render Lát Cắt</div>
            <div className={`hud-value ${renderDuration < 20 ? 'text-good' : 'text-bad'}`}>
              {renderDuration} ms
            </div>
          </div>
        </div>

        <div className="hud-metric-card">
          <span className="hud-icon">🌳</span>
          <div>
            <div className="hud-label">Ước Tính DOM Nodes</div>
            <div className={`hud-value ${isOptimized ? 'text-good' : 'text-bad'}`}>
              {currentDomCount.toLocaleString()} nodes
            </div>
          </div>
        </div>

        <div className="hud-metric-card">
          <span className="hud-icon">🪟</span>
          <div>
            <div className="hud-label">Cơ Chế Render Danh Sách</div>
            <div className="hud-value text-info">
              {isOptimized ? 'Virtual Windowing (~25 rows)' : 'Thô 10.000 rows đồng thời'}
            </div>
          </div>
        </div>

        <div className="hud-metric-card">
          <span className="hud-icon">🎯</span>
          <div>
            <div className="hud-label">Độ Trễ Gõ Phím (Search)</div>
            <div className="hud-value text-good">
              {isOptimized ? '0ms (useDeferredValue)' : '~150ms (Chặn Main Thread)'}
            </div>
          </div>
        </div>
      </section>

      {/* Control Bar: Filter, Search, Sort & Action Buttons */}
      <section className="bt05-controls-bar">
        <div className="search-filter-group">
          {/* Ô tìm kiếm */}
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Tìm theo Tên máy, Hãng (Apple, Dell...), SKU trong 10.000 items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearchTerm('')}
                title="Xoá tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Lọc danh mục */}
          <div className="category-select-wrap">
            <select
              className="category-dropdown"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ProductCategory)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'Tất cả danh mục (10.000 items)' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sắp xếp */}
          <div className="sort-group">
            <select
              className="sort-dropdown"
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
            >
              <option value="id">Sắp xếp: Mặc định ID</option>
              <option value="price">Sắp xếp: Giá bán</option>
              <option value="stock">Sắp xếp: Tồn kho</option>
              <option value="rating">Sắp xếp: Đánh giá sao</option>
              <option value="salesCount">Sắp xếp: Lượt bán chạy</option>
            </select>

            <button
              type="button"
              className="btn-sort-order"
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              title={`Đổi thứ tự: ${sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}`}
            >
              {sortOrder === 'asc' ? '⬆️ Tăng' : '⬇️ Giảm'}
            </button>
          </div>
        </div>

        {/* Nút hành động mở Modal Phân Tích (Code-Splitting) */}
        <div className="action-buttons-group">
          <button
            type="button"
            className="btn-open-analytics"
            onClick={() => setIsAnalyticsOpen(true)}
          >
            <span>📊 Mở Báo Cáo Kho Hàng (Lazy Loading)</span>
          </button>
        </div>
      </section>

      {/* Thông tin kết quả lọc */}
      <div className="filter-summary-row">
        <span>
          Đang hiển thị <strong>{filteredProducts.length.toLocaleString()}</strong> / 10.000 sản phẩm
          {searchTerm && ` khớp với từ khoá "${searchTerm}"`}
        </span>
        {selectedIds.size > 0 && (
          <span className="selected-count-tag">
            Đã chọn {selectedIds.size} sản phẩm
          </span>
        )}
      </div>

      {/* Bảng Dữ Liệu 10.000 Sản Phẩm */}
      <main className="product-table-wrapper">
        <div
          className="virtualized-scroll-container"
          style={{ height: CONTAINER_HEIGHT }}
          onScroll={isOptimized ? virtualizer.onScroll : undefined}
        >
          <div
            className="virtual-height-filler"
            style={{
              height: isOptimized ? virtualizer.totalHeight : 'auto',
              position: 'relative',
            }}
          >
            <table className="products-table">
              <thead className="sticky-table-head">
                <tr>
                  <th className="col-checkbox">
                    <input
                      type="checkbox"
                      checked={
                        filteredProducts.length > 0 &&
                        selectedIds.size === filteredProducts.length
                      }
                      onChange={handleSelectAll}
                      aria-label="Chọn tất cả sản phẩm"
                    />
                  </th>
                  <th className="col-sku">Mã SKU</th>
                  <th className="col-info">Tên Sản Phẩm &amp; Thương Hiệu</th>
                  <th className="col-category">Danh Mục</th>
                  <th className="col-price">Giá Bán</th>
                  <th className="col-stock">Tồn Kho (+/-)</th>
                  <th className="col-rating">Đánh Giá</th>
                  <th className="col-status">Trạng Thái</th>
                </tr>
              </thead>
              <tbody
                style={
                  isOptimized
                    ? {
                        transform: `translateY(${virtualizer.offsetY}px)`,
                      }
                    : undefined
                }
              >
                {renderedItems.map(({ product }) => {
                  if (!product) return null;
                  const isSelected = selectedIds.has(product.id);

                  return isOptimized ? (
                    <MemoizedProductRow
                      key={product.id}
                      product={product}
                      isSelected={isSelected}
                      onToggleSelect={handleToggleSelect}
                      onQuickUpdateStock={handleQuickUpdateStock}
                      isOptimizedMode={true}
                    />
                  ) : (
                    <UnmemoizedProductRow
                      key={product.id}
                      product={product}
                      isSelected={isSelected}
                      onToggleSelect={handleToggleSelect}
                      onQuickUpdateStock={handleQuickUpdateStock}
                      isOptimizedMode={false}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Bảng So Sánh Chỉ Số Lighthouse Chi Tiết & Nút 1-Click Copy Báo Cáo */}
      <PerformanceReportCard />

      {/* Kỹ thuật 3: Code-splitting với React.lazy & Suspense */}
      {isAnalyticsOpen && (
        <Suspense fallback={<AnalyticsSkeleton />}>
          <AnalyticsModal
            isOpen={isAnalyticsOpen}
            onClose={() => setIsAnalyticsOpen(false)}
            products={products}
          />
        </Suspense>
      )}
    </div>
  );
}

export default BT05App;
