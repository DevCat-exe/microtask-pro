import { auth } from '@/auth';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import Submission from '@/models/Submission';
import Payment from '@/models/Payment';
import Link from 'next/link';
import { 
  Briefcase, 
  TrendingUp, 
  FileCheck, 
  Wallet
} from 'lucide-react';
import StatCard from '@/components/StatCard';

async function getBuyerStats(email: string) {
  await connectDB();
  
  const totalTasks = await Task.countDocuments({ buyerEmail: email });
  const activeTasks = await Task.countDocuments({ buyerEmail: email, status: 'active' });
  const pendingSubmissions = await Submission.countDocuments({ buyerEmail: email, status: 'pending' });
  
  const paymentsResult = await Payment.aggregate([
    { $match: { buyerEmail: email, status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  
  const totalSpent = paymentsResult[0]?.total || 0;
  
  return {
    totalTasks,
    activeTasks,
    pendingSubmissions,
    totalSpent,
  };
}

export default async function BuyerDashboard() {
  const session = await auth();
  const stats = await getBuyerStats(session?.user?.email!);

  const statItems: { title: string; value: string | number; icon: string; color: 'blue' | 'green' | 'yellow' | 'purple' | 'primary'; description: string }[] = [
    { 
      title: "Total Tasks", 
      value: stats.totalTasks, 
      icon: "work",
      color: "blue",
      description: "Lifetime tasks posted"
    },
    { 
      title: "Active Tasks", 
      value: stats.activeTasks, 
      icon: "bolt",
      color: "green",
      description: "Currently running"
    },
    { 
      title: "Pending Reviews", 
      value: stats.pendingSubmissions, 
      icon: "pending_actions",
      color: "yellow",
      description: "Submissions to approve"
    },
    { 
      title: "Total Spent", 
      value: `$${stats.totalSpent.toLocaleString()}`, 
      icon: "account_balance_wallet",
      color: "primary",
      description: "Investment in work"
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Buyer Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Manage your tasks and workforce efficiently.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/buyer/add-task" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-[#111813] font-black rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[20px]!">add_circle</span>
            Post New Task
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, idx) => (
          <StatCard key={idx} {...item} />
        ))}
      </div>
      
      {/* Recent Activity / Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#1a2e20] rounded-4xl border border-slate-200 dark:border-[#28392e] p-10 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">analytics</span>
            Campaign Performance
          </h3>
          <div className="h-75 flex flex-col items-center justify-center text-center">
             <p className="text-slate-400 font-bold italic">Chart visualization coming soon...</p>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-4xl p-8 text-white relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-xl font-black mb-6 relative z-10">Quick Actions</h3>
          <div className="flex flex-col gap-3 relative z-10">
            <button className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <span className="font-bold">Add Coins</span>
              <span className="material-symbols-outlined text-primary">arrow_forward</span>
            </button>
            <button className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <span className="font-bold">Approve All Pending</span>
              <span className="material-symbols-outlined text-primary">done_all</span>
            </button>
            <button className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <span className="font-bold">Platform Stats</span>
              <span className="material-symbols-outlined text-primary">equalizer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
