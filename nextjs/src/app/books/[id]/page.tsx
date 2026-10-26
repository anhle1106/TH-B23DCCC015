import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getBookById } from '@/lib/books-data';
import BorrowButton from '@/components/BorrowButton';
import { ArrowLeft, BookOpen, Calendar, Building2, Hash, Layers, CheckCircle2, XCircle } from 'lucide-react';

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return {
      title: 'Không tìm thấy sách',
      description: 'Đầu sách không tồn tại trong thư viện.',
    };
  }

  return {
    title: `${book.title} - ${book.author}`,
    description: `${book.description} Giáo trình phát hành năm ${book.publishedYear} bởi ${book.publisher}.`,
    alternates: {
      canonical: `https://library.edu.vn/books/${book.id}`,
    },
    openGraph: {
      title: `${book.title} - ${book.author} | Mini Library`,
      description: book.description,
      url: `https://library.edu.vn/books/${book.id}`,
      type: 'article',
    },
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  const session = await auth();
  const isAvailable = book.availableCopies > 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.author,
    },
    isbn: book.isbn,
    numberOfPages: book.pages,
    publisher: {
      '@type': 'Organization',
      name: book.publisher,
    },
    datePublished: String(book.publishedYear),
    inLanguage: 'vi',
    description: book.description,
    offers: {
      '@type': 'Offer',
      availability: isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: '0',
      priceCurrency: 'VND',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh mục sách</span>
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {book.category}
              </span>
              <span
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isAvailable
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}
              >
                {isAvailable ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sẵn sàng mượn ({book.availableCopies}/{book.totalCopies} cuốn)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Tất cả {book.totalCopies} cuốn đã được mượn</span>
                  </>
                )}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-snug">
              {book.title}
            </h1>

            <p className="text-base text-zinc-600 dark:text-zinc-400 font-medium">
              Tác giả: <span className="text-zinc-900 dark:text-white font-semibold">{book.author}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Building2 className="w-3.5 h-3.5" />
                <span>Nhà xuất bản</span>
              </div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                {book.publisher}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Năm xuất bản</span>
              </div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                {book.publishedYear}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Layers className="w-3.5 h-3.5" />
                <span>Số trang</span>
              </div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                {book.pages} trang
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Hash className="w-3.5 h-3.5" />
                <span>Mã chuẩn ISBN</span>
              </div>
              <div className="text-sm font-mono font-medium text-zinc-900 dark:text-white">
                {book.isbn}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Giới Thiệu Nội Dung</h2>
            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-60">
              <BorrowButton
                bookId={book.id}
                availableCopies={book.availableCopies}
                isLoggedIn={!!session?.user}
              />
            </div>
            {!session?.user && (
              <p className="text-xs text-zinc-500">
                Đăng nhập tài khoản sinh viên hoặc giảng viên để tiến hành mượn tài liệu.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
