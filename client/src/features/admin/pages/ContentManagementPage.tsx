import { Link } from 'react-router-dom';
import bhagalpurReshamBrandLogoAsset from '../../../assets/bhagalpur_resham_brand_logo.png';


const ContentManagementPage = () => {
    return (

        <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen w-full overflow-hidden flex bg-pattern-madhubani">
            
{/*  SideNavBar  */}
<nav className="bg-surface-container-low border-r border-outline-variant h-full w-64 fixed left-0 top-0 flex flex-col py-8 px-4 gap-4 z-40">
<div className="mb-8 px-4 flex flex-col items-center">
<div className="w-16 h-16 rounded-full bg-surface-container-highest mb-4 overflow-hidden border border-outline-variant flex items-center justify-center">
<img alt="Admin Avatar" className="w-full h-full object-cover" data-alt="Professional headshot of an administrator. Soft studio lighting. Elegant and approachable, conveying a sense of curated luxury and trust suitable for a premium heritage brand dashboard." src={bhagalpurReshamBrandLogoAsset}/>
</div>
<h2 className="font-headline-md text-[22px] leading-tight text-primary text-center font-bold">Bhagalpur Resham Admin</h2>
<p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">Luxury Silk Management</p>
</div>
<div className="flex flex-col gap-2 flex-grow overflow-y-auto">
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/dashboard">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>dashboard</span>
<span className="">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/inventory">
<span className="material-symbols-outlined">inventory_2</span>
<span className="">Inventory</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/orders">
<span className="material-symbols-outlined">shopping_cart</span>
<span className="">Orders</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="#">
<span className="material-symbols-outlined">groups</span>
<span className="">Artisan Network</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/analytics">
<span className="material-symbols-outlined">monitoring</span>
<span className="">Analytics</span>
</Link>
{/*  Additional user requested tabs  */}
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/customers">
<span className="material-symbols-outlined">person</span>
<span className="">Customers</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/coupons">
<span className="material-symbols-outlined">local_offer</span>
<span className="">Coupons</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/reviews">
<span className="material-symbols-outlined">reviews</span>
<span className="">Reviews</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-semibold transition-all duration-200" to="/admin/content">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>article</span>
<span className="">Content</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200 mt-auto" to="#">
<span className="material-symbols-outlined">settings</span>
<span className="">Settings</span>
</Link>
</div>
</nav>
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


{/*  Top Navbar  */}

{/*  Dashboard Content Scrollable Area  */}
<div className="flex-1 overflow-y-auto p-8 lg:p-12">
<div className="max-w-[container-max] mx-auto space-y-12 pb-24">
{/*  Page Header  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/30 pb-6">
<div>
<h2 className="font-headline-xl text-headline-xl text-on-surface mb-2">CMS Management Hub</h2>
<p className="font-body-md text-on-surface-variant">Curate the digital storefront and manage storytelling narratives.</p>
</div>
<button className="bg-primary-container text-on-primary-container px-6 py-3 rounded flex items-center gap-2 hover:bg-primary hover:text-on-primary transition-all shadow-[0_2px_8px_rgba(139,0,0,0.15)]">
<span className="material-symbols-outlined text-sm">publish</span>
<span className="font-label-caps">PUBLISH ALL CHANGES</span>
</button>
</div>
{/*  Bento Grid Layout  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
{/*  Left Column: Banners & Stories (8 cols)  */}
<div className="lg:col-span-8 space-y-8">
{/*  Homepage Banners  */}
<section className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-6 shadow-[0_4px_24px_rgba(128,0,32,0.02)]">
<div className="flex justify-between items-center mb-6">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">view_carousel</span>
<h3 className="font-headline-md text-2xl text-on-surface">Homepage Banners</h3>
</div>
<button className="text-primary font-label-caps text-xs flex items-center gap-1 hover:underline">
<span className="material-symbols-outlined text-sm">add</span> ADD NEW
                                </button>
</div>
<div className="space-y-4">
{/*  Banner Item 1  */}
<div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low border border-outline-variant/30 hover:border-primary/30 transition-colors">
<div className="w-32 h-20 bg-surface-variant rounded flex-shrink-0 overflow-hidden relative ornamental-border">
<div className="inner-border w-full h-full bg-cover bg-center" data-alt="Close up shot of rich, dark red silk fabric with intricate gold embroidery along the border. The lighting is soft and directional, highlighting the texture and sheen of the silk. The mood is luxurious and traditional, perfectly matching the heritage modernism aesthetic." style={{ backgroundImage: 'url(&quot', https: '//lh3.googleusercontent.com/aida-public/AB6AXuCDk5ZCMrG04SUcvWdFz05quRnF-RndOwvuwqY6bXEPZ9dq7hPCIcO9-EUI4vP_poS1aigih-ce1vk-p3-WhuhLPXDRM-PlysdmGWUiTEEYOPQ8q8vXT7K7Z4ryZWcQiMgqhX1jEPoxJE41TCvip6UYEZ4b60IO0z3EFmK0vY8QA41IETf-q9qRE8a3KqiA6UnbwB5E9Fkwycpnqcd30ow6Y996mxP3EmvbXa61WZ3p43prN5lrZwfYb38Zl9B_0e3lgVEmhQtA7ezM&quot' }}></div>
</div>
<div className="flex-1">
<h4 className="font-headline-md text-lg">Festive Collection Launch</h4>
<p className="text-xs text-on-surface-variant font-label-caps mt-1">HERO BANNER • ACTIVE</p>
</div>
<div className="flex items-center gap-2">
<button className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-variant transition-colors" title="Edit">
<span className="material-symbols-outlined">edit</span>
</button>
<button className="p-2 text-primary rounded-full bg-primary-fixed hover:bg-primary-fixed-dim transition-colors" title="Toggle Visibility">
<span className="material-symbols-outlined">visibility</span>
</button>
</div>
</div>
{/*  Banner Item 2  */}
<div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low border border-outline-variant/30 hover:border-primary/30 transition-colors opacity-75">
<div className="w-32 h-20 bg-surface-variant rounded flex-shrink-0 overflow-hidden relative ornamental-border">
<div className="inner-border w-full h-full bg-cover bg-center" data-alt="A wide shot of a traditional handloom in a softly lit, rustic workshop. A weaver's hands are visible working the threads. The color palette is earthy with warm wooden tones and raw silk whites. The aesthetic is authentic and artisanal, focusing on the craft of Bhagalpur silk." style={{ backgroundImage: 'url(&quot', https: '//lh3.googleusercontent.com/aida-public/AB6AXuBU7fOGGMnE5jjd-zwkalApuAvKrxAFkQAxIVb3FvNqNNNAlLAT44cR8KiOjg5G-aZiVquU7cykmdk131d7P-ihdhVfu8pOP9KxkPR5s_y5HFYzfj7IqozT2p0YJDaFHUSOrqHD5Ru-z0OWYcnnguN2oF1nvkoAHV78XFZEqKCWZBMz0FYdVeaj-NkDHrpInRc8gCOO5GYZIRFJA5oUkskpermJ90m6tOj-SpgZwPpX-ewpC3rVaHUKFKUqC2aMb0V5_IuP8o92cz-Y&quot' }}></div>
</div>
<div className="flex-1">
<h4 className="font-headline-md text-lg">The Weaver's Tale</h4>
<p className="text-xs text-on-surface-variant font-label-caps mt-1">SECONDARY BANNER • HIDDEN</p>
</div>
<div className="flex items-center gap-2">
<button className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-variant transition-colors" title="Edit">
<span className="material-symbols-outlined">edit</span>
</button>
<button className="p-2 text-on-surface-variant rounded-full bg-surface-variant hover:bg-surface-container-high transition-colors" title="Toggle Visibility">
<span className="material-symbols-outlined">visibility_off</span>
</button>
</div>
</div>
</div>
</section>
{/*  Heritage Stories  */}
<section className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-6 shadow-[0_4px_24px_rgba(128,0,32,0.02)]">
<div className="flex justify-between items-center mb-6">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">auto_stories</span>
<h3 className="font-headline-md text-2xl text-on-surface">Heritage Stories</h3>
</div>
<button className="border border-secondary text-primary px-4 py-2 font-label-caps text-xs hover:bg-surface-container transition-colors rounded">
                                    MANAGE ALL
                                </button>
</div>
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-outline-variant/50 text-on-surface-variant font-label-caps text-xs">
<th className="pb-3 font-semibold w-1/2">TITLE</th>
<th className="pb-3 font-semibold">LAST UPDATED</th>
<th className="pb-3 font-semibold">STATUS</th>
<th className="pb-3 font-semibold text-right">ACTIONS</th>
</tr>
</thead>
<tbody>
<tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors group">
<td className="py-4 pr-4">
<p className="font-headline-md text-lg text-on-surface">The History of Tussar</p>
</td>
<td className="py-4 text-sm text-on-surface-variant">Oct 12, 2024</td>
<td className="py-4">
<span className="inline-block px-2 py-1 bg-secondary-container text-on-secondary-container text-xs rounded-full font-label-caps">PUBLISHED</span>
</td>
<td className="py-4 text-right">
<button className="text-on-surface-variant group-hover:text-primary transition-colors">
<span className="material-symbols-outlined text-sm">edit_square</span>
</button>
</td>
</tr>
<tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors group">
<td className="py-4 pr-4">
<p className="font-headline-md text-lg text-on-surface">Mithila Art in Modern Fashion</p>
</td>
<td className="py-4 text-sm text-on-surface-variant">Oct 18, 2024</td>
<td className="py-4">
<span className="inline-block px-2 py-1 bg-surface-variant text-on-surface-variant text-xs rounded-full font-label-caps">DRAFT</span>
</td>
<td className="py-4 text-right">
<button className="text-on-surface-variant group-hover:text-primary transition-colors">
<span className="material-symbols-outlined text-sm">edit_square</span>
</button>
</td>
</tr>
</tbody>
</table>
</section>
</div>
{/*  Right Column: Sections & Artisans (4 cols)  */}
<div className="lg:col-span-4 space-y-8">
{/*  Homepage Section Layout  */}
<section className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-6 shadow-[0_4px_24px_rgba(128,0,32,0.02)]">
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined text-primary">view_list</span>
<h3 className="font-headline-md text-xl text-on-surface">Page Layout</h3>
</div>
<p className="text-sm text-on-surface-variant mb-4">Drag to reorder homepage sections.</p>
<div className="space-y-2">
{/*  Layout Item  */}
<div className="flex items-center gap-3 p-3 bg-surface border border-outline-variant/30 rounded shadow-sm group">
<span className="material-symbols-outlined text-on-surface-variant drag-handle cursor-move">drag_indicator</span>
<span className="font-body-md text-sm flex-1">Hero Carousel</span>
<div className="w-8 h-4 bg-primary-container rounded-full relative cursor-pointer">
<div className="w-4 h-4 bg-white rounded-full absolute right-0 shadow transform transition-transform"></div>
</div>
</div>
{/*  Layout Item  */}
<div className="flex items-center gap-3 p-3 bg-surface border border-outline-variant/30 rounded shadow-sm group">
<span className="material-symbols-outlined text-on-surface-variant drag-handle cursor-move">drag_indicator</span>
<span className="font-body-md text-sm flex-1">Featured Collections</span>
<div className="w-8 h-4 bg-primary-container rounded-full relative cursor-pointer">
<div className="w-4 h-4 bg-white rounded-full absolute right-0 shadow transform transition-transform"></div>
</div>
</div>
{/*  Layout Item  */}
<div className="flex items-center gap-3 p-3 bg-surface border border-outline-variant/30 rounded shadow-sm group">
<span className="material-symbols-outlined text-on-surface-variant drag-handle cursor-move">drag_indicator</span>
<span className="font-body-md text-sm flex-1">Artisan Story</span>
<div className="w-8 h-4 bg-primary-container rounded-full relative cursor-pointer">
<div className="w-4 h-4 bg-white rounded-full absolute right-0 shadow transform transition-transform"></div>
</div>
</div>
{/*  Layout Item (Hidden)  */}
<div className="flex items-center gap-3 p-3 bg-surface-variant/50 border border-outline-variant/30 rounded shadow-sm group opacity-60">
<span className="material-symbols-outlined text-on-surface-variant drag-handle cursor-move">drag_indicator</span>
<span className="font-body-md text-sm flex-1 line-through">Mithila Art Showcase</span>
<div className="w-8 h-4 bg-outline-variant rounded-full relative cursor-pointer">
<div className="w-4 h-4 bg-white rounded-full absolute left-0 shadow transform transition-transform"></div>
</div>
</div>
</div>
</section>
{/*  Artisan Profiles Mini  */}
<section className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-6 shadow-[0_4px_24px_rgba(128,0,32,0.02)] relative overflow-hidden">
{/*  Decorative bg element  */}
<div className="absolute -bottom-6 -right-6 text-surface-variant opacity-20 pointer-events-none">
<span className="material-symbols-outlined" style={{ fontSize: '120px' }}>gesture</span>
</div>
<div className="flex justify-between items-center mb-6 relative z-10">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">groups</span>
<h3 className="font-headline-md text-xl text-on-surface">Artisan Profiles</h3>
</div>
</div>
<div className="space-y-4 relative z-10">
{/*  Artisan 1  */}
<div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full overflow-hidden bg-surface-variant">
<img alt="Master Weaver" className="w-full h-full object-cover" data-alt="Portrait of an elderly Indian artisan woman with a warm smile, wearing a simple traditional saree. The lighting is natural and soft, highlighting the character in her face. The background is a slightly blurred workshop setting, conveying authenticity and heritage craft." src={bhagalpurReshamBrandLogoAsset}/>
</div>
<div>
<p className="font-headline-md text-base leading-tight">Shanti Devi</p>
<p className="text-xs text-on-surface-variant">Master Weaver</p>
</div>
</div>
<button className="text-primary hover:text-primary-container text-sm font-label-caps">EDIT</button>
</div>
{/*  Artisan 2  */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full overflow-hidden bg-surface-variant">
<img alt="Master Weaver" className="w-full h-full object-cover" data-alt="Portrait of a middle-aged Indian male artisan looking thoughtfully off-camera. He is in a naturally lit room with subtle textures of raw silk in the out-of-focus background. The mood is respectful and highlights the dignity of traditional manual labor in Bhagalpur." src={bhagalpurReshamBrandLogoAsset}/>
</div>
<div>
<p className="font-headline-md text-base leading-tight">Ramesh Kumar</p>
<p className="text-xs text-on-surface-variant">Dyeing Specialist</p>
</div>
</div>
<button className="text-primary hover:text-primary-container text-sm font-label-caps">EDIT</button>
</div>
</div>
<button className="w-full mt-6 py-2 border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary font-label-caps text-xs transition-colors rounded relative z-10">
                                VIEW ALL ARTISANS
                            </button>
</section>
</div>
</div>
</div>
{/*  Bottom decorative motif  */}
<div className="w-full max-w-[container-max] mx-auto opacity-30 mt-8 mb-4">
<div className="motif-divider w-full"></div>
</div>
</div>

                </div>
            </div>
        </main>
    </div>
    );
};

export default ContentManagementPage;
