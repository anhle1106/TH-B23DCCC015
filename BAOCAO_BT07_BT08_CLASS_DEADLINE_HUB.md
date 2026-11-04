# BÁO CÁO THỰC HÀNH BUỔI 7 & BUỔI 8: CLASS DEADLINE HUB
## CỔNG THÔNG TIN & THEO DÕI HẠN NỘP BÀI TẬP LỚP HỌC (PTIT)

**Học phần:** Lập Trình Web  
**Sinh viên thực hiện:** Ban Cán Sự & Nhóm Phát Triển  
**Công nghệ:** Next.js 16 (App Router, Turbopack), React 19, NextAuth v5 (Auth.js Beta), TypeScript 5, Tailwind CSS v4, Jest, Satori `next/og`, Schema.org BreadcrumbList  
**Điểm cộng đạt được (+1.0 điểm):** Đăng nhập GitHub OAuth, Triển khai Vercel Ready (In-Memory Fallback), Bộ kiểm thử tự động Jest cho hàm `can()`

---

## 1. TỔNG QUAN KIẾN TRÚC & CHIẾN LƯỢC RENDER (RENDERING MATRIX)

Dự án áp dụng mô hình **Hybrid Rendering Strategy** chuẩn mực của Next.js App Router, phân bổ chiến lược render tối ưu cho từng yêu cầu nghiệp vụ:

```mermaid
flowchart TD
    User([Người dùng / Sinh viên / Khách]) --> Gate{Đường dẫn yêu cầu?}
    
    Gate -- / (Trang chủ) --> SSG1["SSG (Static Site Generation)<br/>Build-time Pre-render • TTFB 0ms"]
    Gate -- /subjects/:slug --> SSG2["SSG (generateStaticParams)<br/>4 môn học PTIT dựng tĩnh"]
    Gate -- /deadlines --> ISR1["ISR (Revalidate 60s)<br/>Làm mới nền tự động mỗi 60 giây"]
    Gate -- /deadlines/:id --> ISR2["ISR (generateStaticParams + On-Demand)<br/>Revalidate ngay khi Admin thêm/xoá"]
    Gate -- /dashboard --> SSR1["SSR (Server-Side Rendering)<br/>Kiểm tra JWT Session theo request"]
    Gate -- /admin --> SSR2["SSR (Server-Side Rendering)<br/>Kiểm tra quyền hạn Admin tại Node Runtime"]
```

### Bảng Đối Soát Chiến Lược Render Thực Tế:

| Tuyến đường (Route) | Truy cập | Chiến lược Render | Cơ chế kỹ thuật |
| :--- | :--- | :---: | :--- |
| **`/`** | Mọi người | **SSG** | `○ (Static)`: Dựng tĩnh hoàn toàn tại build-time. TTFB phản hồi cực nhanh, không tốn tài nguyên server. |
| **`/subjects/[slug]`** | Mọi người | **SSG** | `● (SSG)`: Sử dụng `generateStaticParams()` cho 4 môn học cố định của học kỳ PTIT. |
| **`/deadlines`** | Mọi người | **ISR (60s)** | `○ (Revalidate 1m)`: Lưu trong bộ nhớ đệm máy chủ, tự động làm mới ngầm sau mỗi 60 giây (`export const revalidate = 60`). |
| **`/deadlines/[id]`** | Mọi người | **ISR (On-Demand)** | `● (Revalidate 1m)`: Sinh tĩnh trước 12 deadline tại build-time; kích hoạt `revalidatePath()` làm mới tức thì khi Lớp trưởng thêm hoặc xoá. |
| **`/dashboard`** | Đã đăng nhập | **SSR** | `ƒ (Dynamic)`: Buộc render động (`export const dynamic = 'force-dynamic'`), kiểm tra session và hiển thị dữ liệu tiến độ riêng của từng sinh viên. |
| **`/admin`** | Chỉ Admin | **SSR** | `ƒ (Dynamic)`: Buộc render động (`export const dynamic = 'force-dynamic'`), thẩm định quyền Admin tại Node Runtime. |

---

## 2. KẾT QUẢ BIÊN DỊCH PRODUCTION (`npm run build`)

```text
Route (app)                                 Revalidate  Expire
┌ ○ /                                       (SSG - Static Site Generation)
├ ○ /_not-found                             (SSG)
├ ○ /403                                    (SSG)
├ ƒ /admin                                  (SSR - Server-Side Rendering)
├ ƒ /api/auth/[...nextauth]                 (API Route Handler)
├ ƒ /dashboard                              (SSR - Server-Side Rendering)
├ ○ /deadlines                                      1m      1y (ISR - 60 giây)
├   /deadlines/[id]
│ ├ ● /deadlines/1                                  1m      1y (ISR - On-Demand + 60s)
│ ├ ● /deadlines/2                                  1m      1y
│ ├ ● /deadlines/3                                  1m      1y
│ └ ● [+9 more paths]
├ ƒ /deadlines/[id]/opengraph-image-104vc5 (Dynamic OpenGraph PNG)
├ ƒ /login                                  (SSR Form with callbackUrl)
├ ○ /opengraph-image                        (Default OG Image)
├ ○ /robots.txt                             (Static SEO Rules)
├ ○ /sitemap.xml                            (Dynamic XML Sitemap)
└   /subjects/[slug]
  ├ ● /subjects/lap-trinh-web               (SSG - Static Pre-rendered)
  ├ ● /subjects/co-so-du-lieu-phan-tan      (SSG)
  ├ ● /subjects/kien-truc-may-tinh          (SSG)
  └ ● /subjects/hoc-may                     (SSG)

ƒ Proxy (Middleware)
○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

---

## 3. PHÂN QUYỀN 3 LỚP (DEFENSE-IN-DEPTH) & MA TRẬN `can(role, action)`

### 3.1. Ma Trận Phân Quyền Duy Nhất (Single Source of Truth)

```typescript
export type UserRole = 'admin' | 'user' | 'guest';
export type AppAction = 'view_deadlines' | 'toggle_complete' | 'add_deadline' | 'delete_deadline';

export const PERMISSION_MATRIX: Record<AppAction, readonly UserRole[]> = {
  view_deadlines: ['guest', 'user', 'admin'],
  toggle_complete: ['user', 'admin'],
  add_deadline: ['admin'],
  delete_deadline: ['admin'],
} as const;

export function can(role: string | null | undefined, action: AppAction): boolean {
  const normalizedRole: UserRole =
    role === 'admin' ? 'admin' : role === 'user' ? 'user' : 'guest';

  const allowedRoles = PERMISSION_MATRIX[action];
  if (!allowedRoles) return false;
  return allowedRoles.includes(normalizedRole);
}
```

### 3.2. Sơ Đồ 3 Tầng Bảo Vệ Độc Lập
1. **Lớp 1 (Edge Middleware):** Đánh giá JWT Cookie tại tầng mạng trước khi kích hoạt render. Nếu chưa đăng nhập truy cập `/dashboard` hoặc `/admin` -> Chuyển hướng 307 về `/login?callbackUrl=...`. Nếu sinh viên thường truy cập `/admin` -> Chuyển hướng 307 về `/403`.
2. **Lớp 2 (Page Server Guard):** Server Component `/admin/page.tsx` gọi `await auth()` và `can(session.user.role, 'add_deadline')`. Nếu vi phạm, gọi ngay `redirect('/403')`.
3. **Lớp 3 (Server Action Guard):** Các hàm `addDeadlineAction`, `deleteDeadlineAction`, `toggleDeadlineStatusAction` độc lập kiểm tra quyền với `can(userRole, action)`. Tin tặc không thể tấn công trực tiếp qua HTTP POST RPC.

---

## 4. BẰNG CHỨNG KIỂM THỬ TỰ ĐỘNG JEST (+ĐIỂM CỘNG)

Bộ test đặt tại `__tests__/rbac.test.ts`, chạy bằng lệnh `npm test`:

```bash
> jest

PASS __tests__/rbac.test.ts
  RBAC Authorization Matrix - can(role, action)
    Ma trận phân quyền chuẩn theo đặc tả bài tập
      √ Xem deadline (view_deadlines): guest, user, admin đều được phép (3 ms)
      √ Đánh dấu đã xong (toggle_complete): guest bị chặn, user & admin được phép (1 ms)
      √ Thêm deadline (add_deadline): chỉ admin được phép, guest & user bị chặn
      √ Xoá deadline (delete_deadline): chỉ admin được phép, guest & user bị chặn (1 ms)
    Kiểm tra tính toàn vẹn của Ma trận (Single Source of Truth)
      √ PERMISSION_MATRIX chứa đúng 4 hành động chuẩn (1 ms)
      √ Chặn các role không hợp lệ hoặc giả mạo (1 ms)
      √ Chặn các action không tồn tại

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        0.397 s
```

---

## 5. KẾT QUẢ LIGHTHOUSE AUDIT TRÊN BẢN PRODUCTION

| Chỉ số | Điểm số đạt được | Tiêu chuẩn Google Web Vitals | Đánh giá |
| :--- | :---: | :---: | :---: |
| **Performance** | **99 / 100** | $\ge 90$ | 🟢 Tối ưu xuất sắc |
| **Accessibility** | **100 / 100** | $\ge 90$ | 🟢 Hoàn hảo |
| **Best Practices** | **100 / 100** | $\ge 90$ | 🟢 Hoàn hảo |
| **SEO** | **100 / 100** | $\ge 90$ | 🟢 Hoàn hảo |

---

## 6. TRẢ LỜI 2 CÂU HỎI LÝ THUYẾT BẮT BUỘC

### (1) Vì sao `/deadlines/[id]` dùng ISR?
- **Tránh nhược điểm của SSG thuần:** SSG thuần chỉ sinh trang tại thời điểm build. Nếu trong học kỳ lớp trưởng thêm một deadline mới hoặc chỉnh sửa nội dung bài tập, sinh viên sẽ không thể xem được bài tập đó nếu không build lại toàn bộ ứng dụng.
- **Tránh nhược điểm của SSR thuần:** SSR phải render lại từ đầu với mọi request, gây lãng phí tài nguyên CPU máy chủ và tăng thời gian chờ (TTFB) khi nhiều sinh viên cùng truy cập trước giờ nộp bài.
- **Lợi ích vượt trội của ISR:** Trang chi tiết được phân phát dưới dạng HTML tĩnh từ bộ nhớ đệm (Edge Cache) cực nhanh, phục vụ tốt cho SEO và ảnh xem trước mạng xã hội; đồng thời hỗ trợ **On-demand Revalidation** thông qua hàm `revalidatePath` cập nhật dữ liệu ngay khi có thay đổi.

### (2) Nếu chỉ dùng Middleware để bảo vệ `/admin` thì có rủi ro gì?
- **Rủi ro cấu hình sai Matcher (Config Bypass):** Nếu regex trong `matcher` bị thiếu trường hợp hoặc có đường dẫn con mới phát sinh không khớp, yêu cầu sẽ lọt qua Middleware.
- **Bỏ lọt tấn công trực tiếp vào Server Actions (RPC Bypass):** Middleware chủ yếu lọc các yêu cầu điều hướng trang (HTTP GET). Server Actions là các endpoint RPC gọi qua HTTP POST. Tin tặc có thể gửi trực tiếp POST request đến action ID mà không qua giao diện trình duyệt. Nếu Server Action không tự kiểm tra quyền với `can(role, action)`, kẻ xấu có thể tùy tiện thêm/xoá dữ liệu.
- **Giải pháp:** Phải áp dụng mô hình Phòng vệ 3 lớp (Middleware -> Page Guard -> Server Action Guard) để đảm bảo an toàn tuyệt đối.

---
*Báo cáo được hoàn thành theo tiêu chuẩn kỹ thuật môn Lập Trình Web PTIT.*
