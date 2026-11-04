import Link from 'next/link';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '403 - Từ Chối Quyền Truy Cập',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-8 text-center shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <ShieldX className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
          Mã Lỗi: 403 Forbidden
        </span>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-3 mb-2">
          Không Đủ Quyền Truy Cập!
        </h1>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Khu vực quản trị <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono">/admin</code> chỉ dành riêng cho tài khoản có vai trò <strong>Lớp Trưởng (admin)</strong>. Tài khoản sinh viên hiện tại của bạn không có thẩm quyền này.
        </p>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left mb-6 space-y-1">
          <p className="font-semibold text-slate-700">Tài khoản quản trị thử nghiệm:</p>
          <p>Email: <span className="font-mono text-purple-700">admin@ptit.edu.vn</span></p>
          <p>Mật khẩu: <span className="font-mono text-purple-700">admin123</span></p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-sm transition-all text-center"
          >
            Về Dashboard Của Bạn
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors text-center inline-flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4 text-slate-500" />
            Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

