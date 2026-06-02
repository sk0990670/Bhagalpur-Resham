import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';
import { authService } from '../../../shared/services/auth.service';

const CustomerSupportPage = () => {
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

          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 hover:bg-surface-container-highest transition-colors" to="/artisan-credits">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span className="font-body-md text-body-md">Artisan Credits</span>
          </Link>
          <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 hover:bg-surface-container-highest transition-colors" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md text-body-md">Settings</span>
          </a>
        </nav>
        <div className="mt-auto px-4 flex flex-col gap-2 border-t border-outline-variant/20 pt-4">
          <Link className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container font-semibold rounded-lg hover:bg-surface-container-highest transition-colors translate-x-1" to="/support">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>
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
              <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Customer Support</h1>
              <p className="font-story-serif text-story-serif text-on-surface-variant italic">How can we assist you today?</p>
            </div>
          </section>

          {/* Contact Options */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-lg ambient-shadow border border-outline-variant/30 flex flex-col h-full">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">mail</span>
              <h3 className="font-headline-sm text-primary mb-2">Email Us</h3>
              <p className="font-body-md text-on-surface-variant mb-6 flex-grow">
                Our support team is available to assist you with any inquiries regarding your orders, the heritage of our silk, or our artisans.
              </p>
              <a href="mailto:support@bhagalpurresham.com" className="bg-primary text-on-primary font-label-caps text-center py-3 px-6 rounded hover:bg-primary-container transition-colors">
                support@bhagalpurresham.com
              </a>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-lg ambient-shadow border border-outline-variant/30 flex flex-col h-full">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">call</span>
              <h3 className="font-headline-sm text-primary mb-2">Call Us</h3>
              <p className="font-body-md text-on-surface-variant mb-6 flex-grow">
                Speak directly with a patron concierge for immediate assistance with urgent matters or custom orders.
              </p>
              <a href="tel:+9118001234567" className="bg-primary text-on-primary font-label-caps text-center py-3 px-6 rounded hover:bg-primary-container transition-colors">
                +91 1800 123 4567
              </a>
            </div>
          </section>

          {/* Quick Form */}
          <section className="bg-surface-container-low p-8 madhubani-border ambient-shadow mt-8">
            <h3 className="font-headline-md text-primary mb-6">Send us a Message</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
              <div>
                <label className="block text-sm text-on-surface-variant font-label-caps uppercase mb-2">Subject</label>
                <select className="w-full bg-surface border border-outline-variant/50 focus:border-primary rounded px-4 py-3 text-on-surface font-body-md outline-none">
                  <option>Order Inquiry</option>
                  <option>Product Information</option>
                  <option>Artisan Details</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-on-surface-variant font-label-caps uppercase mb-2">Message</label>
                <textarea 
                  className="w-full bg-surface border border-outline-variant/50 focus:border-primary rounded px-4 py-3 text-on-surface font-body-md outline-none min-h-[150px]" 
                  placeholder="Describe your issue or question in detail..."
                  required
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  className="bg-secondary text-on-secondary font-label-caps px-8 py-3 rounded hover:bg-secondary-container transition-colors tracking-widest shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CustomerSupportPage;
