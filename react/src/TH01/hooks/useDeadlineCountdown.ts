import { useMemo } from 'react';
import type { UrgencyLevel } from '../types/deadline.types';

export interface DeadlineCountdownResult {
  diffDays: number;
  isOverdue: boolean;
  isDueToday: boolean;
  countdownText: string;
  urgencyLevel: UrgencyLevel;
  formattedDueDate: string;
}

/**
 * ============================================================================
 * BUỔI 2: CUSTOM HOOK NÂNG CAO - useDeadlineCountdown
 * ============================================================================
 * Tính toán trạng thái hạn nộp, số ngày chênh lệch và nhãn hiển thị trực quan.
 * Tuân thủ chuẩn đề bài:
 * - "Quá hạn Y ngày" (nếu đã qua hạn nộp)
 * - "Còn X ngày" (nếu chưa đến hạn nộp)
 * - "Hạn chót hôm nay" (nếu là trong ngày)
 * - "Đã hoàn thành" (nếu bài tập đã đánh dấu xong)
 */
export function useDeadlineCountdown(
  dueDate: string,
  isCompleted: boolean
): DeadlineCountdownResult {
  return useMemo(() => {
    // 1. Chuẩn hóa ngày về 00:00:00 để tính khoảng cách theo ngày nguyên
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = dueDate.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    targetDate.setHours(0, 0, 0, 0);

    const timeDiff = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(timeDiff / (1000 * 60 * 60 * 24));

    // 2. Định dạng ngày hiển thị dd/mm/yyyy
    const formattedDueDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

    // 3. Trường hợp đã hoàn thành
    if (isCompleted) {
      return {
        diffDays,
        isOverdue: false,
        isDueToday: false,
        countdownText: 'Đã hoàn thành',
        urgencyLevel: 'completed',
        formattedDueDate,
      };
    }

    // 4. Trường hợp quá hạn
    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return {
        diffDays,
        isOverdue: true,
        isDueToday: false,
        countdownText: `Quá hạn ${overdueDays} ngày`,
        urgencyLevel: 'overdue',
        formattedDueDate,
      };
    }

    // 5. Hạn chót trong hôm nay
    if (diffDays === 0) {
      return {
        diffDays,
        isOverdue: false,
        isDueToday: true,
        countdownText: 'Hạn chót hôm nay',
        urgencyLevel: 'urgent',
        formattedDueDate,
      };
    }

    // 6. Trường hợp còn hạn ("Còn X ngày")
    const urgencyLevel: UrgencyLevel = diffDays <= 2 ? 'warning' : 'normal';
    return {
      diffDays,
      isOverdue: false,
      isDueToday: false,
      countdownText: `Còn ${diffDays} ngày`,
      urgencyLevel,
      formattedDueDate,
    };
  }, [dueDate, isCompleted]);
}
