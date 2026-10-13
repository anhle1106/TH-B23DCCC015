import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssignmentCard } from '../../components/DeadlineCard/AssignmentCard';
import { DeadlineForm } from '../../components/DeadlineForm/DeadlineForm';
import type { Deadline, CreateDeadlineDTO } from '../../types/deadline.types';
import { usePinStore } from '../../store/usePinStore';

describe('PHẦN C: COMPONENT TESTS (RTL + userEvent)', () => {
  beforeEach(() => {
    usePinStore.getState().clearPins();
  });

  const mockDeadline: Deadline = {
    id: 'dl-test-1',
    subject: 'Lập trình Web nâng cao',
    title: 'Bài tập React Testing Library',
    dueDate: '2026-11-20',
    priority: 'high',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  };

  // --------------------------------------------------------------------------
  // 1. COMPONENT TEST: AssignmentCard
  // --------------------------------------------------------------------------
  describe('AssignmentCard Component', () => {
    it('hiển thị đầy đủ thông tin: tên môn học, tiêu đề bài tập và mức độ ưu tiên', () => {
      render(
        <AssignmentCard
          deadline={mockDeadline}
          onToggle={jest.fn()}
          onDelete={jest.fn()}
          onTogglePin={jest.fn()}
        />
      );

      expect(screen.getByText('Lập trình Web nâng cao')).toBeInTheDocument();
      expect(screen.getByText('Bài tập React Testing Library')).toBeInTheDocument();
      expect(screen.getByText('Cao')).toBeInTheDocument();
    });

    it('gọi hàm onToggle khi người dùng nhấn nút Hoàn thành bài tập', async () => {
      const user = userEvent.setup();
      const handleToggle = jest.fn();

      render(
        <AssignmentCard
          deadline={mockDeadline}
          onToggle={handleToggle}
          onDelete={jest.fn()}
          onTogglePin={jest.fn()}
        />
      );

      const completeBtn = screen.getByTestId('toggle-complete-btn');
      await user.click(completeBtn);

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(handleToggle).toHaveBeenCalledWith('dl-test-1');
    });

    it('gọi hàm onTogglePin khi người dùng nhấn nút Ghim bài tập', async () => {
      const user = userEvent.setup();
      const handleTogglePin = jest.fn();

      render(
        <AssignmentCard
          deadline={mockDeadline}
          isPinned={false}
          onToggle={jest.fn()}
          onDelete={jest.fn()}
          onTogglePin={handleTogglePin}
        />
      );

      const pinBtn = screen.getByTestId('pin-btn');
      expect(pinBtn).toHaveTextContent('Ghim');

      await user.click(pinBtn);

      expect(handleTogglePin).toHaveBeenCalledTimes(1);
      expect(handleTogglePin).toHaveBeenCalledWith('dl-test-1');
    });

    it('hiển thị trạng thái Đã ghim khi isPinned = true', () => {
      render(
        <AssignmentCard
          deadline={mockDeadline}
          isPinned={true}
          onToggle={jest.fn()}
          onDelete={jest.fn()}
          onTogglePin={jest.fn()}
        />
      );

      expect(screen.getByTestId('pin-btn')).toHaveTextContent('Đã ghim');
      expect(screen.getByText('Đã ghim', { selector: '.pinned-banner' })).toBeInTheDocument();
    });

    it('gọi hàm onDelete khi người dùng nhấn nút Xoá', async () => {
      const user = userEvent.setup();
      const handleDelete = jest.fn();

      render(
        <AssignmentCard
          deadline={mockDeadline}
          onToggle={jest.fn()}
          onDelete={handleDelete}
          onTogglePin={jest.fn()}
        />
      );

      const deleteBtn = screen.getByTestId('delete-btn');
      await user.click(deleteBtn);

      expect(handleDelete).toHaveBeenCalledTimes(1);
      expect(handleDelete).toHaveBeenCalledWith('dl-test-1');
    });
  });

  // --------------------------------------------------------------------------
  // 2. COMPONENT TEST: DeadlineForm
  // --------------------------------------------------------------------------
  describe('DeadlineForm Component', () => {
    it('kiểm tra tính hợp lệ (validate): hiển thị lỗi khi submit form để trống các trường bắt buộc', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();

      render(
        <DeadlineForm
          isOpen={true}
          onClose={jest.fn()}
          onSubmit={handleSubmit}
        />
      );

      const submitBtn = screen.getByTestId('submit-btn');
      await user.click(submitBtn);

      // Phải hiển thị các câu thông báo lỗi validate
      expect(screen.getByText('Vui lòng nhập hoặc chọn tên môn học')).toBeInTheDocument();
      expect(screen.getByText('Vui lòng nhập tên bài tập')).toBeInTheDocument();
      expect(screen.getByText('Vui lòng chọn hạn nộp')).toBeInTheDocument();

      // Callback submit không được gọi khi dữ liệu chưa hợp lệ
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('submit thành công khi điền đầy đủ thông tin hợp lệ', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      const handleClose = jest.fn();

      render(
        <DeadlineForm
          isOpen={true}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      );

      // Điền thông tin vào form bằng userEvent
      const subjectInput = screen.getByTestId('input-subject');
      const titleInput = screen.getByTestId('input-title');
      const dueDateInput = screen.getByTestId('input-dueDate');

      await user.type(subjectInput, 'An toàn thông tin');
      await user.type(titleInput, 'Báo cáo Lab 02');
      await user.type(dueDateInput, '2026-12-15');

      const submitBtn = screen.getByTestId('submit-btn');
      await user.click(submitBtn);

      // Đảm bảo onSubmit được gọi đúng dữ liệu đã nhập
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({
        subject: 'An toàn thông tin',
        title: 'Báo cáo Lab 02',
        dueDate: '2026-12-15',
        priority: 'medium',
      } as CreateDeadlineDTO);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('không render gì khi isOpen = false', () => {
      const { container } = render(
        <DeadlineForm
          isOpen={false}
          onClose={jest.fn()}
          onSubmit={jest.fn()}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
