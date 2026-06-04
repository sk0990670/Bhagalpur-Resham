import AdminSidebar from '../../../shared/components/AdminSidebar';
import { Link } from 'react-router-dom';


const AdminReviewModeration = () => {
    return (

        <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen w-full overflow-hidden flex bg-pattern-madhubani">
            
{/*  SideNavBar  */}
<AdminSidebar />
{/*  Main Content  */}
<main className="ml-64 flex-1 flex flex-col h-full overflow-hidden">
{/*  TopAppBar (Minimal, Sticky)  */}
<header className="bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-30 px-margin-desktop py-4 flex justify-between items-center">
{/*  Search Bar (Left aligned)  */}
<div className="flex-1 max-w-md relative group">
<span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
<input className="w-full bg-transparent border-0 border-b border-outline-variant/50 focus:border-primary focus:ring-0 pl-10 py-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-colors outline-none" placeholder="Search orders, artisans, or silk marks..." type="text"/>
</div>
{/*  Trailing Actions  */}
<div className="flex items-center gap-6 text-on-surface-variant">
<button className="relative hover:text-primary transition-colors cursor-pointer active:scale-95">
<span className="material-symbols-outlined" >notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
</button>
<div className="h-6 w-px bg-outline-variant/50"></div>
<button className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer active:scale-95">
<span className="material-symbols-outlined" >account_circle</span>
<div className="text-left hidden md:block">
<p className="font-label-caps text-[10px] tracking-wider uppercase text-primary font-bold">Aarav M.</p>
<p className="font-label-caps text-[9px] text-on-surface-variant">Master Weaver</p>
</div>
</button>
</div>
</header>
{/*  Scrollable Canvas  */}
<div className="flex-1 overflow-y-auto p-gutter lg:p-margin-desktop bg-surface-container-lowest">
<div className="max-w-container-max mx-auto space-y-section-gap pb-section-gap">


{/*  Sticky Header (Mobile Only for Sidebar, but keep brand visible)  */}

{/*  Page Header  */}
<div className="px-margin-mobile md:px-margin-desktop py-12">
<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
<div>
<h2 className="font-headline-xl text-headline-xl text-primary mb-2">Review Moderation</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">Curate and manage customer testimonials to maintain the regal standard of our artisan collection.</p>
</div>
<div className="flex gap-4">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="pl-10 pr-4 py-2 bg-transparent border-b border-primary focus:outline-none focus:border-b-2 font-body-md text-on-surface w-64 transition-all pb-1" placeholder="Search reviews..." type="text"/>
</div>
<button className="flex items-center gap-2 px-4 py-2 border border-secondary text-primary hover:bg-surface-container-high transition-colors font-label-caps rounded">
<span className="material-symbols-outlined text-sm">filter_list</span>
                        FILTER
                    </button>
</div>
</div>
<div className="flex gap-6 border-b border-outline-variant/50 mb-8">
<button className="px-4 py-2 font-label-caps text-primary border-b-2 border-primary">PENDING (12)</button>
<button className="px-4 py-2 font-label-caps text-on-surface-variant hover:text-primary transition-colors">APPROVED (148)</button>
<button className="px-4 py-2 font-label-caps text-on-surface-variant hover:text-primary transition-colors">REJECTED (5)</button>
</div>
{/*  Review Cards Grid  */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
{/*  Review Card 1 (Pending)  */}
<div className="ornamental-border rounded-lg flex flex-col p-6">
<div className="flex justify-between items-start mb-4">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-headline-md text-xl">A</div>
<div>
<h3 className="font-story-serif text-story-serif text-on-surface">Aanya Sharma</h3>
<p className="font-label-caps text-on-surface-variant text-xs mt-1">OCT 12, 2024</p>
</div>
</div>
<span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label-caps text-xs rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">pending</span> Pending
                        </span>
</div>
<div className="mb-4">
<p className="font-label-caps text-primary text-xs mb-1">PRODUCT</p>
<Link className="font-body-md text-on-surface hover:text-primary underline decoration-outline-variant hover:decoration-primary transition-colors" to="#">Midnight Lotus Tussar Masterpiece</Link>
</div>
<div className="flex gap-1 text-secondary mb-3">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
</div>
<p className="font-body-lg text-body-lg text-on-surface-variant italic mb-6 flex-grow">
                        "The craftsmanship is unparalleled. The raw texture of the Tussar silk combined with the intricate Madhubani motifs makes this piece a true heirloom. Absolutely stunning."
                    </p>
<div className="flex gap-3 mt-auto pt-4 border-t border-outline-variant/30">
<button className="flex-1 bg-primary-container text-on-primary hover:bg-primary transition-colors py-2 font-label-caps rounded">APPROVE</button>
<button className="flex-1 border border-secondary text-primary hover:bg-surface-container-high transition-colors py-2 font-label-caps rounded">REJECT</button>
<button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-colors rounded">
<span className="material-symbols-outlined">reply</span>
</button>
</div>
</div>
{/*  Review Card 2 (Pending)  */}
<div className="ornamental-border rounded-lg flex flex-col p-6">
<div className="flex justify-between items-start mb-4">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-headline-md text-xl">V</div>
<div>
<h3 className="font-story-serif text-story-serif text-on-surface">Vikram Singh</h3>
<p className="font-label-caps text-on-surface-variant text-xs mt-1">OCT 10, 2024</p>
</div>
</div>
<span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label-caps text-xs rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">pending</span> Pending
                        </span>
</div>
<div className="mb-4">
<p className="font-label-caps text-primary text-xs mb-1">PRODUCT</p>
<Link className="font-body-md text-on-surface hover:text-primary underline decoration-outline-variant hover:decoration-primary transition-colors" to="#">Crimson Weave Heritage Saree</Link>
</div>
<div className="flex gap-1 text-secondary mb-3">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
<span className="material-symbols-outlined">star</span>
<span className="material-symbols-outlined">star</span>
</div>
<p className="font-body-lg text-body-lg text-on-surface-variant italic mb-6 flex-grow">
                        "The color is rich, but the fabric felt a bit stiffer than expected. The packaging was beautiful though, very regal."
                    </p>
<div className="flex gap-3 mt-auto pt-4 border-t border-outline-variant/30">
<button className="flex-1 bg-primary-container text-on-primary hover:bg-primary transition-colors py-2 font-label-caps rounded">APPROVE</button>
<button className="flex-1 border border-secondary text-primary hover:bg-surface-container-high transition-colors py-2 font-label-caps rounded">REJECT</button>
<button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-colors rounded">
<span className="material-symbols-outlined">reply</span>
</button>
</div>
</div>
</div>
<div className="mt-12 flex justify-center">
<button className="flex items-center gap-2 text-primary font-label-caps hover:underline decoration-secondary transition-all">
                    LOAD MORE REVIEWS <span className="material-symbols-outlined text-sm">expand_more</span>
</button>
</div>
</div>


                </div>
            </div>
        </main>
    </div>
    );
};

export default AdminReviewModeration;
