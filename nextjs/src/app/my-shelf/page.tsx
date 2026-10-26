import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserBorrows } from '@/lib/books-data';
import ReturnButton from '@/components/ReturnButton';
import { BookmarkCheck, Calendar, BookOpen, Clock, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tủ Sách Của Tôi',
  description: 'Danh sách các đầu sách đang mượn và hạn hoàn trả của sinh viên.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MyShelfPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/my-shelf');
  }

  const userId = session.user.id || session.user.email || '';
  const userBorrows = await getUserBorrows(userId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Tủ Sách Cá Nhân
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Theo dõi danh mục tài liệu bạn đang mượn và thời hạn hoàn trả (Tối đa 3 cuốn).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
            Đang mượn: <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">{userBorrows.length}/3</span> cuốn
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mượn thêm sách</span>
          </Link>
        </div>
      </div>

      {userBorrows.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4 p-8">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Tủ sách của bạn đang trống</h2>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Bạn chưa đăng ký mượn cuốn sách nào từ thư viện. Hãy ghé danh mục sách để tìm tài liệu bạn cần nhé!
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            Khám phá danh mục sách
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-semibold">Tên Tài Liệu</th>
                  <th className="py-4 px-6 font-semibold">Ngày Mượn</th>
                  <th className="py-4 px-6 font-semibold">Hạn Hoàn Trả</th>
                  <th className="py-4 px-6 font-semibold text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {userBorrows.map((record) => {
                  const borrowDate = new Date(record.borrowedAt).toLocaleDateString('vi-VN');
                  const dueDate = new Date(record.dueDate);
                  const isOverdue = dueDate.getTime() < Date.now();
                  const remainingDays = Math.ceil(
                    (dueDate.getTime() - Date.now()) / (1000 * 3600 * 24)
                  );

                  return (
                    <tr key={record.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <Link
                          href={`/books/${record.bookId}`}
                          className="font-bold text-zinc-900 dark:text-white hover:text-blue-600 transition-colors block"
                        >
                          {record.bookTitle}
                        </Link>
                        <span className="text-xs text-zinc-400 font-mono">Mã mượn: {record.id}</span>
                      </td>
                      <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{borrowDate}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-900 dark:text-white">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            <span>{dueDate.toLocaleDateString('vi-VN')}</span>
                          </div>
                          {isOverdue ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600">
                              <AlertTriangle className="w-3 h-3" />
                              Quá hạn trả
                            </span>
                          ) : (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                              Còn {remainingDays} ngày nữa
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <ReturnButton bookId={record.bookId} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
