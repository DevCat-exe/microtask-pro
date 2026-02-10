'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WorkerSubmissionsPage() {
  const { data: session } = useSession();
  const { data: submissions, error, isLoading } = useSWR(
    session?.user?.email ? `/api/submissions?type=worker` : null,
    fetcher
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-primary/10 text-primary border-primary/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status}
      </span>
    );
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary">progress_activity</span></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Mission History</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Track the status of your submitted evidence and earnings.</p>
      </div>

      {submissions?.length > 0 ? (
        <div className="bg-white dark:bg-[#1a2e20] rounded-4xl border border-slate-200 dark:border-[#28392e] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-background-dark/50 border-b border-slate-200 dark:border-[#28392e]">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mission Title</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Submitted</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recruiter</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reward</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {submissions.map((sub: any) => (
                  <tr key={sub._id} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{sub.taskTitle}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                         {new Date(sub.submissionDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <div className="size-6 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-black">
                            {sub.buyerName.charAt(0)}
                         </div>
                         <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{sub.buyerName}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                         <span className="material-symbols-outlined text-primary text-[18px]!">monetization_on</span>
                         <span className="text-sm font-black text-primary">{sub.payableAmount}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {getStatusBadge(sub.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-24 rounded-4xl bg-slate-50 dark:bg-[#1a2e20]/50 border-2 border-dashed border-slate-200 dark:border-[#28392e]">
          <span className="material-symbols-outlined text-[80px]! text-slate-300 dark:text-slate-700 mb-6 font-black">history_edu</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No history yet</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Complete your first mission to start building your record.</p>
        </div>
      )}
    </div>
  );
}
