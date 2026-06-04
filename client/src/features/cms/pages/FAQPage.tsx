import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AccordionItem = ({ question, children }: { question: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-outline-variant rounded-lg bg-surface-container-lowest overflow-hidden shadow-[0_4px_20px_-4px_rgba(128,0,32,0.04)]">
      <button 
        className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none focus:bg-surface-container-low transition-colors group cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-body-lg text-body-lg text-on-surface font-semibold group-hover:text-primary transition-colors">{question}</span>
        <span className={`material-symbols-outlined text-secondary accordion-icon ${isOpen ? 'active' : ''}`} style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
      </button>
      <div className={`accordion-content px-6 bg-surface-container-lowest border-t border-outline-variant/30 ${isOpen ? 'active' : ''}`}>
        <div className="text-on-surface-variant font-body-md text-body-md leading-relaxed pb-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const CATEGORIES = [
  { id: 'shipping', label: 'Shipping & Delivery' },
  { id: 'payment', label: 'Payment Options' },
  { id: 'returns', label: 'Returns & Exchanges' },
  { id: 'care', label: 'Saree Care' },
  { id: 'authenticity', label: 'Authenticity & Craft' },
];

const FAQ = () => {
  const [activeSection, setActiveSection] = useState('shipping');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // Find the first intersecting entry that is visible
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // If multiple are visible, pick the one closest to the top
        visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveSection(visibleEntries[0].target.id);
      }
    }, { rootMargin: '-20% 0px -60% 0px' });

    CATEGORIES.forEach(cat => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="pt-12 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen bg-pattern">
      {/* Hero Section */}
      <header className="text-center mb-16 md:mb-24">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Patron Inquiries</h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant max-w-2xl mx-auto mb-8">
          Guidance on acquiring, caring for, and celebrating your handwoven heritage pieces.
        </p>
        
        {/* Madhubani Motif Divider */}
        <div className="flex items-center justify-center space-x-4 opacity-70">
          <div className="h-px bg-secondary w-16 md:w-32"></div>
          <svg className="text-secondary" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"></path>
            <circle cx="12" cy="12" fill="currentColor" r="3"></circle>
          </svg>
          <div className="h-px bg-secondary w-16 md:w-32"></div>
        </div>
      </header>

      {/* FAQ Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Desktop Sidebar (Navigation for FAQ categories) */}
        <aside className="hidden md:block col-span-3">
          <div className="sticky top-32 space-y-4">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-6 pb-2 border-b border-outline-variant/50">Categories</h3>
            <ul className="space-y-3 font-body-md text-body-md">
              {CATEGORIES.map(cat => {
                const isActive = activeSection === cat.id;
                return (
                  <li key={cat.id}>
                    <a 
                      className={`flex items-center transition-all duration-300 ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`} 
                      href={`#${cat.id}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-3 transition-colors duration-300 ${isActive ? 'bg-secondary' : 'bg-transparent border border-outline'}`}></span>
                      {cat.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Accordion Content Area */}
        <div className="col-span-1 md:col-span-8 md:col-start-5 space-y-12">
          {/* Category: Shipping */}
          <section className="scroll-mt-32" id="shipping">
            <h2 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-4 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-3 text-secondary" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
              Shipping & Delivery
            </h2>
            <div className="space-y-4">
              <AccordionItem question="Do you ship internationally?">
                <p>Yes, we deliver our handcrafted heritage silks globally. We partner with premium courier services (DHL, FedEx) to ensure secure and timely delivery. International shipping usually takes 7-14 business days. Please note that customs duties and taxes may apply depending on your region and are the responsibility of the patron.</p>
              </AccordionItem>
              <AccordionItem question="How long does domestic shipping take within India?">
                <p>For ready-to-ship collections, domestic delivery takes 3-5 business days. For bespoke commissions or pre-order items, our artisans require 2-4 weeks for weaving before dispatch. We provide full tracking information once your saree begins its journey to you.</p>
              </AccordionItem>
            </div>
          </section>

          {/* Category: Payment Options */}
          <section className="scroll-mt-32" id="payment">
            <h2 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-4 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-3 text-secondary" style={{ fontVariationSettings: "'FILL' 0" }}>payments</span>
              Payment Options
            </h2>
            <div className="space-y-4">
              <AccordionItem question="What payment methods do you accept?">
                <p>We accept all major credit and debit cards (Visa, Mastercard, American Express), as well as secure online banking and UPI for domestic orders. For international patrons, we process payments via secure international gateways.</p>
              </AccordionItem>
              <AccordionItem question="Is my payment information secure?">
                <p>Yes, all transactions are encrypted using industry-standard 256-bit SSL security. We do not store your credit card information on our servers.</p>
              </AccordionItem>
            </div>
          </section>

          {/* Category: Returns & Exchanges */}
          <section className="scroll-mt-32" id="returns">
            <h2 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-4 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-3 text-secondary" style={{ fontVariationSettings: "'FILL' 0" }}>assignment_return</span>
              Returns & Exchanges
            </h2>
            <div className="space-y-4">
              <AccordionItem question="What is your return policy?">
                <p>We stand behind the heritage and craftsmanship of every Bhagalpur Resham creation. We accept returns within 7 days of the delivery date. To be eligible for a return, your item must be unused, unwashed, and in its exact original condition with all authentic Silk Mark tags attached.</p>
              </AccordionItem>
              <AccordionItem question="How do I initiate a return?">
                <p className="mb-4">To initiate a return, follow these simple steps:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Email our concierge desk at care@bhagalpurresham.com with your order number.</li>
                  <li>Carefully fold the saree and place it back into its original muslin wrapping.</li>
                  <li>We will arrange a complimentary courier pickup within 48 hours of approval.</li>
                </ol>
              </AccordionItem>
              <AccordionItem question="Are there any exceptions to the return policy?">
                <p>Yes. To maintain the integrity of our exclusive collections, bespoke commissions, custom-woven orders, and sarees with fall & pico services applied cannot be returned.</p>
              </AccordionItem>
            </div>
          </section>

          {/* Category: Saree Care */}
          <section className="scroll-mt-32" id="care">
            <h2 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-4 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-3 text-secondary" style={{ fontVariationSettings: "'FILL' 0" }}>dry_cleaning</span>
              Saree Care
            </h2>
            <div className="space-y-4">
              <AccordionItem question="How should I store my Tussar silk sarees?">
                <p className="mb-4">Tussar silk breathes and requires mindful storage to maintain its natural luster.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Store in a pure cotton or muslin cloth bag. Avoid plastic covers.</li>
                  <li>Keep in a cool, dark place away from direct sunlight.</li>
                  <li>Refold the saree every 3-4 months to prevent permanent creasing and yarn breakage.</li>
                  <li>Use natural repellents like dried neem leaves or cloves wrapped in cloth; avoid direct contact with naphthalene balls.</li>
                </ul>
              </AccordionItem>
              <AccordionItem question="Can I hand wash my Bhagalpuri silk?">
                <p>We strictly recommend <strong>professional dry cleaning only</strong> for all our silk sarees. Hand washing may cause the natural dyes to bleed or alter the unique texture of the wild silk. Should a stain occur, seek professional spot cleaning immediately rather than attempting home remedies.</p>
              </AccordionItem>
            </div>
          </section>

          {/* Category: Authenticity */}
          <section className="scroll-mt-32" id="authenticity">
            <h2 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-4 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-3 text-secondary" style={{ fontVariationSettings: "'FILL' 0" }}>verified</span>
              Authenticity & Craft
            </h2>
            <div className="space-y-4">
              <AccordionItem question="How do I know my saree is authentic Bhagalpuri Silk?">
                <p>Every pure silk piece from our collection carries the official <strong>Silk Mark</strong> certification, ensuring 100% natural silk content. Furthermore, our handloom pieces often exhibit slight irregularities in weave—these are not flaws, but the hallmark of human craftsmanship and the true signature of an authentic handwoven garment.</p>
              </AccordionItem>
            </div>
          </section>

          {/* Support Contact Box */}
          <div className="mt-16 p-8 border border-secondary rounded-lg bg-surface-container-low text-center relative overflow-hidden">
            {/* Decorative border element */}
            <div className="absolute top-2 left-2 right-2 bottom-2 border border-secondary/20 pointer-events-none"></div>
            <h3 className="font-story-serif text-story-serif text-primary mb-4">Still seeking guidance?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-md mx-auto">
              Our concierges are available to assist you with bespoke requests, detailed care instructions, or styling advice.
            </p>
            <Link to="/contact" className="bg-primary-container text-secondary font-label-caps text-label-caps px-8 py-4 rounded hover:bg-tertiary transition-colors duration-300 shadow-sm flex items-center mx-auto inline-flex cursor-pointer">
              CONTACT PATRON CARE
              <span className="material-symbols-outlined ml-2 text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>mail</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FAQ;
