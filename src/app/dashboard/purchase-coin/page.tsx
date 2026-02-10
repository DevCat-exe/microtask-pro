'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Coins, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';

const COIN_PACKAGES = [
  { coins: 10, price: 1, popular: false },
  { coins: 150, price: 10, popular: true },
  { coins: 500, price: 20, popular: false },
  { coins: 1000, price: 35, popular: false },
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
        // Update session with new coin balance
        const currentCoins = session?.user?.coins || 0;
        await update({ coins: currentCoins + selectedPackage.coins });
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Purchase Coins</h1>
        <p className="text-text-secondary">Choose a package to buy coins for posting tasks</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {COIN_PACKAGES.map((pkg) => (
          <button
            key={pkg.coins}
            onClick={() => setSelectedPackage(pkg)}
            className={`relative rounded-xl border-2 p-6 text-center transition-all hover:shadow-lg ${
              selectedPackage?.coins === pkg.coins
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </span>
            )}
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Coins className="h-8 w-8 text-primary" />
              </div>
            </div>
            <p className="text-4xl font-bold text-text mb-1">{pkg.coins}</p>
            <p className="text-text-secondary mb-4">coins</p>
            <p className="text-2xl font-bold text-primary">${pkg.price}</p>
          </button>
        ))}
      </div>

      {selectedPackage && (
        <div className="rounded-xl border border-border bg-white p-6 dark:bg-bg-card-dark">
          <h2 className="text-xl font-semibold text-text mb-4">Confirm Purchase</h2>
          <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-gray-50 dark:bg-bg-dark">
            <div>
              <p className="text-sm text-text-secondary">Package</p>
              <p className="text-lg font-semibold text-text">{selectedPackage.coins} coins</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary">Total</p>
              <p className="text-2xl font-bold text-primary">${selectedPackage.price}</p>
            </div>
          </div>
          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-3 text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Pay with Stripe
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}