'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { borrowBookAction } from '@/app/actions/book-actions';
import { BookCheck, Loader2 } from 'lucide-react';

interface BorrowButtonProps {
  bookId: string;
  availableCopies: number;
  isLoggedIn: boolean;
}

export default function BorrowButton({ bookId, availableCopies, isLoggedIn }: BorrowButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const router = useRouter();

  const handleBorrow = () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/books/${bookId}`);
      return;
    }

    startTransition(async () => {
      setMessage(null);
      const res = await borrowBookAction(bookId);
      if (res.success) {
        setMessage({ text: res.message || 'Mượn sách thành công!' });
      } else {
        setMessage({ text: res.message || 'Mượn sách thất bại.', error: true });
      }
    });
  };

  if (availableCopies <= 0) {
    return (
      <button
        disabled
        className="w-full py-2 px-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 rounded-lg cursor-not-allowed"
      >
        Tạm hết sách
      </button>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={handleBorrow}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 rounded-lg shadow-sm transition-all"
      >
        {isPending ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            <BookCheck className="w-3.5 h-3.5" />
            <span>{isLoggedIn ? 'Mượn Sách' : 'Đăng nhập để mượn'}</span>
          </>
        )}
      </button>

      {message && (
        <p
          className={`mt-1.5 text-[11px] font-medium text-center ${
            message.error ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
