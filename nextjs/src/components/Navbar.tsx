import Link from 'next/link';
import { CalendarClock } from 'lucide-react';
import UserNav from './UserNav';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm group-hover:bg-red-700 transition-colors">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-slate-900 group-hover:text-red-600 transition-colors flex items-center gap-1.5">
              Class Deadline Hub
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-red-100 text-red-700">
                PTIT
              </span>
            </span>
            <p className="text-[11px] text-slate-500 font-medium leading-none">
              Cổng thông tin hạn nộp bài tập
            </p>
          </div>
        </Link>

        {/* Public Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-red-600 transition-colors">
            Trang chủ (SSG)
          </Link>
          <Link href="/deadlines" className="hover:text-red-600 transition-colors flex items-center gap-1">
            Deadlines (ISR 60s)
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </Link>
          <Link href="/subjects/lap-trinh-web" className="hover:text-red-600 transition-colors">
            Môn học (SSG)
          </Link>
        </nav>

        {/* User Session Area (Client Hydrated to preserve SSG on public routes) */}
        <UserNav />
      </div>
    </header>
  );
}
