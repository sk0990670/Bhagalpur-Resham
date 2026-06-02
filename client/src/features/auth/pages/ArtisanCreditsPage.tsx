import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../authSlice';
import { authService } from '../../../shared/services/auth.service';

const ArtisanCreditsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout failed:', e);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-1 w-full mx-auto relative">
      {/* SideNavBar */}
      <aside className="w-64 flex-shrink-0 bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant/20 hidden md:flex flex-col py-8">
        <div className="px-6 mb-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-surface-variant flex items-center justify-center mb-4 border border-secondary-container">
            <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
          </div>
          <h2 className="font-headline-md text-[20px] font-semibold text-primary">Welcome, Patron</h2>
          <p className="font-body-md text-[14px] text-on-surface-variant">Custodian of Heritage</p>
          <button className="mt-4 px-4 py-2 bg-primary-container text-on-primary text-label-caps uppercase tracking-widest hover:bg-primary transition-colors w-full border border-secondary-fixed-dim">
            View Loom Status
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 hover:bg-surface-container-highest transition-colors" to="/dashboard">
            <span className="material-symbols-outlined">account_circle</span>
            <span className="font-body-md text-body-md">My Profile</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 hover:bg-surface-container-highest transition-colors" to="/order-history">
            <span className="material-symbols-outlined">potted_plant</span>
            <span className="font-body-md text-body-md">Order History</span>
          </Link>

          <Link className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container font-semibold rounded-lg mx-2 hover:bg-surface-container-highest transition-colors translate-x-1" to="/artisan-credits">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="font-body-md text-body-md">Artisan Credits</span>
          </Link>
          <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 hover:bg-surface-container-highest transition-colors" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md text-body-md">Settings</span>
          </a>
        </nav>
        <div className="mt-auto px-4 flex flex-col gap-2 border-t border-outline-variant/20 pt-4">
          <Link className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors" to="/support">
            <span className="material-symbols-outlined">help</span>
            <span className="font-body-md text-[14px]">Support</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors w-full text-left cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-md text-[14px]">Log Out</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content Canvas */}
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
              {/* Decorative motif */}
              <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none">
                <span className="material-symbols-outlined" style={{ fontSize: '150px', fontVariationSettings: "'FILL' 1" }}>stars</span>
              </div>
              <h3 className="font-label-caps text-label-caps uppercase tracking-widest opacity-80 mb-2">Available Balance</h3>
              <div className="flex items-end gap-3 mb-6">
                <span className="font-headline-xl text-5xl">₹2,450</span>
                <span className="font-body-md opacity-80 mb-1">Impact Credits</span>
              </div>
              <p className="font-body-md max-w-md mt-auto z-10">
                You earn 5% of your purchase value as Artisan Credits. These credits directly represent the surplus revenue distributed to our weavers.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-lg ambient-shadow border border-outline-variant/30 flex flex-col justify-center items-center text-center">
              <span className="material-symbols-outlined text-secondary text-4xl mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
              <h3 className="font-headline-sm text-primary mb-2">3 Families</h3>
              <p className="font-body-md text-on-surface-variant text-sm">Supported through your patronage this year.</p>
            </div>
          </section>

          {/* How it works */}
          <section className="bg-surface-container-low p-8 madhubani-border ambient-shadow">
            <h3 className="font-headline-md text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">info</span>
              The Cycle of Patronage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line for desktop */}
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
                <p className="font-body-md text-on-surface-variant text-sm">A direct percentage empowers our artisan families.</p>
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
          
          {/* Recent Credit History */}
          <section>
            <h3 className="font-headline-md text-primary mb-6">Recent Ledger</h3>
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 overflow-hidden">
              <div className="divide-y divide-outline-variant/20">
                {/* Entry */}
                <div className="p-4 sm:px-6 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">Order #BR-99045</p>
                      <p className="font-body-md text-sm text-on-surface-variant">Nov 28, 2023</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline-sm text-secondary font-bold">+ ₹1,400</p>
                  </div>
                </div>

                {/* Entry */}
                <div className="p-4 sm:px-6 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>remove</span>
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">Redeemed on Order #BR-99021</p>
                      <p className="font-body-md text-sm text-on-surface-variant">Oct 12, 2023</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline-sm text-on-surface-variant">- ₹800</p>
                  </div>
                </div>

                {/* Entry */}
                <div className="p-4 sm:px-6 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">Order #BR-98872</p>
                      <p className="font-body-md text-sm text-on-surface-variant">Sep 05, 2023</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline-sm text-secondary font-bold">+ ₹1,850</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ArtisanCreditsPage;
