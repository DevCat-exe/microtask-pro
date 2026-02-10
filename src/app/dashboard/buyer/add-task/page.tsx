'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AddTaskPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    requiredWorkers: 1,
    payableAmount: 10,
    completionDate: '',
    submissionInfo: '',
    taskImageUrl: '',
  });

  const totalCost = formData.requiredWorkers * formData.payableAmount;
  const userCoins = session?.user?.coins || 0;
  const hasEnoughCoins = userCoins >= totalCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasEnoughCoins) {
      toast.error('Not enough coins. Please purchase more.');
      router.push('/dashboard/buyer/purchase-coin');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Task created successfully!');
        // Update session to reflect new coin balance
        await update({
          ...session,
          user: {
            ...session?.user,
            coins: userCoins - totalCost
          }
        });
        router.push('/dashboard/buyer/my-tasks');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create task');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Post a New Task</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Fill in the details to recruit workers for your project.</p>
      </div>

      <div className="rounded-[2.5rem] border border-slate-200 dark:border-[#28392e] bg-white p-8 md:p-12 dark:bg-[#1a2e20] shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Task Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                placeholder="e.g., Subscribe to My Channel and Comment"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Task Details</label>
              <textarea
                value={formData.detail}
                onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                rows={4}
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner resize-none"
                placeholder="Detailed instructions for the workers..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Required Workers</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]!">groups</span>
                <input
                  type="number"
                  min={1}
                  value={formData.requiredWorkers}
                  onChange={(e) => setFormData({ ...formData, requiredWorkers: parseInt(e.target.value) })}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white font-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Payment per Worker (Coins)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-[20px]!">monetization_on</span>
                <input
                  type="number"
                  min={1}
                  value={formData.payableAmount}
                  onChange={(e) => setFormData({ ...formData, payableAmount: parseInt(e.target.value) })}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white font-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Completion Deadline</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]!">event</span>
                <input
                  type="date"
                  value={formData.completionDate}
                  onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Proof Requirement</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]!">task_alt</span>
                <input
                  type="text"
                  value={formData.submissionInfo}
                  onChange={(e) => setFormData({ ...formData, submissionInfo: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                  placeholder="e.g., Screenshot of comment"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Example Image URL (Optional)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]!">image</span>
                <input
                  type="url"
                  value={formData.taskImageUrl}
                  onChange={(e) => setFormData({ ...formData, taskImageUrl: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          <div className={`rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-2 transition-all duration-300 ${hasEnoughCoins ? 'bg-primary/5 border-primary/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Total Campaign Cost</p>
              <p className={`text-4xl font-black ${hasEnoughCoins ? 'text-primary' : 'text-red-500'}`}>{totalCost.toLocaleString()} <span className="text-sm font-bold opacity-70">Coins</span></p>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-white/10 hidden md:block" />
            <div className="text-center md:text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Your Available Balance</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{userCoins.toLocaleString()} <span className="text-sm font-bold opacity-70">Coins</span></p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !hasEnoughCoins}
            className="w-full rounded-3xl bg-primary h-16 text-[#111813] text-xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin shadow-none">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[24px]!">rocket_launch</span>
                Launch Task Campaign
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
