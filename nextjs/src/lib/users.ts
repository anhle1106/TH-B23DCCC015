import bcrypt from 'bcryptjs';
import type { UserRole } from '@/types/next-auth';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
}

export const USERS: AppUser[] = [
  {
    id: 'user-admin-01',
    name: 'Quản Trị Viên Kho Sách',
    email: 'admin@library.edu.vn',
    passwordHash: bcrypt.hashSync('Admin@123', 10),
    role: 'admin',
  },
  {
    id: 'user-student-01',
    name: 'Nguyễn Văn Sinh Viên',
    email: 'student@library.edu.vn',
    passwordHash: bcrypt.hashSync('Student@123', 10),
    role: 'user',
  },
];

export function findUserByEmail(email: string): AppUser | undefined {
  return USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): AppUser | undefined {
  return USERS.find((u) => u.id === id);
}

export function verifyPassword(plain: string, hash: string): boolean {
  return bcrypt.compareSync(plain, hash);
}
