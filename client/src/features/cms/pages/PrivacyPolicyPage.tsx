import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <main className="w-full pb-section-gap">
      {/* Hero Section */}
      <header className="pt-24 pb-16 px-margin-mobile md:px-margin-desktop text-center relative overflow-hidden">
        {/* Subtle background texture wrapper */}
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Privacy Policy</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Safeguarding your information with the same care we give our weaves.</p>
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
          
          {/* Section 1: Introduction */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-4">
              <span className="text-secondary opacity-50 font-serif text-4xl leading-none">01</span>
              Introduction
            </h2>
            <div className="prose prose-p:font-body-md prose-p:text-body-md prose-p:text-on-surface-variant prose-p:leading-relaxed max-w-none">
              <p>At Bhagalpur Resham, we deeply respect your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard the information you provide when interacting with our website and purchasing our handwoven heritage pieces.</p>
            </div>
          </section>

          {/* Section 2: Data Collection */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-4">
              <span className="text-secondary opacity-50 font-serif text-4xl leading-none">02</span>
              Information We Collect
            </h2>
            <div className="prose prose-p:font-body-md prose-p:text-body-md prose-p:text-on-surface-variant prose-p:leading-relaxed max-w-none">
              <p className="mb-4">To provide you with a seamless and luxurious shopping experience, we may collect the following types of information:</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full border border-secondary flex-shrink-0"></div>
                  <span className="font-body-md text-body-md text-on-surface-variant"><strong className="text-on-surface font-semibold">Personal Identification:</strong> Name, email address, phone number, shipping and billing addresses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full border border-secondary flex-shrink-0"></div>
                  <span className="font-body-md text-body-md text-on-surface-variant"><strong className="text-on-surface font-semibold">Transaction Data:</strong> Details about payments and the artisanal products you have purchased. (Note: We do not store your credit card numbers on our servers; they are securely processed by our payment gateways).</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full border border-secondary flex-shrink-0"></div>
                  <span className="font-body-md text-body-md text-on-surface-variant"><strong className="text-on-surface font-semibold">Technical Data:</strong> IP address, browser type, device type, and your journey through our curated collections (via cookies).</span>
                </li>
              </ul>
            </div>
          </section>
          
          {/* Section 3: Usage of Information */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-4">
              <span className="text-secondary opacity-50 font-serif text-4xl leading-none">03</span>
              How We Use Your Data
            </h2>
            <div className="prose prose-p:font-body-md prose-p:text-body-md prose-p:text-on-surface-variant prose-p:leading-relaxed max-w-none">
              <p>Your information allows us to fulfill your orders and elevate your experience with Bhagalpur Resham. We use your data to:</p>
              <ul className="space-y-4 mt-6">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full border border-secondary flex-shrink-0"></div>
                  <span className="font-body-md text-body-md text-on-surface-variant">Process transactions and coordinate secure deliveries of your sarees.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full border border-secondary flex-shrink-0"></div>
                  <span className="font-body-md text-body-md text-on-surface-variant">Communicate essential updates regarding your order or bespoke requests.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full border border-secondary flex-shrink-0"></div>
                  <span className="font-body-md text-body-md text-on-surface-variant">Share curated stories, heritage insights, and exclusive collections (only if you have opted in to our newsletter).</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Data Protection */}
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-4">
              <span className="text-secondary opacity-50 font-serif text-4xl leading-none">04</span>
              Data Protection & Sharing
            </h2>
            <div className="prose prose-p:font-body-md prose-p:text-body-md prose-p:text-on-surface-variant prose-p:leading-relaxed max-w-none">
              <p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our trusted logistics and payment partners solely for the purpose of fulfilling your order.</p>
              <div className="flex items-start gap-4 mt-6 p-4 bg-surface-container rounded-sm border-l-2 border-primary">
                <span className="material-symbols-outlined text-primary mt-1" style={{ fontVariationSettings: "'FILL' 0" }}>lock</span>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                  We adopt industry-standard data collection, storage, and processing practices alongside robust security measures to protect against unauthorized access or disclosure of your personal information.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Contact Info */}
          <section className="mt-16 mb-24">
            <div className="bg-[#FFF8E7] border border-secondary/40 p-8 md:p-12 ornamental-border ambient-shadow flex flex-col items-center text-center relative overflow-hidden">
              {/* Decorative corner elements */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-secondary/30"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-secondary/30"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-secondary/30"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-secondary/30"></div>
              
              <span className="material-symbols-outlined text-secondary text-4xl mb-6 block" style={{ fontVariationSettings: "'FILL' 0" }}>support_agent</span>
              <h2 className="font-story-serif text-story-serif text-primary mb-4">Questions Regarding Privacy?</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed mb-6">
                If you have any questions about this Privacy Policy or how we handle your data, our concierge team is always here to assist you.
              </p>
              <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`} className="font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors uppercase">
                {import.meta.env.VITE_CONTACT_EMAIL}
              </a>
            </div>
          </section>

        </div>
      </article>
    </main>
  );
};

export default PrivacyPolicyPage;
