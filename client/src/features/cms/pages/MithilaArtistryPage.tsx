import React from 'react';
import { Link } from 'react-router-dom';
import mithilaArtSilkAsset from '../../../assets/mithila_art_silk.png';


const MithilaArtistry = () => {
  return (
    <main className="flex-grow pt-12 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-motif-pattern opacity-50 pointer-events-none z-[-1]"></div>

      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Mithila Artistry</h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant max-w-2xl mx-auto">
          The canvas of culture: Where ancient folklore meets the finest silk.
        </p>
        
        {/* Motif Divider */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <div className="h-px w-16 bg-secondary-fixed-dim"></div>
          <span className="material-symbols-outlined text-secondary-fixed-dim text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>brush</span>
          <div className="h-px w-16 bg-secondary-fixed-dim"></div>
        </div>
      </section>

      {/* Content Section */}
      <section className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center py-12">
        <div className="w-full md:w-1/2 flex flex-col items-start order-2 md:order-1">
          <span className="font-label-caps text-label-caps text-primary tracking-widest mb-4">Art & Tradition</span>
          <h2 className="font-display-lg text-headline-xl text-on-surface mb-6">Madhubani on Silk</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed">
            Mithila painting, popularly known as Madhubani art, is a celebrated folk art form originating from the Mithila region of Bihar. Characterized by its eye-catching geometrical patterns and vibrant colors, it tells tales of mythology, nature, and royal folklore.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
            When this intricate art is delicately hand-painted onto the luxurious canvas of Bhagalpuri Tussar silk, it creates a masterpiece of unparalleled beauty. Each piece is a unique expression of the artisan's skill, blending the textural richness of wild silk with the vivid storytelling of ancient India.
          </p>
          <Link className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-sm font-label-caps text-label-caps uppercase tracking-wider hover:bg-tertiary transition-colors duration-300 group" to="/collections">
            EXPLORE COLLECTIONS
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
          </Link>
        </div>

        <div className="w-full md:w-1/2 order-1 md:order-2">
          <div className="relative p-4 bg-surface-container-lowest ambient-shadow group">
            <div className="border border-secondary/30 p-2 relative w-full aspect-[4/5] overflow-hidden">
              <img 
                alt="Intricate Mithila art painted on Bhagalpuri silk" 
                className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-1000 group-hover:scale-105" 
                src={mithilaArtSilkAsset} 
              />
            </div>
            {/* Decorative motif */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-surface rounded-full hidden md:flex items-center justify-center border border-secondary/20 shadow-sm z-20">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MithilaArtistry;
