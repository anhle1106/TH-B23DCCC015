import type { Deadline } from '../../types/deadline.types';
import { calcStats } from '../../utils/deadlineHelpers';
import './StatsPage.css';

/**
 * ============================================================================
 * PHẦN B: TỐI ƯU HIỆU NĂNG - REACT.LAZY & SUSPENSE TRANG THỐNG KÊ
 * ============================================================================
 * Component này được tải bất đồng bộ (code splitting) bằng React.lazy.
 * Trình duyệt chỉ tải bundle của component này khi người dùng thực sự mở trang Thống kê.
 * - Đếm số bài đã xong
 * - Đếm số bài quá hạn
 * - Đếm số bài theo từng môn học
 */

export interface StatsPageProps {
  items: Deadline[];
  onBack?: () => void;
}

export function StatsPage({ items, onBack }: StatsPageProps) {
  const stats = calcStats(items);
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Thống kê theo mức độ ưu tiên
  const priorityCounts = {
    high: items.filter((i) => i.priority === 'high').length,
    medium: items.filter((i) => i.priority === 'medium').length,
    low: items.filter((i) => i.priority === 'low').length,
  };

  const subjectEntries = Object.entries(stats.bySubject).sort((a, b) => b[1] - a[1]);

  return (
    <div className="stats-page-container" data-testid="stats-page">
      <div className="stats-page-header">
        <div>
          <span className="stats-badge">🚀 Code-Split với React.lazy &amp; Suspense</span>
          <h2 className="stats-page-title">Báo Cáo Thống Kê Tiến Độ Học Tập</h2>
          <p className="stats-page-subtitle">
            Tổng hợp dữ liệu hạn nộp, tỷ lệ hoàn thành và phân bố khối lượng học tập theo môn
          </p>
        </div>
        {onBack && (
          <button type="button" className="btn-back-to-list" onClick={onBack}>
            ← Quay lại danh sách
          </button>
        )}
      </div>

      {/* 4 Thẻ KPI chính */}
      <div className="stats-kpi-grid">
        <div className="stats-kpi-card blue">
          <span className="kpi-label">Tổng số bài tập</span>
          <span className="kpi-value">{stats.total.toLocaleString('vi-VN')}</span>
          <span className="kpi-hint">Toàn bộ deadline ghi nhận</span>
        </div>

        <div className="stats-kpi-card green">
          <span className="kpi-label">Đã hoàn thành</span>
          <span className="kpi-value">{stats.completed.toLocaleString('vi-VN')}</span>
          <span className="kpi-hint">Tỷ lệ: {completionRate}%</span>
        </div>

        <div className="stats-kpi-card red">
          <span className="kpi-label">Đang quá hạn</span>
          <span className="kpi-value">{stats.overdue.toLocaleString('vi-VN')}</span>
          <span className="kpi-hint">Cần ưu tiên xử lý gấp</span>
        </div>

        <div className="stats-kpi-card amber">
          <span className="kpi-label">Đang thực hiện</span>
          <span className="kpi-value">{stats.pending.toLocaleString('vi-VN')}</span>
          <span className="kpi-hint">Còn hạn nộp trong tương lai</span>
        </div>
      </div>

      {/* Progress Bar Tỷ lệ hoàn thành */}
      <div className="stats-section-card">
        <div className="progress-header">
          <span className="progress-title">Tỷ lệ hoàn thành tổng thể</span>
          <span className="progress-percent">{completionRate}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      {/* Grid 2 cột: Theo môn học và Theo mức độ ưu tiên */}
      <div className="stats-details-grid">
        {/* Phân bố theo môn học */}
        <div className="stats-section-card">
          <h3 className="section-title">📚 Thống kê theo môn học ({subjectEntries.length} môn)</h3>
          {subjectEntries.length === 0 ? (
            <p className="empty-hint">Chưa có bài tập nào để thống kê theo môn.</p>
          ) : (
            <div className="subject-stat-list">
              {subjectEntries.map(([subj, count]) => {
                const subjectPercent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={subj} className="subject-stat-row">
                    <div className="subject-stat-info">
                      <span className="subject-name">{subj}</span>
                      <span className="subject-count">
                        <strong>{count}</strong> bài ({subjectPercent}%)
                      </span>
                    </div>
                    <div className="subject-progress-track">
                      <div className="subject-progress-fill" style={{ width: `${subjectPercent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Phân bố theo mức độ ưu tiên */}
        <div className="stats-section-card">
          <h3 className="section-title">⚡ Phân bố theo mức độ ưu tiên</h3>
          <div className="priority-stat-grid">
            <div className="priority-stat-card high">
              <span className="p-badge high">Ưu tiên Cao</span>
              <span className="p-count">{priorityCounts.high.toLocaleString('vi-VN')}</span>
              <span className="p-desc">Bài tập khẩn cấp</span>
            </div>

            <div className="priority-stat-card medium">
              <span className="p-badge medium">Trung bình</span>
              <span className="p-count">{priorityCounts.medium.toLocaleString('vi-VN')}</span>
              <span className="p-desc">Tiến độ bình thường</span>
            </div>

            <div className="priority-stat-card low">
              <span className="p-badge low">Ưu tiên Thấp</span>
              <span className="p-count">{priorityCounts.low.toLocaleString('vi-VN')}</span>
              <span className="p-desc">Có thể hoàn thành sau</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
