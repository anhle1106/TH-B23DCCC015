import { auth } from '@/auth';
import { getDeadlines, getSubjects } from '@/lib/deadlines';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  CalendarDays,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import CountdownBadge from '@/components/CountdownBadge';
import ToggleCompleteButton from '@/components/ToggleCompleteButton';

// Bắt buộc SSR: Server-Side Rendering theo từng request
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard Sinh Viên (SSR)',
  description: 'Trang quản lý tiến độ và đánh dấu hoàn thành bài tập cá nhân sinh viên.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id || '';

  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  const completedDeadlines = deadlines.filter((d) => d.completedBy.includes(userId));
  const pendingDeadlines = deadlines.filter((d) => !d.completedBy.includes(userId));
  const urgentPending = pendingDeadlines.filter((d) => d.priority === 'high');

  const completionRate = deadlines.length > 0
    ? Math.round((completedDeadlines.length / deadlines.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 uppercase tracking-wider text-red-100">
              Chiến lược: Server-Side Rendering (SSR)
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Xin chào, {session?.user?.name || 'Sinh viên'}!
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-xl">
              Theo dõi tiến độ hoàn thành các hạn nộp bài tập học kỳ. Bấm nút tích để lưu trạng
              thái hoàn thành của riêng bạn.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[140px]">
            <span className="text-3xl font-black text-amber-300">{completionRate}%</span>
            <p className="text-xs text-red-100 font-medium">Tiến độ chung</p>
          </div>
        </div>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500">Tổng Deadline</span>
            <CalendarDays className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-2xl font-black text-slate-900">{deadlines.length}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Trên 4 môn học</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500">Đã Hoàn Thành</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-emerald-600">{completedDeadlines.length}</span>
          <p className="text-[11px] text-emerald-600/80 mt-0.5">Đã nộp và đánh dấu</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500">Chưa Hoàn Thành</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-600">{pendingDeadlines.length}</span>
          <p className="text-[11px] text-amber-600/80 mt-0.5">Cần nộp trước hạn</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500">Khẩn Cấp</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-black text-rose-600">{urgentPending.length}</span>
          <p className="text-[11px] text-rose-600/80 mt-0.5">Ưu tiên làm ngay</p>
        </div>
      </div>

      {/* Section 1: Pending Deadlines */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            Deadline Đang Chờ Xử Lý ({pendingDeadlines.length})
          </h2>
          <Link
            href="/deadlines"
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingDeadlines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            🎉 Tuyệt vời! Bạn đã hoàn thành tất cả deadline trong danh sách.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingDeadlines.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">
                      {item.subjectName}
                    </span>
                    <span className="text-slate-300">•</span>
                    <CountdownBadge dueDate={item.dueDate} isCompleted={false} />
                  </div>

                  <Link
                    href={`/deadlines/${item.id}`}
                    className="text-base font-bold text-slate-900 hover:text-red-600 transition-colors block truncate"
                  >
                    {item.title}
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                  <ToggleCompleteButton
                    deadlineId={item.id}
                    isCompleted={false}
                    isLoggedIn={true}
                  />

                  <Link
                    href={`/deadlines/${item.id}`}
                    className="text-xs font-semibold text-red-600 hover:underline px-2 py-1"
                  >
                    Chi tiết &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Completed Deadlines */}
      {completedDeadlines.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Deadline Đã Đánh Dấu Xong ({completedDeadlines.length})
          </h2>

          <div className="space-y-3">
            {completedDeadlines.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-90"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-600">{item.subjectName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                      Đã hoàn thành
                    </span>
                  </div>

                  <Link
                    href={`/deadlines/${item.id}`}
                    className="text-sm font-semibold text-slate-700 line-through block truncate"
                  >
                    {item.title}
                  </Link>
                </div>

                <div className="shrink-0">
                  <ToggleCompleteButton
                    deadlineId={item.id}
                    isCompleted={true}
                    isLoggedIn={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
