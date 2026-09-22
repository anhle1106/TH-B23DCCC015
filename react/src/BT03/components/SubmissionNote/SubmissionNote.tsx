import { useState } from 'react';
import './SubmissionNote.css';

const SUBMISSION_TEXT = `Em đã hoàn thành bài tập Tuần 3 - Redux Toolkit theo đúng chuẩn yêu cầu của Thầy:
1. Cấu trúc thư mục chuẩn Feature-based:
   - features/products/productsSlice.ts
   - features/cart/cartSlice.ts
   - app/store.ts và app/hooks.ts (chỉ sử dụng useAppDispatch & useAppSelector đã gõ kiểu trong toàn bộ components).
2. productsSlice: Sử dụng createAsyncThunk ('products/fetchProducts') để lấy danh sách sản phẩm từ API giả lập (mockProductsApi), xử lý đầy đủ 3 trạng thái pending / fulfilled / rejected kèm loading skeleton.
3. cartSlice: Hỗ trợ đầy đủ các actions:
   - addToCart: Thêm sản phẩm vào giỏ, kiểm tra không vượt quá tồn kho (stock).
   - removeFromCart: Xoá sản phẩm khỏi giỏ hàng.
   - updateQuantity: Tăng/giảm số lượng sản phẩm (+/-), tự động xoá nếu quantity <= 0.
   - clearCart: Làm trống giỏ hàng sau khi thanh toán.
4. Giao diện: Tích hợp Drawer trượt xem giỏ hàng, cập nhật realtime tổng số lượng và tổng tiền.`;

export function SubmissionNote() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUBMISSION_TEXT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="submission-note-card">
      <div className="note-card-header">
        <div>
          <span className="note-badge">Báo Cáo Hoàn Thành BT03</span>
          <h3 className="note-title">Bảng Đối Soát Chuẩn Đề Bài Tuần 3 - Redux Toolkit</h3>
        </div>
        <button
          type="button"
          className={`btn-copy-note ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? '✓ Đã sao chép nội dung!' : '📋 Sao chép báo cáo nộp bài'}
        </button>
      </div>

      <div className="note-grid">
        <div className="note-col">
          <strong>1. Cấu Trúc Feature-Based</strong>
          <ul>
            <li><code>app/store.ts</code>: Cấu hình store gộp <code>products</code> & <code>cart</code></li>
            <li><code>app/hooks.ts</code>: <code>useAppDispatch</code>, <code>useAppSelector</code></li>
            <li><code>features/products/</code> & <code>features/cart/</code></li>
          </ul>
        </div>

        <div className="note-col">
          <strong>2. productsSlice & createAsyncThunk</strong>
          <ul>
            <li>Gọi API giả lập lấy danh sách sản phẩm (có delay)</li>
            <li>Xử lý trạng thái <code>pending / fulfilled / rejected</code></li>
            <li>Bộ lọc Category & Tìm kiếm keyword</li>
          </ul>
        </div>

        <div className="note-col">
          <strong>3. cartSlice & UI Giỏ Hàng</strong>
          <ul>
            <li>Actions: <code>addToCart</code>, <code>removeFromCart</code>, <code>updateQuantity</code>, <code>clearCart</code></li>
            <li>Kiểm soát số lượng không vượt quá tồn kho <code>stock</code></li>
            <li>Selectors tính tổng tiền & tổng số lượng tự động</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
