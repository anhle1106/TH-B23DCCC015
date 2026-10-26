import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/auth';
import { getBooks } from '@/lib/books-data';
import BorrowButton from '@/components/BorrowButton';
import { BookOpen, Sparkles, CheckCircle2, Shield, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tra Cứu & Mượn Sách Giáo Trình Trực Tuyến',
  description: 'Kho giáo trình và tài liệu học tập chuyên ngành CNTT, Kinh tế số, Ngoại ngữ. Tra cứu tình trạng bản sách thời gian thực và quản lý mượn trả tiện lợi.',
  alternates: {
    canonical: 'https://library.edu.vn',
  },
  openGraph: {
    title: 'Tra Cứu & Mượn Sách Giáo Trình Trực Tuyến | Mini Library',
    description: 'Kho giáo trình và tài liệu học tập chuyên ngành CNTT, Kinh tế số, Ngoại ngữ. Tra cứu tình trạng bản sách thời gian thực.',
    url: 'https://library.edu.vn',
    type: 'website',
  },
};

export default async function HomePage() {
  const session = await auth();
  const books = await getBooks();

  const totalAvailable = books.reduce((acc, b) => acc + b.availableCopies, 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Danh Mục Sách Thư Viện Chuyên Ngành Khoa CNTT',
    description: 'Tra cứu hàng trăm đầu sách giáo trình chuyên ngành CNTT, Kinh tế số, Ngoại ngữ.',
    url: 'https://library.edu.vn',
    inLanguage: 'vi',
    provider: {
      '@type': 'Library',
      name: 'Mini Library Khoa CNTT',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Hà Nội',
        addressCountry: 'VN',
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: books.length,
      itemListElement: books.map((book, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: book.title,
        url: `https://library.edu.vn/books/${book.id}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-sky-800 text-white p-8 md:p-12 shadow-xl shadow-blue-900/10">
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-semibold text-sky-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hệ thống thư viện khoa phiên bản mới</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Tra cứu & mượn sách chuyên ngành trực tuyến
            </h1>

            <p className="text-blue-100 text-base md:text-lg leading-relaxed max-w-2xl">
              Hệ thống quản lý giáo trình, tài liệu tham khảo cho sinh viên và giảng viên Khoa CNTT.
              Tích hợp xác thực phân quyền 2 vai trò bảo mật với NextAuth và tối ưu SEO.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>{books.length} đầu sách chọn lọc</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>{totalAvailable} cuốn sẵn sàng mượn</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-300" />
                <span>Kiểm soát phân quyền 3 lớp</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Tủ Sách Chuyên Ngành
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Tìm kiếm và theo dõi tình trạng còn/hết của từng đầu sách.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Sẵn sàng mượn</span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 inline-block ml-3" />
              <span>Hết bản</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => {
              const isAvailable = book.availableCopies > 0;
              return (
                <div
                  key={book.id}
                  className="group flex flex-col justify-between bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {book.category}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isAvailable
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {isAvailable
                          ? `Còn ${book.availableCopies}/${book.totalCopies} cuốn`
                          : 'Hết bản'}
                      </span>
                    </div>

                    <Link href={`/books/${book.id}`} className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-2 leading-snug">
                        {book.title}
                      </h3>
                    </Link>

                    <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-0.5">
                      <p>Tác giả: <span className="font-medium text-zinc-700 dark:text-zinc-300">{book.author}</span></p>
                      <p>NXB: {book.publisher} ({book.publishedYear})</p>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                    <Link
                      href={`/books/${book.id}`}
                      className="flex-1 text-center py-2 px-3 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      Chi Tiết
                    </Link>
                    <div className="flex-1">
                      <BorrowButton
                        bookId={book.id}
                        availableCopies={book.availableCopies}
                        isLoggedIn={!!session?.user}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
