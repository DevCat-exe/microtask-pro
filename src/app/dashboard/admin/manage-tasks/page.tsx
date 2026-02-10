'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminManageTasksPage() {
  const { data: tasks, error, isLoading, mutate } = useSWR('/api/tasks?status=all', fetcher);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task? This is a permanent administrative action.')) return;
    
    setIsDeleting(taskId);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Task removed from platform');
        mutate();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete task');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-primary/10 text-primary border-primary/20',
      completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      cancelled: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status as keyof typeof styles] || styles.active}`}>
        {status}
      </span>
    );
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary">progress_activity</span></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Mission Control</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Moderate active campaigns and ensure platform content quality.</p>
      </div>

      <div className="bg-white dark:bg-[#1a2e20] rounded-4xl border border-slate-200 dark:border-[#28392e] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-background-dark/50 border-b border-slate-200 dark:border-[#28392e]">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mission</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recruiter</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reward (Coins)</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {tasks?.map((task: any) => (
                <tr key={task._id} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors group">
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-4">
                       {task.taskImageUrl && (
                        <div className="size-12 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 relative">
                           <Image 
                            src={task.taskImageUrl} 
                            alt={task.title} 
                            fill
                            className="object-cover" 
                           />
                        </div>
                      )}
                      <div>
                         <p className="text-sm font-black text-slate-900 dark:text-white leading-tight line-clamp-1">{task.title}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">ID: {task._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div>
                       <p className="text-sm font-bold text-slate-900 dark:text-white">{task.buyerName}</p>
                       <p className="text-[10px] font-medium text-slate-400">{task.buyerEmail}</p>
                    </div>
                  </td>
                  <td className="px-8 py-7 text-center">
                    <span className="font-black text-primary text-sm">{task.payableAmount}</span>
                  </td>
                  <td className="px-8 py-7 text-center">
                    {getStatusBadge(task.status)}
                  </td>
                  <td className="px-8 py-7 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <button className="size-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-white transition-all flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                       </button>
                       <button 
                        onClick={() => handleDelete(task._id)}
                        disabled={isDeleting === task._id}
                        className="size-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20"
                       >
                         {isDeleting === task._id ? (
                           <span className="material-symbols-outlined animate-spin shadow-none text-[16px]!">progress_activity</span>
                         ) : (
                           <span className="material-symbols-outlined text-[18px]!">delete_forever</span>
                         )}
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
