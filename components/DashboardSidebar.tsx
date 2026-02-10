'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

interface DashboardSidebarProps {
  user: any;
  isCollapsed?: boolean;
}

const roleLinks = {
    worker: [
      { label: 'Home', href: '/dashboard/worker', icon: 'home' },
      { label: 'Marketplace', href: '/dashboard/worker/tasks', icon: 'explore' },
      { label: 'My Submissions', href: '/dashboard/worker/submissions', icon: 'history' },
      { label: 'Withdrawals', href: '/dashboard/worker/withdrawals', icon: 'payments' },
    ],
    buyer: [
      { label: 'Home', href: '/dashboard/buyer', icon: 'home' },
      { label: 'Post Mission', href: '/dashboard/buyer/add-task', icon: 'add_circle' },
      { label: 'My Projects', href: '/dashboard/buyer/my-tasks', icon: 'folder' },
      { label: 'Review Hub', href: '/dashboard/buyer/submissions', icon: 'rate_review' },
      { label: 'Wallet', href: '/dashboard/buyer/purchase-coin', icon: 'account_balance_wallet' },
      { label: 'History', href: '/dashboard/buyer/payment-history', icon: 'receipt_long' },
    ],
    admin: [
       { label: 'Overview', href: '/dashboard/admin', icon: 'dashboard' },
       { label: 'Members', href: '/dashboard/admin/manage-users', icon: 'badge' },
       { label: 'Missions', href: '/dashboard/admin/manage-tasks', icon: 'task' },
       { label: 'Audits', href: '/dashboard/admin/withdrawals', icon: 'audit' },
    ]
  };

export default function DashboardSidebar({ user, isCollapsed }: DashboardSidebarProps) { // Destructure isCollapsed
  const pathname = usePathname();
  const role = user.role || 'worker';
  const links = roleLinks[role as keyof typeof roleLinks] || [];

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white dark:bg-background-dark border-r border-slate-200 dark:border-[#28392e] z-40 transition-all duration-300 hidden lg:block ${isCollapsed ? 'w-24' : 'w-72'}`}>
      <div className="p-8 border-b border-slate-100 dark:border-[#28392e]">
        <div className="flex items-center gap-4 mb-8">
           <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
              <span className="material-symbols-outlined text-[22px]">shield_person</span>
           </div>
           <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Microtask</p>
              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-none">Command</h2>
           </div>
        </div>

        <div className="bg-slate-50 dark:bg-white/5 rounded-4xl p-5 border border-slate-100 dark:border-white/5 group">
           <div className="flex items-center gap-4">
              <div className="relative">
                 <div className="size-11 rounded-2xl overflow-hidden border-2 border-primary/50 group-hover:rotate-6 transition-transform relative">
                    <Image 
                       src={user.image || '/default-avatar.png'}
                       alt={user.name || 'User'}
                       fill
                       className="object-cover"
                    />
                 </div>
                 <div className="absolute -bottom-1 -right-1 size-4 bg-primary rounded-lg border-2 border-white dark:border-[#1a2e20] flex items-center justify-center z-10">
                    <span className="material-symbols-outlined text-[8px] text-[#111813] font-black">verified</span>
                 </div>
              </div>
              <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">{user.name}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{user.role}</p>
              </div>
           </div>
           
           <div className="flex items-center justify-between p-3 bg-white dark:bg-background-dark rounded-2xl shadow-sm mt-5">
               <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">toll</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{user?.coins?.toLocaleString()}</span>
               </div>
               <Link href="/dashboard/notifications" className="relative size-8 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group/notif">
                  <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover/notif:text-primary transition-colors">notifications</span>
                  <div className="absolute -top-1 -right-1 size-3 rounded-full bg-red-500 border-2 border-white dark:border-background-dark" />
               </Link>
           </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto space-y-1 scrollbar-hide">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-5 h-15 rounded-2xl font-black transition-all group relative overflow-hidden ${
                  isActive
                    ? 'bg-primary text-[#111813] shadow-xl shadow-primary/20'
                    : 'text-slate-500 hover:text-primary hover:bg-primary/5'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px]! ${isActive ? 'text-[#111813]' : 'group-hover:text-primary'}`}>
                  {link.icon}
                </span>
                <span className="text-xs uppercase tracking-widest">{link.label}</span>
                {link.label === 'Notifications' && (
                  <span className={`material-symbols-outlined text-[18px]! ml-auto ${isActive ? 'text-[#111813]/40' : 'text-primary'}`}>
                    circle
                  </span>
                )}
              </Link>
            );
          })}
      </nav>

      {/* Logout */}
      <div className="p-6">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-4 px-5 h-15 rounded-2xl font-black transition-all text-red-500 hover:bg-red-500 hover:text-white group"
        >
          <span className="material-symbols-outlined text-[22px]! group-hover:rotate-12 transition-transform">logout</span>
          <span className="text-xs uppercase tracking-widest">Terminate Session</span>
        </button>
        
        <div className="mt-8 flex items-center justify-between px-2">
           <span className="material-symbols-outlined text-slate-300 text-[22px]! animate-pulse">toll</span>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">MicroTask v4.0</span>
        </div>
      </div>
    </aside>
  );
}