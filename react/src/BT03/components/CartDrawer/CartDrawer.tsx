import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCartItems,
  selectIsCartOpen,
  selectCartTotalPrice,
  selectCartTotalQuantity,
  setCartOpen,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../../features/cart/cartSlice';
import './CartDrawer.css';

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const isOpen = useAppSelector(selectIsCartOpen);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutSuccess(true);
    setTimeout(() => {
      dispatch(clearCart());
      setCheckoutSuccess(false);
      dispatch(setCartOpen(false));
    }, 2000);
  };

  return (
    <div className="cart-overlay" onClick={() => dispatch(setCartOpen(false))}>
      <aside
        className="cart-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <span className="cart-header-icon">🛍️</span>
            <div>
              <h2 id="cart-title" className="cart-title">Giỏ Hàng Của Bạn</h2>
              <span className="cart-header-count">{totalQuantity} sản phẩm trong giỏ</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-close-cart"
            onClick={() => dispatch(setCartOpen(false))}
            aria-label="Đóng giỏ hàng"
          >
            ✕
          </button>
        </div>

        {/* Cart Content */}
        <div className="cart-body">
          {checkoutSuccess ? (
            <div className="checkout-success-state">
              <span className="success-icon">🎉</span>
              <h3>Đặt Hàng Thành Công!</h3>
              <p>Cảm ơn bạn đã mua sắm. Giỏ hàng đã được làm mới.</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <span className="empty-cart-icon">🛒</span>
              <h3>Giỏ hàng đang trống</h3>
              <p>Hãy thêm các sản phẩm công nghệ tuyệt vời vào giỏ hàng nhé!</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="cart-item-row">
                  <div className="cart-item-img-box">
                    <span>{product.image}</span>
                  </div>

                  <div className="cart-item-info">
                    <span className="cart-item-category">{product.category}</span>
                    <h4 className="cart-item-name">{product.name}</h4>
                    <span className="cart-item-price">${product.price.toLocaleString()}</span>

                    {/* Quantity Controls */}
                    <div className="quantity-controls">
                      <button
                        type="button"
                        className="btn-qty"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: product.id,
                              quantity: quantity - 1,
                            })
                          )
                        }
                        title="Giảm số lượng"
                      >
                        -
                      </button>
                      <span className="qty-value">{quantity}</span>
                      <button
                        type="button"
                        className="btn-qty"
                        disabled={quantity >= product.stock}
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: product.id,
                              quantity: quantity + 1,
                            })
                          )
                        }
                        title={
                          quantity >= product.stock
                            ? 'Đã đạt giới hạn tồn kho'
                            : 'Tăng số lượng'
                        }
                      >
                        +
                      </button>
                      <span className="stock-hint">(Kho: {product.stock})</span>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <span className="item-subtotal">
                      ${(product.price * quantity).toLocaleString()}
                    </span>
                    <button
                      type="button"
                      className="btn-remove-item"
                      onClick={() => dispatch(removeFromCart(product.id))}
                      title="Xoá sản phẩm này"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="trash-icon">
                        <path
                          fillRule="evenodd"
                          d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && !checkoutSuccess && (
          <div className="cart-footer">
            <div className="cart-price-summary">
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
              <div className="summary-row shipping-row">
                <span>Vận chuyển:</span>
                <span className="free-shipping">MIỄN PHÍ</span>
              </div>
              <div className="summary-row total-row">
                <strong>Tổng thanh toán:</strong>
                <strong className="total-amount">${totalPrice.toLocaleString()}</strong>
              </div>
            </div>

            <div className="cart-footer-actions">
              <button
                type="button"
                className="btn-clear-cart"
                onClick={() => dispatch(clearCart())}
              >
                Xoá giỏ hàng
              </button>
              <button
                type="button"
                className="btn-checkout"
                onClick={handleCheckout}
              >
                Thanh toán ngay (${totalPrice.toLocaleString()})
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
