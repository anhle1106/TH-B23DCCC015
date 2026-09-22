# Lập Trình Web Nâng Cao (LTWNC) - Học Viện Công Nghệ Bưu Chính Viễn Thông

Kho lưu trữ các bài thực hành và bài tập môn Lập trình Web nâng cao.

## Cấu Trúc Thư Mục

```text
ltw/
├── nodejs/
│   └── TH01/                        <-- Bài thực hành Tuần 1 (Node.js & TypeScript cơ bản)
└── react/
    ├── package.json                 <-- @reduxjs/toolkit, react-redux, zustand
    └── src/
        ├── TH01/                    <-- BÀI THỰC HÀNH 01 (Student Deadline Tracker)
        │   ├── api/                 <-- API giả lập với createAsyncThunk
        │   ├── components/          <-- Compound Component (DeadlineCard), Form, Stats, FilterTabs
        │   ├── features/            <-- Redux Toolkit Slice
        │   ├── hooks/               <-- Custom Hook (useDeadlineCountdown)
        │   ├── store/               <-- Typed Redux Store & Hooks
        │   ├── types/               <-- TypeScript Nâng Cao (Generics, Utility Types, Type Guards)
        │   └── TH01App.tsx
        ├── TH02/                    <-- BÀI THỰC HÀNH 02 (Accordion Compound Component & usePagination)
        ├── BT04/                    <-- BÀI TẬP TUẦN 4 (Zustand Store - Sản Phẩm Yêu Thích)
        │   ├── components/          <-- FavoritesDrawer, ComparisonCard
        │   ├── store/               <-- favoritesStore.ts (Zustand + Persist middleware)
        │   ├── BT04App.tsx
        │   └── BT04App.css
        ├── App.tsx                  <-- Navigation Hub chuyển đổi linh hoạt TH01 / TH02 / BT04
        └── main.tsx
```

---

## 📌 Bài Tập Tuần 4 — Zustand (Sản Phẩm Yêu Thích - BT04)

- **Cài đặt**: Zustand store riêng (`favoritesStore`) tại `src/BT04/store/favoritesStore.ts`.
- **Tính năng**:
  - Thêm / bỏ 1 sản phẩm khỏi danh sách yêu thích (`toggleFavorite`).
  - Lưu trữ bền vững (`persist` middleware với `localStorage`).
  - Lọc nhanh "Tất cả sản phẩm" vs "Chỉ xem yêu thích".
  - Drawer danh sách yêu thích, hiển thị tổng tiền và hỗ trợ xoá tất cả.
- **Đoạn nhận xét so sánh Zustand vs Redux Toolkit (5–7 dòng nộp bài)**:
  > *"Lựa chọn Zustand store (favoritesStore) mang lại ưu điểm vượt trội về sự tinh gọn: cấu hình cực nhanh mà không cần boilerplate phức tạp (không cần Slice, Reducer, Action Types hay Provider bọc ngoài component root), đồng thời kích thước bundle siêu nhẹ (~1KB). Nhờ cơ chế selector-based hook, Zustand chỉ kích hoạt re-render đối với đúng component đăng ký slice dữ liệu thay đổi, tối ưu hiệu năng vượt trội so với React Context thông thường. So với Redux Toolkit, nhược điểm của Zustand là hệ sinh thái middleware chưa phong phú bằng (thiếu RTK Query cho data fetching nâng cao) và luồng quản lý dữ liệu linh hoạt, ít tính kỷ luật hơn khi áp dụng vào các dự án Enterprise quy mô lớn. Tuy nhiên, với bài toán quản lý client-state độc lập và vừa phải như "Sản phẩm yêu thích", Zustand là lựa chọn tối ưu hàng đầu về cả hiệu năng lẫn trải nghiệm phát triển (Developer Experience)."*

---

## Hướng Dẫn Chạy Dự Án

1. Di chuyển vào thư mục `react`:
   ```bash
   cd react
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy môi trường phát triển:
   ```bash
   npm run dev
   ```
4. Kiểm tra TypeScript & build:
   ```bash
   npm run build
   ```
