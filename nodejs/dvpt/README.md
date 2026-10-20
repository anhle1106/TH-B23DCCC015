# Lab 3: Kết Nối Nội Dung - Thanh Toán Học Phí Trực Tuyến
> Học phần: **Phát triển phần mềm hướng dịch vụ (INT1448) - PTIT**

## 1. Cấu trúc thư mục `nodejs/dvpt`
```
nodejs/dvpt/
├── fee-service.js       # Fee Service (cổng 4001, quản lý công nợ, retry, keep-alive)
├── bank-service.js      # Ngân hàng giả lập (cổng 4002, idempotency, DELAY, DROP, FAIL)
├── package.json         # Scripts chạy test và cấu hình dự án
├── BAOCAO_LAB3.md       # Báo cáo số liệu trước & sau khi tối ưu cho 4 tình huống
└── scripts/
    ├── test-th1.js      # Tự động test Tình huống 1
    ├── test-th2.js      # Tự động test Tình huống 2
    ├── test-th3.js      # Tự động test Tình huống 3
    ├── test-th4.js      # Tự động test Tình huống 4
    └── run-all.js       # Chạy liên tiếp 4 tình huống và tổng kết kết quả
```

## 2. Cách chạy kiểm thử
Tại thư mục `nodejs/dvpt`:
```bash
npm install
npm run test:all
```
