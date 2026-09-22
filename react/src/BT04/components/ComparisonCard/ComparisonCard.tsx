import { useState } from 'react';
import './ComparisonCard.css';

const COMPARISON_TEXT = `Lựa chọn Zustand store (favoritesStore) mang lại ưu điểm vượt trội về sự tinh gọn: cấu hình cực nhanh mà không cần boilerplate phức tạp (không cần Slice, Reducer, Action Types hay Provider bọc ngoài component root), đồng thời kích thước bundle siêu nhẹ (~1KB). Nhờ cơ chế selector-based hook, Zustand chỉ kích hoạt re-render đối với đúng component đăng ký slice dữ liệu thay đổi, tối ưu hiệu năng vượt trội so với React Context thông thường. So với Redux Toolkit, nhược điểm của Zustand là hệ sinh thái middleware chưa phong phú bằng (thiếu RTK Query cho data fetching nâng cao) và luồng quản lý dữ liệu linh hoạt, ít tính kỷ luật hơn khi áp dụng vào các dự án Enterprise quy mô lớn. Tuy nhiên, với bài toán quản lý client-state độc lập và vừa phải như "Sản phẩm yêu thích", Zustand là lựa chọn tối ưu hàng đầu về cả hiệu năng lẫn trải nghiệm phát triển (Developer Experience).`;

export function ComparisonCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(COMPARISON_TEXT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="comparison-card">
      <div className="comparison-header">
        <div>
          <div className="comparison-badge">Yêu Cầu Bài Tập Tuần 4</div>
          <h3 className="comparison-title">
            So sánh ưu/nhược điểm: Zustand Store vs Redux Toolkit
          </h3>
        </div>
        <button
          type="button"
          className={`btn-copy-answer ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          title="Sao chép câu trả lời để nộp bài"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="icon-copy">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Đã sao chép!</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="icon-copy">
                <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12a1.5 1.5 0 01.439 1.061V16.5A1.5 1.5 0 0115.5 18h-7A1.5 1.5 0 017 16.5v-13z" />
                <path d="M4.5 6A1.5 1.5 0 003 7.5v11A1.5 1.5 0 004.5 20h7a1.5 1.5 0 001.5-1.5v-1H8.5A2.5 2.5 0 016 15V6H4.5z" />
              </svg>
              <span>Sao chép câu trả lời nộp bài</span>
            </>
          )}
        </button>
      </div>

      <div className="comparison-body">
        <blockquote className="comparison-quote">
          {COMPARISON_TEXT}
        </blockquote>

        <div className="comparison-matrix">
          <div className="matrix-col pros-col">
            <div className="matrix-heading">
              <span className="matrix-indicator green" />
              <strong>Ưu điểm của Zustand (Lựa chọn cài đặt)</strong>
            </div>
            <ul>
              <li><strong>Zero Boilerplate:</strong> Tạo store trực tiếp trong 1 hàm <code>create()</code> duy nhất, không cần Slice hay Actions rời rạc.</li>
              <li><strong>Không cần Provider:</strong> Dễ dàng gọi và cập nhật state ở bất kỳ component nào mà không làm phình cây component.</li>
              <li><strong>Bundle siêu nhẹ:</strong> ~1KB (so với ~11KB của RTK và React-Redux).</li>
              <li><strong>Hiệu năng Re-render tối ưu:</strong> Hỗ trợ granular selector subscription chỉ render lại khi slice dữ liệu đăng ký thay đổi.</li>
            </ul>
          </div>

          <div className="matrix-col cons-col">
            <div className="matrix-heading">
              <span className="matrix-indicator orange" />
              <strong>Nhược điểm so với Redux Toolkit</strong>
            </div>
            <ul>
              <li><strong>Ít tính khuôn mẫu (Opinionated):</strong> Do quá linh hoạt nên trong các team lớn nếu không quy ước dễ dẫn đến phân tán logic.</li>
              <li><strong>Hệ sinh thái data fetching:</strong> Không có sẵn giải pháp quản lý caching server-state mạnh mẽ như RTK Query.</li>
              <li><strong>DevTools nâng cao:</strong> Dù hỗ trợ Redux DevTools qua middleware nhưng trải nghiệm time-travel debugging của RTK vẫn đồng bộ và chặt chẽ hơn.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
