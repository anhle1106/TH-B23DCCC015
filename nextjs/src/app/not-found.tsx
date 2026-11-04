import Link from 'next/link';
import { FileQuestion, ArrowLeft, Home, CalendarClock } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
          <FileQuestion className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full">
          Mã Lỗi: 404 Not Found
        </span>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-3 mb-2">
          Không Tìm Thấy Trang / Deadline
        </h1>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Đường dẫn bạn yêu cầu hoặc mã định danh deadline không tồn tại trên hệ thống, hoặc đã
          bị lớp trưởng xoá bỏ.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/deadlines"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-sm transition-all inline-flex items-center justify-center gap-2"
          >
            <CalendarClock className="w-4 h-4" />
            Xem Toàn Bộ Deadline
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-500" />
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

