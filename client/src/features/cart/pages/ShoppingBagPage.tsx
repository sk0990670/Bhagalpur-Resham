import React from 'react';
import { Link } from 'react-router-dom';
import highEndFashionPhotographyOfAModelInALuxuriousBhagalpuriSilkSareeAsset from '../../../assets/high_end_fashion_photography_of_a_model_in_a_luxurious_bhagalpuri_silk_saree.png';


const ShoppingBag = () => {
  return (
    <main className="flex-grow pt-16 md:pt-[100px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      <h1 className="font-display-lg text-headline-xl text-primary mb-12 text-center md:text-left">Your Curated Selection</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Cart Items (Left Column) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Item 1 */}
          <div className="bg-surface-container-lowest p-4 md:p-6 motif-border flex flex-col md:flex-row gap-6 items-start">
            <img 
              alt="Rajshahi Tussar Silk Saree" 
              className="w-full md:w-48 h-auto object-cover aspect-[1.75]" 
              src={highEndFashionPhotographyOfAModelInALuxuriousBhagalpuriSilkSareeAsset} 
            />
            <div className="flex-grow flex flex-col justify-between h-full w-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-story-serif text-story-serif text-on-surface mb-1">Rajshahi Tussar Silk Saree</h3>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">SKU: BRS-4920-RTS</p>
                </div>
                <span className="font-body-lg text-body-lg text-primary">₹14,500</span>
              </div>
              <div className="flex justify-between items-end mt-auto pt-6">
                <div className="flex items-center border-b border-primary pb-1">
                  <button className="text-primary hover:text-primary-container px-2 cursor-pointer"><span className="material-symbols-outlined text-[18px]">remove</span></button>
                  <span className="font-body-md text-body-md px-4">1</span>
                  <button className="text-primary hover:text-primary-container px-2 cursor-pointer"><span className="material-symbols-outlined text-[18px]">add</span></button>
                </div>
                <div className="flex gap-4">
                  <button className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4 decoration-outline-variant cursor-pointer">Save for later</button>
                  <button className="font-label-caps text-label-caps text-error hover:text-error-container transition-colors flex items-center gap-1 cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">delete</span> Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary (Right Column) */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-low p-8 motif-border sticky top-[100px]">
            <h2 className="font-headline-md text-headline-md text-primary mb-6 border-b border-outline-variant/50 pb-4">Order Summary</h2>
            <div className="flex flex-col gap-4 mb-8 border-b border-outline-variant/50 pb-6">
              <div className="flex justify-between font-body-md text-body-md text-on-surface">
                <span>Subtotal</span>
                <span>₹14,500</span>
              </div>
              <div className="flex justify-between font-body-md text-body-md text-on-surface">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-body-md text-body-md text-on-surface">
                <span>Estimated Tax</span>
                <span>₹725</span>
              </div>
            </div>
            <div className="flex justify-between font-story-serif text-story-serif text-primary mb-8 font-semibold">
              <span>Total</span>
              <span>₹15,225</span>
            </div>
            <div className="mb-8">
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2" htmlFor="coupon">GIFT CARD OR DISCOUNT CODE</label>
              <div className="flex gap-2">
                <input 
                  className="flex-grow bg-transparent border-0 border-b border-primary focus:ring-0 focus:border-b-2 px-0 py-2 font-body-md text-body-md placeholder-outline" 
                  id="coupon" 
                  placeholder="Enter code" 
                  type="text" 
                />
                <button className="px-4 py-2 font-label-caps text-label-caps text-primary border border-primary hover:bg-primary/5 transition-colors cursor-pointer">APPLY</button>
              </div>
            </div>
            <Link to="/checkout" className="w-full bg-primary-container text-[#FFD700] hover:bg-primary transition-colors py-4 font-label-caps text-label-caps tracking-widest flex justify-center items-center gap-2 cursor-pointer">
              PROCEED TO CHECKOUT
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <p className="text-center font-label-caps text-label-caps text-on-surface-variant mt-4 pt-4 border-t border-outline-variant/30 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px]">lock</span> Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShoppingBag;
