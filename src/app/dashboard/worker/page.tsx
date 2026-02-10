import { auth } from '@/auth';
import connectDB from '@/lib/db';
import Submission from '@/models/Submission';
import StatCard from '@/components/StatCard';

async function getWorkerStats(userId: string, email: string) {
  await connectDB();
  
  const totalSubmissions = await Submission.countDocuments({ workerEmail: email });
  const pendingSubmissions = await Submission.countDocuments({ workerEmail: email, status: 'pending' });
  const approvedSubmissions = await Submission.countDocuments({ workerEmail: email, status: 'approved' });
  
  const earningsResult = await Submission.aggregate([
    { $match: { workerEmail: email, status: 'approved' } },
    { $group: { _id: null, total: { $sum: '$payableAmount' } } }
  ]);
  
  const totalEarnings = earningsResult[0]?.total || 0;
  
  return {
    totalSubmissions,
    pendingSubmissions,
    approvedSubmissions,
    totalEarnings,
  };
}

export default async function WorkerDashboard() {
  const session = await auth();
  const stats = await getWorkerStats(session?.user?.id!, session?.user?.email!);

  const statItems = [
    { 
      title: "Total Missions", 
      value: stats.totalSubmissions, 
      icon: "rocket",
      color: "blue" as const,
      description: "Tasks submitted"
    },
    { 
      title: "Pending Approval", 
      value: stats.pendingSubmissions, 
      icon: "history",
      color: "yellow" as const,
      description: "Waiting for buyer"
    },
    { 
      title: "Missions Success", 
      value: stats.approvedSubmissions, 
      icon: "task_alt",
      color: "green" as const,
      description: "Earning verified"
    },
    { 
      title: "Total Earnings", 
      value: `${stats.totalEarnings.toLocaleString()} Coins`, 
      icon: "monetization_on",
      color: "primary" as const,
      description: "Available balance"
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Worker Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Complete tasks, earn coins, and withdraw your rewards.
          </p>
        </div>
        <div className="flex gap-3">
          <a href="/dashboard/worker/tasks" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-[#111813] font-black rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[20px]!">search</span>
            Browse Missions
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, idx) => (
          <StatCard key={idx} {...item} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#1a2e20] rounded-4xl p-8 border border-slate-200 dark:border-[#28392e] shadow-xl">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">trending_up</span>
            Earning Velocity
          </h3>
          <div className="h-75 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
             <p className="text-slate-400 font-bold italic">Earnings graph coming soon...</p>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-4xl p-8 text-white relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-xl font-black mb-6 relative z-10">Quick Missions</h3>
          <div className="flex flex-col gap-3 relative z-10">
            <button className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <span className="font-bold">Next Milestone</span>
              <span className="material-symbols-outlined text-primary">flag</span>
            </button>
            <a href="/dashboard/worker/withdrawals" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <span className="font-bold">Withdraw Request</span>
              <span className="material-symbols-outlined text-primary">payments</span>
            </a>
            <button className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <span className="font-bold">Leaderboard</span>
              <span className="material-symbols-outlined text-primary">leaderboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
