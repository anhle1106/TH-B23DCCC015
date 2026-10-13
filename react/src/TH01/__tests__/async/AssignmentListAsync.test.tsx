import React from 'react';
import { render, screen } from '@testing-library/react';
import { AssignmentList } from '../../components/AssignmentList/AssignmentList';
import type { Deadline } from '../../types/deadline.types';

describe('PHẦN C: ASYNCHRONOUS TESTS - ASSIGNMENT LIST', () => {
  const mockDeadlines: Deadline[] = [
    {
      id: 'task-1',
      subject: 'Lập trình Web nâng cao',
      title: 'Lab 01: TypeScript Generics',
      dueDate: '2026-11-10',
      priority: 'high',
      isCompleted: false,
      createdAt: '',
    },
    {
      id: 'task-2',
      subject: 'Kiến trúc máy tính',
      title: 'Lab 02: Pipeline MIPS',
      dueDate: '2026-11-15',
      priority: 'medium',
      isCompleted: true,
      createdAt: '',
    },
  ];

  it('1. Trạng thái đang tải (Loading state): Hiển thị skeleton placeholder khi status === "loading"', () => {
    render(
      <AssignmentList
        items={[]}
        status="loading"
        onToggle={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    // Kiểm tra skeleton container và các skeleton lines xuất hiện
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    const skeletonItems = screen.getAllByTestId('skeleton-item');
    expect(skeletonItems.length).toBeGreaterThanOrEqual(4);
  });

  it('2. Trạng thái thành công (Succeeded state): Hiển thị danh sách các bài tập khi tải dữ liệu thành công', () => {
    render(
      <AssignmentList
        items={mockDeadlines}
        status="succeeded"
        onToggle={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Lab 01: TypeScript Generics')).toBeInTheDocument();
    expect(screen.getByText('Lab 02: Pipeline MIPS')).toBeInTheDocument();
    expect(screen.getByTestId('assignment-card-task-1')).toBeInTheDocument();
    expect(screen.getByTestId('assignment-card-task-2')).toBeInTheDocument();
  });

  it('3. Trạng thái lỗi (Failed state): Hiển thị thông báo lỗi khi API trả về thất bại', () => {
    const errorMessage = 'Không thể kết nối đến máy chủ API giả lập';

    render(
      <AssignmentList
        items={[]}
        status="failed"
        error={errorMessage}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onResetFilters={jest.fn()}
      />
    );

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Không thể tải danh sách bài tập')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('4. Trạng thái danh sách rỗng (Empty state): Hiển thị thông báo khi không có bài tập nào', () => {
    render(
      <AssignmentList
        items={[]}
        status="succeeded"
        onToggle={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('Không tìm thấy bài tập nào')).toBeInTheDocument();
  });
});
