import { auth } from '@/auth';
import StatCard from '@/components/StatCard';

async function getAdminStats() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/stats`, {
    headers: {
      cookie: (await import('next/headers')).cookies().toString(),
    },
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  if (!stats) return <div className="p-10 text-red-500 font-bold">Failed to load system statistics.</div>;

  const statItems = [
    { title: "Total Users", value: stats.totalUsers, icon: "groups", color: "blue" as const, description: "Registered members" },
    { title: "System Coins", value: stats.totalCoins.toLocaleString(), icon: "generating_tokens", color: "yellow" as const, description: "Circulating balance" },
    { title: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: "payments", color: "green" as const, description: "Gross payments" },
    { title: "Active Missions", value: stats.activeTasks, icon: "rocket_launch", color: "primary" as const, description: "Currently running" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">System Oversight</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Platform-wide analytics and administrative controls.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, idx) => (
          <StatCard key={idx} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#1a2e20] rounded-4xl p-10 border border-slate-200 dark:border-[#28392e] shadow-2xl">
           <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Platform Growth
           </h3>
           <div className="h-87.5 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-4xl">
              <p className="text-slate-400 font-bold italic">System activity chart coming soon...</p>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 rounded-4xl p-8 text-white shadow-2xl">
              <h4 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6">Quick Report</h4>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-xs uppercase">Total Submissions</span>
                    <span className="font-black text-xl">{stats.totalSubmissions.toLocaleString()}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-xs uppercase">Total Payments</span>
                    <span className="font-black text-xl">{stats.totalPayments.toLocaleString()}</span>
                 </div>
              </div>
              <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-sm transition-colors border border-white/10">
                 Export Logs (CSV)
              </button>
           </div>
           
           <div className="p-8 bg-primary/10 rounded-4xl border border-primary/20">
              <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                 <span className="material-symbols-outlined text-[20px]!">security</span>
                 System Alerts
              </h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                 All system operations are running normally. No critical security events detected in the last 24 hours.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
