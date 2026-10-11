# BÁO CÁO BÀI TẬP TUẦN 6: KIỂM THỬ (TESTING) - LTWNC
**Giảng viên:** Ngô Văn Nhận  
**Module thực hiện:** Module Giỏ hàng & Sản phẩm (`src/BT03`)  
**Công nghệ sử dụng:** Jest, React Testing Library (RTL), Redux Toolkit, TypeScript  

---

## 1. TỔNG QUAN KẾT QUẢ ĐẠT ĐƯỢC

| Tiêu chí đề bài yêu cầu | Kết quả thực tế đạt được | Đánh giá |
|:---|:---|:---:|
| **Module kiểm thử** | Module Giỏ hàng & Sản phẩm xây từ Buổi 3 (`src/BT03`) |  Đạt |
| **Số lượng test case (≥ 10)** | **47 test cases** (vượt xa yêu cầu) |  Đạt |
| **Phân loại kiểm thử** | Đầy đủ Unit test (hàm selector, reducer, mock API) & Integration test (Component với RTL) |  Đạt |
| **Test bất đồng bộ (Async + Mock API)** | Kiểm thử `createAsyncThunk` (`fetchProducts`) mock `mockProductsApi` đầy đủ trường hợp pending, fulfilled, rejected |  Đạt |
| **Tỷ lệ Jest Coverage (≥ 70%)** | **99.25% Statements, 98.03% Branches, 100% Functions, 100% Lines** |  Xuất sắc |

---

## 2. BẢNG BÁO CÁO COVERAGE (JEST --COVERAGE)

Chạy lệnh: `npm run test:coverage` hoặc `npx jest --coverage`

```text
PASS src/BT03/__tests__/mockProductsApi.test.ts
PASS src/BT03/__tests__/productsSlice.test.ts
PASS src/BT03/__tests__/cartSlice.test.ts
PASS src/BT03/__tests__/ProductCard.test.tsx
PASS src/BT03/__tests__/CartDrawer.test.tsx
------------------------|---------|----------|---------|---------|-------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------------|---------|----------|---------|---------|-------------------
All files               |   99.25 |    98.03 |     100 |     100 |                   
 api                    |     100 |      100 |     100 |     100 |                   
  mockProductsApi.ts    |     100 |      100 |     100 |     100 |                   
 components/CartDrawer  |   96.66 |     92.3 |     100 |     100 |                   
  CartDrawer.tsx        |   96.66 |     92.3 |     100 |     100 | 27                
 components/ProductCard |     100 |      100 |     100 |     100 |                   
  ProductCard.tsx       |     100 |      100 |     100 |     100 |                   
 features/cart          |     100 |      100 |     100 |     100 |                   
  cartSlice.ts          |     100 |      100 |     100 |     100 |                   
 features/products      |     100 |      100 |     100 |     100 |                   
  productsSlice.ts      |     100 |      100 |     100 |     100 |                   
------------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 99.25% ( 134/135 )
Branches     : 98.03% ( 50/51 )
Functions    : 100% ( 49/49 )
Lines        : 100% ( 106/106 )
================================================================================

Test Suites: 5 passed, 5 total
Tests:       47 passed, 47 total
Snapshots:   0 total
Time:        4.4 s
```

---

## 3. CHI TIẾT DANH SÁCH 47 TEST CASES

### A. Unit Tests: `cartSlice.test.ts` (18 Test Cases)
- **Kiểm thử Reducers & Actions:**
  1. `should return the initial state when passed an empty action`: Khởi tạo state mặc định.
  2. `should add a new product to empty cart with quantity 1`: Thêm sản phẩm mới vào giỏ trống.
  3. `should increment quantity when adding an existing product if below stock`: Tăng số lượng khi thêm sản phẩm đã tồn tại trong giỏ.
  4. `should not increment quantity beyond product stock limit`: Chặn không cho vượt quá giới hạn tồn kho.
  5. `should not add product if stock is 0`: Chặn không cho thêm sản phẩm hết hàng (stock = 0).
  6. `should remove product from cart by id`: Xóa sản phẩm khỏi giỏ hàng qua action `removeFromCart`.
  7. `should update quantity of an existing item`: Cập nhật số lượng sản phẩm bằng `updateQuantity`.
  8. `should remove item if updated quantity is 0 or negative`: Tự động xóa sản phẩm khi số lượng cập nhật ≤ 0.
  9. `should cap quantity to product stock if updated quantity exceeds stock`: Giới hạn số lượng không vượt quá `stock` khi cập nhật lớn hơn tồn kho.
  10. `should ignore updateQuantity when target product not found in cart`: Không ảnh hưởng khi cập nhật sản phẩm không có trong giỏ.
  11. `should clear all items in cart`: Xóa sạch giỏ hàng với `clearCart`.
  12. `should toggle cart isOpen state`: Bật/tắt trạng thái mở giỏ hàng với `toggleCart`.
  13. `should set cart isOpen explicitly with setCartOpen`: Thiết lập trực tiếp trạng thái mở/đóng giỏ hàng.
- **Kiểm thử Pure Selectors:**
  14. `selectCartItems`: Lấy danh sách item trong giỏ.
  15. `selectIsCartOpen`: Lấy trạng thái đóng/mở drawer.
  16. `selectCartTotalQuantity`: Tính tổng số lượng hàng trong giỏ.
  17. `selectCartTotalPrice`: Tính tổng giá trị giỏ hàng chính xác.
  18. `selectItemQuantityInCart`: Lấy số lượng của từng mã sản phẩm cụ thể.

### B. Unit & Async Thunk Tests: `productsSlice.test.ts` (12 Test Cases)
- **Kiểm thử Reducers:**
  19. `should return initial state when passed an empty action`: State khởi tạo ban đầu.
  20. `should set selected category`: Cập nhật danh mục được chọn.
  21. `should set search keyword`: Cập nhật từ khóa tìm kiếm.
- **Kiểm thử Bất đồng bộ với Mock API (createAsyncThunk):**
  22. `should handle fetchProducts.pending state`: Xử lý trạng thái loading khi bắt đầu gọi API.
  23. `should fetch products successfully and handle fetchProducts.fulfilled`: Mock API trả về danh sách sản phẩm thành công, cập nhật `items` và `status = 'succeeded'`.
  24. `should handle fetchProducts.rejected when API throws an Error`: Mock API ném lỗi `Error`, cập nhật `error` và `status = 'failed'`.
  25. `should handle fetchProducts.rejected with fallback message for non-Error rejection`: Xử lý thông báo lỗi dự phòng khi rejected không phải instance của Error.
  26. `should fallback error message in reducer when payload is absent`: Xử lý fallback message từ `action.error.message`.
- **Kiểm thử Selectors:**
  27. `basic selectors retrieve correct slice states`: Truy xuất items, status, error, category, searchKeyword.
  28. `selectFilteredProducts filters by category`: Lọc sản phẩm theo danh mục chính xác.
  29. `selectFilteredProducts filters by search keyword`: Tìm kiếm không phân biệt hoa thường theo tên và mô tả.
  30. `selectFilteredProducts returns empty array when no products match filter`: Trả về rỗng khi không có sản phẩm khớp điều kiện.

### C. Unit Test API: `mockProductsApi.test.ts` (1 Test Case)
  31. `should return list of initial products after simulated network delay`: Kiểm tra hàm gọi API giả lập với fake timers.

### D. Integration Tests: `ProductCard.test.tsx` (5 Test Cases)
  32. `renders product information correctly`: Render đúng tên, giá, phân loại, tồn kho, đánh giá sao, mô tả.
  33. `dispatches addToCart when clicking add to cart button`: Người dùng bấm thêm giỏ hàng -> dispatch action và cập nhật store Redux.
  34. `renders out-of-stock state when stock is 0`: Hiển thị "Hết hàng" và disable nút khi sản phẩm hết hàng.
  35. `renders in-cart indicator and allows adding more when below stock`: Hiển thị badge "Đã có X" và nút "+ Thêm tiếp" khi đã có trong giỏ.
  36. `disables button when item quantity in cart reaches stock limit`: Vô hiệu hóa nút và hiện "Đã đạt tối đa kho (X)" khi đã thêm đủ số lượng tồn kho.

### E. Integration Tests: `CartDrawer.test.tsx` (11 Test Cases)
  37. `does not render anything when cart isOpen is false`: Drawer ẩn hoàn toàn khỏi DOM khi `isOpen = false`.
  38. `renders empty cart state when cart is open without items`: Hiển thị giao diện "Giỏ hàng đang trống" khi chưa có sản phẩm.
  39. `renders cart items and totals summary when cart is open with items`: Hiển thị đầy đủ danh sách, ảnh emoji, đơn giá, tạm tính, phí vận chuyển và tổng tiền.
  40. `increments item quantity when clicking "+" button`: Người dùng bấm nút "+" -> tăng số lượng trong Redux store.
  41. `disables "+" button when item quantity in cart equals stock limit`: Nút "+" bị disable khi số lượng đạt tối đa kho.
  42. `decrements item quantity when clicking "-" button`: Người dùng bấm nút "-" -> giảm số lượng trong Redux store.
  43. `removes item from cart when clicking remove button`: Bấm icon thùng rác -> xóa sản phẩm khỏi giỏ hàng.
  44. `clears entire cart when clicking "Xoá giỏ hàng" button`: Bấm "Xoá giỏ hàng" -> làm trống toàn bộ giỏ.
  45. `closes cart when clicking close button "✕"`: Bấm nút "✕" -> đóng giỏ hàng.
  46. `handles checkout flow and clears cart after successful checkout`: Bấm "Thanh toán ngay" -> hiện màn hình thành công "🎉 Đặt Hàng Thành Công!" và sau 2s giỏ hàng tự động làm mới, đóng drawer.
  47. `closes cart when clicking overlay backdrop and prevents bubbling on modal body`: Đóng drawer khi click ra backdrop ngoài và không bị đóng khi click bên trong modal panel.

---

## 4. CÁCH CHẠY VÀ CHỤP ẢNH BÁO CÁO

Để chụp ảnh nộp bài cho Giảng viên:
1. Mở terminal tại thư mục `react`:
   ```bash
   cd react
   npm run test:coverage
   ```
2. Terminal sẽ hiển thị bảng thống kê màu xanh lá cây với **47/47 test pass** và **Coverage đạt 99.25%**.
3. Chụp toàn màn hình terminal chứa bảng kết quả này để nộp bài.
