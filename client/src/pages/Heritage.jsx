import React from 'react';
import { Link } from 'react-router-dom';

const Heritage = () => {
  return (
    <main className="flex-grow pt-12 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-motif-pattern opacity-50 pointer-events-none z-[-1]"></div>

      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">The Legacy of Bhagalpur</h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant max-w-2xl mx-auto">
          Tracing the golden threads of history through centuries of masterful silk weaving.
        </p>
        
        {/* Motif Divider */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <div className="h-px w-16 bg-secondary-fixed-dim"></div>
          <span className="material-symbols-outlined text-secondary-fixed-dim text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          <div className="h-px w-16 bg-secondary-fixed-dim"></div>
        </div>
      </section>

      {/* Content Section */}
      <section className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center py-12">
        <div className="w-full md:w-1/2">
          <div className="relative p-4 bg-surface-container-lowest ambient-shadow group">
            <div className="border border-secondary/30 p-2 relative w-full aspect-[4/5] overflow-hidden">
              <img 
                alt="Ancient weaving looms and silk threads" 
                className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-1000 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO1Uv8k0LnFuecRoecp2-hbDTD2AEn2J9cL4UZZNuiLClj3WovhhVv2IGk7yTbKkriv3DClR59IzfIm61ppbv3AKkVw8envNDVP-5rIsHwsJxhe3J4usQ431TJVqZLWQqgqhVPHk88lXyVy-raXQAZ5Ugk-yI9kXOwD8y7c5mgI5ueOGAfSWXbrwW-8260kjDZX89WAi-DlK_-V_gwQ2-oAap_xlkmvNf3PoogbQHAV-xIRffBJrxSnt3l7fQJxKjjuC-eJIKIkmuR" 
              />
            </div>
            {/* Decorative motif */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-surface rounded-full hidden md:flex items-center justify-center border border-secondary/20 shadow-sm z-20">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>history_edu</span>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <span className="font-label-caps text-label-caps text-primary tracking-widest mb-4">Centuries of Craft</span>
          <h2 className="font-display-lg text-headline-xl text-on-surface mb-6">The Silk City</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed">
            Bhagalpur, situated on the southern banks of the river Ganges in Bihar, has been a center of silk fabric manufacturing for over a century. Known affectionately as the 'Silk City' of India, it holds a legacy that is intricately woven into the cultural fabric of the nation.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
            The secret to Bhagalpuri silk lies in its unique dyeing technique and the exceptional quality of Tussar silk cocoons found in the region. The result is a mesmerizing texture, characterized by its golden hue, natural breathability, and rustic charm, making it a luxurious drape for any occasion.
          </p>
          <Link className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-sm font-label-caps text-label-caps uppercase tracking-wider hover:bg-tertiary transition-colors duration-300 group" to="/collections">
            EXPLORE COLLECTIONS
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Heritage;
