import { Link } from 'react-router-dom';

const ShippingPolicy = () => {
  return (
    <main className="flex-grow pt-12 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-motif-pattern opacity-50 pointer-events-none z-[-1]"></div>
      
      {/* Page Header */}
      <div className="text-center mb-16 md:mb-24">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">The Silk Journey</h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant max-w-2xl mx-auto">Shipping & Delivery Guidelines</p>
        
        {/* Motif Divider */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <div className="h-px w-16 bg-secondary-fixed-dim"></div>
          <span className="material-symbols-outlined text-secondary-fixed-dim text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          <div className="h-px w-16 bg-secondary-fixed-dim"></div>
        </div>
      </div>
      
      {/* Policy Sections Layout (Bento-style Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter items-start">
        {/* Main Content Column */}
        <div className="md:col-span-8 space-y-8">
          
          {/* Domestic Shipping Card */}
          <div className="ornamental-border ambient-shadow bg-surface rounded-sm p-8 md:p-12 transition-transform duration-300 hover:-translate-y-1 relative">
            <div className="flex items-start gap-6 relative z-10">
              <div className="flex-shrink-0 w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center text-primary border border-outline-variant/50">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-primary mb-4">Domestic Shipping</h2>
                <p className="font-body-lg text-body-lg text-on-surface mb-4">We offer <strong className="text-primary font-semibold">free express shipping</strong> across all pin codes in India.</p>
                <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant list-none pl-0">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary-fixed-dim text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>fiber_manual_record</span>
                    Partnered with premium logistics: BlueDart and Delhivery.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary-fixed-dim text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>fiber_manual_record</span>
                    Estimated delivery within 5-7 business days from dispatch.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* International Shipping Card */}
          <div className="ornamental-border ambient-shadow bg-surface rounded-sm p-8 md:p-12 transition-transform duration-300 hover:-translate-y-1 relative">
            <div className="flex items-start gap-6 relative z-10">
              <div className="flex-shrink-0 w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center text-primary border border-outline-variant/50">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>public</span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-primary mb-4">International Reach</h2>
                <p className="font-body-lg text-body-lg text-on-surface mb-4">Sharing the heritage of Bhagalpur globally. We currently ship to over 50 countries worldwide.</p>
                
                <div className="bg-surface-container-low p-6 rounded-sm border border-outline-variant/30 mt-6">
                  <h3 className="font-label-caps text-label-caps text-primary mb-2 uppercase tracking-widest">Customs & Duties</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Shipping rates are calculated dynamically at checkout based on destination. Please note that international orders may be subject to local customs duties and taxes, which are the responsibility of the patron upon delivery.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Sidebar Column */}
        <div className="md:col-span-4 space-y-8">
          
          {/* Delivery Time Frame */}
          <div className="bg-primary text-on-primary rounded-sm p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
              <span className="material-symbols-outlined text-9xl" style={{ fontVariationSettings: "'FILL' 0" }}>hourglass_top</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-headline-md text-[28px] leading-tight mb-4">The Art Takes Time</h3>
              <p className="font-body-md text-on-primary/90 mb-6">Each artisanal handloom piece is carefully inspected and specially packed to preserve its delicate texture. This meticulous process requires <strong className="text-secondary-container">2-3 days prior to dispatch</strong>.</p>
              <p className="font-label-caps text-[11px] uppercase tracking-wider text-on-primary/70">Transit time varies by specific location.</p>
            </div>
          </div>
          
          {/* Tracking Action Card */}
          <div className="ornamental-border ambient-shadow bg-surface rounded-sm p-8 text-center flex flex-col items-center justify-center min-h-[240px] relative">
            <div className="relative z-10 flex flex-col items-center w-full">
              <span className="material-symbols-outlined text-primary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>location_on</span>
              <h3 className="font-headline-md text-[24px] text-primary mb-2">Track Your Heritage</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Follow the journey of your silk from our looms to your home.</p>
              <Link to="/order-history" className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-sm font-label-caps text-label-caps uppercase tracking-wider hover:bg-tertiary transition-colors duration-300">
                Track Order
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
              </Link>
            </div>
          </div>
          
          {/* Support Link */}
          <div className="text-center pt-4">
            <Link to="/contact" className="inline-flex items-center gap-2 text-primary font-label-caps text-label-caps uppercase tracking-wider hover:text-tertiary transition-colors group">
              <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>support_agent</span>
              Contact Concierge
            </Link>
          </div>
          
        </div>
      </div>
    </main>
  );
};

export default ShippingPolicy;
