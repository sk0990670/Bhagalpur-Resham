import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../shared/services/api';
import CustomerSidebar from '../../../shared/components/CustomerSidebar';

const ArtisanCreditsPage = () => {
  const [balanceData, setBalanceData] = useState<any>(null);
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreditData();
  }, []);

  const fetchCreditData = async () => {
    try {
      setLoading(true);
      const [balanceRes, ledgerRes] = await Promise.all([
        api.get('/credits/balance'),
        api.get('/credits/ledger')
      ]);

      if (balanceRes.data?.success) {
        setBalanceData(balanceRes.data.data);
      }
      if (ledgerRes.data?.success) {
        setLedgerData(ledgerRes.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch credit data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 w-full mx-auto relative bg-surface">
        <CustomerSidebar />
        <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-88px)]">
          <p className="font-label-caps text-on-surface-variant animate-pulse">Loading impact data...</p>
        </main>
      </div>
    );
  }

  const hasNoActivity = balanceData?.availableCredits === 0 && ledgerData.length === 0;

  return (
    <div className="flex flex-1 w-full mx-auto relative bg-surface">
      <CustomerSidebar />
      <main className="flex-1 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-88px)] w-full max-w-container-max mx-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header Section */}
          <section className="flex flex-col md:flex-row gap-8 items-start border-b border-outline-variant/20 pb-8">
            <div className="flex-1">
              <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Artisan Credits</h1>
              <p className="font-story-serif text-story-serif text-on-surface-variant italic">Your impact on the Bhagalpur weaving community.</p>
            </div>
          </section>

          {/* Credit Balance */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary text-on-primary p-6 rounded-lg ambient-shadow flex flex-col col-span-1 md:col-span-2 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none">
                <span className="material-symbols-outlined" style={{ fontSize: '150px', fontVariationSettings: "'FILL' 1" }}>stars</span>
              </div>
              <h3 className="font-label-caps text-label-caps uppercase tracking-widest opacity-80 mb-2">Available Balance</h3>
              <div className="flex items-end gap-3 mb-6">
                <span className="font-headline-xl text-5xl">₹{balanceData?.availableCredits?.toLocaleString() || 0}</span>
                <span className="font-body-md opacity-80 mb-1">Impact Credits</span>
              </div>
              <p className="font-body-md max-w-md mt-auto z-10">
                You earn 1% of your purchase value as Artisan Credits (₹100 spent = 1 credit). These credits directly represent the surplus revenue distributed to our weavers.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-lg ambient-shadow border border-outline-variant/30 flex flex-col justify-center items-center text-center">
              <span className="material-symbols-outlined text-secondary text-4xl mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
              <h3 className="font-headline-sm text-primary mb-2">{balanceData?.familiesSupported || 0} Families</h3>
              <p className="font-body-md text-on-surface-variant text-sm">Supported through your patronage this year.</p>
            </div>
          </section>

          {/* Analytics Summary */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant/20 text-center">
              <p className="text-[12px] text-on-surface-variant uppercase tracking-wider mb-1">Lifetime Earned</p>
              <p className="font-headline-sm text-primary">{balanceData?.earnedCredits?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant/20 text-center">
              <p className="text-[12px] text-on-surface-variant uppercase tracking-wider mb-1">Total Redeemed</p>
              <p className="font-headline-sm text-secondary">{balanceData?.redeemedCredits?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant/20 text-center">
              <p className="text-[12px] text-on-surface-variant uppercase tracking-wider mb-1">Orders Contributed</p>
              <p className="font-headline-sm text-on-surface">{balanceData?.deliveredOrdersCount || 0}</p>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant/20 text-center">
              <p className="text-[12px] text-on-surface-variant uppercase tracking-wider mb-1">Total Impact Value</p>
              <p className="font-headline-sm text-on-surface">₹{balanceData?.lifetimeSpend?.toLocaleString() || 0}</p>
            </div>
          </section>

          {/* How it works */}
          <section className="bg-surface-container-low p-8 madhubani-border ambient-shadow">
            <h3 className="font-headline-md text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">info</span>
              The Cycle of Patronage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-[2px] bg-outline-variant/30 -z-0"></div>

              <div className="text-center relative z-10">
                <div className="w-16 h-16 mx-auto bg-surface border-2 border-secondary rounded-full flex items-center justify-center mb-4 text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                </div>
                <h4 className="font-headline-sm text-primary mb-2">1. Purchase</h4>
                <p className="font-body-md text-on-surface-variant text-sm">Acquire a masterpiece of Bhagalpur heritage.</p>
              </div>

              <div className="text-center relative z-10">
                <div className="w-16 h-16 mx-auto bg-surface border-2 border-secondary rounded-full flex items-center justify-center mb-4 text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_1</span>
                </div>
                <h4 className="font-headline-sm text-primary mb-2">2. Support</h4>
                <p className="font-body-md text-on-surface-variant text-sm">Every ₹50,000 spent supports one artisan family.</p>
              </div>

              <div className="text-center relative z-10">
                <div className="w-16 h-16 mx-auto bg-surface border-2 border-secondary rounded-full flex items-center justify-center mb-4 text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
                </div>
                <h4 className="font-headline-sm text-primary mb-2">3. Redeem</h4>
                <p className="font-body-md text-on-surface-variant text-sm">Use your accumulated credits on future collections.</p>
              </div>
            </div>
          </section>
          
          {/* Ledger / History */}
          <section>
            <h3 className="font-headline-md text-primary mb-6">Recent Ledger</h3>
            
            {hasNoActivity ? (
              <div className="bg-surface-container-low p-12 text-center madhubani-border ambient-shadow">
                <span className="material-symbols-outlined text-6xl text-outline mb-4">auto_awesome</span>
                <h3 className="font-headline-sm text-2xl text-on-surface font-bold mb-2">Your journey with Bhagalpur Resham has just begun.</h3>
                <p className="font-body-md text-on-surface-variant mb-6">Start acquiring heritage pieces to build your impact credits.</p>
                <Link to="/collections" className="inline-block px-8 py-3 bg-primary text-on-primary font-label-caps hover:bg-primary/90 transition-colors">
                  Explore Collections
                </Link>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 overflow-hidden">
                <div className="divide-y divide-outline-variant/20">
                  {ledgerData.map((txn) => {
                    const isPositive = txn.type === 'CREDIT_EARNED' || txn.type === 'ADJUSTMENT';
                    const isRedeemed = txn.type === 'CREDIT_REDEEMED';
                    const isReversed = txn.type === 'CREDIT_REVERSED';
                    
                    return (
                      <div key={txn._id} className="p-4 sm:px-6 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isPositive ? 'bg-secondary-container text-on-secondary-container' : 
                            'bg-surface-variant text-on-surface-variant'
                          }`}>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {isPositive ? 'add' : 'remove'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-on-surface">
                              {txn.type === 'CREDIT_EARNED' && `Order #${txn.orderId?.orderId || 'Unknown'}`}
                              {txn.type === 'CREDIT_REDEEMED' && `Redeemed on Order #${txn.orderId?.orderId || 'Unknown'}`}
                              {txn.type === 'CREDIT_REVERSED' && `Refunded Order #${txn.orderId?.orderId || 'Unknown'}`}
                              {txn.type === 'ADJUSTMENT' && `Admin Adjustment`}
                            </p>
                            <p className="font-body-md text-sm text-on-surface-variant">
                              {new Date(txn.createdAt).toLocaleDateString()} &middot; ID: {txn.transactionId}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-headline-sm font-bold ${
                            isPositive ? 'text-secondary' : 'text-on-surface-variant'
                          }`}>
                            {isPositive ? '+' : '-'} ₹{txn.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {ledgerData.length === 0 && !hasNoActivity && (
                    <div className="p-8 text-center text-on-surface-variant">
                      No recent transactions found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default ArtisanCreditsPage;
