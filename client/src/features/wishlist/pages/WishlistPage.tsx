import React from 'react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  return (
    <main className="flex-grow pt-12 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Your Saved Masterpieces</h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant max-w-2xl mx-auto">A curated selection of heritage silks you've admired. Ready to become part of your collection.</p>
        
        {/* Motif Divider */}
        <div className="flex items-center justify-center mt-8 opacity-60">
          <div className="h-px w-24 bg-secondary-container"></div>
          <span className="material-symbols-outlined text-secondary mx-4 text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>local_florist</span>
          <div className="h-px w-24 bg-secondary-container"></div>
        </div>
      </div>
      
      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Item 1 */}
        <div className="bg-surface-container-lowest masterpiece-card ambient-shadow flex flex-col group transition-transform duration-300 hover:-translate-y-1">
          <div className="relative p-4 flex-grow">
            {/* Image */}
            <div className="aspect-[3/4] overflow-hidden bg-surface-variant relative z-0">
              <img 
                alt="Madhubani Hand-painted Tussar Saree" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida/ADBb0ujvZ2gk9ZlWyI6cMg33QTOuFWUsn-MexVSiD55DTZfCUMqOG7TUmeRwdpbDmg7BmEfr5qQ9MXPRw4M8ui58zbl9ir_ZUuo0CJ2Kh3PMZNl5hWmESovzNNZ2SaI-tJalj1oTGveBBL6XUuKpQZq7GPgjuCL-l0OB3oTHCMQ_hU3GNGWVKh-qO6KjRV0w6PP7YfTTQxB4R_tbq4nbNzI9-AeukgmOZ3JjiopdSZP_0OogDU4-nubeYLatS-eB"
              />
            </div>
            {/* Remove Action */}
            <button aria-label="Remove from wishlist" className="absolute top-6 right-6 z-20 text-on-surface-variant bg-surface/80 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-error hover:bg-error-container cursor-pointer">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
            </button>
            {/* Content */}
            <div className="pt-6 pb-2 text-center relative z-20 bg-surface-container-lowest mt-[-20px] mx-4 border-t border-outline-variant">
              <h3 className="font-headline-md text-[24px] leading-tight text-primary mb-2">Madhubani Hand-painted Tussar</h3>
              <p className="font-body-md text-on-surface-variant mb-4 font-semibold tracking-wide">₹18,500</p>
            </div>
          </div>
          {/* Action */}
          <div className="px-8 pb-8 z-20 relative bg-surface-container-lowest">
            <button className="w-full bg-primary-container text-secondary-fixed py-3 font-label-caps text-label-caps hover:bg-primary transition-colors duration-300 flex justify-center items-center gap-2 cursor-pointer">
              MOVE TO BAG
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>local_mall</span>
            </button>
          </div>
        </div>
        
        {/* Item 2 */}
        <div className="bg-surface-container-lowest masterpiece-card ambient-shadow flex flex-col group transition-transform duration-300 hover:-translate-y-1">
          <div className="relative p-4 flex-grow">
            <div className="aspect-[3/4] overflow-hidden bg-surface-variant relative z-0">
              <img 
                alt="Pure Golden Tussar Classic Saree" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeGShf416KGewFQDNQyeW02IZa6PZdTKjc8dvkd6qrmTQ1gWBWY_81aBsrHRTAX36RWWfnSe1c0WLdmBnUuTcpE_irkd_z3AZGpUGWXMOEMLx2JrSwret29qFrJSYqaCaSyH5n5fZAdtwhMNhDQQ9BHDvRAru4VyjXsQJY_8beF88NJWbFavOCyjwrh6-xCixY58IOwQvJ8E3L9VPHVVDXlRjeIeYXE7WCbgu4Xv9orsbLXwv6P1Pr_z0BkTnGwmwsyToBbg7I15sv"
              />
            </div>
            <button aria-label="Remove from wishlist" className="absolute top-6 right-6 z-20 text-on-surface-variant bg-surface/80 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-error hover:bg-error-container cursor-pointer">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
            </button>
            <div className="pt-6 pb-2 text-center relative z-20 bg-surface-container-lowest mt-[-20px] mx-4 border-t border-outline-variant">
              <h3 className="font-headline-md text-[24px] leading-tight text-primary mb-2">Pure Golden Tussar Classic</h3>
              <p className="font-body-md text-on-surface-variant mb-4 font-semibold tracking-wide">₹14,200</p>
            </div>
          </div>
          <div className="px-8 pb-8 z-20 relative bg-surface-container-lowest">
            <button className="w-full bg-primary-container text-secondary-fixed py-3 font-label-caps text-label-caps hover:bg-primary transition-colors duration-300 flex justify-center items-center gap-2 cursor-pointer">
              MOVE TO BAG
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>local_mall</span>
            </button>
          </div>
        </div>
        
        {/* Item 3 */}
        <div className="bg-surface-container-lowest masterpiece-card ambient-shadow flex flex-col group transition-transform duration-300 hover:-translate-y-1">
          <div className="relative p-4 flex-grow">
            <div className="aspect-[3/4] overflow-hidden bg-surface-variant relative z-0">
              <img 
                alt="Indigo & Maroon Heritage Weave Saree" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIwgXmAQxzFzI84kgPMzQou-na5KunyxC4holVNf_U99cBr_eBwqvqVEabWIrua_8OLY4GNotfS3sCDW1rcKx-QNZtFU88eNoKJXxpPf84PzCn4kMa4h4hCN0Z98w1cDgqkcXBOrD5HPu3c6jHZcxJEpzMB-jsp5U6UNLuNb5E9DOMfOlBQM8UMezduhfXAl191StqGiRevhFd5wtlCtgaJImuOOcQWxD-98uxuyoGaBoL8nzHHkgWlBqNzXv_mX7erH5iBAQCqB7y"
              />
            </div>
            <button aria-label="Remove from wishlist" className="absolute top-6 right-6 z-20 text-on-surface-variant bg-surface/80 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-error hover:bg-error-container cursor-pointer">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
            </button>
            <div className="pt-6 pb-2 text-center relative z-20 bg-surface-container-lowest mt-[-20px] mx-4 border-t border-outline-variant">
              <h3 className="font-headline-md text-[24px] leading-tight text-primary mb-2">Indigo & Maroon Heritage Weave</h3>
              <p className="font-body-md text-on-surface-variant mb-4 font-semibold tracking-wide">₹21,000</p>
            </div>
          </div>
          <div className="px-8 pb-8 z-20 relative bg-surface-container-lowest">
            <button className="w-full bg-primary-container text-secondary-fixed py-3 font-label-caps text-label-caps hover:bg-primary transition-colors duration-300 flex justify-center items-center gap-2 cursor-pointer">
              MOVE TO BAG
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>local_mall</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Empty State (Hidden by default, shown here for structure if needed later) */}
      <div className="hidden flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-6" style={{ fontVariationSettings: "'FILL' 0" }}>favorite_border</span>
        <h2 className="font-headline-md text-headline-md text-primary mb-4">Your collection is waiting</h2>
        <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-8">Discover our latest masterpieces and save your favorites here.</p>
        <button className="border border-secondary-container text-primary px-8 py-3 font-label-caps text-label-caps hover:bg-surface-container-high transition-colors cursor-pointer">
          EXPLORE COLLECTIONS
        </button>
      </div>
    </main>
  );
};

export default Wishlist;
