import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getBooks } from '@/lib/books-data';
import AddBookForm from '@/components/AddBookForm';
import DeleteBookButton from '@/components/DeleteBookButton';
import { Shield, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quản Trị Kho Sách Thư Viện',
  description: 'Bảng điều khiển quản lý danh mục sách và phân quyền quản trị viên.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminBooksPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin/books');
  }

  if (session.user.role !== 'admin') {
    redirect('/unauthorized');
  }

  const books = await getBooks();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-400">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Quản Trị Kho Sách Thư Viện
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Khu vực dành riêng cho Quản trị viên: thêm mới giáo trình, cập nhật tồn kho và quản lý xóa đầu sách.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-400 border border-red-200 dark:border-red-900">
            Xác thực: ADMIN
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            {session.user.email}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Thêm Sách Mới Vào Kho
            </h2>
          </div>
          <AddBookForm />
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Danh Sách Đầu Sách ({books.length})
              </h2>
            </div>
            <span className="text-xs text-zinc-400 font-medium">Cập nhật tức thời</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Tên sách / Tác giả</th>
                  <th className="py-3 px-4 font-semibold">Chuyên ngành</th>
                  <th className="py-3 px-4 font-semibold">Tồn kho</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {books.map((book) => {
                  const isAvailable = book.availableCopies > 0;
                  return (
                    <tr key={book.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/books/${book.id}`}
                          className="font-bold text-zinc-900 dark:text-white hover:text-blue-600 transition-colors block leading-snug line-clamp-1"
                        >
                          {book.title}
                        </Link>
                        <span className="text-[11px] text-zinc-500">
                          {book.author} • {book.publisher} ({book.publishedYear})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-medium text-[10px]">
                          {book.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {isAvailable ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
                          )}
                          <span
                            className={`font-semibold ${
                              isAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'
                            }`}
                          >
                            {book.availableCopies} / {book.totalCopies}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DeleteBookButton bookId={book.id} bookTitle={book.title} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
