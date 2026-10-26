import { useFilterStore, type CategoryFilter } from '../../store/useFilterStore';
import { BOOK_CATEGORIES } from '../../types/book.types';
import './FilterBar.css';

const CATEGORY_TABS: readonly CategoryFilter[] = [
  'Tất cả',
  ...BOOK_CATEGORIES,
];

export interface FilterBarProps {
  totalResults: number;
}

export function FilterBar({ totalResults }: FilterBarProps) {
  const keyword = useFilterStore((state) => state.keyword);
  const category = useFilterStore((state) => state.category);
  const setKeyword = useFilterStore((state) => state.setKeyword);
  const setCategory = useFilterStore((state) => state.setCategory);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const hasActiveFilters = keyword.trim() !== '' || category !== 'Tất cả';

  return (
    <div className="filter-bar-container">
      <div className="category-tabs" role="tablist" aria-label="Lọc theo thể loại sách">
        {CATEGORY_TABS.map((cat) => {
          const isActive = category === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`cat-btn ${isActive ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="search-filter-wrapper">
        <div className="search-box">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo tên sách hoặc tác giả (debounce 300ms)..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="Tìm kiếm sách"
          />
          {keyword && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setKeyword('')}
              aria-label="Xoá từ khoá tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn-reset-filters"
            onClick={resetFilters}
            title="Đặt lại bộ lọc về mặc định"
          >
            Đặt lại
          </button>
        )}
      </div>

      <div className="filter-status-text">
        Tìm thấy <strong>{totalResults}</strong> đầu sách phù hợp
      </div>
    </div>
  );
}

export default FilterBar;
