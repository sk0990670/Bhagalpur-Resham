import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import closeUpAsset from '../../../assets/close_up_of_a_handloom_weaver_s_hands_working_on_a_silk_saree_traditional.png';
import biharMapAsset from '../../../assets/bihar_map.png';
import artisanHeroAsset from '../../../assets/artisan_hero.png';
import storyHeroBgAsset from '../../../assets/story_hero_bg.jpg';
import tussarWeavingAsset from '../../../assets/tussar_silk_weaving.png';
import artisanWomanWeavingAsset from '../../../assets/artisan_woman_weaving.png';
import artisanHeroBgAsset from '../../../assets/artisan_hero_bg.png';

const ArtisanStory = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="flex-grow bg-surface-container-lowest">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] bg-surface-container-highest overflow-hidden flex flex-col justify-end">
        {/* Parallax image */}
        <div ref={heroRef} className="absolute inset-0 will-change-transform">
          <img
            src={artisanHeroBgAsset}
            alt="Master artisan weaving Bhagalpuri silk"
            className="w-full h-full object-cover object-center opacity-75 mix-blend-multiply"
          />
        </div>

        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent z-10 pointer-events-none" />

        {/* Text block */}
        <div className="relative z-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-20 pt-40">
          <span className="font-label-caps text-label-caps text-secondary tracking-widest mb-4 block uppercase">The People of Bhagalpur</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6 max-w-3xl leading-tight">
            The Hands Behind the Heritage
          </h1>
          <p className="font-story-serif text-story-serif text-on-surface max-w-2xl leading-relaxed mb-10">
            For centuries, the weavers of Bhagalpur have sat at their wooden pit-looms and transformed wild Tussar cocoons into silk that sings. These are not craftsmen — they are custodians of a living art.
          </p>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-secondary/50" />
            <span className="text-xs text-secondary/70 italic">Scroll to discover their story</span>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section className="py-20 px-margin-mobile md:px-margin-desktop bg-surface-container/30 border-y border-secondary/10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-5xl text-secondary/30 font-display-lg leading-none block mb-4">"</span>
          <blockquote className="font-story-serif text-story-serif md:text-2xl text-on-surface leading-relaxed italic mb-6">
            Every thread I weave carries the prayers of my grandmother who taught me. The loom does not forget.
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-secondary/30" />
            <cite className="font-label-caps text-label-caps text-secondary tracking-widest uppercase not-italic">Ramesh Prabhat, Master Weaver, Bhagalpur</cite>
            <div className="h-px w-8 bg-secondary/30" />
          </div>
        </div>
      </section>

      {/* ── STORY 1: The Rhythm of the Loom ── */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-secondary/20 pointer-events-none" />
            <img
              src={closeUpAsset}
              alt="Close-up of a handloom weaver's hands working on a silk saree"
              className="w-full h-auto object-cover relative z-10"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm px-5 py-3 z-20 border-l-2 border-secondary">
              <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase text-xs">Bhagalpur, Bihar</span>
            </div>
          </div>
          {/* Content */}
          <div className="space-y-6">
            <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">The Craft</span>
            <h2 className="font-display-lg text-headline-xl text-on-surface">The Rhythm of the Loom</h2>
            <div className="w-12 h-0.5 bg-secondary/40" />
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              In the heart of Bihar, the ancient craft of weaving Tussar silk is a rhythm that has echoed through generations. Each shuttle throw is a heartbeat — a decision made not by algorithm but by a hand that has done this ten thousand times.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Our weavers, often working in family units, possess a tactile knowledge that lives in the body, not in manuals. The raw, golden hue of Bhagalpur silk is brought to life through their skilled hands, transforming humble cocoons into wearable masterpieces.
            </p>
            <div className="flex items-start gap-4 pt-2">
              <span className="material-symbols-outlined text-secondary/60 text-2xl mt-0.5">format_quote</span>
              <p className="font-story-serif text-story-serif text-on-surface-variant italic leading-relaxed">
                "My father could tell which thread would hold and which would break just by running his thumb along it. I am still learning that touch."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY 2: Reverse layout ── */}
      <section className="bg-surface-container/20 py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Content — appears first on desktop */}
            <div className="space-y-6 order-2 md:order-1">
              <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">The Legacy</span>
              <h2 className="font-display-lg text-headline-xl text-on-surface">Passed Hand to Hand</h2>
              <div className="w-12 h-0.5 bg-secondary/40" />
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                There are no instruction books for weaving Bhagalpuri silk. The knowledge is oral, physical, and deeply personal — learned by watching a mother's wrists, by feeling a father's corrections, by slowly earning the right to sit at the loom alone.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Bhagalpur Resham was built to honour this inheritance. By connecting weavers directly to customers, we ensure that the craft remains economically viable — that the next generation has a reason to learn.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { num: '200+', text: 'Years of unbroken weaving tradition' },
                  { num: 'Family', text: 'Knowledge passed across generations' },
                ].map((s, i) => (
                  <div key={i} className="border-l-2 border-secondary/30 pl-4">
                    <div className="font-display-lg text-title-lg text-primary mb-1">{s.num}</div>
                    <div className="text-xs text-on-surface-variant leading-snug">{s.text}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Image */}
            <div className="relative order-1 md:order-2">
              <div className="absolute -top-4 -right-4 w-full h-full border border-secondary/20 pointer-events-none" />
              <img
                src={artisanWomanWeavingAsset}
                alt="Bhagalpur artisan heritage"
                className="w-full h-auto object-cover relative z-10"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm px-5 py-3 z-20 border-l-2 border-secondary">
                <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase text-xs">Heritage in Motion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP SECTION ── */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <span className="font-label-caps text-label-caps text-secondary tracking-widest mb-3 block uppercase">Rooted in Place</span>
            <h2 className="font-display-lg text-headline-xl text-on-surface mb-5">The Weaving Clusters of Bihar</h2>
            <p className="font-story-serif text-story-serif text-on-surface-variant max-w-xl mx-auto leading-relaxed">
              Silk is not just made in Bhagalpur — it is grown here, cocoon to cloth, in a 50-kilometre arc along the Ganga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-secondary/15 bg-surface-container-lowest mb-10">
            {[
              { place: 'Bhagalpur', role: 'The Silk City', note: 'Hub of finishing and weaving masters' },
              { place: 'Nathnagar', role: 'The Dyeing Quarter', note: 'Natural dye artisans since the Mughal era' },
              { place: 'Sabour', role: 'The Cocoon Belt', note: 'Tribal communities raising wild Tussar silkworms' },
            ].map((loc, i) => (
              <div key={i} className="p-8 border-b md:border-b-0 md:border-r border-secondary/10 last:border-0 hover:bg-primary/5 transition-colors group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-secondary/50 text-xl group-hover:text-secondary transition-colors">location_on</span>
                  <span className="font-label-caps text-label-caps text-secondary/60 uppercase tracking-widest text-xs">{loc.role}</span>
                </div>
                <h3 className="font-display-lg text-title-lg text-on-surface mb-2">{loc.place}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{loc.note}</p>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="relative w-full overflow-hidden border border-secondary/15">
            <img
              src={biharMapAsset}
              alt="Map of Bihar weaving clusters"
              className="w-full h-auto object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div className="bg-surface-container-lowest/95 backdrop-blur-sm border border-secondary/20 px-6 py-4 border-l-2 border-l-secondary">
                <h3 className="font-display-lg text-title-lg text-primary mb-1">Bhagalpur</h3>
                <p className="font-body-md text-xs text-on-surface-variant">The 'Silk City' — Heart of Tussar Weaving</p>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-sm px-4 py-2 border border-secondary/10">
                <span className="material-symbols-outlined text-secondary text-sm">info</span>
                <span className="text-xs text-on-surface-variant italic">Bihar, Eastern India</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="py-20 px-margin-mobile md:px-margin-desktop bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src={tussarWeavingAsset} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto text-center">
          <h2 className="font-display-lg text-headline-xl text-on-primary mb-4">Support a Weaver Today</h2>
          <p className="font-story-serif text-story-serif text-on-primary/70 max-w-xl mx-auto mb-10">
            Every saree you buy ensures a weaver can pay school fees, repair a loom, and teach their child to weave.
          </p>
          <Link to="/collections" className="inline-flex items-center gap-2 bg-on-primary text-primary px-8 py-4 font-label-caps text-label-caps uppercase tracking-wider hover:bg-secondary-container transition-colors duration-300 rounded-sm shadow-md group">
            Explore the Collection
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      </section>

    </main>
  );
};

export default ArtisanStory;
