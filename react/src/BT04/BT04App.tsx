import { useState } from 'react';
import { MOCK_PRODUCTS } from '../TH02/data/mockProducts';
import { useFavoritesStore } from './store/favoritesStore';
import { FavoritesDrawer } from './components/FavoritesDrawer/FavoritesDrawer';
import { ComparisonCard } from './components/ComparisonCard/ComparisonCard';
import './BT04App.css';

export function BT04App() {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Zustand Store Selectors
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);

  // Danh sách hiển thị tuỳ theo Tab lọc
  const displayedProducts =
    activeTab === 'favorites'
      ? MOCK_PRODUCTS.filter((product) => isFavorite(product.id))
      : MOCK_PRODUCTS;

  return (
    <div className="bt04-wrapper">
      {/* Header chính */}
      <header className="bt04-header">
        <div className="header-badge-row">
          <span className="bt04-badge">LTWNC - Bài Tập Tuần 4</span>
          <span className="tech-tag">Zustand Store (favoritesStore) + Persist</span>
        </div>
        <h1 className="bt04-title">Sản Phẩm Yêu Thích</h1>
        <p className="bt04-subtitle">
          Thực hành quản lý client-state với <code>Zustand</code> thay thế cho Redux Toolkit, kèm đoạn nhận xét so sánh nộp bài.
        </p>
      </header>

      {/* Control Bar: Filter Tabs & Favorites Drawer Button */}
      <div className="bt04-controls">
        <div className="tab-group" role="tablist">
          <button
            type="button"
            className={`control-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả sản phẩm ({MOCK_PRODUCTS.length})
          </button>
          <button
            type="button"
            className={`control-tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Chỉ xem yêu thích ({favorites.length})
          </button>
        </div>

        <button
          type="button"
          className="btn-open-drawer"
          onClick={() => setIsDrawerOpen(true)}
        >
          <span className="fav-heart-icon">❤️</span>
          <span>Xem danh sách yêu thích</span>
          <span className="fav-count-pill">{favorites.length}</span>
        </button>
      </div>

      {/* Product Grid */}
      <main className="product-showcase">
        {displayedProducts.length === 0 ? (
          <div className="empty-fav-container">
            <span className="empty-fav-icon">💔</span>
            <h3>Chưa có sản phẩm yêu thích nào</h3>
            <p>
              Hãy bấm vào biểu tượng trái tim trên các sản phẩm ở tab "Tất cả sản phẩm" để thêm vào danh sách!
            </p>
            <button
              type="button"
              className="btn-switch-all"
              onClick={() => setActiveTab('all')}
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {displayedProducts.map((product) => {
              const favorited = isFavorite(product.id);

              return (
                <div
                  key={product.id}
                  className={`product-card ${favorited ? 'is-fav' : ''}`}
                >
                  {/* Top Bar Card */}
                  <div className="card-top-bar">
                    <span className="card-category">{product.category}</span>
                    <button
                      type="button"
                      className={`btn-fav-toggle ${favorited ? 'active' : ''}`}
                      onClick={() => toggleFavorite(product)}
                      title={favorited ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                      aria-label={favorited ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                    >
                      <svg viewBox="0 0 24 24" className="heart-svg" fill={favorited ? '#ef4444' : 'none'} stroke={favorited ? '#ef4444' : '#94a3b8'} strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>

                  {/* Product Icon & Name */}
                  <div className="card-image-box">
                    <span className="product-emoji">{product.image}</span>
                  </div>

                  <div className="card-info">
                    <h3 className="card-title">{product.name}</h3>
                    <p className="card-desc">{product.description}</p>

                    <div className="card-meta">
                      <span className="card-price">${product.price.toLocaleString()}</span>
                      <span className="card-rating">⭐ {product.rating}</span>
                    </div>

                    <button
                      type="button"
                      className={`btn-card-action ${favorited ? 'btn-unfav' : 'btn-fav'}`}
                      onClick={() => toggleFavorite(product)}
                    >
                      {favorited ? '✕ Bỏ yêu thích' : '❤️ Thêm yêu thích'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* So sánh Zustand vs Redux Toolkit (Đoạn nhận xét 5–7 dòng nộp bài) */}
      <ComparisonCard />

      {/* Drawer Danh Sách Yêu Thích */}
      <FavoritesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

export default BT04App;
