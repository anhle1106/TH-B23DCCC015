'use client';

import { useState } from 'react';
import { PlusCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { addDeadlineAction } from '@/app/actions/deadline-actions';
import type { Subject } from '@/types/deadline';

interface AddDeadlineFormProps {
  subjects: Subject[];
}

export default function AddDeadlineForm({ subjects }: AddDeadlineFormProps) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await addDeadlineAction(formData);
      if (res.success) {
        setSuccessMsg(res.message || 'Thêm deadline mới thành công!');
        form.reset();
      } else {
        setErrorMsg(res.message || 'Đã có lỗi xảy ra.');
        if (res.errors) {
          setFieldErrors(res.errors);
        }
      }
    } catch {
      setErrorMsg('Lỗi kết nối máy chủ khi tạo deadline.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2 bg-red-50 text-red-600 rounded-xl">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Tạo Deadline Mới</h2>
          <p className="text-xs text-slate-500">
            Đăng thông báo hạn chót nộp bài tập / đồ án tới toàn thể sinh viên
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tiêu đề */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Tiêu đề Deadline <span className="text-rose-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            placeholder="Ví dụ: Báo cáo Thực hành Buổi 8 - NextAuth & Phân quyền RBAC"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
          />
          {fieldErrors.title && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.title}</p>
          )}
        </div>

        {/* Môn học & Hạn nộp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Môn học <span className="text-rose-500">*</span>
            </label>
            <select
              name="subjectSlug"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all text-slate-700"
            >
              <option value="">-- Chọn môn học --</option>
              {subjects.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
            {fieldErrors.subjectSlug && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.subjectSlug}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Thời hạn nộp bài (Hạn chót) <span className="text-rose-500">*</span>
            </label>
            <input
              name="dueDate"
              type="datetime-local"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all text-slate-700"
            />
            {fieldErrors.dueDate && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.dueDate}</p>
            )}
          </div>
        </div>

        {/* Mức độ ưu tiên & Thể loại */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mức độ ưu tiên
            </label>
            <select
              name="priority"
              defaultValue="medium"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all text-slate-700"
            >
              <option value="high">Khẩn cấp (High)</option>
              <option value="medium">Trung bình (Medium)</option>
              <option value="low">Thấp (Low)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Thể loại
            </label>
            <select
              name="type"
              defaultValue="assignment"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all text-slate-700"
            >
              <option value="assignment">Bài tập (Assignment)</option>
              <option value="project">Đồ án / Tiểu luận (Project)</option>
              <option value="exam">Thi kết thúc học phần (Exam)</option>
              <option value="quiz">Trắc nghiệm nhanh (Quiz)</option>
            </select>
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Mô tả & Hướng dẫn nộp bài <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="description"
            rows={3}
            required
            placeholder="Nội dung yêu cầu, định dạng nộp file (PDF/Zip), liên kết nộp bài LMS..."
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
          />
          {fieldErrors.description && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.description}</p>
          )}
        </div>

        {/* Nút gửi form */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu & kích hoạt ISR Revalidation...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Đăng Deadline Mới
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

