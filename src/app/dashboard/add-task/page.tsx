'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Loader2, Plus, Image as ImageIcon } from 'lucide-react';

export default function AddTaskPage() {
  const { data: session } = useSession();
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
      toast.error('Not enough coins. Redirecting to purchase page...');
      router.push('/dashboard/purchase-coin');
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
        router.push('/dashboard/my-tasks');
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Add New Task</h1>
        <p className="text-text-secondary">Create a new task for workers to complete</p>
      </div>

      <div className="rounded-xl border border-border bg-white p-8 dark:bg-bg-card-dark">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Task Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="e.g., Watch my YouTube video and make a comment"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Task Details</label>
            <textarea
              value={formData.detail}
              onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Provide detailed instructions for the task"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Required Workers</label>
              <input
                type="number"
                min={1}
                value={formData.requiredWorkers}
                onChange={(e) => setFormData({ ...formData, requiredWorkers: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">Payable Amount (coins)</label>
              <input
                type="number"
                min={1}
                value={formData.payableAmount}
                onChange={(e) => setFormData({ ...formData, payableAmount: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Completion Date</label>
            <input
              type="date"
              value={formData.completionDate}
              onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Submission Requirements</label>
            <input
              type="text"
              value={formData.submissionInfo}
              onChange={(e) => setFormData({ ...formData, submissionInfo: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="e.g., Screenshot of comment, link to proof"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Task Image URL (Optional)</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="url"
                value={formData.taskImageUrl}
                onChange={(e) => setFormData({ ...formData, taskImageUrl: e.target.value })}
                className="input pl-10"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className={`rounded-lg p-4 ${hasEnoughCoins ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-text-secondary">Total Cost</p>
                <p className="text-2xl font-bold text-primary">{totalCost} coins</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-secondary">Your Balance</p>
                <p className="text-lg font-semibold text-text">{userCoins} coins</p>
              </div>
            </div>
            {!hasEnoughCoins && (
              <p className="text-sm text-red-600 mt-2">Insufficient coins. Please purchase more.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !hasEnoughCoins}
            className="w-full rounded-lg bg-primary px-4 py-3 text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}