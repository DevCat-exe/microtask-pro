'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';
import { 
  Wallet, 
  Loader2, 
  ChevronDown,
  DollarSign,
  CreditCard
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PAYMENT_METHODS = [
  { value: 'Stripe', label: 'Stripe' },
  { value: 'Bkash', label: 'Bkash' },
  { value: 'Rocket', label: 'Rocket' },
  { value: 'Nagad', label: 'Nagad' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
];

export default function WithdrawalsPage() {
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
  const canWithdraw = userCoins >= 200 && formData.withdrawalCoin <= userCoins;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canWithdraw) {
      toast.error('Insufficient coins for withdrawal');
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
        toast.success('Withdrawal request submitted successfully!');
        // Update session with new coin balance
        await update({ coins: userCoins - formData.withdrawalCoin });
        mutate();
        setFormData({
          withdrawalCoin: 200,
          paymentSystem: 'Stripe',
          accountNumber: '',
        });
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to submit withdrawal');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Withdrawals</h1>
        <p className="text-text-secondary">Request and track your withdrawals</p>
      </div>

      {/* Withdrawal Form */}
      <div className="rounded-xl border border-border bg-white p-6 dark:bg-bg-card-dark">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Balance */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-text">Your Balance</h2>
            <div className="rounded-xl bg-primary/10 p-6">
              <p className="text-sm text-text-secondary mb-1">Available Coins</p>
              <p className="text-4xl font-bold text-primary">{userCoins}</p>
            </div>
            <div className="rounded-xl bg-gray-100 p-6 dark:bg-bg-dark">
              <p className="text-sm text-text-secondary mb-1">Current Value</p>
              <p className="text-2xl font-bold text-text">${(userCoins / 20).toFixed(2)}</p>
              <p className="text-xs text-text-secondary mt-1">20 coins = $1.00</p>
            </div>
            {userCoins < 200 && (
              <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                Minimum withdrawal is 200 coins ($10.00)
              </div>
            )}
          </div>

          {/* Withdrawal Form */}
          <div>
            <h2 className="text-xl font-semibold text-text mb-6">Request Withdrawal</h2>
            {canWithdraw ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Amount (coins)
                  </label>
                  <input
                    type="number"
                    min={200}
                    max={userCoins}
                    value={formData.withdrawalCoin}
                    onChange={(e) => setFormData({ ...formData, withdrawalCoin: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Max: {userCoins} coins
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Withdrawal Amount
                  </label>
                  <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-3 dark:bg-bg-dark">
                    <DollarSign className="h-5 w-5 text-text-secondary" />
                    <span className="text-lg font-semibold text-text">{withdrawalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Payment Method
                  </label>
                  <div className="relative">
                    <select
                      value={formData.paymentSystem}
                      onChange={(e) => setFormData({ ...formData, paymentSystem: e.target.value })}
                      className="input appearance-none"
                      required
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Enter your account number"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-primary px-4 py-3 text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Request Withdrawal'}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <Wallet className="h-16 w-16 mx-auto text-text-secondary mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">Insufficient Coins</h3>
                <p className="text-text-secondary">
                  You need at least 200 coins ($10.00) to request a withdrawal.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Withdrawal History */}
      {withdrawals?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-text mb-4">Withdrawal History</h2>
          <div className="rounded-xl border border-border bg-white overflow-hidden dark:bg-bg-card-dark">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-bg-dark">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {withdrawals.map((withdrawal: any) => (
                  <tr key={withdrawal._id} className="hover:bg-gray-50 dark:hover:bg-bg-dark">
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {new Date(withdrawal.withdrawDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary">${withdrawal.withdrawalAmount}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{withdrawal.paymentSystem}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${withdrawal.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : withdrawal.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                        {withdrawal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}