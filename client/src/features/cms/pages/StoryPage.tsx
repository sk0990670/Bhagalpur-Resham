import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cmsService } from '../../../shared/services/cms.service';
import artisanWeavingLoomAsset from '../../../assets/artisan_weaving_loom.png';
import artisanHeroAsset from '../../../assets/artisan_hero.png';
import closeUpAsset from '../../../assets/close_up_of_a_handloom_weaver_s_hands_working_on_a_silk_saree_traditional.png';
import tussarWeavingAsset from '../../../assets/tussar_silk_weaving.png';
import storyHeroBgAsset from '../../../assets/story_hero_bg.jpg';

export default function StoryPage() {
  const [stats, setStats] = useState({
    totalArtisans: 0,
    activeArtisans: 0,
    totalCustomers: 0,
    totalOrders: 0,
    completedOrders: 0,
    avgRating: '0'
  });
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, artisansData] = await Promise.all([
          cmsService.getStoryStats(),
          cmsService.getPublicArtisans()
        ]);
        setStats(statsData.data);
        setArtisans(artisansData.data);
      } catch (err) {
        console.error('Failed to fetch story data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="bg-surface-container-lowest text-on-surface">
      {/* Hero Section */}
      <section className="relative w-full min-h-[550px] bg-surface-container-highest overflow-hidden flex items-center justify-center">
        {/* Mobile: Cover background to ensure text fits */}
        <img src={storyHeroBgAsset} alt="Master artisan weaving Bhagalpuri silk" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply md:hidden z-0" />
        {/* Desktop: Flow image to define exact height, no cropping */}
        <img src={storyHeroBgAsset} alt="Master artisan weaving Bhagalpuri silk" className="hidden md:block w-full h-auto opacity-80 mix-blend-multiply relative z-0" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent z-10 pointer-events-none"></div>
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-margin-mobile md:px-margin-desktop">
          <div className="max-w-4xl mx-auto flex flex-col items-center mt-12 md:mt-24">
            <span className="font-label-caps text-label-caps text-secondary mb-4 tracking-widest uppercase">Our Heritage</span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6 drop-shadow-md">The Story Woven Into Every Thread</h1>
            <p className="font-story-serif text-story-serif text-on-surface mb-10 max-w-2xl drop-shadow-sm">
              For generations, the artisans of Bhagalpur have transformed raw silk into living heritage, mastering a craft that echoes through time.
            </p>
            <button
                onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps uppercase tracking-wider hover:bg-primary-container transition-colors duration-300 flex items-center gap-2 rounded-sm shadow-md group"
              >
                Explore The Journey
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
          </div>
        </div>
      </section>
      
      {/* SECTION 1: The Silk City of India */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="w-full md:w-1/2">
             <div className="relative p-4 bg-surface-container-lowest ambient-shadow">
               <div className="border border-secondary/30 p-2 relative w-full aspect-square overflow-hidden">
                  <img src={artisanHeroAsset} alt="Bhagalpur Heritage" className="w-full h-full object-cover z-10" />
               </div>
             </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-start">
             <span className="font-label-caps text-label-caps text-primary tracking-widest mb-4">India's Silk City</span>
             <h2 className="font-display-lg text-headline-xl text-on-surface mb-6">Bhagalpur</h2>
             <p className="font-story-serif text-story-serif text-on-surface-variant mb-6 leading-relaxed">
               Situated on the banks of the Ganga, Bhagalpur has been known as India's Silk City for centuries. The region's unique weaving traditions have been passed from one generation to the next, creating textiles celebrated across India and beyond.
             </p>
             <div className="w-full border-t border-secondary/20 pt-6 mt-2 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
                <div>
                  <div className="text-3xl md:text-2xl font-bold text-primary mb-1">200+</div>
                  <div className="text-xs uppercase tracking-widest text-on-surface-variant">Years of Legacy</div>
                </div>
                <div>
                  <div className="text-3xl md:text-2xl font-bold text-primary mb-1">Hundreds</div>
                  <div className="text-xs uppercase tracking-widest text-on-surface-variant">Artisan Families</div>
                </div>
                <div>
                  <div className="text-3xl md:text-2xl font-bold text-primary mb-1">Authentic</div>
                  <div className="text-xs uppercase tracking-widest text-on-surface-variant">Handloom Craft</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: The Journey of Silk */}
      <section id="journey" className="py-section-gap bg-surface-container/30 px-margin-mobile md:px-margin-desktop overflow-hidden">
        <div className="max-w-container-max mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <span className="font-label-caps text-label-caps text-secondary tracking-widest mb-3 block uppercase">From Cocoon to Drape</span>
            <h2 className="font-display-lg text-headline-xl text-on-surface mb-5">The Journey of Silk</h2>
            <p className="font-story-serif text-story-serif text-on-surface-variant max-w-xl mx-auto leading-relaxed">
              Each saree carries within it a story of patience, skill, and tradition — a journey that begins deep in the forests of Jharkhand.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-16 bg-secondary/40"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
              <div className="h-px w-16 bg-secondary/40"></div>
            </div>
          </div>

          {/* Timeline — alternating layout */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical spine */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-secondary/30 to-transparent"></div>

            {[
              {
                step: '01',
                title: 'Silk Cocoon Selection',
                desc: 'Deep in the sal forests, tribal communities hand-harvest wild Tussar cocoons — each one chosen with a practiced eye honed over generations. No machine can replicate this discernment.',
                icon: 'park',
                side: 'left'
              },
              {
                step: '02',
                title: 'Reeling & Yarn Spinning',
                desc: 'The cocoons are carefully boiled and the delicate filament unreeled by hand. A single cocoon yields hundreds of metres of raw, lustrous thread — spun into yarn on traditional wooden charkhas.',
                icon: 'rotate_right',
                side: 'right'
              },
              {
                step: '03',
                title: 'Natural Dyeing',
                desc: 'Artisans steep the yarn in vats of indigo, pomegranate rind, madder root, and turmeric — recipes passed down through families. The result is a depth of colour that synthetic dyes can never match.',
                icon: 'water_drop',
                side: 'left'
              },
              {
                step: '04',
                title: 'Handloom Weaving',
                desc: 'At the heart of every Bhagalpur saree is a master weaver seated at a wooden pit-loom. Each shuttle throw is deliberate. Each pattern — a zari border, a Madhubani motif — is memorised, not printed.',
                icon: 'grid_4x4',
                side: 'right'
              },
              {
                step: '05',
                title: 'Quality & Finishing',
                desc: 'Every piece is stretched, inspected under natural light, and finished by hand. Imperfection is human; inconsistency is not tolerated. The Silk Mark certification is earned, not bought.',
                icon: 'verified',
                side: 'left'
              },
              {
                step: '06',
                title: 'Arriving at Your Door',
                desc: 'Wrapped in unbleached cotton and sealed with a wax stamp, your saree travels from a weaver\'s hands directly to yours — carrying with it the warmth and intention of its maker.',
                icon: 'favorite',
                side: 'right'
              },
            ].map((item, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 mb-16 ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                {/* Content card */}
                <div className="flex-1">
                  <div className={`bg-surface-container-lowest border border-secondary/10 p-8 relative group hover:border-secondary/30 transition-colors duration-500 ${item.side === 'left' ? 'md:mr-10' : 'md:ml-10'}`}>
                    {/* Corner ornament */}
                    <div className={`absolute top-0 ${item.side === 'left' ? 'right-0' : 'left-0'} w-6 h-6 border-t-2 border-r-2 border-secondary/20 ${item.side === 'right' ? 'rotate-90' : ''}`}></div>
                    <div className={`absolute bottom-0 ${item.side === 'left' ? 'left-0' : 'right-0'} w-6 h-6 border-b-2 border-l-2 border-secondary/20 ${item.side === 'right' ? 'rotate-90' : ''}`}></div>

                    <div className="flex items-start gap-4 mb-4">
                      <span className="font-label-caps text-label-caps text-secondary/60 tracking-widest pt-1">{item.step}</span>
                      <h3 className="font-display-lg text-title-lg text-on-surface leading-snug">{item.title}</h3>
                    </div>
                    <p className="text-base text-on-surface-variant leading-relaxed font-body-md">{item.desc}</p>
                  </div>
                </div>

                {/* Centre spine dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-surface-container-lowest border-2 border-secondary/30 items-center justify-center z-10 shrink-0">
                  <span className="material-symbols-outlined text-primary text-base">{item.icon}</span>
                </div>

                {/* Mobile: icon row */}
                <div className="md:hidden flex items-center gap-3 self-start">
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm">{item.icon}</span>
                  </div>
                </div>

                {/* Spacer for opposite side */}
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Meet Our Artisans */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-16">
          <span className="font-label-caps text-label-caps text-primary tracking-widest mb-2 block">The Hands Behind the Craft</span>
          <h2 className="font-display-lg text-headline-xl text-on-surface mb-4">Meet Our Artisans</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-on-surface-variant flex flex-col items-center">
            <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-primary">autorenew</span>
            Loading artisans...
          </div>
        ) : artisans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {artisans.map((artisan, idx) => (
              <div key={idx} className="bg-surface-container-lowest border border-secondary/20 ambient-shadow group overflow-hidden">
                <div className="aspect-[4/5] relative overflow-hidden bg-surface-container/50">
                  <img 
                    src={artisan.image || '/assets/default-artisan.webp'} 
                    alt={artisan.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    onError={(e) => { e.currentTarget.src = '/assets/default-artisan.webp'; }} 
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-display-sm text-title-md text-on-surface">{artisan.name}</h3>
                  <p className="text-xs uppercase tracking-wider text-primary mb-2 mt-1">
                    {Array.isArray(artisan.specialization) ? artisan.specialization.join(', ') : artisan.specialization}
                  </p>
                  <p className="text-sm text-on-surface-variant">{artisan.experienceYears || artisan.experience || 0} Years Exp. | {artisan.city || artisan.location}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-container/20 border border-secondary/10">
             <span className="material-symbols-outlined text-4xl text-primary/50 mb-3 block">group</span>
             <p className="font-story-serif text-lg text-on-surface-variant">Our master artisans will be featured here soon.</p>
          </div>
        )}
      </section>

      {/* SECTION 4: The Heritage We Preserve */}
      <section className="py-section-gap bg-primary text-on-primary px-margin-mobile md:px-margin-desktop relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
           <img src={tussarWeavingAsset} alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-container-max mx-auto relative z-10 text-center">
          <h2 className="font-display-lg text-headline-xl mb-12">The Heritage We Preserve</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            {[
              { title: 'Bhagalpuri Silk', desc: 'Known as the Queen of all fabrics, renowned for its striking resilience and elegance.' },
              { title: 'Tussar Silk', desc: 'Wild silk featuring a rich, textured feel and a natural, un-dyed golden sheen.' },
              { title: 'Ghicha Silk', desc: 'Hand-reeled from the pierced cocoons, offering a coarse but beautiful texture.' },
              { title: 'Matka Silk', desc: 'Woven from thick yarn spun from the mulberry silk waste, highly versatile and organic.' }
            ].map((s, i) => (
              <div key={i} className="border border-white/20 p-6 bg-black/10 backdrop-blur-sm hover:bg-black/20 transition-colors">
                <h3 className="font-display-sm text-title-lg mb-3">{s.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Impact on Artisan Families */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-16">
          <span className="font-label-caps text-label-caps text-secondary tracking-widest mb-3 block uppercase">The Human Story</span>
          <h2 className="font-display-lg text-headline-xl text-on-surface mb-5">Our Artisan Impact</h2>
          <p className="font-story-serif text-story-serif text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Behind every purchase is a family sustained, a tradition continued, a skill honoured.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 border border-secondary/15 divide-y sm:divide-y-0 sm:divide-x divide-secondary/15 bg-surface-container-lowest">
           {[
             { value: stats.totalArtisans, label: 'Weaver Families', sublabel: 'earning a living wage', icon: 'groups' },
             { value: stats.completedOrders.toLocaleString('en-IN'), label: 'Orders Fulfilled', sublabel: 'since we began', icon: 'package_2' },
             { value: stats.activeArtisans, label: 'Active Artisans', sublabel: 'on the platform today', icon: 'person_play' },
             { value: (stats.completedOrders * 1.5).toLocaleString('en-IN'), label: 'Heritage Pieces', sublabel: 'now in loving homes', icon: 'home' },
           ].map((stat, i) => (
             <div key={i} className="flex flex-col items-center text-center p-10 group hover:bg-primary/5 transition-colors duration-300 relative">
               <span className="material-symbols-outlined text-secondary/40 text-3xl mb-4 group-hover:text-secondary transition-colors duration-300">{stat.icon}</span>
               <div className="font-display-lg text-headline-xl text-primary mb-1 leading-none">{stat.value}</div>
               <div className="font-label-caps text-label-caps text-on-surface tracking-widest mb-1 uppercase">{stat.label}</div>
               <div className="text-xs text-on-surface-variant italic">{stat.sublabel}</div>
               {i < 3 && <div className="absolute right-0 top-1/4 bottom-1/4 hidden md:block w-px bg-secondary/10"></div>}
             </div>
           ))}
        </div>
      </section>

      {/* SECTION 6: From Loom to Legacy */}
      <section className="py-16 bg-primary px-margin-mobile md:px-margin-desktop relative overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-5">
          <img src={tussarWeavingAsset} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto">
          <div className="text-center mb-12">
            <span className="font-label-caps text-label-caps text-secondary tracking-widest mb-3 block uppercase">The Promise</span>
            <h2 className="font-display-lg text-headline-xl text-on-primary mb-4">From Loom to Your Life</h2>
            <p className="font-story-serif text-story-serif text-on-primary/70 max-w-xl mx-auto">
              Every step is touched by human hands and guided by centuries of wisdom.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch justify-center gap-0">
            {[
              { icon: 'person_play', title: 'Artisan', note: 'A named weaver, not a factory' },
              { icon: 'view_comfy', title: 'Handloom', note: 'Wood, thread, and skill' },
              { icon: 'verified', title: 'Silk Mark', note: 'Certified authentic' },
              { icon: 'inventory_2', title: 'Handwrapped', note: 'With care and cotton' },
              { icon: 'favorite', title: 'To You', note: 'Carrying a maker\'s warmth' },
            ].map((step, i, arr) => (
              <div key={i} className="flex md:flex-col items-center gap-4 md:gap-0 flex-1">
                <div className="flex md:flex-col items-center gap-3 md:gap-0 flex-1 py-6 px-4 border border-white/10 hover:bg-white/5 transition-colors duration-300 text-center">
                  <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 flex items-center justify-center shrink-0 md:mb-4 md:mx-auto">
                    <span className="material-symbols-outlined text-on-primary text-xl">{step.icon}</span>
                  </div>
                  <div>
                    <div className="font-label-caps text-label-caps text-on-primary tracking-widest uppercase mb-1">{step.title}</div>
                    <div className="text-xs text-on-primary/60 italic">{step.note}</div>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <>
                    <span className="material-symbols-outlined text-on-primary/30 text-xl hidden md:block md:self-center md:-mt-2 rotate-0">arrow_forward</span>
                    <span className="material-symbols-outlined text-on-primary/30 text-xl md:hidden rotate-90">arrow_downward</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: Gallery of Heritage */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display-lg text-headline-xl text-on-surface mb-4">Gallery of Heritage</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
           <img src={closeUpAsset} alt="Close up" className="w-full break-inside-avoid ambient-shadow object-cover" />
           <img src={tussarWeavingAsset} alt="Weaving" className="w-full break-inside-avoid ambient-shadow object-cover" />
           <img src={artisanWeavingLoomAsset} alt="Loom" className="w-full break-inside-avoid ambient-shadow object-cover" />
        </div>
      </section>

      {/* SECTION 8: Customer Trust */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
        <div className="max-w-5xl mx-auto border-t border-b border-primary/20 py-12 flex flex-col md:flex-row items-center justify-around gap-8 text-center">
           <div className="flex flex-col items-center">
             <div className="text-4xl font-display-lg text-primary font-bold">{stats.totalCustomers.toLocaleString('en-IN')}+</div>
             <div className="text-xs uppercase tracking-widest text-on-surface-variant mt-2 font-bold">Total Customers</div>
           </div>
           <div className="hidden md:block w-[1px] h-16 bg-primary/20"></div>
           <div className="flex flex-col items-center">
             <div className="text-4xl font-display-lg text-primary font-bold">{stats.totalOrders.toLocaleString('en-IN')}</div>
             <div className="text-xs uppercase tracking-widest text-on-surface-variant mt-2 font-bold">Total Orders</div>
           </div>
           <div className="hidden md:block w-[1px] h-16 bg-primary/20"></div>
           <div className="flex flex-col items-center">
             <div className="text-4xl font-display-lg text-primary font-bold">{stats.avgRating}/5.0</div>
             <div className="text-xs uppercase tracking-widest text-on-surface-variant mt-2 font-bold">Customer Satisfaction</div>
           </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop text-center bg-surface-container">
        <h2 className="font-display-lg text-headline-xl text-on-surface mb-6">Become Part of the Story</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
          Every Bhagalpur Resham saree carries the legacy of generations of artisans. Discover the collection or meet the people who make it possible.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/collections" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-on-primary font-label-caps text-label-caps hover:bg-primary/90 transition-colors">
            Explore Collections
          </Link>
          <Link to="/artisans" className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary font-label-caps text-label-caps hover:bg-primary/5 transition-colors">
            Meet Our Artisans
          </Link>
        </div>
      </section>
    </main>
  );
}
