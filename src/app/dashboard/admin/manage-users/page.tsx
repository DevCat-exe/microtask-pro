'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminManageUsersPage() {
  const { data: users, error, isLoading, mutate } = useSWR('/api/admin/users', fetcher);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const filteredUsers = users?.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    setIsProcessing(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast.success(`Role updated to ${newRole}`);
        mutate();
      } else {
        toast.error('Failed to update role');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary">progress_activity</span></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Member Oversight</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Audit, moderate, and manage all platform participants.</p>
        </div>
        
        <div className="relative w-full md:w-[320px]">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Search email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-3xl border border-slate-200 dark:border-[#28392e] bg-white dark:bg-[#1a2e20] text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xl"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a2e20] rounded-4xl border border-slate-200 dark:border-[#28392e] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-background-dark/50 border-b border-slate-200 dark:border-[#28392e]">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Wallet Balance</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredUsers?.map((user: any) => (
                <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors group">
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                         <Image 
                          src={user.photoUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.email} 
                          alt={user.name}
                          width={48}
                          height={48}
                          className="rounded-2xl object-cover border-2 border-white dark:border-background-dark shadow-lg"
                        />
                        <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white dark:border-background-dark ${user.role === 'buyer' ? 'bg-primary' : 'bg-blue-500'}`} />
                      </div>
                      <div>
                         <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{user.name}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-2">
                       <span className={`material-symbols-outlined text-[18px]! ${user.role === 'buyer' ? 'text-primary' : 'text-blue-500'}`}>
                          {user.role === 'buyer' ? 'payments' : 'work'}
                       </span>
                       <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-7 text-center">
                    <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-background-dark px-4 py-2 rounded-xl">
                       <span className="material-symbols-outlined text-primary text-[16px]!">toll</span>
                       <span className="font-black text-slate-900 dark:text-white text-sm">{user.coins.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={isProcessing === user._id}
                        className="bg-slate-100 dark:bg-white/5 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                       >
                          <option value="worker">Worker</option>
                          <option value="buyer">Buyer</option>
                          <option value="admin">Admin</option>
                       </select>
                       <button className="size-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]!">block</span>
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
