import { auth } from '@/auth';
import { can } from '@/lib/rbac';
import { getDeadlines, getSubjects } from '@/lib/deadlines';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldAlert,
  CalendarDays,
  PlusCircle,
  Trash2,
  AlertCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';
import AddDeadlineForm from '@/components/AddDeadlineForm';
import DeleteDeadlineButton from '@/components/DeleteDeadlineButton';
import CountdownBadge from '@/components/CountdownBadge';

// Bắt buộc SSR: Server-Side Rendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quản Trị Deadline Lớp Học (SSR - Admin)',
  description: 'Trang quản trị dành riêng cho Lớp trưởng thêm và xoá deadline.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await auth();

  // Lớp phòng vệ 2 (Page Server Guard): Kiểm tra quyền tại Server Component
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (!can(session.user.role, 'add_deadline')) {
    redirect('/403');
  }

  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-800 text-purple-200 border border-purple-700">
              Chiến lược: SSR (Chỉ Admin)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Lớp trưởng: {session.user.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-amber-300" />
            Bảng Điều Khiển Quản Trị Deadline
          </h1>
          <p className="text-xs sm:text-sm text-purple-200">
            Thêm mới và xoá hạn nộp bài tập. Mọi thay đổi sẽ kích hoạt On-demand ISR Revalidation ngay lập tức.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold bg-white text-purple-900 hover:bg-purple-50 transition-colors shadow-xs"
        >
          Về Dashboard Cá Nhân &rarr;
        </Link>
      </div>

      {/* Form thêm deadline */}
      <section>
        <AddDeadlineForm subjects={subjects} />
      </section>

      {/* Danh sách quản lý & xoá deadline */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Danh Sách Deadline Hiện Tại ({deadlines.length})
            </h2>
            <p className="text-xs text-slate-500">
              Bấm nút thùng rác màu đỏ để xoá deadline khỏi hệ thống
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Tiêu đề bài tập</th>
                <th className="py-3 px-4">Môn học</th>
                <th className="py-3 px-4">Hạn nộp</th>
                <th className="py-3 px-4">Ưu tiên</th>
                <th className="py-3 px-4">SV đã xong</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deadlines.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    #{item.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/deadlines/${item.id}`}
                      className="font-bold text-slate-900 hover:text-red-600 transition-colors max-w-xs truncate block"
                    >
                      {item.title}
                    </Link>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {item.subjectName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800">
                      {new Date(item.dueDate).toLocaleDateString('vi-VN')}
                    </span>
                    <div className="mt-1">
                      <CountdownBadge dueDate={item.dueDate} />
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase ${
                        item.priority === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : item.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {item.completedBy.length} SV
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/deadlines/${item.id}`}
                        title="Xem trang công khai"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <DeleteDeadlineButton
                        deadlineId={item.id}
                        deadlineTitle={item.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

