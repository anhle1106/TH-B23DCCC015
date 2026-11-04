import Link from 'next/link';
import { CalendarClock, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                <CalendarClock className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900">
                Class Deadline Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Cổng thông tin quản lý hạn nộp bài tập & đồ án học kỳ. Xây dựng bằng Next.js 16
              App Router, áp dụng chiến lược kết hợp SSG, ISR 60s, SSR, NextAuth v5 và phân quyền RBAC 3 lớp.
            </p>
            <p className="text-xs text-slate-400">
              Học viện Công nghệ Bưu chính Viễn thông (PTIT) • Khoa Công nghệ Thông tin
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Chiến Lược Render
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/" className="hover:text-red-600 transition-colors">
                  Trang chủ (SSG)
                </Link>
              </li>
              <li>
                <Link href="/deadlines" className="hover:text-red-600 transition-colors">
                  Deadlines (ISR 60s)
                </Link>
              </li>
              <li>
                <Link href="/subjects/lap-trinh-web" className="hover:text-red-600 transition-colors">
                  Môn học (SSG)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-red-600 transition-colors">
                  Dashboard (SSR)
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Accounts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Tài Khoản Demo Bắt Buộc
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-semibold text-slate-800">Admin (Lớp trưởng):</p>
                <code className="text-[11px] text-purple-700">admin@ptit.edu.vn / admin123</code>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-semibold text-slate-800">User (Sinh viên):</p>
                <code className="text-[11px] text-blue-700">sv@ptit.edu.vn / sv123456</code>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 PTIT Class Deadline Hub. Bài tập Buổi 7 & Buổi 8.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> RBAC 3-Layer Protected
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
