import { Link } from 'react-router-dom';
import bhagalpurReshamBrandLogoAsset from '../../../assets/bhagalpur_resham_brand_logo.png';


const AdminCustomerManagement = () => {
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
<Link className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-semibold transition-all duration-200" to="/admin/customers">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>person</span>
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



{/*  Page Canvas  */}
<div className="flex-1 px-margin-desktop py-12 max-w-container-max mx-auto w-full">
{/*  Page Header & Actions  */}
<div className="flex justify-between items-end mb-10 border-b border-outline-variant pb-6">
<div>
<h2 className="font-headline-xl text-headline-xl text-primary mb-2">Customer Directory</h2>
<p className="font-story-serif text-story-serif text-on-surface-variant">Manage your esteemed clientele and patron history.</p>
</div>
<div className="flex space-x-4">
<button className="px-6 py-3 border border-secondary text-primary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors flex items-center">
<span className="material-symbols-outlined mr-2 text-[18px]">filter_list</span>
                        FILTER: TOP SPENDERS
                    </button>
<button className="px-6 py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps hover:bg-primary transition-colors shadow-artisan flex items-center">
<span className="material-symbols-outlined mr-2 text-[18px]">person_add</span>
                        ADD PATRON
                    </button>
</div>
</div>
{/*  Search and Filter Bar  */}
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-artisan border border-outline-variant/30 mb-8 flex justify-between items-center relative overflow-hidden">
{/*  Decorative subtle border  */}
<div className="absolute inset-2 border border-secondary/20 pointer-events-none"></div>
<div className="relative w-1/3 z-10 flex items-center">
<span className="material-symbols-outlined absolute left-0 text-on-surface-variant">search</span>
<input className="w-full bg-transparent border-0 border-b border-outline-variant pl-8 pr-4 py-2 text-on-background focus:ring-0 input-artisan border-primary font-body-md text-body-md transition-colors placeholder-on-surface-variant/50" placeholder="Search by name, email or ID..." type="text"/>
</div>
<div className="flex space-x-6 z-10">
<div className="flex items-center space-x-2">
<span className="font-label-caps text-label-caps text-on-surface-variant">STATUS:</span>
<select className="bg-transparent border-0 border-b border-outline-variant text-primary font-body-md text-body-md focus:ring-0 input-artisan cursor-pointer pr-8">
<option>All Patrons</option>
<option>Active</option>
<option>Dormant</option>
</select>
</div>
<div className="flex items-center space-x-2">
<span className="font-label-caps text-label-caps text-on-surface-variant">SORT BY:</span>
<select className="bg-transparent border-0 border-b border-outline-variant text-primary font-body-md text-body-md focus:ring-0 input-artisan cursor-pointer pr-8">
<option>Recent Activity</option>
<option>Highest Spend</option>
<option>Name (A-Z)</option>
</select>
</div>
</div>
</div>
{/*  Customer Data Table (The Masterpiece Card treatment applied to a table layout)  */}
<div className="bg-surface-container-lowest rounded-xl shadow-artisan border border-outline-variant/50 relative overflow-hidden">
{/*  Double border technique  */}
<div className="absolute inset-[6px] border border-secondary/30 pointer-events-none rounded-lg"></div>
<div className="overflow-x-auto relative z-10 p-[16px]">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-outline-variant">
<th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">Patron Details</th>
<th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">Contact Info</th>
<th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold text-right">Orders</th>
<th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold text-right">Total Spend (INR)</th>
<th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold text-right">Last Activity</th>
<th className="py-4 px-6"></th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-high">
{/*  Row 1  */}
<tr className="hover:bg-surface-container-low transition-colors duration-150 group cursor-pointer">
<td className="py-5 px-6">
<div className="flex items-center">
<div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary font-headline-md text-[18px] mr-4 shrink-0 shadow-sm">
                                            A
                                        </div>
<div>
<div className="font-headline-md text-[18px] text-on-background group-hover:text-primary transition-colors">Aarav Patel</div>
<div className="font-label-caps text-[10px] text-secondary mt-1 flex items-center">
<span className="material-symbols-outlined text-[14px] mr-1" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                                                SILK MARK VIP
                                            </div>
</div>
</div>
</td>
<td className="py-5 px-6 text-on-surface-variant">aarav.p@example.com</td>
<td className="py-5 px-6 text-right font-body-md">12</td>
<td className="py-5 px-6 text-right font-body-md font-semibold text-primary">₹ 1,45,000</td>
<td className="py-5 px-6 text-right text-on-surface-variant">Oct 12, 2023</td>
<td className="py-5 px-6 text-right">
<button className="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/*  Row 2  */}
<tr className="hover:bg-surface-container-low transition-colors duration-150 group cursor-pointer">
<td className="py-5 px-6">
<div className="flex items-center">
<div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-headline-md text-[18px] mr-4 shrink-0 shadow-sm border border-outline-variant">
                                            N
                                        </div>
<div>
<div className="font-headline-md text-[18px] text-on-background group-hover:text-primary transition-colors">Nisha Sharma</div>
</div>
</div>
</td>
<td className="py-5 px-6 text-on-surface-variant">n.sharma_design@web.in</td>
<td className="py-5 px-6 text-right font-body-md">4</td>
<td className="py-5 px-6 text-right font-body-md font-semibold text-primary">₹ 32,500</td>
<td className="py-5 px-6 text-right text-on-surface-variant">Sep 28, 2023</td>
<td className="py-5 px-6 text-right">
<button className="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/*  Row 3  */}
<tr className="hover:bg-surface-container-low transition-colors duration-150 group cursor-pointer">
<td className="py-5 px-6">
<div className="flex items-center">
<div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-headline-md text-[18px] mr-4 shrink-0 shadow-sm border border-outline-variant">
                                            R
                                        </div>
<div>
<div className="font-headline-md text-[18px] text-on-background group-hover:text-primary transition-colors">Rohan Desai</div>
</div>
</div>
</td>
<td className="py-5 px-6 text-on-surface-variant">rohan.desai88@mail.com</td>
<td className="py-5 px-6 text-right font-body-md">1</td>
<td className="py-5 px-6 text-right font-body-md font-semibold text-primary">₹ 8,900</td>
<td className="py-5 px-6 text-right text-on-surface-variant">Sep 15, 2023</td>
<td className="py-5 px-6 text-right">
<button className="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/*  Row 4  */}
<tr className="hover:bg-surface-container-low transition-colors duration-150 group cursor-pointer">
<td className="py-5 px-6">
<div className="flex items-center">
<div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary font-headline-md text-[18px] mr-4 shrink-0 shadow-sm">
                                            M
                                        </div>
<div>
<div className="font-headline-md text-[18px] text-on-background group-hover:text-primary transition-colors">Meera Kapoor</div>
<div className="font-label-caps text-[10px] text-secondary mt-1 flex items-center">
<span className="material-symbols-outlined text-[14px] mr-1" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                                                SILK MARK VIP
                                            </div>
</div>
</div>
</td>
<td className="py-5 px-6 text-on-surface-variant">meera_k_boutique@fashion.com</td>
<td className="py-5 px-6 text-right font-body-md">28</td>
<td className="py-5 px-6 text-right font-body-md font-semibold text-primary">₹ 4,15,200</td>
<td className="py-5 px-6 text-right text-on-surface-variant">Aug 02, 2023</td>
<td className="py-5 px-6 text-right">
<button className="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Pagination Footer  */}
<div className="border-t border-outline-variant bg-surface-container-low px-6 py-4 flex justify-between items-center relative z-10 rounded-b-lg">
<span className="font-label-caps text-label-caps text-on-surface-variant">SHOWING 1-4 OF 128 PATRONS</span>
<div className="flex space-x-2">
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-50" disabled="">
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary shadow-sm">
                            1
                        </button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors">
                            2
                        </button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors">
                            3
                        </button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</div>
</div>

                </div>
            </div>
        </main>
    </div>
    );
};

export default AdminCustomerManagement;
