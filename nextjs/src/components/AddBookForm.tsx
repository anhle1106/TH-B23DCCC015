'use client';

import { useRef, useTransition, useState } from 'react';
import { addBookAction } from '@/app/actions/book-actions';
import { PlusCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AddBookForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (formData: FormData) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await addBookAction(formData);
      if (res.success) {
        setFeedback({ success: true, message: res.message || 'Thêm thành công!' });
        formRef.current?.reset();
      } else {
        setFeedback({ success: false, message: res.message || 'Thêm thất bại.' });
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
            feedback.success
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}
        >
          {feedback.success ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Tên đầu sách <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            required
            placeholder="Ví dụ: Lập Trình Python Cho Data Science"
            className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Tác giả / Nhóm tác giả <span className="text-red-500">*</span>
          </label>
          <input
            name="author"
            required
            placeholder="Ví dụ: PGS. TS. Nguyễn An"
            className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Chuyên ngành
          </label>
          <select
            name="category"
            defaultValue="CNTT"
            className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CNTT">Công Nghệ Thông Tin</option>
            <option value="Kinh tế">Kinh Tế</option>
            <option value="Ngoại ngữ">Ngoại Ngữ</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Năm xuất bản
          </label>
          <input
            name="publishedYear"
            type="number"
            defaultValue={2026}
            className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Số lượng bản sách
          </label>
          <input
            name="totalCopies"
            type="number"
            min={1}
            max={50}
            defaultValue={5}
            className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Mã ISBN
          </label>
          <input
            name="isbn"
            defaultValue="978-604-0-12345-0"
            className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Số trang
          </label>
          <input
            name="pages"
            type="number"
            defaultValue={350}
            className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Nhà xuất bản
          </label>
          <input
            name="publisher"
            defaultValue="NXB Thông Tin & Truyền Thông"
            className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Mô tả tóm tắt nội dung
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="Giới thiệu nội dung tài liệu..."
          defaultValue="Giáo trình chuyên ngành cập nhật theo chương trình đào tạo mới."
          className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
      >
        {isPending ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Đang lưu vào kho...</span>
          </>
        ) : (
          <>
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Thêm Sách Vào Kho</span>
          </>
        )}
      </button>
    </form>
  );
}
