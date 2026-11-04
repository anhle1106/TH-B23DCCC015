import fs from 'fs/promises';
import path from 'path';
import type { Deadline, Subject } from '@/types/deadline';
import initialSubjects from '@/data/subjects.json';
import initialDeadlines from '@/data/deadlines.json';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DEADLINES_FILE = path.join(DATA_DIR, 'deadlines.json');
const SUBJECTS_FILE = path.join(DATA_DIR, 'subjects.json');

// In-memory fallback cache for Serverless environments (e.g. Vercel read-only filesystem)
let inMemoryDeadlines: Deadline[] | null = null;
let inMemorySubjects: Subject[] | null = null;

/**
 * Lấy danh sách tất cả môn học
 */
export async function getSubjects(): Promise<Subject[]> {
  if (inMemorySubjects) {
    return inMemorySubjects;
  }
  try {
    const raw = await fs.readFile(SUBJECTS_FILE, 'utf-8');
    inMemorySubjects = JSON.parse(raw) as Subject[];
    return inMemorySubjects;
  } catch {
    inMemorySubjects = initialSubjects as Subject[];
    return inMemorySubjects;
  }
}

/**
 * Lấy chi tiết môn học theo slug
 */
export async function getSubjectBySlug(slug: string): Promise<Subject | undefined> {
  const subjects = await getSubjects();
  return subjects.find((s) => s.slug === slug);
}

/**
 * Lấy danh sách tất cả deadline
 */
export async function getDeadlines(): Promise<Deadline[]> {
  if (inMemoryDeadlines) {
    return inMemoryDeadlines;
  }
  try {
    const raw = await fs.readFile(DEADLINES_FILE, 'utf-8');
    inMemoryDeadlines = JSON.parse(raw) as Deadline[];
    return inMemoryDeadlines;
  } catch {
    inMemoryDeadlines = initialDeadlines as Deadline[];
    return inMemoryDeadlines;
  }
}

/**
 * Lấy chi tiết deadline theo ID
 */
export async function getDeadlineById(id: string): Promise<Deadline | undefined> {
  const deadlines = await getDeadlines();
  return deadlines.find((d) => d.id === id);
}

/**
 * Lấy danh sách deadline của một môn học
 */
export async function getDeadlinesBySubject(subjectSlug: string): Promise<Deadline[]> {
  const deadlines = await getDeadlines();
  return deadlines.filter((d) => d.subjectSlug === subjectSlug);
}

/**
 * Lưu dữ liệu deadlines xuống file JSON & đồng bộ in-memory
 */
async function saveDeadlines(deadlines: Deadline[]): Promise<void> {
  inMemoryDeadlines = [...deadlines];
  try {
    await fs.writeFile(DEADLINES_FILE, JSON.stringify(deadlines, null, 2), 'utf-8');
  } catch (error) {
    console.warn('[Storage Warning] Không thể ghi file JSON (môi trường Read-only/Vercel). Đã đồng bộ in-memory:', error);
  }
}

/**
 * Thêm deadline mới (Chỉ Admin)
 */
export async function addDeadline(
  payload: Omit<Deadline, 'id' | 'completedBy' | 'createdAt'>
): Promise<Deadline> {
  const deadlines = await getDeadlines();
  
  // Tạo ID mới an toàn
  const nextId = (deadlines.length > 0
    ? Math.max(...deadlines.map((d) => parseInt(d.id, 10) || 0)) + 1
    : 1
  ).toString();

  const newDeadline: Deadline = {
    ...payload,
    id: nextId,
    completedBy: [],
    createdAt: new Date().toISOString(),
  };

  const updated = [newDeadline, ...deadlines];
  await saveDeadlines(updated);
  return newDeadline;
}

/**
 * Xóa deadline theo ID (Chỉ Admin)
 */
export async function deleteDeadline(id: string): Promise<boolean> {
  const deadlines = await getDeadlines();
  const exists = deadlines.some((d) => d.id === id);
  if (!exists) return false;

  const updated = deadlines.filter((d) => d.id !== id);
  await saveDeadlines(updated);
  return true;
}

/**
 * Sinh viên / Admin đánh dấu hoặc hủy đánh dấu đã hoàn thành
 */
export async function toggleDeadlineCompletion(id: string, userId: string): Promise<boolean> {
  const deadlines = await getDeadlines();
  const index = deadlines.findIndex((d) => d.id === id);
  if (index === -1) return false;

  const target = deadlines[index];
  const isCompleted = target.completedBy.includes(userId);

  const newCompletedBy = isCompleted
    ? target.completedBy.filter((uid) => uid !== userId)
    : [...target.completedBy, userId];

  deadlines[index] = {
    ...target,
    completedBy: newCompletedBy,
  };

  await saveDeadlines(deadlines);
  return true;
}
