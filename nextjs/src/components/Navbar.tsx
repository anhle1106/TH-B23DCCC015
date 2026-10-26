import Link from 'next/link';
import { auth } from '@/auth';
import { handleSignOut } from '@/app/actions/auth-actions';
import { BookOpen, Shield, BookmarkCheck, LogIn, LogOut, User } from 'lucide-react';

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-zinc-900 dark:text-white tracking-tight block leading-tight">
                Mini Library
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Khoa Công Nghệ Thông Tin
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Danh Mục Sách
            </Link>

            {user && (
              <Link
                href="/my-shelf"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <BookmarkCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Tủ Sách Của Tôi
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                href="/admin/books"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
              >
                <Shield className="w-4 h-4 text-amber-600" />
                Quản Trị Kho Sách
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2 justify-end">
                  <span>{user.name}</span>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      user.role === 'admin'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-400 border border-red-200 dark:border-red-800'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</div>
              </div>

              <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                )}
              </div>

              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Thoát</span>
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
