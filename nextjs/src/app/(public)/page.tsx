import Link from 'next/link';
import type { Metadata } from 'next';
import { getDeadlines, getSubjects } from '@/lib/deadlines';
import {
  CalendarClock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';
import CountdownBadge from '@/components/CountdownBadge';

export const metadata: Metadata = {
  title: 'Trang Chủ - Cổng Deadline Lớp Học PTIT',
  description: 'Trang chủ tra cứu deadline công khai cho sinh viên PTIT. Áp dụng chiến lược Static Site Generation (SSG).',
  alternates: {
    canonical: 'http://localhost:3000',
  },
};

export default async function HomePage() {
  const [subjects, deadlines] = await Promise.all([
    getSubjects(),
    getDeadlines(),
  ]);

  const urgentDeadlines = deadlines
    .filter((d) => d.priority === 'high')
    .slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-600 to-red-800 text-white py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-red-100">
            <GraduationCap className="w-4 h-4" />
            Học viện Công nghệ Bưu chính Viễn thông
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Cổng Quản Lý & Theo Dõi <br className="hidden sm:inline" />
            <span className="text-amber-300">Deadline Lớp Học</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-red-100 leading-relaxed">
            Tra cứu công khai toàn bộ hạn nộp bài tập, đồ án các môn chuyên ngành CNTT.
            Hỗ trợ sinh viên đánh dấu tiến độ và ban cán sự quản lý hạn chót tập trung.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/deadlines"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-red-700 hover:bg-red-50 font-bold text-sm shadow-lg transition-all inline-flex items-center justify-center gap-2"
            >
              <CalendarClock className="w-4 h-4" />
              Xem Toàn Bộ Deadline (ISR 60s)
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-950/60 hover:bg-red-950/80 text-white font-semibold text-sm border border-white/20 transition-all inline-flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Đăng Nhập Đánh Dấu Đã Xong
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/10 text-left">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <span className="text-2xl font-black text-amber-300">{subjects.length}</span>
              <p className="text-xs text-red-100 font-medium">Môn học học kỳ</p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <span className="text-2xl font-black text-white">{deadlines.length}</span>
              <p className="text-xs text-red-100 font-medium">Hạn nộp tổng cộng</p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <span className="text-2xl font-black text-rose-300">{urgentDeadlines.length}</span>
              <p className="text-xs text-red-100 font-medium">Deadline khẩn cấp</p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <span className="text-2xl font-black text-emerald-300">SSG</span>
              <p className="text-xs text-red-100 font-medium">Chiến lược render</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Urgent Deadlines Preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                Hạn Nộp Khẩn Cấp (High Priority)
              </h2>
              <p className="text-xs text-slate-500">
                Các bài tập và đồ án quan trọng cần ưu tiên hoàn thành sớm
              </p>
            </div>
            <Link
              href="/deadlines"
              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {urgentDeadlines.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-red-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                      Khẩn cấp
                    </span>
                    <CountdownBadge dueDate={item.dueDate} />
                  </div>
                  <Link
                    href={`/deadlines/${item.id}`}
                    className="text-sm font-bold text-slate-900 hover:text-red-600 line-clamp-2 mb-2 block"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {item.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium truncate max-w-[120px]">
                    {item.subjectName}
                  </span>
                  <Link
                    href={`/deadlines/${item.id}`}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Chi tiết &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subjects Grid (SSG Route Links) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-600" />
                Danh Sách Môn Học (SSG Routes)
              </h2>
              <p className="text-xs text-slate-500">
                Mỗi môn học được sinh tĩnh sẵn bằng Static Site Generation (SSG) với generateStaticParams
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {subjects.map((sub) => {
              const subDeadlines = deadlines.filter((d) => d.subjectSlug === sub.slug);
              return (
                <Link
                  key={sub.slug}
                  href={`/subjects/${sub.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-red-500 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 text-xs font-bold font-mono bg-red-50 text-red-700 rounded-lg">
                        {sub.code}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {sub.credits} tín chỉ
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      {sub.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      <strong>{subDeadlines.length}</strong> deadline
                    </span>
                    <span className="text-red-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                      Xem môn học <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Technical Architecture Banner */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                <Layers className="w-4 h-4" />
                Kiến Trúc Next.js 16 App Router
              </div>
              <h3 className="text-2xl font-black tracking-tight">
                Chiến Lược Hybrid Rendering & Phân Quyền 3 Lớp
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              RBAC can(role, action)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-2">
              <p className="font-bold text-white text-sm">1. SSG & ISR Rendering</p>
              <p className="leading-relaxed">
                Trang chủ <code>/</code> và môn học <code>/subjects/[slug]</code> dựng tĩnh hoàn toàn (SSG). Trang <code>/deadlines</code> dùng ISR 60s và trang chi tiết dùng On-Demand Revalidation.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-2">
              <p className="font-bold text-white text-sm">2. NextAuth v5 & Session JWT</p>
              <p className="leading-relaxed">
                Đăng nhập bảo mật với Credentials và GitHub OAuth. Khai báo kiểu TypeScript nghiêm ngặt cho <code>id</code> và <code>role</code> trong JWT Token & Session.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-2">
              <p className="font-bold text-white text-sm">3. Defense-in-Depth Phân Quyền</p>
              <p className="leading-relaxed">
                Ma trận kiểm soát 3 lớp độc lập: Edge Middleware, Page Server Guard (SSR), và Server Action Guard với hàm <code>can(role, action)</code> duy nhất.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
