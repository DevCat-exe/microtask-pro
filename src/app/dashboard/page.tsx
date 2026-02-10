import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  const user = session?.user as any;
  const role = user?.role;

  if (role === 'admin') {
    redirect('/dashboard/admin');
  } else if (role === 'buyer') {
    redirect('/dashboard/buyer');
  } else {
    redirect('/dashboard/worker');
  }
}
