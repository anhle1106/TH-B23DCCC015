'use server';

import { auth } from '@/auth';
import { can } from '@/lib/rbac';
import { addDeadline, deleteDeadline, toggleDeadlineCompletion, getSubjectBySlug } from '@/lib/deadlines';
import { revalidatePath } from 'next/cache';
import type { DeadlinePriority, DeadlineType } from '@/types/deadline';

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
};

/**
 * Server Action: Thêm deadline mới (Chỉ Admin)
 * Phân quyền 3 lớp: Kiểm tra vai trò bằng hàm can(role, 'add_deadline')
 */
export async function addDeadlineAction(formData: FormData): Promise<ActionResponse> {
  const session = await auth();
  const userRole = session?.user?.role;

  // Lớp phòng vệ 3: Kiểm tra quyền tại Server Action
  if (!can(userRole, 'add_deadline')) {
    return {
      success: false,
      message: 'Từ chối truy cập (403): Chỉ Lớp trưởng (Admin) mới có quyền thêm deadline!',
    };
  }

  const title = (formData.get('title') as string || '').trim();
  const description = (formData.get('description') as string || '').trim();
  const subjectSlug = (formData.get('subjectSlug') as string || '').trim();
  const dueDateRaw = (formData.get('dueDate') as string || '').trim();
  const priority = (formData.get('priority') as DeadlinePriority) || 'medium';
  const type = (formData.get('type') as DeadlineType) || 'assignment';

  // Validation dữ liệu đầu vào
  const errors: Record<string, string> = {};

  if (!title || title.length < 5) {
    errors.title = 'Tiêu đề deadline phải có ít nhất 5 ký tự.';
  }

  if (!description || description.length < 10) {
    errors.description = 'Mô tả chi tiết phải có ít nhất 10 ký tự.';
  }

  const subject = await getSubjectBySlug(subjectSlug);
  if (!subject) {
    errors.subjectSlug = 'Môn học được chọn không hợp lệ trong hệ thống.';
  }

  if (!dueDateRaw) {
    errors.dueDate = 'Vui lòng chọn thời hạn nộp bài (Hạn chót).';
  } else {
    const parsedDate = new Date(dueDateRaw);
    if (isNaN(parsedDate.getTime())) {
      errors.dueDate = 'Định dạng ngày giờ không hợp lệ.';
    }
  }

  if (!['high', 'medium', 'low'].includes(priority)) {
    errors.priority = 'Mức độ ưu tiên không hợp lệ.';
  }

  if (!['assignment', 'project', 'exam', 'quiz'].includes(type)) {
    errors.type = 'Loại bài tập không hợp lệ.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Dữ liệu đầu vào không hợp lệ. Vui lòng kiểm tra lại.',
      errors,
    };
  }

  try {
    const newDeadline = await addDeadline({
      title,
      description,
      subjectSlug,
      subjectName: subject!.name,
      dueDate: new Date(dueDateRaw).toISOString(),
      priority,
      type,
    });

    // On-Demand Revalidation: Làm mới ngay các trang phụ thuộc
    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${newDeadline.id}`);
    revalidatePath(`/subjects/${subjectSlug}`);
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Thêm deadline mới thành công!',
      data: newDeadline,
    };
  } catch (error) {
    console.error('Lỗi khi thêm deadline:', error);
    return {
      success: false,
      message: 'Lỗi hệ thống khi lưu deadline. Vui lòng thử lại sau.',
    };
  }
}

/**
 * Server Action: Xoá deadline (Chỉ Admin)
 * Phân quyền 3 lớp: Kiểm tra vai trò bằng can(role, 'delete_deadline')
 */
export async function deleteDeadlineAction(id: string): Promise<ActionResponse> {
  const session = await auth();
  const userRole = session?.user?.role;

  // Lớp phòng vệ 3: Kiểm tra quyền tại Server Action
  if (!can(userRole, 'delete_deadline')) {
    return {
      success: false,
      message: 'Từ chối truy cập (403): Chỉ Lớp trưởng (Admin) mới có quyền xoá deadline!',
    };
  }

  if (!id || typeof id !== 'string') {
    return {
      success: false,
      message: 'Mã định danh deadline không hợp lệ.',
    };
  }

  try {
    const deleted = await deleteDeadline(id);
    if (!deleted) {
      return {
        success: false,
        message: 'Deadline không tồn tại hoặc đã bị xoá trước đó.',
      };
    }

    // On-Demand Revalidation: Làm mới tức thì
    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${id}`);
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Đã xoá deadline thành công!',
    };
  } catch (error) {
    console.error('Lỗi khi xoá deadline:', error);
    return {
      success: false,
      message: 'Lỗi máy chủ khi xoá deadline.',
    };
  }
}

/**
 * Server Action: Đánh dấu đã xong / Chưa xong (User & Admin)
 * Phân quyền 3 lớp: Kiểm tra vai trò bằng can(role, 'toggle_complete')
 */
export async function toggleDeadlineStatusAction(id: string): Promise<ActionResponse> {
  const session = await auth();
  const userRole = session?.user?.role;
  const userId = session?.user?.id;

  if (!session || !userId) {
    return {
      success: false,
      message: 'Vui lòng đăng nhập để đánh dấu tiến độ hoàn thành deadline.',
    };
  }

  // Lớp phòng vệ 3: Kiểm tra can(role, 'toggle_complete')
  if (!can(userRole, 'toggle_complete')) {
    return {
      success: false,
      message: 'Bạn không có quyền thực hiện hành động này.',
    };
  }

  try {
    const updated = await toggleDeadlineCompletion(id, userId);
    if (!updated) {
      return {
        success: false,
        message: 'Không tìm thấy deadline tương ứng để cập nhật.',
      };
    }

    revalidatePath('/dashboard');
    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${id}`);

    return {
      success: true,
      message: 'Cập nhật trạng thái hoàn thành thành công!',
    };
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái deadline:', error);
    return {
      success: false,
      message: 'Không thể cập nhật trạng thái lúc này.',
    };
  }
}

