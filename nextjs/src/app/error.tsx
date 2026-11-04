'use client';

import { useEffect } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">
          Đã Có Lỗi Xảy Ra!
        </h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Hệ thống gặp sự cố trong quá trình xử lý yêu cầu hoặc nạp dữ liệu deadline. Bạn có thể
          thử lại ngay bây giờ.
        </p>

        {error.message && (
          <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 font-mono text-left overflow-x-auto">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Thử lại
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors text-center"
          >
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
