'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateWithCredentials, signInWithGithubAction } from '@/app/actions/auth-actions';
import { Lock, Mail, LogIn, AlertCircle, Sparkles, UserCheck, ShieldAlert } from 'lucide-react';

interface LoginFormProps {
  callbackUrl?: string;
}

export default function LoginForm({ callbackUrl = '/dashboard' }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('callbackUrl', callbackUrl);

    startTransition(async () => {
      const res = await authenticateWithCredentials(undefined, formData);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    });
  };

  const fillAdmin = () => {
    setEmail('admin@ptit.edu.vn');
    setPassword('admin123');
    setErrorMessage('');
  };

  const fillStudent = () => {
    setEmail('sv@ptit.edu.vn');
    setPassword('sv123456');
    setErrorMessage('');
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Email trường PTIT
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ptit.edu.vn hoặc sv@ptit.edu.vn"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>{isPending ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
        </button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider absolute">
          hoặc
        </span>
      </div>

      {/* GitHub OAuth Bonus Point */}
      <form action={signInWithGithubAction}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-slate-900 hover:bg-black text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>Đăng nhập với GitHub OAuth (+Điểm cộng)</span>
        </button>
      </form>

      {/* Quick Fill Box for the Required Accounts */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Tài khoản bắt buộc đề bài (Bấm để điền nhanh):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={fillAdmin}
            className="p-2.5 text-left rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-1 text-xs font-bold text-purple-700">
              <ShieldAlert className="w-3.5 h-3.5" />
              Lớp Trưởng (Admin)
            </div>
            <div className="text-[11px] text-slate-600 truncate mt-0.5">admin@ptit.edu.vn</div>
            <div className="text-[10px] text-slate-400 font-mono">Mật khẩu: admin123</div>
          </button>

          <button
            type="button"
            onClick={fillStudent}
            className="p-2.5 text-left rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-1 text-xs font-bold text-blue-700">
              <UserCheck className="w-3.5 h-3.5" />
              Sinh Viên (User)
            </div>
            <div className="text-[11px] text-slate-600 truncate mt-0.5">sv@ptit.edu.vn</div>
            <div className="text-[10px] text-slate-400 font-mono">Mật khẩu: sv123456</div>
          </button>
        </div>
      </div>
    </div>
  );
}
