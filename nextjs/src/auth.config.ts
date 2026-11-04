import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const pathname = nextUrl.pathname;

      // Bảo vệ /admin: Chỉ admin được truy cập
      if (pathname.startsWith('/admin')) {
        if (!isLoggedIn) {
          // Trả về false để NextAuth tự động chuyển hướng về /login?callbackUrl=...
          return false;
        }
        if (role !== 'admin') {
          // Người dùng đã đăng nhập nhưng không phải admin -> chuyển hướng sang /403
          return Response.redirect(new URL('/403', nextUrl));
        }
        return true;
      }

      // Bảo vệ /dashboard: Phải đăng nhập (cả user và admin)
      if (pathname.startsWith('/dashboard')) {
        if (!isLoggedIn) {
          return false;
        }
        return true;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        if (token.id) session.user.id = token.id as string;
        if (token.role) session.user.role = token.role as 'admin' | 'user';
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
