import { ImageResponse } from 'next/og';

export const alt = 'Mini Library - Thư Viện Sách Khoa CNTT';
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
          padding: '60px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0369a1 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            📚
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Mini Library
            </span>
            <span style={{ fontSize: '18px', color: '#93c5fd' }}>
              Khoa Công Nghệ Thông Tin - PTIT
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              padding: '8px 16px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.15)',
              fontSize: '18px',
              fontWeight: '600',
              color: '#67e8f9',
              alignSelf: 'flex-start',
            }}
          >
            Hệ Thống Quản Lý & Tra Cứu Trực Tuyến
          </div>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: '900',
              lineHeight: 1.15,
              margin: 0,
              maxWidth: '900px',
            }}
          >
            Tra Cứu & Mượn Sách Giáo Trình Chuyên Ngành
          </h1>
          <p style={{ fontSize: '22px', color: '#cbd5e1', margin: 0, maxWidth: '800px' }}>
            Hàng trăm tài liệu CNTT, Kinh tế số, Ngoại ngữ cập nhật mới nhất cho sinh viên và giảng viên.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '32px' }}>
            <span style={{ fontSize: '18px', color: '#e2e8f0' }}>⚡ Sẵn sàng mượn ngay</span>
            <span style={{ fontSize: '18px', color: '#e2e8f0' }}>🔒 Phân quyền NextAuth</span>
            <span style={{ fontSize: '18px', color: '#e2e8f0' }}>🌐 Chuẩn SEO & OpenGraph</span>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#60a5fa' }}>
            library.edu.vn
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
