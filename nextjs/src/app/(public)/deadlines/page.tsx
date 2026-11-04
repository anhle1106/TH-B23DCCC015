import type { Metadata } from 'next';
import { getDeadlines, getSubjects } from '@/lib/deadlines';
import DeadlineFilter from '@/components/DeadlineFilter';
import { CalendarClock, RefreshCw } from 'lucide-react';

// Bắt buộc ISR: Làm mới sau mỗi 60 giây
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Danh Sách Deadline Lớp Học (ISR 60s)',
  description: 'Tra cứu toàn bộ hạn nộp bài tập, đồ án các môn học. Tự động tái tạo tĩnh theo chu kỳ ISR 60 giây.',
  alternates: {
    canonical: 'http://localhost:3000/deadlines',
  },
};

export default async function DeadlinesPage() {
  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Strategy Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <RefreshCw className="w-3 h-3 text-emerald-700" />
              Chiến lược: ISR (Revalidate 60s)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarClock className="w-7 h-7 text-red-600" />
            Cổng Tra Cứu Deadline Lớp Học
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dữ liệu được lưu trong bộ nhớ đệm máy chủ và tự động làm mới ngầm sau mỗi 60 giây.
          </p>
        </div>
      </div>

      {/* Interactive Filter Component (Client Boundary) */}
      <DeadlineFilter
        initialDeadlines={deadlines}
        subjects={subjects}
      />
    </div>
  );
}
