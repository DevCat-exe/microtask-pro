'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminWithdrawalsPage() {
  const { data: withdrawals, error, isLoading, mutate } = useSWR('/api/withdrawals', fetcher);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setIsProcessing(id);
    try {
      const response = await fetch('/api/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        toast.success(`Withdrawal ${status} successfully!`);
        mutate();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update withdrawal');
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
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Financial Audits</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Review and process fund withdrawal requests from workers.</p>
      </div>

      {withdrawals?.length > 0 ? (
        <div className="bg-white dark:bg-[#1a2e20] rounded-4xl border border-slate-200 dark:border-[#28392e] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-background-dark/50 border-b border-slate-200 dark:border-[#28392e]">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Worker</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount ($)</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method / Account</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {withdrawals.map((w: any) => (
                  <tr key={w._id} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors group">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black text-xs">
                          {w.workerName.charAt(0)}
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{w.workerName}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{w.workerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                       <div className="flex flex-col">
                          <span className="text-xl font-black text-slate-900 dark:text-white">${w.withdrawalAmount.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{w.withdrawalCoin} Coins</span>
                       </div>
                    </td>
                    <td className="px-8 py-7">
                       <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">{w.paymentSystem}</p>
                          <p className="text-[10px] font-medium text-slate-500 font-mono">{w.accountNumber}</p>
                       </div>
                    </td>
                    <td className="px-8 py-7 text-center">
                      {getStatusBadge(w.status)}
                    </td>
                    <td className="px-8 py-7 text-right">
                      {w.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => handleUpdate(w._id, 'approved')}
                            disabled={isProcessing === w._id}
                            className="size-11 rounded-2xl bg-primary text-[#111813] hover:scale-110 active:scale-90 transition-all flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[20px]! font-black">payments</span>
                          </button>
                          <button 
                            onClick={() => handleUpdate(w._id, 'rejected')}
                            disabled={isProcessing === w._id}
                            className="size-11 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white hover:scale-110 active:scale-90 transition-all flex items-center justify-center border border-red-500/20 disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[20px]! font-black">close</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">
                          Audit Complete
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
        <div className="text-center py-24 rounded-4xl bg-slate-50 dark:bg-[#1a2e20]/50 border-2 border-dashed border-slate-200 dark:border-[#28392e]">
          <span className="material-symbols-outlined text-[80px]! text-slate-300 dark:text-slate-700 mb-6">approval_delegation</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No pending audits</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Platform finances are up to date. Check back later!</p>
        </div>
      )}
    </div>
  );
}
