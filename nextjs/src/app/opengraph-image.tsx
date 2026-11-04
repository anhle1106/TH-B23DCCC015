import { ImageResponse } from 'next/og';

export const alt = 'Class Deadline Hub - Cổng Thông Tin & Quản Lý Deadline Lớp Học PTIT';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #881337 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#ffffff',
              }}
            >
              PT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Class Deadline Hub
              </span>
              <span style={{ fontSize: '15px', color: '#cbd5e1' }}>
                Học Viện Công Nghệ Bưu Chính Viễn Thông (PTIT)
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '8px 18px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '14px',
              fontWeight: '700',
              color: '#fca5a5',
            }}
          >
            Học Kỳ 2026 - Khoa CNTT
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '52px',
              fontWeight: '900',
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              color: '#ffffff',
            }}
          >
            <span>Cổng Thông Tin & Theo Dõi</span>
            <span>Hạn Nộp Bài Tập Lớp Học</span>
          </div>
          <div style={{ display: 'flex', fontSize: '22px', color: '#e2e8f0', maxWidth: '900px' }}>
            Tra cứu công khai deadline, hỗ trợ sinh viên đánh dấu đã xong và quản trị hạn chót tập trung.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '20px',
            fontSize: '16px',
            color: '#94a3b8',
          }}
        >
          <div style={{ display: 'flex' }}>Next.js 16 • Hybrid SSG & ISR • NextAuth v5 RBAC</div>
          <div style={{ display: 'flex', color: '#10b981', fontWeight: '700' }}>4 Môn Học • 12 Deadlines</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
