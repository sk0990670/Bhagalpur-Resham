import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto w-full">
      {/* Celebratory Section */}
      <div className="text-center max-w-2xl mb-[64px]">
        <h1 className="font-display-lg text-display-lg text-primary mb-[24px] max-md:font-display-lg-mobile max-md:text-display-lg-mobile">
          Thank You.
        </h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant mb-[48px]">
          Your acquisition of Bhagalpur heritage is confirmed. The loom now weaves your legacy.
        </p>
        
        {/* Madhubani Artwork Divider */}
        <div className="flex justify-center items-center gap-4 mb-[48px] opacity-80">
          <span className="h-px bg-outline-variant w-24"></span>
          <img 
            alt="Ornamental divider" 
            className="h-10 object-contain mix-blend-multiply filter grayscale opacity-60" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgQA2SDhCCeG0jLfFOt5oMzMFakPHbI0sDc34WDS1tQ_T_5Nkc2LJM_zlc1yZ5zJ7ut_4kpIwO2yCaXzb2ZiZ0Pz5FQzyGU-FA2iF9q2xdOoVlVm5fh2bC_vVxOuZ-xpv99gqcM6XIcAznPM3eKIuHEIG0mQ7CosS6tM-78OfLhSUV6iXE5kbS-p6RWc8xUc6AbkRWmjy_zwhBEIgO4JhOTHgUKKieE2wHfMCvzjKC4RDzoZFGwkRQHL8APNsKFpWVIBNRLHIRj31-" 
          />
          <span className="h-px bg-outline-variant w-24"></span>
        </div>
        
        {/* Order Details */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-gutter text-on-surface">
          <div className="flex flex-col items-center">
            <span className="font-label-caps text-label-caps text-outline mb-1">Order Number</span>
            <span className="font-headline-md text-headline-md text-primary">#BR-99021</span>
          </div>
          <div className="hidden md:block w-px h-12 bg-outline-variant"></div>
          <div className="flex flex-col items-center">
            <span className="font-label-caps text-label-caps text-outline mb-1">Estimated Delivery</span>
            <span className="font-body-lg text-body-lg text-on-surface-variant mt-1">October 24, 2024</span>
          </div>
        </div>
      </div>

      {/* The "Masterpiece" Product Summary Card */}
      <div className="w-full max-w-3xl bg-surface-container-lowest p-[16px] tinted-shadow mb-[64px]">
        <div className="border border-secondary-container p-[24px] flex flex-col md:flex-row gap-[32px] items-center md:items-start relative">
          {/* Artisan Badge */}
          <div className="absolute top-[16px] left-[16px] z-10 bg-surface-container-lowest rounded-full p-2 border border-secondary-container tinted-shadow" title="Silk Mark Certified">
            <span className="material-symbols-outlined text-secondary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>verified</span>
          </div>
          
          {/* Product Thumbnail */}
          <div className="w-full md:w-[240px] aspect-[3/4] bg-surface-variant overflow-hidden">
            <img 
              alt="Crimson Zari Kanjivaram" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzSuJi2HFlGwVCamw4E6ZSVA_iWbhYPtQGfYeOayt699jf_TeS9SR-VisH9KgoohCVQVH_kVaUH4YczAqvyb6Z8VwMJh2Pkm6HCkZoJvlLzgy1bX6D380fq40XZZEAXs4qtQ7CMwkhWz8E2lGP8A3tEtrZn22HeWXYJKXQlw7c2XtpUN_qqCXFoJWTeBKv7rc1as2Dz8WKEDVVWSK_RMP_4O_WeEOYb2D63s1ASVUDUtMwG-7-tWeANy_gQ9G9OJGH_FHiLVtcN6VW" 
            />
          </div>
          
          {/* Product Details */}
          <div className="flex-1 flex flex-col justify-center h-full py-4 text-center md:text-left">
            <h2 className="font-headline-xl text-headline-xl text-primary mb-[16px]">Crimson Zari Kanjivaram</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-[24px] max-w-md">
              Handwoven over 14 days by master artisan Shri Ramdev. 100% pure Bhagalpur Tussar silk with authentic gold zari border.
            </p>
            <div className="mt-auto">
              <div className="flex justify-between items-center border-t border-outline-variant pt-[16px]">
                <span className="font-label-caps text-label-caps text-outline">Total Paid</span>
                <span className="font-body-lg text-body-lg text-on-surface font-semibold">₹ 24,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-gutter justify-center w-full max-w-md">
        {/* Secondary Button */}
        <Link to="/collections" className="flex-1 py-[16px] px-[24px] border border-secondary-container bg-transparent text-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-variant transition-colors duration-300 text-center cursor-pointer">
          Continue Shopping
        </Link>
        {/* Primary Button */}
        <button className="flex-1 py-[16px] px-[24px] bg-primary-container text-secondary-container font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary transition-colors duration-300 flex justify-center items-center gap-2 cursor-pointer">
          Download Invoice
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
        </button>
      </div>
    </main>
  );
};

export default OrderConfirmation;
