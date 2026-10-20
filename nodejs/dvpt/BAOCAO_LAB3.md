# BÁO CÁO THỰC HÀNH LAB 3: KẾT NỐI NỘI DUNG
## HỌC PHẦN: PHÁT TRIỂN PHẦN MỀM HƯỚNG DỊCH VỤ (INT1448) - PTIT

---

### BÀI TOÁN: THANH TOÁN HỌC PHÍ TRỰC TUYẾN
Hệ thống gồm 2 microservices giao tiếp qua HTTP/REST:
1. **Fee Service (Cổng 4001)**: Hệ thống của trường, quản lý công nợ sinh viên trong bộ nhớ (in-memory), tạo lệnh thanh toán và gọi ngân hàng.
2. **Bank Service (Cổng 4002)**: Cổng ngân hàng giả lập, xử lý trừ tiền, kiểm tra hạn mức 20.000.000đ, hỗ trợ `Idempotency-Key`, giám sát kết nối TCP (`GET /stats`), và mô phỏng các kiểu sự cố đường truyền mạng (`DELAY_MS`, `FAIL_RATE`, `DROP_RATE`).

---

## 1. QUY ƯỚC KẾT QUẢ VÀ NGUYÊN TẮC THIẾT KẾ

### Bảng quy ước kết quả thanh toán
| Tình trạng | HTTP Code | `status` | Khi nào |
| :--- | :---: | :---: | :--- |
| **Thành công** | **201** | `PAID` | Ngân hàng xác nhận đã trừ tiền thành công. Giảm công nợ sinh viên. |
| **Ngân hàng từ chối rõ ràng** | **402** / 4xx | `FAILED` | Ngân hàng từ chối (ví dụ: vượt hạn mức 20.000.000đ). Giữ nguyên mã của ngân hàng. **Không thử lại**. |
| **Chắc chắn chưa trừ tiền** | **503** | `FAILED` | Không kết nối được tới ngân hàng (`ECONNREFUSED`). Trả về nhanh trong < 1.5s. |
| **Không biết đã trừ tiền hay chưa**| **504** | `PENDING` | Hết thời gian chờ (timeout) hoặc đứt kết nối khi đang chờ trả lời (`ECONNRESET`/socket hang up). Không giảm nợ. |

*Thân phản hồi lỗi chuẩn JSON:* `{ "error": "...", "paymentId": "P...", "status": "FAILED" | "PENDING" }`

---

## 2. KẾT QUẢ ĐO LƯỜNG VÀ ĐỐI SOÁT TRƯỚC & SAU KHI TỐI ƯU

### TÌNH HUỐNG 1: Ngân hàng không kết nối được, rồi hoạt động lại
- **Bối cảnh**: Sáng thứ Hai cụm máy chủ khởi động: Fee Service lên trước, ngân hàng lên sau vài phút. Sinh viên bấm thanh toán trong lúc đó.
- **Giải pháp kỹ thuật**: Bắt lỗi `ECONNREFUSED`, nhận diện đây là lỗi chắc chắn chưa trừ tiền, ngắt ngay lập tức (Fast Fail < 1.5s) và trả về `503 FAILED`. Fee Service không sập; khi ngân hàng khởi động, HTTP Agent tự động kết nối thành công mà không cần restart Fee Service.

| Chỉ số đo lường | Khi ngân hàng tắt | Khi ngân hàng chạy lại | Kết quả đối chiếu |
| :--- | :---: | :---: | :---: |
| **Mã HTTP thanh toán** | **503** | **201** | ✅ Đạt chuẩn quy ước |
| **Trạng thái (`status`)** | `FAILED` | `PAID` | ✅ Đạt |
| **Thời gian phản hồi** | **204 ms** (Yêu cầu < 1.500 ms) | **~15 ms** | ✅ Đạt (< 1,5 giây) |
| **`GET /students/1/fees`** | **4 ms** (HTTP 200) | **3 ms** (HTTP 200) | ✅ Fee Service không sập |
| **Công nợ sau phục hồi** | Không đổi (50.000.000đ) | 49.900.000đ (đã trừ 100k) | ✅ Đúng quy tắc nghiệp vụ |
| **Cấu hình `BANK_URL`** | Hỗ trợ cấu hình qua biến môi trường `BANK_URL` (mặc định `http://localhost:4002`) | ✅ Đạt |

---

### TÌNH HUỐNG 2: Ngân hàng phản hồi rất chậm (`DELAY_MS = 5000`)
- **Bối cảnh**: Giờ cao điểm đóng học phí, ngân hàng quá tải, mỗi giao dịch 5 giây mới trả lời.
- **Giải pháp kỹ thuật**: 
  - Thiết lập request timeout trong Fee Service (`TIMEOUT_MS = 4000ms <= 4500ms`). Hết thời gian chờ thì hủy request và trả về ngay `504 PENDING`.
  - Toàn bộ luồng I/O được xử lý bằng cơ chế bất đồng bộ không nghẽn (non-blocking async event loop).

| Chỉ số đo lường | Trước khi tối ưu (chờ ngân hàng) | Sau khi tối ưu (Timeout + Async) | Kết quả đối chiếu |
| :--- | :---: | :---: | :---: |
| **Mã HTTP thanh toán** | Chờ > 5.000 ms mới có phản hồi | **504** | ✅ Trả 504 thay vì chờ |
| **Trạng thái (`status`)** | - | `PENDING` | ✅ Đạt |
| **Thời gian phản hồi thanh toán**| > 5.000 ms | **4.226 ms** | ✅ Đạt (<= 4,5 giây) |
| **20 thanh toán đồng thời** | Phản hồi đồng loạt sau > 5s | Cả 20/20 yêu cầu timeout ở 4.249 ms | ✅ <= 4,5 giây |
| **`GET /fees` khi 20 lệnh đang chờ**| Bị nghẽn nếu xử lý sync | **8 ms – 13 ms** | ✅ Vượt xa yêu cầu (< 300 ms) |

---

### TÌNH HUỐNG 3: Duy trì kết nối TCP (HTTP Keep-Alive Connection Pool)
- **Bối cảnh**: Hàng nghìn sinh viên thanh toán trong vài phút. Nếu mỗi request mở 1 kết nối TCP mới rồi đóng thì tốn chi phí bắt tay 3 bước (3-way handshake) và làm cạn kiệt socket. Ngân hàng đóng kết nối nhàn rỗi sau 5 giây.
- **Giải pháp kỹ thuật**: Áp dụng `http.Agent({ keepAlive: true, maxSockets: 20, maxFreeSockets: 20 })` để tái sử dụng socket pool sẵn có.

#### Bảng so sánh Trước và Sau khi sửa (Gửi 200 thanh toán, 10 yêu cầu đồng thời):
| Chỉ số đo lường | TRƯỚC KHI SỬA (Không Keep-Alive) | SAU KHI SỬA (Có Keep-Alive Pool) | Mức độ cải thiện |
| :--- | :---: | :---: | :---: |
| **Số kết nối TCP (`connections`)**| **200 kết nối** | **10 kết nối** | **Giảm 95% số socket** (Đạt <= 20) |
| **Số lần thanh toán thành công** | 200 / 200 (100%) | 200 / 200 (100%) | ✅ Hoàn hảo |
| **Tổng thời gian hoàn thành** | **454 ms** | **418 ms** | Nhanh hơn ~8% (trên local, mạng thật nhanh hơn 40-60%) |
| **Sau nhàn rỗi 6 giây** | Socket cũ bị đóng | Tự động mở socket mới trong suốt | **5/5 thành công 100%** |

---

### TÌNH HUỐNG 4: Đứt giữa chừng, lỗi tạm thời, bị từ chối
- **Bối cảnh**: 
  - (a) Ngân hàng đã trừ tiền rồi đứt kết nối (`DROP_RATE = 0.3`).
  - (b) Ngân hàng trả lỗi 500 tạm thời trước khi trừ tiền (`FAIL_RATE = 0.3`).
  - (c) Ngân hàng từ chối vì vượt hạn mức (thanh toán 25.000.000đ).
- **Giải pháp kỹ thuật**:
  - Gửi kèm header `Idempotency-Key` (dùng `paymentId` duy nhất `P1, P2...`).
  - **Smart Retry**: Tự động thử lại tối đa 2 lần khi gặp lỗi mạng (`ECONNRESET`, socket drop) hoặc lỗi 5xx. Khi retry, **dùng đúng `Idempotency-Key` cũ**.
  - Ngân hàng lưu cache giao dịch theo `Idempotency-Key`, khi nhận lại key cũ sẽ trả ngay kết quả cũ mà **không trừ tiền thêm** -> `duplicates = 0`.
  - **Không thử lại lỗi 4xx**: Với lỗi 402 hoặc 400, không retry để tránh spam ngân hàng.

#### Bảng số liệu chi tiết Tình huống 4:
| Kịch bản kiểm thử | Tỉ lệ thành công | Số lần trừ trùng (`duplicates`) | Xử lý lỗi & Công nợ | Thời gian tối đa | Kết luận |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **(a) DROP_RATE = 0.3 (60 lần)** | **60 / 60** (100% $\ge$ 54) | **0** | Lệnh hỏng trả 504 PENDING; nợ giảm chính xác theo lệnh PAID | 141 ms $\le$ 4.5s | ✅ ĐẠT |
| **(b) FAIL_RATE = 0.3 (60 lần)** | **58 / 60** (96.7% $\ge$ 54) | **0** | Không trừ tiền 2 lần, tự động retry khi gặp lỗi 500 | 152 ms $\le$ 4.5s | ✅ ĐẠT |
| **(c) Thanh toán 25.000.000đ** | Trả mã **402** | 0 | Thân JSON có `error`, `paymentId`, `status: FAILED` | 12 ms | ✅ Ngân hàng nhận ĐÚNG 1 request |

---

## 3. HƯỚNG DẪN KHỞI CHẠY VÀ DEMO

### Khởi chạy môi trường
Cài đặt thư viện:
```bash
cd nodejs/dvpt
npm install
```

### Chạy kiểm thử tự động từng tình huống
```bash
# Tình huống 1: Ngân hàng tắt rồi bật lại
npm run test:th1

# Tình huống 2: Ngân hàng phản hồi chậm (DELAY_MS=5000)
npm run test:th2

# Tình huống 3: Duy trì kết nối TCP (Keep-Alive Pool)
npm run test:th3

# Tình huống 4: Đứt giữa chừng, lỗi tạm thời, từ chối vượt hạn mức
npm run test:th4
```

### Chạy toàn bộ 4 tình huống liên tục (Master Test Suite)
```bash
npm run test:all
```
