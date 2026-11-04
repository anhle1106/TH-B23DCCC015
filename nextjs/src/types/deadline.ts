export interface Subject {
  id: string;
  code: string;
  name: string;
  slug: string;
  description: string;
  lecturer: string;
  credits: number;
  icon: string;
}

export type DeadlinePriority = 'high' | 'medium' | 'low';
export type DeadlineType = 'assignment' | 'project' | 'exam' | 'quiz';

export interface Deadline {
  id: string;
  title: string;
  description: string;
  subjectSlug: string;
  subjectName: string;
  dueDate: string; // ISO date string: YYYY-MM-DDTHH:mm:ss
  priority: DeadlinePriority;
  type: DeadlineType;
  completedBy: string[]; // User IDs who marked as completed
  createdAt: string;
}
