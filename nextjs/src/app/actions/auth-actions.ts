'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export type AuthState = {
  success?: boolean;
  error?: string;
};

export async function authenticateWithCredentials(
  prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/',
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Email hoặc mật khẩu không chính xác.' };
        default:
          return { error: 'Đã có lỗi xảy ra trong quá trình đăng nhập.' };
      }
    }
    throw error;
  }
}

export async function signInWithGithubAction() {
  await signIn('github', { redirectTo: '/' });
}

export async function handleSignOut() {
  await signOut({ redirectTo: '/login' });
}
