import React from 'react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  return (
    <main className="flex-grow pt-16 md:pt-[100px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      <div className="mb-12 text-center md:text-left">
        <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Secure Checkout</h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant italic">Complete your acquisition of handcrafted heritage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-12">
          {/* Contact Info */}
          <section>
            <h2 className="font-headline-md text-headline-md text-tertiary mb-6 border-b border-outline-variant/50 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">contact_mail</span>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="email">Email Address *</label>
                <input className="input-line font-body-md text-body-md text-on-surface focus:ring-0" id="email" placeholder="your@email.com" type="email" />
              </div>
              <div className="flex flex-col">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="phone">Phone Number *</label>
                <input className="input-line font-body-md text-body-md text-on-surface focus:ring-0" id="phone" placeholder="+91 98765 43210" type="tel" />
              </div>
            </div>
          </section>

          {/* Delivery Address */}
          <section>
            <h2 className="font-headline-md text-headline-md text-tertiary mb-6 border-b border-outline-variant/50 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">local_shipping</span>
              Delivery Address
            </h2>
            <div className="space-y-6">
              <div className="flex flex-col">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="fullName">Full Name *</label>
                <input className="input-line font-body-md text-body-md text-on-surface focus:ring-0" id="fullName" placeholder="As it appears on your ID" type="text" />
              </div>
              <div className="flex flex-col">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="address1">Address Line 1 *</label>
                <input className="input-line font-body-md text-body-md text-on-surface focus:ring-0" id="address1" placeholder="House/Flat No., Building Name" type="text" />
              </div>
              <div className="flex flex-col">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="address2">Address Line 2 (Optional)</label>
                <input className="input-line font-body-md text-body-md text-on-surface focus:ring-0" id="address2" placeholder="Street, Locality" type="text" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="city">City *</label>
                  <input className="input-line font-body-md text-body-md text-on-surface focus:ring-0" id="city" placeholder="City" type="text" />
                </div>
                <div className="flex flex-col">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="state">State *</label>
                  <input className="input-line font-body-md text-body-md text-on-surface focus:ring-0" id="state" placeholder="State" type="text" />
                </div>
                <div className="flex flex-col">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="zip">ZIP / Postal Code *</label>
                  <input className="input-line font-body-md text-body-md text-on-surface focus:ring-0" id="zip" placeholder="ZIP" type="text" />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="landmark">Landmark (Optional)</label>
                <input className="input-line font-body-md text-body-md text-on-surface focus:ring-0" id="landmark" placeholder="Near a known place" type="text" />
              </div>
            </div>
          </section>

          {/* Shipping Method */}
          <section>
            <h2 className="font-headline-md text-headline-md text-tertiary mb-6 border-b border-outline-variant/50 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">inventory_2</span>
              Shipping Method
            </h2>
            <div className="space-y-4">
              <label className="flex items-center p-4 border border-outline-variant cursor-pointer hover:bg-surface-container-low transition-colors">
                <input defaultChecked className="text-tertiary focus:ring-tertiary w-5 h-5 cursor-pointer" name="shipping" type="radio" />
                <div className="ml-4 flex-grow flex justify-between items-center">
                  <div>
                    <span className="block font-body-md text-body-md font-semibold text-on-surface">Standard Heritage Delivery</span>
                    <span className="block font-body-md text-body-md text-on-surface-variant text-sm">5-7 Business Days</span>
                  </div>
                  <span className="font-body-md text-body-md font-semibold text-on-surface">Free</span>
                </div>
              </label>
              <label className="flex items-center p-4 border border-outline-variant cursor-pointer hover:bg-surface-container-low transition-colors opacity-70">
                <input className="text-tertiary focus:ring-tertiary w-5 h-5 cursor-pointer" name="shipping" type="radio" />
                <div className="ml-4 flex-grow flex justify-between items-center">
                  <div>
                    <span className="block font-body-md text-body-md font-semibold text-on-surface">Express Royal Courier</span>
                    <span className="block font-body-md text-body-md text-on-surface-variant text-sm">2-3 Business Days</span>
                  </div>
                  <span className="font-body-md text-body-md font-semibold text-on-surface">₹500</span>
                </div>
              </label>
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h2 className="font-headline-md text-headline-md text-tertiary mb-6 border-b border-outline-variant/50 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">payments</span>
              Payment Method
            </h2>
            <div className="space-y-4">
              {/* UPI */}
              <div className="border border-outline-variant">
                <label className="flex items-center p-4 cursor-pointer hover:bg-surface-container-low transition-colors">
                  <input defaultChecked className="text-tertiary focus:ring-tertiary w-5 h-5 cursor-pointer" name="payment" type="radio" />
                  <span className="ml-4 font-body-md text-body-md font-semibold text-on-surface">UPI / QR Code</span>
                </label>
                <div className="p-4 bg-surface-container-low border-t border-outline-variant flex flex-col items-center justify-center gap-4">
                  <div className="w-48 h-48 bg-white border border-outline p-2 flex items-center justify-center relative">
                    {/* QR Code Placeholder */}
                    <div className="absolute inset-0 bg-gray-200 opacity-20"></div>
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">qr_code_2</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant text-center text-sm">Scan with any UPI app</p>
                </div>
              </div>
              {/* Card */}
              <div className="border border-outline-variant">
                <label className="flex items-center p-4 cursor-pointer hover:bg-surface-container-low transition-colors">
                  <input className="text-tertiary focus:ring-tertiary w-5 h-5 cursor-pointer" name="payment" type="radio" />
                  <span className="ml-4 font-body-md text-body-md font-semibold text-on-surface">Credit / Debit Card</span>
                </label>
              </div>
              {/* Net Banking */}
              <div className="border border-outline-variant">
                <label className="flex items-center p-4 cursor-pointer hover:bg-surface-container-low transition-colors">
                  <input className="text-tertiary focus:ring-tertiary w-5 h-5 cursor-pointer" name="payment" type="radio" />
                  <span className="ml-4 font-body-md text-body-md font-semibold text-on-surface">Net Banking</span>
                </label>
              </div>
              {/* COD */}
              <div className="border border-outline-variant">
                <label className="flex items-center p-4 cursor-pointer hover:bg-surface-container-low transition-colors">
                  <input className="text-tertiary focus:ring-tertiary w-5 h-5 cursor-pointer" name="payment" type="radio" />
                  <span className="ml-4 font-body-md text-body-md font-semibold text-on-surface">Cash on Delivery</span>
                </label>
              </div>
            </div>
          </section>

          <div className="pt-6">
            <Link to="/order-confirmation" className="w-full bg-primary hover:bg-tertiary text-on-primary font-label-caps text-label-caps uppercase py-4 px-8 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer">
              Complete Secure Order
              <span className="material-symbols-outlined">lock</span>
            </Link>
            <p className="text-center mt-4 font-body-md text-sm text-on-surface-variant">By placing your order, you agree to our Terms of Service & Privacy Policy.</p>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32 mithila-border shadow-[0_4px_20px_-4px_rgba(128,0,32,0.04)]">
            <h3 className="font-headline-md text-headline-md text-tertiary mb-6 border-b border-secondary/20 pb-4 text-center">Your Selection</h3>
            
            {/* Items */}
            <div className="space-y-6 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {/* Item 1 */}
              <div className="flex gap-4 items-start">
                <div className="w-24 h-32 flex-shrink-0 bg-surface-variant border border-secondary/30 relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCwn_eBsrF2Mm0kcegD1o6ZSCWPc1PxH2DQtMoFlf492usmVv_xvLg5LGENtVwZwHNRjBzYSJ__N45gHcpse96jfALhks7XClC0__RBpk4Cc_ZzV_T-U9wSdUeZDI3OmvDDB8bfkhsNm-t5YiA8J1Dq_Aw2ih1xM9FRauBKLzcVehsS6OQ56lPSK1coAgFeEWLS38YNh9WQWo_zyEMXd5aCXp9XkT1nwVV9eizqL-JX054-oBP-Z3UJkQWP45W8tkr0tg5Y2k8Q7aUb')` }}
                  ></div>
                </div>
                <div className="flex-grow">
                  <h4 className="font-headline-md text-lg text-on-surface leading-tight mb-1">Crimson Zari Kanjivaram</h4>
                  <p className="font-body-md text-sm text-on-surface-variant mb-2">Bhagalpuri Silk • Handwoven</p>
                  <div className="flex justify-between items-center">
                    <span className="font-body-md text-body-md">Qty: 1</span>
                    <span className="font-body-md text-body-md font-semibold">₹24,500</span>
                  </div>
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="flex gap-4 items-start">
                <div className="w-24 h-32 flex-shrink-0 bg-surface-variant border border-secondary/30 relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAnNXmCZajGQm557tZxONNEIJb3JegZBin-lS-NtGrUps4cbPTjjfpq-2FYabiz4bRY7cKnUc4MYgHSogJBooGB4S5R6P2iJdqN0_J-iL1IYY4l7U9CObzkpai0dIjR9HfqnM9zsdIj-bD5aun4tr6y_i1t7NP1e0-jXP0MGz4R6jv56HcWXhOUALfEaFzqn6S2ajmWOIN_ubteKwC2gg1V4yU5nrslTXj8Peaw4BMvit3bWjQi31T4fFsAFn85-8rlVT57c3ydOIVt')` }}
                  ></div>
                </div>
                <div className="flex-grow">
                  <h4 className="font-headline-md text-lg text-on-surface leading-tight mb-1">Ivory Tussar Classic</h4>
                  <p className="font-body-md text-sm text-on-surface-variant mb-2">Wild Silk • Natural Dye</p>
                  <div className="flex justify-between items-center">
                    <span className="font-body-md text-body-md">Qty: 1</span>
                    <span className="font-body-md text-body-md font-semibold">₹18,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="border-t border-secondary/20 pt-4 space-y-3 font-body-md text-body-md">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>₹42,500</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Estimated Taxes</span>
                <span>₹2,125</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-secondary/50 mt-4 pt-4 flex justify-between items-end">
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Grand Total</span>
              <span className="font-headline-xl text-headline-xl text-primary leading-none">₹44,625</span>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-outline-variant/30 grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-secondary mb-1">verified</span>
                <span className="text-[10px] font-label-caps uppercase text-on-surface-variant">Silk Mark Certified</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-secondary mb-1">handshake</span>
                <span className="text-[10px] font-label-caps uppercase text-on-surface-variant">Authentic Handloom</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-secondary mb-1">shield_lock</span>
                <span className="text-[10px] font-label-caps uppercase text-on-surface-variant">256-bit Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
