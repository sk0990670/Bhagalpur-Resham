
const ReturnPolicy = () => {
  return (
    <main className="w-full pb-section-gap">
      {/* Hero Section */}
      <header className="pt-24 pb-16 px-margin-mobile md:px-margin-desktop text-center relative overflow-hidden">
        {/* Subtle background texture wrapper */}
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Returns & Exchanges</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Our commitment to artisanal quality and your satisfaction.</p>
        </div>
        
        {/* Motif Divider */}
        <div className="flex items-center justify-center py-12 relative z-10">
          <div className="h-[1px] w-24 bg-secondary opacity-30"></div>
          <div className="w-2 h-2 rotate-45 bg-secondary mx-4 opacity-80"></div>
          <div className="h-[1px] w-24 bg-secondary opacity-30"></div>
        </div>
      </header>
      
      {/* Policy Content Layout */}
      <article className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter relative z-10">
        {/* Main Content Column */}
        <div className="lg:col-start-3 lg:col-span-8 space-y-section-gap">
          
          {/* Section 1: 7-Day Return Policy */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-4">
              <span className="text-secondary opacity-50 font-serif text-4xl leading-none">01</span>
              7-Day Return Policy
            </h2>
            <div className="prose prose-p:font-body-md prose-p:text-body-md prose-p:text-on-surface-variant prose-p:leading-relaxed max-w-none">
              <p>We stand behind the heritage and craftsmanship of every Bhagalpur Resham creation. If your purchase does not meet your expectations, we accept returns within 7 days of the delivery date. To be eligible for a return, your item must be unused, unwashed, and in the exact condition that you received it.</p>
              <p className="mt-4">It is imperative that the item remains in its original packaging with all accompanying materials, including the authentic Silk Mark tags and any artisanal certification cards, fully intact and untampered with.</p>
            </div>
          </section>
          
          {/* Section 2: How to Initiate a Return (Bento Grid Style) */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-8 flex items-center gap-4">
              <span className="text-secondary opacity-50 font-serif text-4xl leading-none">02</span>
              How to Initiate a Return
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-surface-container-low p-8 border border-outline-variant/30 relative group hover:border-secondary/50 transition-colors duration-300 ambient-shadow">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                <span className="material-symbols-outlined text-secondary text-3xl mb-4 block" style={{ fontVariationSettings: "'FILL' 0" }}>mail</span>
                <h3 className="font-label-caps text-label-caps text-primary mb-3">1. Contact Support</h3>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Email our concierge desk at care@bhagalpurresham.com with your order number and reason for return.</p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-surface-container-low p-8 border border-outline-variant/30 relative group hover:border-secondary/50 transition-colors duration-300 ambient-shadow">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                <span className="material-symbols-outlined text-secondary text-3xl mb-4 block" style={{ fontVariationSettings: "'FILL' 0" }}>box</span>
                <h3 className="font-label-caps text-label-caps text-primary mb-3">2. Pack Securely</h3>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Carefully fold the saree and place it back into its original muslin wrapping and presentation box.</p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-surface-container-low p-8 border border-outline-variant/30 relative group hover:border-secondary/50 transition-colors duration-300 ambient-shadow">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                <span className="material-symbols-outlined text-secondary text-3xl mb-4 block" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
                <h3 className="font-label-caps text-label-caps text-primary mb-3">3. Courier Pickup</h3>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">We will arrange a complimentary pickup from your designated address within 48 hours of approval.</p>
              </div>
            </div>
          </section>
          
          {/* Section 3 & 4 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
            {/* Section 3: Refund Process */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-4">
                <span className="text-secondary opacity-50 font-serif text-4xl leading-none">03</span>
                Refund Process
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                Once your return is received and inspected by our quality control team at the Bhagalpur atelier, we will send you an email to notify you of the approval or rejection of your refund.
              </p>
              <div className="flex items-start gap-4 mt-6 p-4 bg-surface-container rounded-sm border-l-2 border-primary">
                <span className="material-symbols-outlined text-primary mt-1" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                  Approved refunds are processed automatically and a credit will be applied to your original method of payment within <strong className="text-on-surface font-semibold">7-10 business days</strong>.
                </p>
              </div>
            </section>
            
            {/* Section 4: Non-Returnable Items */}
            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-4">
                <span className="text-secondary opacity-50 font-serif text-4xl leading-none">04</span>
                Exceptions
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                To maintain the integrity of our exclusive collections, certain items cannot be returned:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full border border-secondary flex-shrink-0"></div>
                  <span className="font-body-md text-body-md text-on-surface-variant">Bespoke commissions and custom-woven orders.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full border border-secondary flex-shrink-0"></div>
                  <span className="font-body-md text-body-md text-on-surface-variant">Sarees where fall and pico services have been applied at your request.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full border border-secondary flex-shrink-0"></div>
                  <span className="font-body-md text-body-md text-on-surface-variant">Special acquisitions made during specific heritage exhibitions or trunk shows.</span>
                </li>
              </ul>
            </section>
          </div>
          
          {/* Section 5: Quality Assurance Callout (Masterpiece Card style) */}
          <section className="mt-16">
            <div className="bg-[#FFF8E7] border border-secondary/40 p-8 md:p-12 ornamental-border ambient-shadow flex flex-col items-center text-center relative overflow-hidden">
              {/* Decorative corner elements */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-secondary/30"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-secondary/30"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-secondary/30"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-secondary/30"></div>
              
              <span className="material-symbols-outlined text-secondary text-4xl mb-6 block" style={{ fontVariationSettings: "'FILL' 0" }}>verified</span>
              <h2 className="font-story-serif text-story-serif text-primary mb-4">A Note on Artisanal Authenticity</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                Our textiles are hand-woven on traditional pit looms in Bhagalpur. As a result, you may notice slight variations in color, texture, or the occasional uneven thread (slubs) in the Tussar silk. These are not defects. Rather, they are the profound, beautiful signatures of the human hand and the hallmark of genuine handloom weaving.
              </p>
            </div>
          </section>
          
        </div>
      </article>
    </main>
  );
};

export default ReturnPolicy;
