import { auth } from '@/auth';
import { getDeadlines } from '@/lib/deadlines';
import DashboardSidebar from '@/components/DashboardSidebar';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const deadlines = await getDeadlines();
  const userId = session.user.id;
  const completed = deadlines.filter((d) => d.completedBy.includes(userId)).length;
  const pending = deadlines.length - completed;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Nested Sidebar */}
        <DashboardSidebar
          userRole={session.user.role}
          userName={session.user.name || 'Sinh viên'}
          userEmail={session.user.email || 'sv@ptit.edu.vn'}
          stats={{
            total: deadlines.length,
            completed,
            pending,
          }}
        />

        {/* Dashboard Content */}
        <section className="flex-1 min-w-0 w-full">{children}</section>
      </div>
    </div>
  );
}

