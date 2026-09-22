import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { Product } from '../../types/cart.types';
import { addToCart, selectItemQuantityInCart } from '../../features/cart/cartSlice';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const quantityInCart = useAppSelector(selectItemQuantityInCart(product.id));

  const isOutOfStock = product.stock <= 0;
  const isMaxInCart = quantityInCart >= product.stock;

  return (
    <div className="tech-product-card">
      <div className="tech-card-header">
        <span className="category-pill">{product.category}</span>
        <span className={`stock-pill ${isOutOfStock ? 'out-of-stock' : ''}`}>
          {isOutOfStock ? 'Hết hàng' : `Còn ${product.stock} sản phẩm`}
        </span>
      </div>

      <div className="tech-card-img">
        <span className="emoji-display">{product.image}</span>
      </div>

      <div className="tech-card-content">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="tech-card-meta">
          <span className="price-tag">${product.price.toLocaleString()}</span>
          <span className="rating-tag">⭐ {product.rating}</span>
        </div>

        <button
          type="button"
          className={`btn-add-cart ${quantityInCart > 0 ? 'in-cart' : ''}`}
          disabled={isOutOfStock || isMaxInCart}
          onClick={() => dispatch(addToCart(product))}
        >
          {isOutOfStock ? (
            'Tạm hết hàng'
          ) : isMaxInCart ? (
            `Đã đạt tối đa kho (${quantityInCart})`
          ) : quantityInCart > 0 ? (
            <>
              <span>+ Thêm tiếp</span>
              <span className="badge-in-cart">Đã có {quantityInCart}</span>
            </>
          ) : (
            '🛒 Thêm vào giỏ hàng'
          )}
        </button>
      </div>
    </div>
  );
}
