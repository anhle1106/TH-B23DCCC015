'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShieldAlert, LogIn, LogOut, Loader2 } from 'lucide-react';
import { handleSignOut } from '@/app/actions/auth-actions';
import type { UserRole } from '@/types/rbac';

interface ClientUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: UserRole;
}

export default function UserNav() {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const session = await res.json();
          if (isMounted && session?.user) {
            setUser(session.user);
          }
        }
      } catch {
        // Fallback for static builds
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSession();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all shadow-xs cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>Đăng nhập</span>
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all shadow-xs cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>Đăng nhập</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Role & Name */}
      <div className="hidden sm:flex flex-col text-right">
        <span className="text-xs font-bold text-slate-900 leading-tight">
          {user.name || 'Sinh Viên'}
        </span>
        <div className="flex items-center justify-end gap-1 mt-0.5">
          <span
            className={`inline-block text-[10px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
              user.role === 'admin'
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-blue-100 text-blue-700 border border-blue-200'
            }`}
          >
            {user.role === 'admin' ? 'Lớp Trưởng' : 'Sinh Viên'}
          </span>
        </div>
      </div>

      {/* Dashboard Link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
      >
        <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>

      {/* Admin Link if Admin */}
      {user.role === 'admin' && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quản Trị</span>
        </Link>
      )}

      {/* Sign Out Button */}
      <form action={handleSignOut}>
        <button
          type="submit"
          title="Đăng xuất"
          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

