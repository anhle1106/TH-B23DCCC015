'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, BookOpen, ChevronRight, Tag } from 'lucide-react';
import type { Deadline, Subject } from '@/types/deadline';
import CountdownBadge from './CountdownBadge';
import ToggleCompleteButton from './ToggleCompleteButton';

interface DeadlineFilterProps {
  initialDeadlines: Deadline[];
  subjects: Subject[];
}

export default function DeadlineFilter({
  initialDeadlines,
  subjects,
}: DeadlineFilterProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const session = await res.json();
          if (session?.user?.id) {
            setCurrentUserId(session.user.id);
            setIsLoggedIn(true);
          }
        }
      } catch {}
    }
    loadSession();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredDeadlines = useMemo(() => {
    return initialDeadlines.filter((item) => {
      // Search
      const matchesSearch =
        searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subjectName.toLowerCase().includes(searchTerm.toLowerCase());

      // Subject
      const matchesSubject =
        selectedSubject === 'all' || item.subjectSlug === selectedSubject;

      // Priority
      const matchesPriority =
        selectedPriority === 'all' || item.priority === selectedPriority;

      // Status
      const isCompleted = currentUserId
        ? item.completedBy.includes(currentUserId)
        : false;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'completed' && isCompleted) ||
        (selectedStatus === 'pending' && !isCompleted);

      return matchesSearch && matchesSubject && matchesPriority && matchesStatus;
    });
  }, [initialDeadlines, searchTerm, selectedSubject, selectedPriority, selectedStatus, currentUserId]);

  const priorityColors = {
    high: 'text-rose-700 bg-rose-50 border-rose-200',
    medium: 'text-amber-700 bg-amber-50 border-amber-200',
    low: 'text-blue-700 bg-blue-50 border-blue-200',
  };

  const priorityLabels = {
    high: 'Khẩn cấp',
    medium: 'Trung bình',
    low: 'Thấp',
  };

  const typeLabels = {
    assignment: 'Bài tập',
    project: 'Đồ án',
    exam: 'Thi cử',
    quiz: 'Trắc nghiệm',
  };

  return (
    <div className="space-y-6">
      {/* Thanh bộ lọc và tìm kiếm */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Ô tìm kiếm */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm deadline, môn học, bài tập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
            />
          </div>

          {/* Lọc theo môn học */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all text-slate-700"
            >
              <option value="all">Tất cả môn học ({subjects.length})</option>
              {subjects.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo mức độ ưu tiên */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all text-slate-700"
            >
              <option value="all">Mọi mức độ ưu tiên</option>
              <option value="high">Khẩn cấp (High)</option>
              <option value="medium">Trung bình (Medium)</option>
              <option value="low">Thấp (Low)</option>
            </select>
          </div>
        </div>

        {/* Lọc nhanh trạng thái hoàn thành nếu đã đăng nhập */}
        {isLoggedIn && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Trạng thái cá nhân:
            </span>
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                selectedStatus === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                selectedStatus === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Chưa hoàn thành
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                selectedStatus === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Đã hoàn thành
            </button>
          </div>
        )}
      </div>

      {/* Hiển thị số lượng kết quả */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Hiển thị <strong>{filteredDeadlines.length}</strong> trên tổng số{' '}
          <strong>{initialDeadlines.length}</strong> deadline
        </span>
        {(searchTerm || selectedSubject !== 'all' || selectedPriority !== 'all' || selectedStatus !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSubject('all');
              setSelectedPriority('all');
              setSelectedStatus('all');
            }}
            className="text-red-600 hover:text-red-700 font-medium cursor-pointer underline"
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Danh sách thẻ Deadline */}
      {filteredDeadlines.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">Không tìm thấy deadline phù hợp</h3>
          <p className="text-sm text-slate-500 mt-1">
            Thử thay đổi từ khóa tìm kiếm hoặc làm mới bộ lọc.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredDeadlines.map((item) => {
            const isCompleted = currentUserId
              ? item.completedBy.includes(currentUserId)
              : false;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-500" />
                      {typeLabels[item.type] || item.type}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-md border ${
                        priorityColors[item.priority]
                      }`}
                    >
                      {priorityLabels[item.priority]}
                    </span>
                  </div>

                  <Link
                    href={`/deadlines/${item.id}`}
                    className="text-base font-bold text-slate-900 hover:text-red-600 transition-colors line-clamp-2 mb-2 block"
                  >
                    {item.title}
                  </Link>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <Link
                      href={`/subjects/${item.subjectSlug}`}
                      className="font-medium text-slate-700 hover:text-red-600 truncate max-w-[160px]"
                    >
                      {item.subjectName}
                    </Link>
                    <CountdownBadge dueDate={item.dueDate} isCompleted={isCompleted} />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <ToggleCompleteButton
                      deadlineId={item.id}
                      completedBy={item.completedBy}
                    />

                    <Link
                      href={`/deadlines/${item.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                    >
                      Chi tiết <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
