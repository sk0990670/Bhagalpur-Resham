import { Link } from 'react-router-dom';
import bhagalpurReshamBrandLogoAsset from '../../../assets/bhagalpur_resham_brand_logo.png';


const AdminCouponManagement = () => {
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
<Link className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-semibold transition-all duration-200" to="/admin/coupons">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>local_offer</span>
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


{/*  Sticky Header  */}

{/*  Content Area  */}
<div className="p-margin-mobile md:p-margin-desktop flex-1 flex flex-col gap-12">
{/*  Page Header  */}
<section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
<div>
<h2 className="font-headline-xl text-headline-xl text-primary mb-2">Promotion &amp; Loyalty Management</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant italic font-story-serif">Crafting value for our esteemed patrons.</p>
</div>
<button className="bg-primary hover:bg-primary-container text-on-primary px-8 py-3 rounded-DEFAULT font-label-caps text-label-caps transition-all flex items-center gap-2 shadow-sm" onclick="document.getElementById('coupon-modal').classList.remove('hidden')">
<span className="material-symbols-outlined text-[18px]">add</span>
                    CREATE NEW COUPON
                </button>
</section>
{/*  Stats/Overview Bento  */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="bg-surface-container-lowest p-6 madhubani-border ambient-shadow">
<p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Active Promotions</p>
<p className="font-headline-md text-headline-md text-primary">12</p>
</div>
<div className="bg-surface-container-lowest p-6 madhubani-border ambient-shadow">
<p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Total Value Redeemed</p>
<p className="font-headline-md text-headline-md text-primary">₹ 1,45,000</p>
</div>
<div className="bg-surface-container-lowest p-6 madhubani-border ambient-shadow">
<p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Expiring Soon</p>
<p className="font-headline-md text-headline-md text-primary">3</p>
</div>
</section>
{/*  Coupons Table  */}
<section className="bg-surface-container-lowest p-1 ambient-shadow rounded-sm border border-outline-variant/50">
<div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
<h3 className="font-headline-md text-headline-md text-primary">Active Catalog</h3>
<div className="flex gap-4">
<select className="bg-transparent border-b border-outline text-on-surface font-label-caps text-label-caps focus:outline-none focus:border-primary py-1">
<option>All Types</option>
<option>Percentage</option>
<option>Fixed</option>
</select>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">
<th className="p-4 font-semibold tracking-wider">CODE NAME</th>
<th className="p-4 font-semibold tracking-wider">DISCOUNT</th>
<th className="p-4 font-semibold tracking-wider">STATUS</th>
<th className="p-4 font-semibold tracking-wider">REDEEMED</th>
<th className="p-4 font-semibold tracking-wider">EXPIRY</th>
<th className="p-4 font-semibold tracking-wider text-right">ACTIONS</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md text-on-surface">
<tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
<td className="p-4 font-semibold text-primary">TUSSAR10</td>
<td className="p-4">10% Off</td>
<td className="p-4"><span className="inline-flex items-center gap-1 text-primary-container"><span className="w-2 h-2 rounded-full bg-primary-container"></span> Active</span></td>
<td className="p-4">45 / 100</td>
<td className="p-4">31 Dec 2024</td>
<td className="p-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-[20px]">edit</span></button>
<button className="text-on-surface-variant hover:text-error transition-colors p-1 ml-2"><span className="material-symbols-outlined text-[20px]">block</span></button>
</td>
</tr>
<tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
<td className="p-4 font-semibold text-primary">FESTIVE2000</td>
<td className="p-4">₹ 2000 Fixed</td>
<td className="p-4"><span className="inline-flex items-center gap-1 text-primary-container"><span className="w-2 h-2 rounded-full bg-primary-container"></span> Active</span></td>
<td className="p-4">12 / 50</td>
<td className="p-4">15 Nov 2024</td>
<td className="p-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-[20px]">edit</span></button>
<button className="text-on-surface-variant hover:text-error transition-colors p-1 ml-2"><span className="material-symbols-outlined text-[20px]">block</span></button>
</td>
</tr>
<tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors text-on-surface-variant/50">
<td className="p-4 font-semibold">DIWALI23</td>
<td className="p-4">15% Off</td>
<td className="p-4"><span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-outline"></span> Expired</span></td>
<td className="p-4">500 / 500</td>
<td className="p-4">12 Nov 2023</td>
<td className="p-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
</td>
</tr>
</tbody>
</table>
</div>
</section>
{/*  Cultural Divider  */}
<div className="flex justify-center items-center my-8 opacity-40">
<div className="h-px w-32 bg-secondary"></div>
<span className="material-symbols-outlined text-secondary mx-4">spa</span>
<div className="h-px w-32 bg-secondary"></div>
</div>
</div>

                </div>
            </div>
        </main>
    </div>
    );
};

export default AdminCouponManagement;
