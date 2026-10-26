import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/auth';
import { ShieldAlert, ArrowLeft, BookmarkCheck, LogIn } from 'lucide-react';

export const metadata: Metadata = {
  title: '403 - Quyền Truy Cập Bị Từ Chối',
  description: 'Trang thông báo không đủ quyền hạn truy cập khu vực quản trị.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UnauthorizedPage() {
  const session = await auth();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-xl shadow-zinc-900/5">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/70 dark:text-red-400 flex items-center justify-center mx-auto border border-red-200 dark:border-red-900/50">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            403 - Quyền Truy Cập Bị Từ Chối
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Bạn không có đặc quyền quản trị viên (<span className="font-semibold text-red-600 dark:text-red-400">admin</span>) để thao tác trên tài nguyên này.
          </p>
        </div>

        {session?.user && (
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-left text-xs space-y-1">
            <div className="text-zinc-500 font-medium">Tài khoản hiện tại:</div>
            <div className="font-semibold text-zinc-900 dark:text-white">{session.user.name} ({session.user.email})</div>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-zinc-500">Vai trò (Role):</span>
              <span className="px-2 py-0.5 rounded-full font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                {session.user.role}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900 hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-semibold text-sm rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay về Danh mục sách</span>
          </Link>

          <Link
            href="/my-shelf"
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-sm rounded-xl transition-all"
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span>Đến Tủ Sách Của Tôi</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-blue-600 hover:underline"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập với tài khoản khác</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
