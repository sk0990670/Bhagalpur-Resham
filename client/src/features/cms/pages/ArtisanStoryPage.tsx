import React from 'react';
import closeUpOfAHandloomWeaverSHandsWorkingOnASilkSareeTraditionalAsset from '../../../assets/close_up_of_a_handloom_weaver_s_hands_working_on_a_silk_saree_traditional.png';
import biharMapAsset from '../../../assets/bihar_map.png';


const ArtisanStory = () => {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-surface-container-highest">
        <div className="absolute inset-0 z-0 bg-black/40"></div>
        {/* Placeholder for hero image, using a pattern for now to keep HTML clean as requested without data URIs */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-variant to-background opacity-50"></div>
        <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto mt-20">
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mb-6 drop-shadow-md">The Hands Behind the Heritage</h1>
          <p className="font-story-serif text-story-serif text-on-surface-variant md:text-on-surface">Discover the master weavers of Bhagalpur and the legacy of Tussar silk.</p>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center items-center py-12 md:py-16 text-primary opacity-60">
        <span className="material-symbols-outlined text-4xl">brightness_5</span>
      </div>

      {/* Storytelling Section 1 */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
          <div className="order-2 md:order-1 relative">
            <div className="absolute -inset-4 border border-secondary/30 rounded-lg -z-10"></div>
            <img 
              alt="Close-up of a handloom weaver's hands working on a silk saree" 
              className="w-full h-auto object-cover rounded shadow-lg" 
              src={closeUpOfAHandloomWeaverSHandsWorkingOnASilkSareeTraditionalAsset} 
            />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="font-headline-md text-headline-md text-primary">The Rhythm of the Loom</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">In the heart of Bihar, the ancient craft of weaving Tussar silk is a rhythm that has echoed through generations. Each thread tells a story of patience, precision, and an unspoken bond between the artisan and the loom.</p>
            <p className="font-body-md text-body-md text-on-surface-variant">Our weavers, often working in family units, possess a tactile knowledge passed down over centuries. The raw, golden hue of Bhagalpur silk is brought to life through their skilled hands, transforming humble cocoons into wearable masterpieces.</p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center items-center py-12 md:py-16 text-primary opacity-60">
        <span className="material-symbols-outlined text-4xl">dark_mode</span>
      </div>

      {/* Interactive Map Section (Conceptual) */}
      <section className="bg-surface-container-low py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-headline-xl text-headline-xl text-primary mb-8">The Weaving Clusters of Bihar</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">Explore the historical heartlands where our silk is cultivated and woven.</p>
          
          <div className="relative w-full h-[400px] md:h-[600px] bg-surface-variant rounded-xl overflow-hidden border border-outline-variant/50 shadow-inner flex items-center justify-center">
            {/* Conceptual Map Placeholder */}
            <img 
              alt="Map of Bihar" 
              className="w-full h-full object-cover opacity-80" 
              src={biharMapAsset} 
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center bg-surface/90 p-6 rounded shadow-lg backdrop-blur-sm pointer-events-auto border border-secondary/20">
                <h3 className="font-headline-md text-headline-md text-primary mb-2">Bhagalpur</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">The 'Silk City' - Heart of Tussar Weaving</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ArtisanStory;
