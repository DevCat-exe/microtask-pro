'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PAYMENT_METHODS = [
  { value: 'Stripe', label: 'Stripe', icon: 'credit_card' },
  { value: 'Bkash', label: 'Bkash', icon: 'account_balance_wallet' },
  { value: 'Rocket', label: 'Rocket', icon: 'account_balance_wallet' },
  { value: 'Nagad', label: 'Nagad', icon: 'account_balance_wallet' },
  { value: 'Bank Transfer', label: 'Bank Transfer', icon: 'account_balance' },
];

export default function WorkerWithdrawalsPage() {
  const { data: session, update } = useSession();
  const { data: withdrawals, mutate } = useSWR('/api/withdrawals', fetcher);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    withdrawalCoin: 200,
    paymentSystem: 'Stripe',
    accountNumber: '',
  });

  const userCoins = session?.user?.coins || 0;
  const withdrawalAmount = formData.withdrawalCoin / 20; // 20 coins = $1
  const canWithdraw = userCoins >= 200;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.withdrawalCoin > userCoins) {
      toast.error('Insufficient coins for withdrawal');
      return;
    }

    if (formData.withdrawalCoin < 200) {
      toast.error('Minimum withdrawal is 200 coins');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerId: session?.user?.id,
          workerName: session?.user?.name,
          workerEmail: session?.user?.email,
          ...formData,
        }),
      });

      if (response.ok) {
        toast.success('Withdrawal request submitted!');
        await update({
          ...session,
          user: {
            ...session?.user,
            coins: userCoins - formData.withdrawalCoin
          }
        });
        mutate();
        setFormData({
          withdrawalCoin: 200,
          paymentSystem: 'Stripe',
          accountNumber: '',
        });
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to submit request');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-primary/10 text-primary border-primary/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Financial Center</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Convert your hard-earned coins into real world currency.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Balance & Highlights */}
        <div className="space-y-8">
           <div className="bg-slate-900 rounded-4xl p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent opacity-50" />
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Current Balance</p>
                 <div className="flex items-end gap-3 mb-10">
                    <span className="text-6xl font-black tracking-tighter text-white">{userCoins.toLocaleString()}</span>
                    <span className="text-xl font-bold text-primary mb-2">Coins</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6 pt-10 border-t border-white/10">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Equivalent Value</p>
                       <p className="text-3xl font-black text-white">${(userCoins / 20).toFixed(2)}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exchange Rate</p>
                       <p className="text-lg font-bold text-slate-300">20 Coins = $1.00</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-linear-to-br from-primary/10 to-transparent rounded-4xl p-10 border border-primary/20 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 text-primary/5 transition-transform group-hover:scale-110">
                 <span className="material-symbols-outlined text-160!">account_balance_wallet</span>
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">info</span>
                 Withdrawal Policy
              </h4>
              <ul className="space-y-4">
                 {[
                   { label: 'Minimum Withdrawal', value: '200 Coins ($10)' },
                   { label: 'Processing Time', value: '24 - 48 Hours' },
                   { label: 'Network Fee', value: '0.50 Coins per tx' },
                 ].map((item, idx) => (
                   <li key={idx} className="flex items-center justify-between text-sm font-medium">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-900 dark:text-white font-black">{item.value}</span>
                   </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* Right: Withdrawal Form */}
        <div className="bg-white dark:bg-[#1a2e20] rounded-4xl p-10 md:p-12 border border-slate-200 dark:border-[#28392e] shadow-2xl">
           <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl!">payments</span>
              Request Funds
           </h3>

           {!canWithdraw ? (
             <div className="py-12 text-center bg-slate-50 dark:bg-background-dark/50 rounded-4xl border-2 border-dashed border-slate-200 dark:border-[#28392e]">
                <span className="material-symbols-outlined text-6xl! text-slate-300 dark:text-slate-600 mb-4">lock</span>
                <p className="text-slate-500 font-bold max-w-60 mx-auto italic">Maintain at least 200 coins to unlock withdrawals.</p>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Amount to Withdraw (Coins)</label>
                    <div className="relative">
                       <input 
                        type="number"
                        min={200}
                        max={userCoins}
                        value={formData.withdrawalCoin}
                        onChange={(e) => setFormData({ ...formData, withdrawalCoin: parseInt(e.target.value) })}
                        className="w-full px-8 py-5 rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white font-black text-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-inner"
                       />
                       <span className="absolute right-8 top-1/2 -translate-y-1/2 text-primary font-black text-xl">
                          ≈ ${(formData.withdrawalCoin / 20).toFixed(2)}
                       </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                       {PAYMENT_METHODS.map((method) => (
                         <button
                          key={method.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentSystem: method.value })}
                          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${formData.paymentSystem === method.value ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-50 dark:bg-background-dark border-slate-100 dark:border-white/5 text-slate-500 hover:border-primary/50'}`}
                         >
                            <span className="material-symbols-outlined text-xl!">{method.icon}</span>
                            <span className="text-xs font-black uppercase tracking-tight">{method.label}</span>
                         </button>
                       ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Account Number / Details</label>
                    <input 
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="Enter wallet address or bank ID"
                      className="w-full px-8 py-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-[#111813] font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined animate-spin shadow-none">progress_activity</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-2xl!">send_money</span>
                      Submit Withdrawal
                    </>
                  )}
                </button>
             </form>
           )}
        </div>
      </div>

      {/* History */}
      {withdrawals?.length > 0 && (
        <div className="mt-20">
           <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Withdrawal History</h2>
           <div className="bg-white dark:bg-[#1a2e20] rounded-4xl border border-slate-200 dark:border-[#28392e] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50 dark:bg-background-dark/50 border-b border-slate-200 dark:border-[#28392e]">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Requested</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                       {withdrawals.map((w: any) => (
                         <tr key={w._id} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors group">
                            <td className="px-8 py-6">
                               <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{new Date(w.withdrawDate).toLocaleDateString()}</p>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-2">
                                  <span className="text-lg font-black text-slate-900 dark:text-white">${w.withdrawalAmount.toLocaleString()}</span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">({w.withdrawalCoin} Coins)</span>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{w.paymentSystem}</p>
                            </td>
                            <td className="px-8 py-6 text-right">
                               {getStatusBadge(w.status)}
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
