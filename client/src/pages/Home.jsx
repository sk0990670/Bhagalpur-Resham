import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <header className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <video 
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-[5000ms] z-0"
            src="/assets/hover-video.mp4" 
            autoPlay
            loop 
            muted 
            playsInline
          />
          <img 
            alt="Woman in red saree in a traditional courtyard" 
            className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 delay-[5000ms] z-10 opacity-100 group-hover:opacity-0" 
            src="/assets/high_end_fashion_photography_of_a_model_in_a_luxurious_bhagalpuri_silk_saree.png" 
          />
          <div className="absolute inset-0 bg-black/30 z-20 pointer-events-none"></div>
        </div>
        
        <div className="relative z-30 text-center px-margin-mobile max-w-4xl mx-auto flex flex-col items-center pointer-events-none">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-6 drop-shadow-md pointer-events-auto">Woven Heritage of Bihar</h1>
          <p className="font-body-lg text-body-lg text-surface-container-lowest mb-10 max-w-2xl drop-shadow-sm pointer-events-auto">
            Discover handcrafted silk sarees inspired by generations of tradition. Every thread tells a story of artistry and elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
            <Link className="inline-flex items-center justify-center px-8 py-4 bg-primary-container text-on-secondary font-label-caps text-label-caps hover:bg-tertiary-container transition-colors duration-300 ambient-shadow border border-secondary/20 hover-group" to="/collections">
              Shop Collection
            </Link>
            <Link className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-surface-container-lowest text-surface-container-lowest font-label-caps text-label-caps hover:bg-surface-container-lowest/10 transition-colors duration-300" to="/heritage">
              Explore Heritage
            </Link>
          </div>
        </div>
      </header>

      {/* Heritage Storytelling Section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <div className="relative p-4 bg-surface-container-lowest ambient-shadow group">
              <div className="border border-secondary/30 p-2 relative w-full aspect-square overflow-hidden">
                <video 
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-[5000ms]"
                  src="/assets/hover-video.mp4" 
                  autoPlay
                  loop 
                  muted 
                  playsInline
                />
                <img 
                  alt="Handloom weaver working" 
                  className="absolute inset-0 w-full h-full object-cover z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-1000 delay-[5000ms]" 
                  src="/assets/close_up_of_a_handloom_weaver_s_hands_working_on_a_silk_saree_traditional.png" 
                />
              </div>
              {/* Decorative motif */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-surface rounded-full hidden md:flex items-center justify-center border border-secondary/20 shadow-sm z-20 pointer-events-none">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2 flex flex-col items-start">
            <span className="font-label-caps text-label-caps text-primary tracking-widest mb-4">The Artisan's Touch</span>
            <h2 className="font-display-lg text-headline-xl text-on-surface mb-6">Bihar Heritage</h2>
            <p className="font-story-serif text-story-serif text-on-surface-variant mb-6 leading-relaxed">
              Rooted in the ancient city of Bhagalpur, known as the 'Silk City' of India, our Tussar silk is born from a legacy of weaving that spans centuries. Each piece is a testament to the skill passed down through generations.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              We partner directly with master weavers, ensuring fair trade and preserving the traditional handloom techniques that give our silk its distinctive rich texture and natural golden sheen.
            </p>
            <Link className="inline-flex items-center gap-2 text-primary font-label-caps text-label-caps hover:text-tertiary-container transition-colors group" to="/">
              DISCOVER OUR STORY
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
