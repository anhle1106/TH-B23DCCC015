'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { addBook, deleteBook, borrowBook, returnBook } from '@/lib/books-data';
import type { BookCategory } from '@/types/book';

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function addBookAction(formData: FormData): Promise<ActionResponse> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, message: 'Bạn chưa đăng nhập.' };
  }

  if (session.user.role !== 'admin') {
    return { success: false, message: 'Quyền hạn không hợp lệ. Chỉ Quản Trị Viên mới được thêm sách.' };
  }

  const title = (formData.get('title') as string)?.trim();
  const author = (formData.get('author') as string)?.trim();
  const category = (formData.get('category') as BookCategory) || 'CNTT';
  const publishedYear = Number(formData.get('publishedYear')) || new Date().getFullYear();
  const totalCopies = Number(formData.get('totalCopies')) || 1;
  const description = (formData.get('description') as string)?.trim() || '';
  const isbn = (formData.get('isbn') as string)?.trim() || '978-604-0-00000-0';
  const pages = Number(formData.get('pages')) || 100;
  const publisher = (formData.get('publisher') as string)?.trim() || 'NXB Giáo Dục';

  if (!title || !author) {
    return { success: false, message: 'Tên sách và tác giả là bắt buộc.' };
  }

  await addBook({
    title,
    author,
    category,
    publishedYear,
    totalCopies,
    availableCopies: totalCopies,
    description,
    isbn,
    pages,
    publisher,
  });

  revalidatePath('/');
  revalidatePath('/admin/books');
  return { success: true, message: 'Thêm sách mới thành công!' };
}

export async function deleteBookAction(bookId: string): Promise<ActionResponse> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, message: 'Bạn chưa đăng nhập.' };
  }

  if (session.user.role !== 'admin') {
    return { success: false, message: 'Quyền hạn không hợp lệ. Chỉ Quản Trị Viên mới được xoá sách.' };
  }

  const ok = await deleteBook(bookId);
  if (!ok) {
    return { success: false, message: 'Không tìm thấy sách cần xoá.' };
  }

  revalidatePath('/');
  revalidatePath('/admin/books');
  return { success: true, message: 'Đã xoá sách thành công.' };
}

export async function borrowBookAction(bookId: string): Promise<ActionResponse> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, message: 'Vui lòng đăng nhập để mượn sách.' };
  }

  const userId = session.user.id || session.user.email || 'unknown';
  const userEmail = session.user.email || 'unknown@library.edu.vn';

  const result = await borrowBook(bookId, userId, userEmail);
  if (!result.ok) {
    return { success: false, message: result.error || 'Mượn sách không thành công.' };
  }

  revalidatePath('/');
  revalidatePath(`/books/${bookId}`);
  revalidatePath('/my-shelf');
  return { success: true, message: 'Mượn sách thành công! Hạn trả sau 14 ngày.' };
}

export async function returnBookAction(bookId: string): Promise<ActionResponse> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, message: 'Vui lòng đăng nhập để trả sách.' };
  }

  const userId = session.user.id || session.user.email || 'unknown';

  const result = await returnBook(bookId, userId);
  if (!result.ok) {
    return { success: false, message: result.error || 'Trả sách không thành công.' };
  }

  revalidatePath('/');
  revalidatePath(`/books/${bookId}`);
  revalidatePath('/my-shelf');
  return { success: true, message: 'Đã trả sách thành công.' };
}
