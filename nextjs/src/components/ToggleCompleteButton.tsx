'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { toggleDeadlineStatusAction } from '@/app/actions/deadline-actions';

interface ToggleCompleteButtonProps {
  deadlineId: string;
  completedBy?: string[];
  isCompleted?: boolean; // Optional override for dashboard
  isLoggedIn?: boolean;
}

export default function ToggleCompleteButton({
  deadlineId,
  completedBy = [],
  isCompleted: explicitCompleted,
  isLoggedIn: explicitLoggedIn,
}: ToggleCompleteButtonProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean>(explicitCompleted ?? false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (explicitCompleted !== undefined) {
      setCompleted(explicitCompleted);
      return;
    }

    async function loadSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const session = await res.json();
          if (session?.user?.id) {
            setUserId(session.user.id);
            setCompleted(completedBy.includes(session.user.id));
          }
        }
      } catch {
        // Static build ignore
      }
    }

    loadSession();
  }, [completedBy, explicitCompleted]);

  async function handleToggle() {
    if (explicitLoggedIn === false || (!userId && explicitLoggedIn === undefined)) {
      window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await toggleDeadlineStatusAction(deadlineId);
      if (res.success) {
        setCompleted(!completed);
      } else {
        setErrorMsg(res.message || 'Có lỗi xảy ra.');
      }
    } catch {
      setErrorMsg('Lỗi mạng hoặc máy chủ.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        onClick={handleToggle}
        disabled={loading}
        title={completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
          completed
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs'
        } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
        ) : completed ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
        ) : (
          <Circle className="w-3.5 h-3.5 text-slate-400" />
        )}
        <span>{completed ? 'Đã hoàn thành' : 'Đánh dấu đã xong'}</span>
      </button>
      {errorMsg && <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>}
    </div>
  );
}
