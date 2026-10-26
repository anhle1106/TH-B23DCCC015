'use client';

import { useTransition, useState } from 'react';
import { returnBookAction } from '@/app/actions/book-actions';
import { RotateCcw, Loader2 } from 'lucide-react';

export default function ReturnButton({ bookId }: { bookId: string }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');

  const handleReturn = () => {
    setErrorMsg('');
    startTransition(async () => {
      const res = await returnBookAction(bookId);
      if (!res.success) {
        setErrorMsg(res.message || 'Lỗi khi trả sách');
      }
    });
  };

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleReturn}
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-all disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
        )}
        <span>{isPending ? 'Đang trả...' : 'Trả Sách'}</span>
      </button>
      {errorMsg && <p className="text-[10px] text-red-600 mt-1">{errorMsg}</p>}
    </div>
  );
}
