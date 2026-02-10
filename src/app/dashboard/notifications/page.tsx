'use client';

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NotificationsPage() {
  const { data: notifications, mutate } = useSWR('/api/notifications', fetcher);
  const router = useRouter();

  const markAsRead = async (id: string, url?: string) => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    mutate();
    if (url) router.push(url);
  };

  const markAllAsRead = async () => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    });
    mutate();
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Activity Feed</h1>
          <p className="text-slate-500 font-medium">Internal platform updates and mission alerts.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications?.length > 0 ? (
          notifications.map((n: any) => (
            <div 
              key={n._id}
              onClick={() => markAsRead(n._id, n.actionUrl)}
              className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer group flex items-start gap-5 ${n.isRead ? 'bg-white dark:bg-[#1a2e20] border-slate-100 dark:border-[#28392e]' : 'bg-primary/5 border-primary/20 ring-2 ring-primary/10 shadow-lg shadow-primary/5'}`}
            >
              <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${n.isRead ? 'bg-slate-50 dark:bg-white/5 text-slate-400' : 'bg-primary text-[#111813] shadow-lg shadow-primary/20'}`}>
                <span className="material-symbols-outlined text-[20px]!">
                  {n.type === 'success' ? 'check_circle' : n.type === 'error' ? 'error' : 'notifications'}
                </span>
              </div>
              <div className="flex-1">
                <p className={`font-bold leading-tight mb-2 ${n.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                  {n.message}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.isRead && (
                 <div className="size-2 rounded-full bg-primary animate-pulse mt-2" />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-white/2 rounded-[3.5rem] border-2 border-dashed border-slate-200 dark:border-white/5">
             <span className="material-symbols-outlined text-[60px]! text-slate-300 dark:text-slate-700 mb-4">notifications_off</span>
             <p className="text-slate-500 font-bold italic">All quiet in the feed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
