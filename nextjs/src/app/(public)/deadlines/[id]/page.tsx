import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getDeadlines, getDeadlineById, getSubjectBySlug } from '@/lib/deadlines';
import CountdownBadge from '@/components/CountdownBadge';
import ToggleCompleteButton from '@/components/ToggleCompleteButton';
import {
  CalendarClock,
  BookOpen,
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  Share2,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface DeadlineDetailPageProps {
  params: Promise<{ id: string }>;
}

// Bắt buộc ISR: Làm mới sau 60s và On-demand revalidation khi admin thêm/xóa
export const revalidate = 60;

// generateStaticParams giúp render trước toàn bộ deadline tại build-time (ISR)
export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((d) => ({
    id: d.id,
  }));
}

// Metadata động chuẩn SEO + OpenGraph
export async function generateMetadata({ params }: DeadlineDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    return {
      title: 'Không Tìm Thấy Deadline',
    };
  }

  const formattedDate = new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    title: `${deadline.title} | ${deadline.subjectName}`,
    description: `Hạn chót: ${formattedDate}. ${deadline.description}`,
    alternates: {
      canonical: `http://localhost:3000/deadlines/${deadline.id}`,
    },
    openGraph: {
      title: `${deadline.title} - Hạn Nộp: ${formattedDate}`,
      description: deadline.description,
      url: `http://localhost:3000/deadlines/${deadline.id}`,
      type: 'article',
      locale: 'vi_VN',
      siteName: 'Class Deadline Hub PTIT',
    },
    twitter: {
      card: 'summary_large_image',
      title: deadline.title,
      description: deadline.description,
    },
  };
}

export default async function DeadlineDetailPage({ params }: DeadlineDetailPageProps) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    notFound();
  }

  const subject = await getSubjectBySlug(deadline.subjectSlug);

  const formattedDueDate = new Date(deadline.dueDate).toLocaleString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Structured Data (JSON-LD) BreadcrumbList chuẩn SEO Schema.org
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang Chủ',
        item: 'http://localhost:3000',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Deadlines',
        item: 'http://localhost:3000/deadlines',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: deadline.title,
        item: `http://localhost:3000/deadlines/${deadline.id}`,
      },
    ],
  };

  const priorityLabels = {
    high: 'Khẩn cấp (High)',
    medium: 'Trung bình (Medium)',
    low: 'Thấp (Low)',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Schema.org Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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
        <span className="text-slate-800 font-semibold truncate max-w-[200px]">
          {deadline.title}
        </span>
      </nav>

      {/* Main Detail Card */}
      <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-bold font-mono bg-red-50 text-red-700">
              Mã #{deadline.id}
            </span>
            <Link
              href={`/subjects/${deadline.subjectSlug}`}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {deadline.subjectName}
            </Link>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-emerald-600" />
              Chiến lược: ISR (60s + On-Demand)
            </span>
          </div>

          <CountdownBadge dueDate={deadline.dueDate} />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {deadline.title}
        </h1>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
          <div className="space-y-1">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5" /> Hạn chót nộp bài:
            </span>
            <p className="font-bold text-slate-900">{formattedDueDate}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Tag className="w-3.5 h-3.5" /> Mức độ ưu tiên:
            </span>
            <p className="font-bold text-slate-900">{priorityLabels[deadline.priority]}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <BookOpen className="w-3.5 h-3.5" /> Thể loại:
            </span>
            <p className="font-bold text-slate-900 uppercase font-mono">{deadline.type}</p>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Nội Dung & Hướng Dẫn Nộp Bài
          </h2>
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-wrap">
            {deadline.description}
          </div>
        </div>

        {/* Lecturer & Subject Details if Available */}
        {subject && (
          <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-800">
                Môn học: {subject.name} ({subject.code})
              </p>
              <p>Giảng viên phụ trách: {subject.lecturer} • {subject.credits} tín chỉ</p>
            </div>
            <Link
              href={`/subjects/${subject.slug}`}
              className="text-red-600 font-bold hover:underline"
            >
              Xem tất cả bài tập môn này &rarr;
            </Link>
          </div>
        )}

        {/* Interactive Action Area: Toggle Completed */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ToggleCompleteButton
              deadlineId={deadline.id}
              completedBy={deadline.completedBy}
            />
            <span className="text-xs text-slate-500">
              {deadline.completedBy.length} sinh viên đã hoàn thành
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/deadlines"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
