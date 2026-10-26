import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoginForm from './LoginForm';
import { BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Đăng Nhập Hệ Thống',
  description: 'Cổng xác thực người dùng Mini Library cho sinh viên và quản trị viên.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl shadow-zinc-900/5 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Đăng Nhập Thư Viện
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Sử dụng email tài khoản trường hoặc tài khoản GitHub được liên kết
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
