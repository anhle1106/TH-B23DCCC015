# Lập Trình Web Nâng Cao (LTWNC) - Học Viện Công Nghệ Bưu Chính Viễn Thông

Kho lưu trữ các bài thực hành môn Lập trình Web nâng cao.

## Cấu Trúc Thư Mục

```text
ltw/
├── nodejs/
│   └── TH01/                        <-- Bài thực hành Tuần 1 (Node.js & TypeScript cơ bản)
└── react/
    ├── package.json                 <-- Môi trường React dùng chung (@reduxjs/toolkit, react-redux)
    └── src/
        ├── TH01/                    <-- BÀI THỰC HÀNH 01 (Student Deadline Tracker)
        │   ├── api/                 <-- API giả lập với createAsyncThunk
        │   ├── components/          <-- Compound Components, Stats & Forms
        │   │   ├── DeadlineCard/    <-- Compound Component: Header, Body, Actions
        │   │   ├── DeadlineForm/    <-- Form thêm deadline với quick date presets
        │   │   ├── DeadlineStats/   <-- 4 thẻ KPI tương tác (Click đổi filter)
        │   │   └── FilterTabs/      <-- Tabs lọc trạng thái + Search bar
        │   ├── features/            <-- Redux Toolkit Slice (Feature-based)
        │   ├── hooks/               <-- Custom Hook nâng cao (useDeadlineCountdown)
        │   ├── store/               <-- Typed Redux Store & Hooks
        │   ├── types/               <-- TypeScript nâng cao (Generics, Utility Types, Type Guards)
        │   ├── TH01App.tsx          <-- Main Component TH01
        │   └── TH01App.css
        ├── TH02/                    <-- BÀI THỰC HÀNH 02 (Accordion & usePagination)
        ├── App.tsx                  <-- Navigation Hub cho phép chuyển đổi nhanh TH01 / TH02
        └── main.tsx
```

## Bảng Đối Soát Yêu Cầu Kỹ Thuật (TH01 - Student Deadline Tracker)

| Buổi Học | Yêu Cầu Đề Bài | Triển Khai Thực Tế |
| :--- | :--- | :--- |
| **Buổi 1 — TypeScript Nâng Cao** | • Generic<br>• Utility types<br>• Type guard | • `ApiResponse<T>`, `filterItems<T>`<br>• `Pick`, `Omit`, `Partial`, `Record` (`CreateDeadlineDTO`, `UpdateDeadlineDTO`, `PRIORITY_MAP`)<br>• `isPriority()`, `isDeadline()`, `isDeadlineOverdue()` |
| **Buổi 2 — React Design Pattern** | • Custom hook nâng cao<br>• Compound Component / HOC | • `useDeadlineCountdown()`: Tính ngày còn lại / quá hạn, urgency status<br>• `DeadlineCard`: Compound Component Pattern (`DeadlineCard.Header`, `DeadlineCard.Body`, `DeadlineCard.Actions`) |
| **Buổi 3 — Redux Toolkit + TS** | • Feature-based structure<br>• Typed hooks<br>• `createAsyncThunk` | • `src/TH01/features/deadlines/deadlinesSlice.ts`<br>• `useAppDispatch`, `useAppSelector` chuẩn typed hooks<br>• `fetchInitialDeadlines` giả lập call API nạp dữ liệu ban đầu |

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
