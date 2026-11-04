'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteDeadlineAction } from '@/app/actions/deadline-actions';

interface DeleteDeadlineButtonProps {
  deadlineId: string;
  deadlineTitle: string;
}

export default function DeleteDeadlineButton({
  deadlineId,
  deadlineTitle,
}: DeleteDeadlineButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xoá deadline: "${deadlineTitle}"?\nThao tác này sẽ kích hoạt ISR Revalidation làm mới tức thì.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await deleteDeadlineAction(deadlineId);
      if (!res.success) {
        alert(res.message || 'Không thể xoá deadline.');
      }
    } catch {
      alert('Đã xảy ra lỗi máy chủ khi xoá deadline.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="Xoá deadline này"
      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}

