'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MyTasksPage() {
  const { data: session } = useSession();
  const { data: tasks, error, isLoading, mutate } = useSWR(
    session?.user?.email ? `/api/tasks?email=${session.user.email}` : null,
    fetcher
  );

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task? Remaining coins for uncompleted spots will be refunded.')) return;
    
    setIsDeleting(taskId);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Task deleted and coins refunded!');
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
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">My Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage and track your active task campaigns.</p>
        </div>
      </div>

      {tasks?.length > 0 ? (
        <div className="grid gap-6">
          {tasks.map((task: any) => (
            <div key={task._id} className="group relative bg-white dark:bg-[#1a2e20] rounded-4xl p-8 border border-slate-200 dark:border-[#28392e] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
            <div className="shrink-0">
               <div className="size-20 rounded-3xl overflow-hidden border-4 border-white dark:border-background-dark shadow-2xl relative">
                  <Image 
                    src={task.taskImageUrl || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop'} 
                    alt={task.title} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
               </div>
            </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{task.title}</h3>
                      {getStatusBadge(task.status)}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 mb-6">{task.detail}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Payable</p>
                      <p className="text-lg font-black text-primary">{task.payableAmount} <span className="text-[10px] opacity-70">Coins</span></p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Resources</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white">{task.remainingWorkers} / {task.requiredWorkers} <span className="text-[10px] opacity-70">Spots</span></p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Total Cost</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white">{task.requiredWorkers * task.payableAmount} <span className="text-[10px] opacity-70">Coins</span></p>
                    </div>
                    <div className="hidden md:flex flex-col justify-center gap-2">
                       <button 
                        onClick={() => handleDelete(task._id)}
                        disabled={isDeleting === task._id}
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-xs transition-colors disabled:opacity-50"
                       >
                         {isDeleting === task._id ? (
                           <span className="material-symbols-outlined animate-spin shadow-none text-[16px]!">progress_activity</span>
                         ) : (
                           <>
                             <span className="material-symbols-outlined text-[16px]!">delete</span>
                             Cancel Task
                           </>
                         )}
                       </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-16!">group</span>
                    <span className="text-xs font-black text-slate-500">{task.requiredWorkers} Spots</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-16!">schedule</span>
                    <span className="text-xs font-black text-slate-500">{new Date(task.completionDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                   <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-[#111813] font-black text-sm hover:scale-105 transition-transform shadow-xl">
                      <span className="material-symbols-outlined text-18!">visibility</span>
                      View Submissions
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
         <div className="text-center py-24 rounded-4xl bg-slate-50 dark:bg-[#1a2e20]/50 border-2 border-dashed border-slate-200 dark:border-[#28392e]">
           <span className="material-symbols-outlined text-80! text-slate-300 dark:text-slate-700 mb-6">work_off</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No tasks found</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">You haven&apos;t posted any tasks yet. Start recruiting now!</p>
          <button className="px-8 py-3 bg-primary text-[#111813] font-black rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-primary/20">
            Create First Task
          </button>
        </div>
      )}
    </div>
  );
}
