import React, { useMemo } from 'react';
import type { ProductItem } from '../types';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  const stats = useMemo(() => {
    let totalStock = 0;
    let totalValuation = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    const categoryCounts: Record<string, number> = {};
    const categoryValues: Record<string, number> = {};

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      totalStock += p.stock;
      totalValuation += p.price * p.stock;
      if (p.status === 'Low Stock') lowStockCount++;
      if (p.status === 'Out of Stock') outOfStockCount++;

      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      categoryValues[p.category] = (categoryValues[p.category] || 0) + p.price * p.stock;
    }

    const avgPrice = products.length > 0 ? Math.round(totalValuation / totalStock || 0) : 0;

    return {
      totalStock,
      totalValuation,
      lowStockCount,
      outOfStockCount,
      avgPrice,
      categoryCounts,
      categoryValues,
    };
  }, [products]);

  if (!isOpen) return null;

  return (
    <div className="analytics-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="analytics-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">📊</span>
            <div>
              <h2>Báo Cáo Phân Tích Kho Hàng (10.000 Sản Phẩm)</h2>
              <p className="modal-subtitle">Module nạp lười (Code-Splitting via React.lazy & Suspense)</p>
            </div>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose} aria-label="Đóng modal">
            ✕
          </button>
        </div>

        <div className="modal-kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Tổng Định Giá Kho Hàng</span>
            <span className="kpi-value text-blue">${stats.totalValuation.toLocaleString()}</span>
            <span className="kpi-sub">10.000 mặt hàng tổng thể</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Tổng Số Lượng Tồn Kho</span>
            <span className="kpi-value text-green">{stats.totalStock.toLocaleString()} chiếc</span>
            <span className="kpi-sub">Giá trung bình: ${stats.avgPrice}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Cảnh Báo Hết / Sắp Hết Hàng</span>
            <span className="kpi-value text-amber">
              {stats.lowStockCount + stats.outOfStockCount} items
            </span>
            <span className="kpi-sub">{stats.outOfStockCount} hết hàng, {stats.lowStockCount} sắp hết</span>
          </div>
        </div>

        <div className="analytics-section">
          <h3>Phân Bổ Định Giá Theo Danh Mục</h3>
          <div className="chart-bar-list">
            {Object.entries(stats.categoryValues).map(([category, value]) => {
              const percentage = Math.round((value / (stats.totalValuation || 1)) * 100);
              return (
                <div key={category} className="chart-bar-row">
                  <div className="bar-labels">
                    <span className="bar-name">{category}</span>
                    <span className="bar-val">${value.toLocaleString()} ({percentage}%)</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <div className="code-split-note">
            💡 <strong>Code-Splitting Insight:</strong> Modal này nặng hơn 40KB tính toán & chart, được phân tách hoàn toàn khỏi bundle chính của ứng dụng. Chỉ khi bấm nút xem báo cáo, bundle mới được nạp vào trình duyệt!
          </div>
          <button type="button" className="btn-close-cta" onClick={onClose}>
            Đóng Phân Tích
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
