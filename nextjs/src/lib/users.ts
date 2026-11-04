import bcrypt from 'bcryptjs';
import type { UserRole } from '@/types/rbac';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  avatarUrl?: string;
}

export const USERS: AppUser[] = [
  {
    id: 'ptit-admin-01',
    name: 'Lớp Trưởng (Admin)',
    email: 'admin@ptit.edu.vn',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'ptit-sv-01',
    name: 'Sinh Viên PTIT',
    email: 'sv@ptit.edu.vn',
    passwordHash: bcrypt.hashSync('sv123456', 10),
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
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
