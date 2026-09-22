import type { FilterStatus } from '../../types/deadline.types';
import './FilterTabs.css';

interface FilterTabsProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  stats: {
    total: number;
    pending: number;
    overdue: number;
    completed: number;
  };
}

interface TabOption {
  key: FilterStatus;
  label: string;
  count: number;
}

export function FilterTabs({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  stats,
}: FilterTabsProps) {
  const tabs: TabOption[] = [
    { key: 'all', label: 'Tất cả', count: stats.total },
    { key: 'pending', label: 'Chưa hoàn thành', count: stats.pending },
    { key: 'overdue', label: 'Quá hạn', count: stats.overdue },
    { key: 'completed', label: 'Đã hoàn thành', count: stats.completed },
  ];

  return (
    <div className="filter-search-bar">
      {/* Yêu cầu 5: Tabs lọc theo trạng thái */}
      <div className="tabs-container" role="tablist">
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`filter-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => onFilterChange(tab.key)}
            >
              <span>{tab.label}</span>
              <span className={`tab-counter ${tab.key === 'overdue' && tab.count > 0 ? 'counter-overdue' : ''}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Input tìm kiếm nhanh */}
      <div className="search-box">
        <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Tìm theo môn học hoặc bài tập..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="btn-clear-search"
            onClick={() => onSearchChange('')}
            title="Xoá tìm kiếm"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
