import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getSubjects, getSubjectBySlug, getDeadlinesBySubject } from '@/lib/deadlines';
import { BookOpen, CalendarClock, User, Award, ArrowLeft, ChevronRight, Tag } from 'lucide-react';
import CountdownBadge from '@/components/CountdownBadge';

interface SubjectPageProps {
  params: Promise<{ slug: string }>;
}

// Bắt buộc SSG với generateStaticParams
export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((sub) => ({
    slug: sub.slug,
  }));
}

// Dynamic Metadata cho SSG Subject
export async function generateMetadata({ params }: SubjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    return {
      title: 'Môn học không tồn tại',
    };
  }

  return {
    title: `Môn Học: ${subject.name} (${subject.code})`,
    description: subject.description,
    alternates: {
      canonical: `http://localhost:3000/subjects/${subject.slug}`,
    },
  };
}

export default async function SubjectDetailPage({ params }: SubjectPageProps) {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  const deadlines = await getDeadlinesBySubject(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-red-600 transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/deadlines" className="hover:text-red-600 transition-colors">
          Deadlines
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">{subject.name}</span>
      </nav>

      {/* Subject Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold font-mono bg-red-100 text-red-700 rounded-lg">
                {subject.code}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                Chiến lược: SSG
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {subject.name}
            </h1>
          </div>

          <Link
            href="/deadlines"
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tất cả deadline
          </Link>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          {subject.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <User className="w-4 h-4 text-red-600" />
            <span>Giảng viên: <strong>{subject.lecturer}</strong></span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <Award className="w-4 h-4 text-red-600" />
            <span>Số tín chỉ: <strong>{subject.credits} tín chỉ</strong></span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <CalendarClock className="w-4 h-4 text-red-600" />
            <span>Tổng số deadline: <strong>{deadlines.length} bài tập</strong></span>
          </div>
        </div>
      </div>

      {/* Deadlines List for This Subject */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-red-600" />
            Danh Sách Hạn Nộp Môn {subject.name} ({deadlines.length})
          </h2>
        </div>

        {deadlines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
            Hiện tại môn học này chưa có deadline nào được đăng tải.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {deadlines.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {item.type}
                    </span>
                    <CountdownBadge dueDate={item.dueDate} />
                  </div>

                  <Link
                    href={`/deadlines/${item.id}`}
                    className="text-base font-bold text-slate-900 hover:text-red-600 transition-colors line-clamp-2 mb-2 block"
                  >
                    {item.title}
                  </Link>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Hạn: {new Date(item.dueDate).toLocaleDateString('vi-VN')}
                  </span>
                  <Link
                    href={`/deadlines/${item.id}`}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Xem chi tiết &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

