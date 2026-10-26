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

      if (pathname.startsWith('/admin')) {
        if (!isLoggedIn) return false;
        if (role !== 'admin') {
          return Response.redirect(new URL('/unauthorized', nextUrl));
        }
        return true;
      }

      if (pathname.startsWith('/my-shelf')) {
        return isLoggedIn;
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
