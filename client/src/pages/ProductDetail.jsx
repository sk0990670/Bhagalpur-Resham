import React from 'react';

const ProductDetail = () => {
  return (
    <main className="pt-[100px] md:pt-[120px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      {/* Product Showcase (Bento-style Gallery + Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-section-gap">
        {/* Image Gallery (Left - 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full aspect-[3/4] bg-surface-container-low overflow-hidden shadow-tinted relative border border-outline-variant/20 p-2">
            <div className="w-full h-full border border-secondary-container p-1 relative">
              <img 
                alt="Full shot of Rajshahi Tussar Silk Saree" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg8gMr7CdgMmrlfIjr7sQHdQHGqylo50Vm1aw0hVFiviOEYvkNXRjn52PS-LiAVzRc1nOeM5nC4T7i3qGql4L22pUTQtDN1tI7k2AkS_E72nagADRDDGssEPzB0U3lMoFFo6Ex7CiVf1cAtEURJlNuHvWAmWlCqB8g9RQXcJWtfO8odrEJrp8d0CI6hYmJjo615ww14fLJFoqqV32cSCr7oy3aCbxuDtlXPzd_1Cp1a8EOlJydBzTtmoZd-6eWimuYRwV0_3ylmXPZ" 
              />
              {/* Artisan Badge */}
              <div className="absolute bottom-4 right-4 bg-surface/90 rounded-full w-12 h-12 flex items-center justify-center border border-secondary backdrop-blur-sm shadow-sm" title="Silk Mark Certified">
                <svg fill="none" height="24" stroke="#735c00" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path>
                  <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square bg-surface-container-low overflow-hidden shadow-tinted border border-outline-variant/20 p-1">
              <img 
                alt="Close up of Saree pallu" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbleXReDvh8YBb-YmvbLa77e0pXQuKXPi3ZqTLx1dwbG_7EnSKmasTpMRJUAgjwOFFu_nOPOENjkEIKJucyEZvNmNqrcLGXTYJ7lVD9eFnf0V7buM8xzE1xjM_z9RXgjumqpkkKhpWKefXfC79SB33OgMLBVk9Gubn7DVm4tvWwyl7dxxqos_7DakereUXKGJJv-VdI7bz4gajCrhvkXCLGNOnF7t4ia7cO637qoqvYiHFMc3yGwE_ulPLvSTSZGcl17JB27hCCY2A" 
              />
            </div>
            <div className="aspect-square bg-surface-container-low overflow-hidden shadow-tinted border border-outline-variant/20 p-1">
              <img 
                alt="Detail of Mithila motif" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8Mld9tCLoC_unJczyICPgE6o_qAHL49_y3chZQaOd7-CEUFvcgiEqvOWTNY2RLXxWbNKp-UnB2VnoT9Y6YHcIkB9t1jDX6KvglXeAyQOj4hNjckUDmY_HLM_eF5p8f2mVgvrpToDqBuRhJQgq8uS1nBPf7GgYsblIv5QUwIz8XocLmCdUeQKF78PtUBJQtXZYXysB4vWkKcGKy3IgoMMfID0vYYmv3SDGa7o39jp8knlc7r7IQMteZANAJSadrwIS_NdHZr0Vug7A" 
              />
            </div>
          </div>
        </div>

        {/* Product Info (Right - 5 cols) sticky */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-[120px] flex flex-col gap-6 p-6 bg-surface-container-low/50 shadow-tinted border border-outline-variant/20 backdrop-blur-sm">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.2em] mb-2 uppercase">Handcrafted in Bhagalpur</p>
              <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Rajshahi Tussar Silk Saree</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">₹ 24,500 <span className="text-sm ml-2 opacity-70">Incl. of all taxes</span></p>
            </div>
            <div className="w-full h-px bg-outline-variant/30 my-2 relative flex justify-center items-center">
              <span className="material-symbols-outlined text-secondary absolute bg-surface-container-low px-2" style={{ fontSize: '16px' }}>filter_vintage</span>
            </div>
            <p className="font-story-serif text-story-serif text-on-surface-variant leading-relaxed">
              A masterpiece taking 12 days to weave, this pure Tussar silk saree features the sacred Mithila fish motif along its borders—a centuries-old symbol of fertility and prosperity. Woven on traditional pit looms, its unbleached ivory base contrasts beautifully with rich madder-red accents.
            </p>
            
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Fabric</span>
                <span className="font-body-md text-on-surface">Pure Tussar Silk</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Technique</span>
                <span className="font-body-md text-on-surface">Handloom & Zari</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Care</span>
                <span className="font-body-md text-on-surface">Dry Clean Only</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-4 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group cursor-pointer">
                Add to Bag
                <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">shopping_bag</span>
              </button>
              <button className="w-full bg-transparent border border-secondary text-primary font-label-caps text-label-caps py-4 transition-all duration-300 hover:bg-surface-variant flex items-center justify-center gap-2 cursor-pointer">
                Add to Wishlist
                <span className="material-symbols-outlined">favorite_border</span>
              </button>
            </div>

            {/* Accordion for more details */}
            <div className="mt-4 border border-outline-variant/30">
              <details className="group">
                <summary className="flex justify-between items-center font-label-caps text-label-caps p-4 cursor-pointer text-primary hover:bg-surface-variant transition-colors">
                  Shipping & Returns
                  <span className="material-symbols-outlined transition duration-300 group-open:-rotate-180">expand_more</span>
                </summary>
                <div className="p-4 pt-0 text-body-md text-on-surface-variant bg-surface-container-low/50">
                  Complimentary express shipping globally. As this is a handcrafted piece, slight irregularities are part of its charm. Returns accepted within 14 days in original condition.
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
