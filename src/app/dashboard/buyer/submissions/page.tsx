'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BuyerSubmissionsPage() {
  const { data: session } = useSession();
  const { data: submissions, error, isLoading, mutate } = useSWR(
    session?.user?.email ? `/api/submissions?type=buyer` : null,
    fetcher
  );

  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleStatusUpdate = async (submissionId: string, status: 'approved' | 'rejected') => {
    setIsProcessing(submissionId);
    try {
      const response = await fetch(`/api/submissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, status }),
      });

      if (response.ok) {
        toast.success(`Submission ${status} successfully!`);
        mutate();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update submission');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsProcessing(null);
    }
  };

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
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Review Submissions</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Approve or reject work submitted by your recruits.</p>
      </div>

      {submissions?.length > 0 ? (
        <div className="bg-white dark:bg-[#1a2e20] rounded-[2.5rem] border border-slate-200 dark:border-[#28392e] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-background-dark/50 border-b border-slate-200 dark:border-[#28392e]">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Worker</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Title</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Proof</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Coins</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {submissions.map((sub: any) => (
                  <tr key={sub._id} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Mission Entry</p>
                          <div className="size-1 rounded-full bg-primary/20" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {sub._id.slice(-8)}</p>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight max-w-75 truncate mb-1">
                          &quot;{sub.taskTitle}&quot;
                        </h3>
                        <p className="text-sm font-bold text-slate-500 italic">Submitted by {sub.workerEmail}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{sub.taskTitle}</p>
                    </td>
                    <td className="px-8 py-6 max-w-75">
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-1 italic">&quot;{sub.submissionDetails}&quot;</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-black text-primary text-sm">{sub.payableAmount}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {sub.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(sub._id, 'approved')}
                            disabled={isProcessing === sub._id}
                            className="size-10 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-[#111813] transition-all flex items-center justify-center disabled:opacity-50"
                            title="Approve"
                          >
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(sub._id, 'rejected')}
                            disabled={isProcessing === sub._id}
                            className="size-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
                            title="Reject"
                          >
                            <span className="material-symbols-outlined text-[20px]">cancel</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">
                          Reviewed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 dark:bg-white/2 rounded-4xl border-2 border-dashed border-slate-200 dark:border-white/5">
          <span className="material-symbols-outlined text-80! text-slate-300 dark:text-slate-700 mb-6 font-thin">rate_review</span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Inbox is Clear</h2>
          <p className="text-slate-500 font-bold max-w-sm mx-auto">No pending mission proofs to review. Your workers are busy completing tasks.</p>
        </div>
      )}
    </div>
  );
}
