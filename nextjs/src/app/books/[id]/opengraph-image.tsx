import { ImageResponse } from 'next/og';
import { getBookById } from '@/lib/books-data';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBookById(id);

  const title = book?.title || 'Chi Tiết Sách';
  const author = book?.author || 'Tác giả Thư viện';
  const category = book?.category || 'CNTT';
  const isbn = book?.isbn || 'Đang cập nhật';
  const available = book ? book.availableCopies > 0 : false;

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
          background: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 60%, #0c4a6e 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              📖
            </div>
            <span style={{ fontSize: '24px', fontWeight: '800' }}>Mini Library Khoa CNTT</span>
          </div>

          <div
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              background: available ? '#059669' : '#dc2626',
              fontSize: '18px',
              fontWeight: '700',
            }}
          >
            {available ? `Còn ${book?.availableCopies} cuốn sẵn sàng` : 'Tạm hết sách'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              fontSize: '16px',
              fontWeight: '600',
              color: '#38bdf8',
              alignSelf: 'flex-start',
            }}
          >
            {category} • ISBN: {isbn}
          </div>

          <h1
            style={{
              fontSize: '52px',
              fontWeight: '900',
              lineHeight: 1.2,
              margin: 0,
              maxWidth: '1000px',
            }}
          >
            {title}
          </h1>

          <div style={{ fontSize: '24px', color: '#cbd5e1' }}>
            Tác giả: <span style={{ color: '#ffffff', fontWeight: '700' }}>{author}</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '20px',
            fontSize: '18px',
            color: '#94a3b8',
          }}
        >
          <span>Tra cứu và mượn sách trực tuyến tại Khoa CNTT</span>
          <span style={{ color: '#60a5fa', fontWeight: '700' }}>library.edu.vn</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
