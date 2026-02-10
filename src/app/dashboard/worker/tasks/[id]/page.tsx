'use client';

import { useState, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WorkerTaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [submissionDetails, setSubmissionDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: task, isLoading: isTaskLoading } = useSWR(`/api/tasks/${id}`, fetcher);
  const { data: submissions, isLoading: isSubCheckLoading } = useSWR(
    session?.user?.email ? `/api/submissions?type=worker` : null,
    fetcher
  );

  const hasAlreadySubmitted = submissions?.some((sub: any) => sub.taskId === id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionDetails.trim()) {
      toast.error('Please provide submission details');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: id,
          submissionDetails,
        }),
      });

      if (response.ok) {
        toast.success('Submission sent successfully!');
        router.push('/dashboard/worker/submissions');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to submit proof');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isTaskLoading || isSubCheckLoading) return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary">progress_activity</span></div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div className="max-w-250 mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-3xl!">rocket_launch</span>
              <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Active Mission</span>
           </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {task.title}
          </h1>
        </div>
        <div className="bg-[#111813] dark:bg-primary rounded-3xl p-6 flex items-center gap-5 shadow-2xl shadow-primary/20">
           <div>
              <p className="text-xs! font-black text-primary uppercase tracking-widest">Reward</p>
              <p className="text-3xl font-black text-[#111813] dark:text-primary">{task.payableAmount} <span className="text-sm! opacity-70">Coins</span></p>
           </div>
           <span className="material-symbols-outlined text-4xl!">monetization_on</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           {/* Instructions */}
           <div className="bg-white dark:bg-[#1a2e20] rounded-4xl p-10 md:p-12 border border-slate-200 dark:border-[#28392e] shadow-xl">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary">description</span>
                 Mission Instructions
              </h3>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium whitespace-pre-wrap leading-relaxed">
                 {task.detail}
              </div>
           </div>

           {/* Submission Form */}
           {hasAlreadySubmitted ? (
             <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-4xl p-12 text-center">
                <span className="material-symbols-outlined text-6xl! text-primary mb-4">task_alt</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Proof Submitted!</h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto">You&apos;ve already completed this mission. The buyer is currently reviewing your evidence.</p>
                <button 
                  onClick={() => router.push('/dashboard/worker/submissions')}
                  className="mt-8 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-[#111813] font-black rounded-2xl hover:scale-105 transition-transform"
                >
                  Track Submission
                </button>
             </div>
           ) : (
              <div className="bg-slate-900 rounded-4xl p-10 md:p-12 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="mb-10 text-center">
                   <div className="size-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center border-2 border-dashed border-primary/30 mx-auto mb-6">
                      <span className="material-symbols-outlined text-primary text-3xl!">upload_file</span>
                   </div>
                   <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Submit Proof</h1>
                   <p className="text-slate-500 font-bold max-w-xs mx-auto">Upload your proof of completion as requested by the buyer.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Evidence / Proof Details</label>
                     <textarea 
                      value={submissionDetails}
                      onChange={(e) => setSubmissionDetails(e.target.value)}
                      placeholder={task.submissionInfo || "Provide the required proof here..."}
                      className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-white font-bold placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-50"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                           <span className="material-symbols-outlined text-primary">security</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 max-w-50">Evidence is encrypted and shared only with the Buyer.</p>
                     </div>
                    
                     <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto h-16 px-12 rounded-3xl bg-primary text-[#111813] font-black text-lg hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <span className="material-symbols-outlined animate-spin shadow-none">progress_activity</span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-xl!">send</span>
                          Complete Mission
                        </>
                      )}
                    </button>
                  </div>
                </form>
             </div>
           )}
        </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-[#1a2e20] rounded-4xl p-8 border border-slate-200 dark:border-[#28392e] shadow-xl">
              <h4 className="text-xs! font-black text-slate-400 uppercase tracking-widest mb-6">Mission Stats</h4>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                       <span className="material-symbols-outlined text-lg!">groups</span>
                       Spots Left
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{task.remainingWorkers} / {task.requiredWorkers}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                       <span className="material-symbols-outlined text-lg!">event</span>
                       Deadline
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{new Date(task.completionDate).toLocaleDateString()}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                       <span className="material-symbols-outlined text-lg!">person</span>
                       Recruiter
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{task.buyerName}</span>
                 </div>
              </div>
           </div>

            {task.taskImageUrl && (
               <div className="rounded-4xl overflow-hidden border border-slate-200 dark:border-[#28392e] shadow-xl relative min-h-64">
                  <Image 
                    src={task.taskImageUrl} 
                    alt="Task Example" 
                    fill
                    className="object-cover" 
                  />
               </div>
            )}
            
            <div className="bg-linear-to-br from-primary/10 to-transparent rounded-4xl p-8 border border-primary/10">
              <h4 className="text-sm font-black text-primary mb-2 flex items-center gap-2">
                 <span className="material-symbols-outlined text-lg!">verified_user</span>
                 Safety First
              </h4>
              <p className="text-xs! text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                 Always provide genuine proof. Fraudulent submissions may result in account suspension and loss of coins.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
