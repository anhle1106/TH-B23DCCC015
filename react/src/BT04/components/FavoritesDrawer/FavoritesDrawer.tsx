import { useFavoritesStore } from '../../store/favoritesStore';
import './FavoritesDrawer.css';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesDrawer({ isOpen, onClose }: FavoritesDrawerProps) {
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);

  if (!isOpen) return null;

  const totalPrice = favorites.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-header-info">
            <span className="heart-header-icon">❤️</span>
            <div>
              <h2 id="drawer-title" className="drawer-title">Sản Phẩm Yêu Thích</h2>
              <p className="drawer-subtitle">
                Được đồng bộ tự động qua <code>useFavoritesStore (Zustand)</code>
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close-drawer"
            onClick={onClose}
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Drawer Content */}
        <div className="drawer-body">
          {favorites.length === 0 ? (
            <div className="drawer-empty-state">
              <span className="empty-heart-icon">🤍</span>
              <h3>Chưa có sản phẩm yêu thích nào</h3>
              <p>Bấm vào biểu tượng trái tim trên các sản phẩm để lưu lại vào đây nhé!</p>
            </div>
          ) : (
            <div className="favorites-list">
              {favorites.map((product) => (
                <div key={product.id} className="favorite-item">
                  <div className="favorite-item-image">
                    <span>{product.image}</span>
                  </div>
                  <div className="favorite-item-details">
                    <span className="favorite-item-category">{product.category}</span>
                    <h4 className="favorite-item-name">{product.name}</h4>
                    <span className="favorite-item-price">${product.price.toLocaleString()}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-remove-fav"
                    onClick={() => removeFavorite(product.id)}
                    title="Bỏ khỏi yêu thích"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="icon-trash">
                      <path
                        fillRule="evenodd"
                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {favorites.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-summary">
              <span className="summary-label">Tổng cộng ({favorites.length} sản phẩm):</span>
              <span className="summary-price">${totalPrice.toLocaleString()}</span>
            </div>
            <div className="drawer-actions">
              <button
                type="button"
                className="btn-clear-all"
                onClick={clearFavorites}
              >
                Xoá tất cả
              </button>
              <button
                type="button"
                className="btn-close-cta"
                onClick={onClose}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
