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
        ├── BT03/                    <-- BÀI TẬP TUẦN 3 (Module Giỏ Hàng Redux Toolkit)
        │   ├── app/                 <-- store.ts & hooks.ts (Typed useAppDispatch, useAppSelector)
        │   ├── features/
        │   │   ├── products/        <-- productsSlice.ts (createAsyncThunk fetchProducts)
        │   │   └── cart/            <-- cartSlice.ts (addToCart, removeFromCart, updateQuantity, clearCart)
        │   ├── api/                 <-- mockProductsApi.ts
        │   ├── components/          <-- CartDrawer, ProductCard, SubmissionNote
        │   ├── BT03App.tsx
        │   └── BT03App.css
        ├── BT04/                    <-- BÀI TẬP TUẦN 4 (Zustand Store - Sản Phẩm Yêu Thích)
        │   ├── components/          <-- FavoritesDrawer, ComparisonCard
        │   ├── store/               <-- favoritesStore.ts (Zustand + Persist middleware)
        │   ├── BT04App.tsx
        │   └── BT04App.css
        ├── App.tsx                  <-- Navigation Hub chuyển đổi linh hoạt TH01 / TH02 / BT03 / BT04
        └── main.tsx
```

---

## 📌 Bài Tập Tuần 3 — Redux Toolkit (Module Giỏ Hàng - BT03)

- **Cấu trúc chuẩn Feature-Based**:
  - `features/products/productsSlice.ts`: Quản lý danh sách sản phẩm, `createAsyncThunk ('products/fetchProducts')` lấy dữ liệu từ mock API.
  - `features/cart/cartSlice.ts`: Thêm, xoá, cập nhật số lượng `updateQuantity`, kiểm soát tồn kho (`stock`), tính tổng tiền và tổng số lượng.
  - `app/store.ts` & `app/hooks.ts`: Cung cấp `useAppDispatch` và `useAppSelector` đã gõ kiểu đầy đủ cho toàn bộ components.
- **Tính năng & Giao diện**:
  - Grid sản phẩm công nghệ hiện đại.
  - Drawer giỏ hàng trượt thông minh, cập nhật số lượng realtime, nút thanh toán giả lập.

---

## 📌 Bài Tập Tuần 4 — Zustand (Sản Phẩm Yêu Thích - BT04)

- **Cài đặt**: Zustand store riêng (`favoritesStore`) tại `src/BT04/store/favoritesStore.ts`.
- **Tính năng**: Thêm / bỏ sản phẩm yêu thích (`toggleFavorite`), lưu bền vững qua `persist` middleware, Drawer danh sách yêu thích, đoạn nhận xét 5–7 dòng so sánh với Redux Toolkit.

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
