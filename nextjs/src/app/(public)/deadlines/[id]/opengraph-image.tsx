import { ImageResponse } from 'next/og';
import { getDeadlineById } from '@/lib/deadlines';

export const runtime = 'nodejs';
export const alt = 'Class Deadline Hub - Chi Tiết Hạn Nộp';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  const title = deadline?.title || 'Thông Tin Deadline Lớp Học';
  const subjectName = deadline?.subjectName || 'Học Phần PTIT';
  const priority = deadline?.priority || 'medium';
  const dueDate = deadline?.dueDate
    ? new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Chưa cập nhật';

  const priorityColor =
    priority === 'high' ? '#e11d48' : priority === 'medium' ? '#d97706' : '#2563eb';
  const priorityText =
    priority === 'high' ? 'Khẩn Cấp (High)' : priority === 'medium' ? 'Trung Bình' : 'Bình Thường';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0f172a',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220,38,38,0.25) 0%, rgba(15,23,42,0) 70%)',
          }}
        />

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#ffffff',
                boxShadow: '0 4px 20px rgba(220,38,38,0.5)',
              }}
            >
              PT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                Class Deadline Hub
              </span>
              <span style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Học Viện Công Nghệ Bưu Chính Viễn Thông
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.08)',
              padding: '10px 20px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '16px',
              fontWeight: 700,
              color: priorityColor,
            }}
          >
            ● {priorityText}
          </div>
        </div>

        {/* Center Content: Title & Subject */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              MÔN HỌC
            </span>
            <span style={{ fontSize: '24px', fontWeight: 600, color: '#e2e8f0' }}>
              {subjectName}
            </span>
          </div>

          <div
            style={{
              fontSize: '48px',
              fontWeight: 900,
              lineHeight: 1.2,
              letterSpacing: '-1px',
              color: '#ffffff',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom Bar: Due Date & Strategy */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px', color: '#94a3b8' }}>Hạn chót:</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc' }}>
              {dueDate}
            </span>
          </div>

          <div
            style={{
              fontSize: '14px',
              color: '#10b981',
              backgroundColor: 'rgba(16,185,129,0.1)',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(16,185,129,0.3)',
              fontWeight: 700,
            }}
          >
            ✓ ISR Cache 60s & On-Demand Revalidated
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
