import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import DashboardSidebar from '@/components/DashboardSidebar';
import Navbar from '@/components/Navbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-[#0a0f0b]">
      <Navbar />
      <div className="flex pt-16 relative">
        <DashboardSidebar user={session.user} />
        <main className="flex-1 lg:ml-72 p-6 lg:p-10 min-h-[calc(100vh-64px)] overflow-x-hidden relative z-10 text-white">
          {children}
        </main>
      </div>
    </div>
  );
}