import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70">
      <Suspense fallback={<div className="h-16 border-b border-slate-200 bg-white" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1 py-8">{children}</main>
      <Footer />
    </div>
  );
}
