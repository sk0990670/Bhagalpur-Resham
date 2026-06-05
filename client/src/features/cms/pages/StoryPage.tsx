import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cmsService } from '../../../shared/services/cms.service';
import artisanWeavingLoomAsset from '../../../assets/artisan_weaving_loom.png';
import artisanHeroAsset from '../../../assets/artisan_hero.png';
import closeUpAsset from '../../../assets/close_up_of_a_handloom_weaver_s_hands_working_on_a_silk_saree_traditional.png';
import tussarWeavingAsset from '../../../assets/tussar_silk_weaving.png';

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
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={artisanWeavingLoomAsset} alt="Master artisan weaving Bhagalpuri silk" className="w-full h-full object-cover object-center opacity-90" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-6 drop-shadow-md">The Story Woven Into Every Thread</h1>
          <p className="font-body-lg text-body-lg text-surface-container-lowest mb-10 max-w-2xl drop-shadow-sm">
            For generations, the artisans of Bhagalpur have transformed silk into living heritage.
          </p>
          <a href="#journey" className="inline-flex items-center justify-center px-8 py-4 bg-primary-container text-on-secondary font-label-caps text-label-caps hover:bg-tertiary-container transition-colors duration-300 ambient-shadow border border-secondary/20 hover-group">
            Explore The Journey
          </a>
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
      <section id="journey" className="py-section-gap bg-surface-container/30 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto text-center mb-16">
          <h2 className="font-display-lg text-headline-xl text-on-surface mb-4">The Journey of Silk</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Timeline steps */}
          {[
            { step: '01', title: 'Silk Cocoon Selection', desc: 'Carefully handpicking the finest Tussar cocoons.' },
            { step: '02', title: 'Yarn Preparation', desc: 'Spinning natural fibers into resilient yarn.' },
            { step: '03', title: 'Dyeing Process', desc: 'Using natural, heritage-inspired dyes.' },
            { step: '04', title: 'Handloom Weaving', desc: 'Master artisans weaving intricate patterns.' },
            { step: '05', title: 'Quality Inspection', desc: 'Rigorous checks for authentic perfection.' },
            { step: '06', title: 'Delivery', desc: 'Bringing a piece of heritage to your home.' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-surface-container-lowest border border-secondary/10 ambient-shadow hover:-translate-y-1 transition-transform duration-300">
               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4 border border-primary/20">
                 {item.step}
               </div>
               <h3 className="font-display-sm text-title-lg text-on-surface mb-2">{item.title}</h3>
               <p className="text-sm text-on-surface-variant">{item.desc}</p>
            </div>
          ))}
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
                  {artisan.image ? (
                    <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/30">
                       <span className="material-symbols-outlined text-6xl">person</span>
                    </div>
                  )}
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-display-sm text-title-md text-on-surface">{artisan.name}</h3>
                  <p className="text-xs uppercase tracking-wider text-primary mb-2 mt-1">{artisan.specialization}</p>
                  <p className="text-sm text-on-surface-variant">{artisan.experience} Years Exp. | {artisan.location}</p>
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
          <h2 className="font-display-lg text-headline-xl text-on-surface mb-4">Our Artisan Impact</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Every purchase contributes directly to the welfare and continuation of these traditional weaving families.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
           <div className="p-8 text-center border border-secondary/20 bg-surface-container-lowest ambient-shadow">
             <div className="text-4xl md:text-5xl font-display-lg text-primary mb-2">{stats.totalArtisans}</div>
             <div className="text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant font-bold">Families Supported</div>
           </div>
           <div className="p-8 text-center border border-secondary/20 bg-surface-container-lowest ambient-shadow">
             <div className="text-4xl md:text-5xl font-display-lg text-primary mb-2">{stats.completedOrders.toLocaleString('en-IN')}</div>
             <div className="text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant font-bold">Orders Completed</div>
           </div>
           <div className="p-8 text-center border border-secondary/20 bg-surface-container-lowest ambient-shadow">
             <div className="text-4xl md:text-5xl font-display-lg text-primary mb-2">{stats.activeArtisans}</div>
             <div className="text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant font-bold">Active Artisans</div>
           </div>
           <div className="p-8 text-center border border-secondary/20 bg-surface-container-lowest ambient-shadow">
             <div className="text-4xl md:text-5xl font-display-lg text-primary mb-2">{(stats.completedOrders * 1.5).toLocaleString('en-IN')}</div>
             <div className="text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant font-bold">Heritage Pieces Delivered</div>
           </div>
        </div>
      </section>

      {/* SECTION 6: From Loom to Legacy */}
      <section className="py-16 bg-surface-container/30 border-y border-secondary/20 px-margin-mobile">
         <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 text-center md:text-left">
           <div className="flex-1 flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
               <span className="material-symbols-outlined text-3xl text-primary">person</span>
             </div>
             <span className="font-label-caps text-sm tracking-widest text-on-surface">Artisan</span>
           </div>
           <div className="hidden md:block w-16 lg:w-24 h-[2px] bg-primary/20"></div>
           <div className="block md:hidden h-8 w-[2px] bg-primary/20"></div>
           <div className="flex-1 flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
               <span className="material-symbols-outlined text-3xl text-primary">view_comfy</span>
             </div>
             <span className="font-label-caps text-sm tracking-widest text-on-surface">Handloom</span>
           </div>
           <div className="hidden md:block w-16 lg:w-24 h-[2px] bg-primary/20"></div>
           <div className="block md:hidden h-8 w-[2px] bg-primary/20"></div>
           <div className="flex-1 flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
               <span className="material-symbols-outlined text-3xl text-primary">verified</span>
             </div>
             <span className="font-label-caps text-sm tracking-widest text-on-surface">Quality Check</span>
           </div>
           <div className="hidden md:block w-16 lg:w-24 h-[2px] bg-primary/20"></div>
           <div className="block md:hidden h-8 w-[2px] bg-primary/20"></div>
           <div className="flex-1 flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
               <span className="material-symbols-outlined text-3xl text-primary">inventory_2</span>
             </div>
             <span className="font-label-caps text-sm tracking-widest text-on-surface">Packaging</span>
           </div>
           <div className="hidden md:block w-16 lg:w-24 h-[2px] bg-primary/20"></div>
           <div className="block md:hidden h-8 w-[2px] bg-primary/20"></div>
           <div className="flex-1 flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
               <span className="material-symbols-outlined text-3xl text-primary">favorite</span>
             </div>
             <span className="font-label-caps text-sm tracking-widest text-on-surface">Customer</span>
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
