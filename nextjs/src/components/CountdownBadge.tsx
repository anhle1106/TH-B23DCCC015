'use client';

import { useEffect, useState } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CountdownBadgeProps {
  dueDate: string;
  isCompleted?: boolean;
}

export default function CountdownBadge({ dueDate, isCompleted = false }: CountdownBadgeProps) {
  const [displayText, setDisplayText] = useState<string>('');
  const [status, setStatus] = useState<'completed' | 'urgent' | 'pending' | 'overdue'>('pending');

  useEffect(() => {
    function calculateCountdown() {
      if (isCompleted) {
        setDisplayText('Đã hoàn thành');
        setStatus('completed');
        return;
      }

      const now = new Date().getTime();
      const target = new Date(dueDate).getTime();
      const diff = target - now;

      if (diff < 0) {
        const overdueDays = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
        const overdueHours = Math.floor((Math.abs(diff) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (overdueDays > 0) {
          setDisplayText(`Quá hạn ${overdueDays} ngày`);
        } else {
          setDisplayText(`Quá hạn ${Math.max(1, overdueHours)} giờ`);
        }
        setStatus('overdue');
      } else {
        const remainingDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const remainingHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (remainingDays === 0) {
          setDisplayText(`Còn ${remainingHours} giờ`);
          setStatus('urgent');
        } else if (remainingDays <= 2) {
          setDisplayText(`Còn ${remainingDays} ngày ${remainingHours}h`);
          setStatus('urgent');
        } else {
          setDisplayText(`Còn ${remainingDays} ngày`);
          setStatus('pending');
        }
      }
    }

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000);
    return () => clearInterval(interval);
  }, [dueDate, isCompleted]);

  if (!displayText) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 animate-pulse">
        <Clock className="w-3.5 h-3.5" />
        Đang tính...
      </span>
    );
  }

  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {displayText}
      </span>
    );
  }

  if (status === 'overdue') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
        <AlertTriangle className="w-3.5 h-3.5" />
        {displayText}
      </span>
    );
  }

  if (status === 'urgent') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3.5 h-3.5" />
        {displayText}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
      <Clock className="w-3.5 h-3.5" />
      {displayText}
    </span>
  );
}
