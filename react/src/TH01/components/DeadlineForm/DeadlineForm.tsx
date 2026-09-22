import React, { useState } from 'react';
import type { CreateDeadlineDTO, Priority } from '../../types/deadline.types';
import './DeadlineForm.css';

interface DeadlineFormProps {
  onSubmit: (data: CreateDeadlineDTO) => void;
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_SUBJECTS = [
  'Lập trình Web nâng cao',
  'An toàn hệ thống',
  'Kiến trúc máy tính',
  'Học máy ứng dụng',
  'Cơ sở dữ liệu nâng cao',
];

export function DeadlineForm({ onSubmit, isOpen, onClose }: DeadlineFormProps) {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  // Helper đặt ngày nhanh (Quick Presets)
  const handleSetQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setDueDate(`${yyyy}-${mm}-${dd}`);
    if (errors.dueDate) {
      setErrors((prev) => ({ ...prev, dueDate: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!subject.trim()) newErrors.subject = 'Vui lòng nhập hoặc chọn tên môn học';
    if (!title.trim()) newErrors.title = 'Vui lòng nhập tên bài tập';
    if (!dueDate) newErrors.dueDate = 'Vui lòng chọn hạn nộp';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      subject: subject.trim(),
      title: title.trim(),
      dueDate,
      priority,
    });

    // Reset form
    setSubject('');
    setTitle('');
    setDueDate('');
    setPriority('medium');
    setErrors({});
    onClose();
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div
        className="form-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="form-modal-header">
          <div>
            <h2 id="modal-title" className="form-title">Thêm Deadline Mới</h2>
            <p className="form-subtitle">Tạo bài tập cần theo dõi để không bị trễ hạn</p>
          </div>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            aria-label="Đóng form"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="deadline-form" noValidate>
          {/* 1. Môn học */}
          <div className="form-field">
            <label className="field-label" htmlFor="input-subject">
              Tên môn học <span className="req">*</span>
            </label>
            <input
              id="input-subject"
              type="text"
              className={`form-input ${errors.subject ? 'input-error' : ''}`}
              placeholder="VD: Lập trình Web nâng cao"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) setErrors((prev) => ({ ...prev, subject: '' }));
              }}
            />
            {errors.subject && <span className="error-text">{errors.subject}</span>}

            {/* Gợi ý chọn nhanh môn học */}
            <div className="quick-suggestions">
              <span className="suggestion-label">Gợi ý:</span>
              {COMMON_SUBJECTS.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  className="btn-suggestion"
                  onClick={() => {
                    setSubject(sub);
                    if (errors.subject) setErrors((prev) => ({ ...prev, subject: '' }));
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Tên bài tập */}
          <div className="form-field">
            <label className="field-label" htmlFor="input-title">
              Tên bài tập <span className="req">*</span>
            </label>
            <input
              id="input-title"
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="VD: Bài thực hành 01 (Redux Toolkit)"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* 3. Hạn nộp & Quick presets */}
          <div className="form-field">
            <div className="field-label-row">
              <label className="field-label" htmlFor="input-dueDate">
                Hạn nộp bài <span className="req">*</span>
              </label>
              {/* Presets nộp bài nhanh */}
              <div className="date-presets">
                <button
                  type="button"
                  className="btn-preset"
                  onClick={() => handleSetQuickDate(1)}
                >
                  Ngày mai (+1d)
                </button>
                <button
                  type="button"
                  className="btn-preset"
                  onClick={() => handleSetQuickDate(3)}
                >
                  +3 ngày
                </button>
                <button
                  type="button"
                  className="btn-preset"
                  onClick={() => handleSetQuickDate(7)}
                >
                  +1 tuần
                </button>
              </div>
            </div>
            <input
              id="input-dueDate"
              type="date"
              className={`form-input ${errors.dueDate ? 'input-error' : ''}`}
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: '' }));
              }}
            />
            {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
          </div>

          {/* 4. Mức độ ưu tiên */}
          <div className="form-field">
            <span className="field-label">Mức độ ưu tiên</span>
            <div className="priority-options">
              <label
                className={`priority-radio-label priority-low ${
                  priority === 'low' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value="low"
                  checked={priority === 'low'}
                  onChange={() => setPriority('low')}
                />
                <span className="radio-dot dot-low" />
                <span>Thấp</span>
              </label>

              <label
                className={`priority-radio-label priority-medium ${
                  priority === 'medium' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value="medium"
                  checked={priority === 'medium'}
                  onChange={() => setPriority('medium')}
                />
                <span className="radio-dot dot-medium" />
                <span>Trung bình</span>
              </label>

              <label
                className={`priority-radio-label priority-high ${
                  priority === 'high' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value="high"
                  checked={priority === 'high'}
                  onChange={() => setPriority('high')}
                />
                <span className="radio-dot dot-high" />
                <span>Cao (Gấp)</span>
              </label>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Huỷ bỏ
            </button>
            <button
              type="submit"
              className="btn-submit"
            >
              Tạo bài tập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
