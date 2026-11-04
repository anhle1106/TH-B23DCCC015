import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'Class Deadline Hub - Cổng Thông Tin & Quản Lý Deadline Lớp Học PTIT',
    template: '%s | Class Deadline Hub',
  },
  description: 'Hệ thống tra cứu, theo dõi và quản trị hạn nộp bài tập, đồ án dành cho sinh viên và ban cán sự lớp Học viện Công nghệ Bưu chính Viễn thông.',
  keywords: ['deadline', 'lớp học', 'PTIT', 'sinh viên', 'nộp bài tập', 'đồ án', 'Next.js 16', 'ISR', 'NextAuth'],
  authors: [{ name: 'Ban Cán Sự Lớp PTIT' }],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'http://localhost:3000',
    siteName: 'Class Deadline Hub',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
