'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { 
  Briefcase, 
  Calendar, 
  Users, 
  Coins, 
  ArrowRight,
  Loader2,
  Search
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TaskListPage() {
  const { data: tasks, error, isLoading } = useSWR('/api/tasks', fetcher);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks?.filter((task: any) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load tasks. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Available Tasks</h1>
          <p className="text-text-secondary">Browse and complete tasks to earn coins</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      {filteredTasks?.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task: any) => (
            <div
              key={task._id}
              className="group rounded-xl border border-border bg-white overflow-hidden hover:border-primary/50 transition-all dark:bg-bg-card-dark"
            >
              {task.taskImageUrl && (
                <img
                  src={task.taskImageUrl}
                  alt={task.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text mb-2 line-clamp-1">
                  {task.title}
                </h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {task.detail}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-bg-dark">
                    <p className="text-xs text-text-secondary uppercase">Payable</p>
                    <p className="text-lg font-bold text-primary">{task.payableAmount} coins</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-bg-dark">
                    <p className="text-xs text-text-secondary uppercase">Remaining</p>
                    <p className="text-lg font-bold text-text">{task.remainingWorkers}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(task.completionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Users className="h-4 w-4" />
                    <span>{task.requiredWorkers} workers needed</span>
                  </div>
                </div>
                
                <Link
                  href={`/dashboard/tasks/${task._id}`}
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-2 text-white font-medium hover:bg-primary-dark transition-colors"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-semibold text-text mb-2">No tasks available</h3>
          <p className="text-text-secondary">Check back later for new tasks</p>
        </div>
      )}
    </div>
  );
}