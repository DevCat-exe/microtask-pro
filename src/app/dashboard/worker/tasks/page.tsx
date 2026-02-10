'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WorkerTaskListPage() {
  const { data: tasks, error, isLoading } = useSWR('/api/tasks', fetcher);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks?.filter((task: any) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary">progress_activity</span></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Available Missions</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Discover opportunities to earn coins from global buyers.</p>
        </div>
        
        <div className="relative w-full md:w-[320px]">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Search missions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-[#28392e] bg-white dark:bg-[#1a2e20] text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xl"
          />
        </div>
      </div>

      {filteredTasks?.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task: any) => (
            <div key={task._id} className="group flex flex-col bg-white dark:bg-[#1a2e20] rounded-4xl border border-slate-200 dark:border-[#28392e] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all">
              <div className="relative h-56 overflow-hidden">
                <Image 
                  src={task.taskImageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop'} 
                  alt={task.title} 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                   <div className="bg-primary text-[#111813] px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                      {task.payableAmount} Coins
                   </div>
                   <div className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-tighter border border-white/20">
                      {task.remainingWorkers} Spots left
                   </div>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-primary transition-colors">{task.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 mb-8">{task.detail}</p>
                
                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-2">
                       <span className="material-symbols-outlined text-18!">event</span>
                       Due: {new Date(task.completionDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="material-symbols-outlined text-18!">person</span>
                       {task.buyerName}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/dashboard/worker/tasks/${task._id}`}
                    className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-[#111813] font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                  >
                    Take Mission
                    <span className="material-symbols-outlined text-20!">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 rounded-4xl bg-slate-50 dark:bg-[#1a2e20]/50 border-2 border-dashed border-slate-200 dark:border-[#28392e]">
          <span className="material-symbols-outlined text-80! text-slate-300 dark:text-slate-700 mb-6">explore_off</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No missions available</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Try searching for something else or check back later.</p>
        </div>
      )}
    </div>
  );
}
