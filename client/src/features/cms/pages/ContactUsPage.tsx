import React, { useState } from 'react';
import api from '../../../shared/services/api';
import artisanWeavingImg from '../../../assets/artisan_weaving_loom.png';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Bespoke Commission',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', {
        fullName: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: 'Bespoke Commission', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };
  return (
    <main className="flex-grow pt-12 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      {/* Header Section */}
      <header className="text-center mb-16 md:mb-24">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Connect with Our Heritage</h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant max-w-2xl mx-auto">
          We invite you to reach out. Whether inquiring about our artisanal collections, commissioning a bespoke piece, or tracing the lineage of your silk.
        </p>
        <div className="mt-8 flex justify-center">
          <svg fill="none" height="24" viewBox="0 0 120 24" width="120" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12H40M80 12H120" stroke="#735c00" strokeWidth="1"></path>
            <circle cx="60" cy="12" fill="#610000" r="4"></circle>
            <circle cx="50" cy="12" fill="#735c00" r="2"></circle>
            <circle cx="70" cy="12" fill="#735c00" r="2"></circle>
          </svg>
        </div>
      </header>
      
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Contact Info Panel (Left) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container-low p-8 motif-border ambient-shadow h-full flex flex-col justify-center">
            <h2 className="font-headline-md text-headline-md text-primary mb-8">Reach the Artisans</h2>
            <ul className="space-y-8">
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-secondary text-2xl mt-1" style={{ fontVariationSettings: "'FILL' 0" }}>call</span>
                <div>
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Direct Line</h3>
                  <p className="font-body-lg text-body-lg text-on-surface">+91 {import.meta.env.VITE_SUPPORT_PHONE}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-secondary text-2xl mt-1" style={{ fontVariationSettings: "'FILL' 0" }}>mail</span>
                <div>
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Electronic Mail</h3>
                  <p className="font-body-lg text-body-lg text-on-surface">{import.meta.env.VITE_CONTACT_EMAIL}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-secondary text-2xl mt-1" style={{ fontVariationSettings: "'FILL' 0" }}>chat</span>
                <div>
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">WhatsApp Boutique</h3>
                  <a className="font-body-lg text-body-lg text-primary border-b border-primary hover:text-secondary transition-colors inline-block mt-1" href={`https://wa.me/91${import.meta.env.VITE_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">Message an Artisan</a>
                </div>
              </li>
            </ul>
            <div className="mt-12 pt-8 border-t border-outline-variant/50">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">Atelier Hours</h3>
              <p className="font-body-md text-body-md text-on-surface">Monday to Saturday<br />10:00 AM - 6:00 PM (IST)</p>
            </div>
          </div>
        </div>
        
        {/* Image & Map Panel (Middle) */}
        <div className="lg:col-span-4 flex flex-col gap-gutter h-full">
          <div className="h-[50%] overflow-hidden motif-border relative group">
            <img 
              alt="Artisan weaving" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={artisanWeavingImg}
            />
          </div>
          <div className="h-[50%] motif-border overflow-hidden bg-surface-container-high relative">
            {/* Placeholder for Map, using image style as requested */}
            <img 
              alt="Map" 
              className="w-full h-full object-cover opacity-60 mix-blend-multiply" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt-XQnOU9cW5jkvGGtTLRhbKfgVhmgPwM0MNN9WaPbHI2TOY7xPV9lEwKQ5A8kL4ZDdO7XmPB5zJPKEvodFZdMnto252gCIlIxraukyN_iPLECsZpQnNTbCoPDUq6HycbYMtPV6J8lBE5w7nDRdF3mU6a0rK8uyr_p-Bzw4IFHFt2LVDfXJtrzCC0IvtQ9hm-LeljxZD1OkGtv3cjhXryMhe0L3O0tru7EzDayMFnFK6nm0wYnCcqjgaEgscR183ya9L-egyDa1QVX"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-surface/90 px-6 py-4 border border-secondary text-center backdrop-blur-sm">
                <span className="material-symbols-outlined text-primary mb-2" style={{ fontVariationSettings: "'FILL' 0" }}>location_on</span>
                <p className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Nathnagar Cluster</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">Bhagalpur, Bihar</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form Panel (Right) */}
        <div className="lg:col-span-4">
          <div className="bg-surface p-8 motif-border ambient-shadow h-full flex flex-col">
            <h2 className="font-headline-md text-headline-md text-primary mb-2">Send an Inquiry</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">We endeavor to respond to all curatorial inquiries within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-8 flex-grow flex flex-col relative">
              {status === 'success' && (
                <div className="absolute inset-0 bg-surface/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6 border border-secondary">
                  <span className="material-symbols-outlined text-secondary text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
                  <h3 className="font-story-serif text-primary text-2xl mb-2">Inquiry Received</h3>
                  <p className="font-body-md text-on-surface-variant">Thank you for contacting Bhagalpur Resham. Your inquiry has been received successfully. A confirmation email has been sent to your inbox.</p>
                </div>
              )}
              {status === 'error' && (
                <div className="p-4 mb-4 bg-error-container text-on-error-container text-sm rounded-sm">
                  There was a problem sending your message. Please try again or contact us directly via email.
                </div>
              )}
              <div className="relative">
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2 uppercase" htmlFor="name">Full Name</label>
                <input className="input-underline w-full font-body-lg text-body-lg" id="name" name="name" required type="text" value={formData.name} onChange={handleChange} disabled={status === 'loading'} />
              </div>
              <div className="relative">
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2 uppercase" htmlFor="email">Email Address</label>
                <input className="input-underline w-full font-body-lg text-body-lg" id="email" name="email" required type="email" value={formData.email} onChange={handleChange} disabled={status === 'loading'} />
              </div>
              <div className="relative">
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2 uppercase" htmlFor="subject">Subject of Inquiry</label>
                <select className="input-underline w-full font-body-lg text-body-lg appearance-none bg-transparent" id="subject" name="subject" value={formData.subject} onChange={handleChange} disabled={status === 'loading'}>
                  <option>Bespoke Commission</option>
                  <option>Collection Inquiry</option>
                  <option>Wholesale Partnership</option>
                  <option>General Information</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-end px-2 text-on-surface-variant pb-2">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
                </div>
              </div>
              <div className="relative flex-grow">
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2 uppercase" htmlFor="message">Your Message</label>
                <textarea className="input-underline w-full font-body-lg text-body-lg resize-none h-[120px]" id="message" name="message" required rows={4} value={formData.message} onChange={handleChange} disabled={status === 'loading'}></textarea>
              </div>
              <button disabled={status === 'loading'} className="mt-auto w-full bg-primary-container text-[#fed65b] font-label-caps text-label-caps py-4 px-8 uppercase tracking-widest hover:bg-tertiary transition-colors duration-300 flex justify-center items-center gap-2 group cursor-pointer disabled:opacity-70" type="submit">
                {status === 'loading' ? 'Sending...' : 'Submit Inquiry'}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>{status === 'loading' ? 'sync' : 'arrow_forward'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactUs;
