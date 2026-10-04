# Kế Hoạch Triển Khai BT05: Tối Ưu Hiệu Năng React (10.000 Sản Phẩm)

> **Mục tiêu**: Xây dựng trang quản lý 10.000 sản phẩm tối ưu toàn diện, cải thiện triệt để các chỉ số Lighthouse (FCP, LCP, TBT, CLS), kèm báo cáo đối sánh trước/sau tối ưu để nộp bài.

---

## 📌 Phân Rã Nhiệm Vụ (Task Breakdown)

- [x] **Task 1: Mock Data Generator & Data Model**
  - Tạo `src/BT05/types.ts` và `src/BT05/data/generate10kProducts.ts` sinh 10.000 items (name, category, price, stock, rating, SKU, status) tối ưu bộ nhớ.
  - *Kiểm chứng*: Hàm sinh dữ liệu chạy < 15ms, sinh đúng 10.000 sản phẩm có cấu trúc chuẩn.

- [x] **Task 2: Bộ Kỹ Thuật Tối Ưu Hóa (Core Performance Engine)**
  - **Kỹ thuật 1 - Virtualization (Windowing)**: Tạo `useVirtualList` hoặc `VirtualizedProductTable` chỉ render ~25 hàng trong viewport thay vì 10.000 DOM nodes.
  - **Kỹ thuật 2 - Memoization & Selective Re-render**: Áp dụng `useMemo` cho filter/sort/thống kê tài sản kho, `useCallback` cho actions, `React.memo` cho từng row item.
  - **Kỹ thuật 3 - Code-Splitting & Dynamic Import**: Sử dụng `React.lazy` và `<Suspense>` tách rời Analytics & Inventory Chart Modal thành chunk riêng tải on-demand.
  - **Kỹ thuật 4 - Non-blocking Search (Concurrent Features)**: Dùng `useDeferredValue` / debounced input để giữ 60 FPS khi gõ phím tìm kiếm trên 10.000 records.
  - *Kiểm chứng*: DOM nodes duy trì ~30 nodes, gõ search không lag giật (INP/TBT ~ 0ms).

- [x] **Task 3: Giao Diện Dashboard BT05 & Bộ Chuyển Đổi So Sánh**
  - Xây dựng `BT05App.tsx` và `BT05App.css` hiện đại, chuyên nghiệp với:
    - Thanh điều hướng lọc danh mục, tìm kiếm, sắp xếp giá/tồn kho.
    - Chế độ so sánh "Chưa tối ưu 🛑" vs "Đã tối ưu ⚡" (để phục vụ việc chụp ảnh, đo đạc Lighthouse và chấm điểm trực tiếp).
    - Thẻ tóm tắt chỉ số Performance thời gian thực (Render Time, DOM Nodes Count, FPS).
  - Tích hợp BT05 vào `src/App.tsx` (LTWNC Labs Hub) và cập nhật `README.md`.
  - *Kiểm chứng*: Chuyển tab BT05 trên giao diện mượt mà, chuyển đổi giữa 2 chế độ hiển thị rõ khác biệt DOM và thời gian render.

- [x] **Task 4: Báo Cáo Đối Sánh Lighthouse & Nội Dung Nộp Bài**
  - Tạo `BAOCAO_BT05_TOI_UU_REACT.md` phân tích chuyên sâu các chỉ số FCP, LCP, TBT, CLS trước và sau tối ưu.
  - Cung cấp đoạn văn bản súc tích chuẩn bị sẵn để copy trực tiếp vào khung nộp bài của giảng viên Ngô Văn Nhận.
  - *Kiểm chứng*: Đầy đủ số liệu đo lường, nguyên nhân gốc rễ và giải pháp kỹ thuật.

- [x] **Task 5: Kiểm Thử Build & Chất Lượng Mã Nguồn**
  - Chạy `npm run build` và oxlint kiểm tra tính toàn vẹn TypeScript.
  - *Kiểm chứng*: Build thành công 100% không warning/lỗi cú pháp.
