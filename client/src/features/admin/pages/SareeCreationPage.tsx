import { Link, useNavigate } from 'react-router-dom';
import bhagalpurReshamBrandLogoAsset from '../../../assets/bhagalpur_resham_brand_logo.png';


const AdminSareeCreation = () => {
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
<Link className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-semibold transition-all duration-200" to="/admin/inventory">
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
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/content">
<span className="material-symbols-outlined">article</span>
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


{/*  Sticky TopAppBar (Mobile & Tablet)  */}
<header className="md:hidden sticky top-0 z-30 bg-surface/90 backdrop-blur-md px-4 py-4 flex items-center justify-between shadow-sm">
<h1 className="font-headline-md text-headline-md text-primary italic">Bhagalpur Resham</h1>
<button className="text-primary"><span className="material-symbols-outlined">menu</span></button>
</header>
<div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 pb-32">
{/*  Header & Back Link  */}
<div className="mb-8">
<Link className="inline-flex items-center text-primary font-label-caps text-label-caps hover:opacity-70 transition-opacity mb-4" to="/admin/inventory">
<span className="material-symbols-outlined mr-2" style={{ fontSize: '16px' }}>arrow_back</span>
                    BACK TO INVENTORY
                </Link>
<h2 className="font-headline-xl text-headline-xl text-primary mb-2">Create Masterpiece</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Add a new luxury handloom creation to the catalog.</p>
</div>
<form className="space-y-12">
{/*  Basic Information  */}
<section className="ambient-shadow bg-surface-container-lowest p-6 md:p-10 ornamental-border">
<h3 className="font-story-serif text-story-serif text-tertiary mb-6 border-b border-outline-variant/30 pb-2">I. The Essence</h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="col-span-1 md:col-span-2">
<label className="block font-label-caps text-label-caps text-primary mb-1">Saree Name</label>
<input className="w-full custom-input font-headline-md text-headline-md text-on-surface focus:ring-0 placeholder:text-outline/50" placeholder="e.g. Royal Maroon Tussar Silk" type="text"/>
</div>
<div>
<label className="block font-label-caps text-label-caps text-primary mb-1">Category</label>
<select className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0">
<option>Pure Tussar Silk</option>
<option>Gicha Silk</option>
<option>Matka Silk</option>
<option>Linen Silk Blend</option>
</select>
</div>
<div>
<label className="block font-label-caps text-label-caps text-primary mb-1">Stock Quantity</label>
<input className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0" placeholder="0" type="number"/>
</div>
<div>
<label className="block font-label-caps text-label-caps text-primary mb-1">Price (INR)</label>
<input className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0" placeholder="₹" type="text"/>
</div>
<div>
<label className="block font-label-caps text-label-caps text-primary mb-1">Discount Price (Optional)</label>
<input className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0" placeholder="₹" type="text"/>
</div>
</div>
</section>
{/*  Media Upload  */}
<section className="ambient-shadow bg-surface-container-lowest p-6 md:p-10 ornamental-border">
<h3 className="font-story-serif text-story-serif text-tertiary mb-6 border-b border-outline-variant/30 pb-2">II. Visuals</h3>
<div className="border-2 border-dashed border-outline-variant p-12 text-center hover:bg-primary-container/5 transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-4xl text-outline mb-4 group-hover:text-primary transition-colors">cloud_upload</span>
<p className="font-body-lg text-body-lg text-on-surface mb-2">Drag and drop imagery here</p>
<p className="font-body-md text-body-md text-outline mb-6">High resolution, perfectly lit photography only. (Max 5MB per image)</p>
<button className="border border-secondary-fixed-dim text-primary font-label-caps text-label-caps py-3 px-8 hover:bg-surface-variant transition-colors" type="button">
                            BROWSE GALLERY
                        </button>
</div>
</section>
{/*  Product Details  */}
<section className="ambient-shadow bg-surface-container-lowest p-6 md:p-10 ornamental-border">
<h3 className="font-story-serif text-story-serif text-tertiary mb-6 border-b border-outline-variant/30 pb-2">III. The Craft</h3>
<div className="space-y-8">
<div>
<label className="block font-label-caps text-label-caps text-primary mb-2">Artisanal Story (Description)</label>
<textarea className="w-full border border-outline-variant bg-transparent p-4 font-body-md text-body-md focus:ring-1 focus:ring-primary focus:border-primary resize-none" placeholder="Describe the weave, the inspiration, and the legacy..." rows="4"></textarea>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div>
<label className="block font-label-caps text-label-caps text-primary mb-1">Weaving Technique</label>
<input className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0" placeholder="e.g. Handloom, Extra Weft" type="text"/>
</div>
<div>
<label className="block font-label-caps text-label-caps text-primary mb-1">Primary Color</label>
<input className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0" placeholder="e.g. Deep Maroon" type="text"/>
</div>
<div>
<label className="block font-label-caps text-label-caps text-primary mb-1">Care Instructions</label>
<input className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0" type="text" value="Dry Clean Only"/>
</div>
<div>
<label className="block font-label-caps text-label-caps text-primary mb-1">Occasion</label>
<input className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0" placeholder="e.g. Wedding, Festive" type="text"/>
</div>
</div>
</div>
</section>
</form>
</div>
{/*  Sticky Action Bar  */}
<div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface-container-lowest border-t border-outline-variant/50 p-4 md:px-margin-desktop shadow-[0_-4px_20px_rgba(128,0,32,0.05)] z-40 flex justify-end gap-4 items-center">
<button className="font-label-caps text-label-caps text-primary border border-secondary-fixed-dim px-6 py-3 hover:bg-surface-variant transition-colors">
                SAVE DRAFT
            </button>
<button className="font-label-caps text-label-caps text-secondary-fixed bg-[#8B0000] px-8 py-3 hover:bg-tertiary transition-colors shadow-sm">
                PUBLISH MASTERPIECE
            </button>
</div>

                </div>
            </div>
        </main>
    </div>
    );
};

export default AdminSareeCreation;
