'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

const COIN_PACKAGES = [
  { coins: 10, price: 1, popular: false, icon: 'generating_tokens' },
  { coins: 150, price: 10, popular: true, icon: 'database' },
  { coins: 500, price: 20, popular: false, icon: 'account_balance' },
  { coins: 1000, price: 35, popular: false, icon: 'toll' },
];

export default function PurchaseCoinPage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof COIN_PACKAGES[0] | null>(null);

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPackage.price,
          coins: selectedPackage.coins,
          paymentMethod: 'Stripe',
        }),
      });

      if (response.ok) {
        toast.success(`Successfully purchased ${selectedPackage.coins} coins!`);
        // Update session
        const currentCoins = session?.user?.coins || 0;
        await update({
          ...session,
          user: {
            ...session?.user,
            coins: currentCoins + selectedPackage.coins
          }
        });
        setSelectedPackage(null);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Payment failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Purchase Coins</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Boost your account and launch more missions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {COIN_PACKAGES.map((pkg) => (
          <button
            key={pkg.coins}
            onClick={() => setSelectedPackage(pkg)}
            className={`group relative rounded-[2.5rem] border-2 p-8 text-center transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl ${
              selectedPackage?.coins === pkg.coins
                ? 'border-primary bg-primary/5 shadow-primary/10'
                : 'border-slate-200 dark:border-[#28392e] bg-white dark:bg-[#1a2e20] hover:border-primary/50'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] font-black text-[#111813] uppercase tracking-widest shadow-lg">
                Most Popular
              </span>
            )}
            
            <div className="mb-6 flex justify-center">
              <div className={`rounded-3xl p-5 ${selectedPackage?.coins === pkg.coins ? 'bg-primary text-[#111813]' : 'bg-slate-50 dark:bg-background-dark text-slate-400 group-hover:text-primary'}`}>
                <span className="material-symbols-outlined text-[40px]! leading-none">{pkg.icon}</span>
              </div>
            </div>
            
            <p className="text-5xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">{pkg.coins}</p>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">coins</p>
            
            <div className="pt-6 border-t border-slate-100 dark:border-white/5">
              <p className="text-2xl font-black text-primary">${pkg.price}</p>
            </div>

            {selectedPackage?.coins === pkg.coins && (
              <div className="absolute -bottom-2 -right-2 size-8 bg-primary rounded-full flex items-center justify-center border-4 border-white dark:border-background-dark">
                 <span className="material-symbols-outlined text-[80px]! text-slate-300 dark:text-slate-700 mb-6">receipt_long</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedPackage && (
        <div className="mt-12 rounded-[3.5rem] border border-slate-200 dark:border-[#28392e] bg-white p-10 dark:bg-[#1a2e20] shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Order Summary</h2>
              <p className="text-slate-500 font-bold max-w-xs mx-auto mb-10 group-hover:text-slate-400">Perfect for recruiters who don&apos;t want to pause.</p>
            </div>
            
            <div className="flex items-center gap-10">
              <div className="text-right">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                <p className="text-4xl font-black text-primary">${selectedPackage.price}</p>
              </div>
              
              <button
                onClick={handlePurchase}
                disabled={isLoading}
                className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-[#111813] h-16 px-10 font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin shadow-none">progress_activity</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-primary text-[20px]!">monetization_on</span>
                    Pay with Stripe
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
