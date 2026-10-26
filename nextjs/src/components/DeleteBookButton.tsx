'use client';

import { useTransition } from 'react';
import { deleteBookAction } from '@/app/actions/book-actions';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeleteBookButton({ bookId, bookTitle }: { bookId: string; bookTitle: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xoá cuốn sách "${bookTitle}" khỏi hệ thống không?`)) {
      startTransition(async () => {
        await deleteBookAction(bookId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors disabled:opacity-50"
      title="Xoá sách"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
