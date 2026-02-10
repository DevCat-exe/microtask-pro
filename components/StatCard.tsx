'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'primary';
  description?: string;
}

export default function StatCard({ title, value, icon, color, description }: StatCardProps) {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
    purple: 'bg-purple-500/10 text-purple-500',
    primary: 'bg-primary/10 text-primary',
  };

  return (
    <div className="bg-white dark:bg-[#1a2e20] rounded-4xl p-8 border border-slate-200 dark:border-[#28392e] group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className={`size-14 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
          <span className="material-symbols-outlined text-[28px]!">{icon}</span>
        </div>
        {description && (
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-full">
            {description}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
