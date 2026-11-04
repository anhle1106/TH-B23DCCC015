'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  ShieldCheck,
  CheckCircle,
  Clock,
} from 'lucide-react';
import type { UserRole } from '@/types/rbac';

interface DashboardSidebarProps {
  userRole?: UserRole | 'guest';
  userName?: string;
  userEmail?: string;
  stats?: {
    total: number;
    completed: number;
    pending: number;
  };
}

export default function DashboardSidebar({
  userRole,
  userName = 'Sinh viên',
  userEmail = 'sv@ptit.edu.vn',
  stats,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Tổng quan Tiến độ',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      name: 'Toàn bộ Deadline',
      href: '/deadlines',
      icon: CalendarDays,
      active: pathname === '/deadlines',
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between shrink-0 space-y-6">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            <span
              className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md ${
                userRole === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {userRole === 'admin' ? 'Lớp Trưởng' : 'Sinh Viên'}
            </span>
          </div>
        </div>

        {/* Stats widget if available */}
        {stats && (
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
              <span className="text-emerald-700 font-bold text-lg block">
                {stats.completed}
              </span>
              <span className="text-emerald-600 text-[11px] font-medium flex items-center justify-center gap-1">
                <CheckCircle className="w-3 h-3" /> Đã xong
              </span>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-xl">
              <span className="text-amber-700 font-bold text-lg block">
                {stats.pending}
              </span>
              <span className="text-amber-600 text-[11px] font-medium flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" /> Đang chờ
              </span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Điều hướng
          </p>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-red-50 text-red-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    item.active ? 'text-red-600' : 'text-slate-400'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {userRole === 'admin' && (
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === '/admin'
                  ? 'bg-purple-50 text-purple-700 font-semibold shadow-xs'
                  : 'text-purple-600 hover:bg-purple-50/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Quản trị Deadline</span>
            </Link>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
        PTIT Deadline Hub v2.0
      </div>
    </aside>
  );
}
