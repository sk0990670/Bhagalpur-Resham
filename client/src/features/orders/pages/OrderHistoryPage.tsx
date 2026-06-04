import { Link } from 'react-router-dom';

const OrderHistory = () => {
  return (
    <div className="flex flex-1 w-full mx-auto relative">
      {/* SideNavBar */}
      <aside className="w-64 flex-shrink-0 bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant/20 hidden md:flex flex-col py-8">
        <div className="px-6 mb-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-surface-variant flex items-center justify-center mb-4 border border-secondary-container">
            <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
          </div>
          <h2 className="font-headline-md text-[20px] font-semibold text-primary">Welcome, Patron</h2>
          <p className="font-body-md text-[14px] text-on-surface-variant">Custodian of Heritage</p>
          <button className="mt-4 px-4 py-2 bg-primary-container text-on-primary text-label-caps uppercase tracking-widest hover:bg-primary transition-colors w-full border border-secondary-fixed-dim cursor-pointer">
            View Loom Status
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 hover:bg-surface-container-highest transition-colors" to="/dashboard">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
            <span className="font-body-md text-body-md">My Profile</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container font-semibold rounded-lg mx-2 hover:bg-surface-container-highest transition-colors translate-x-1" to="/order-history">
            <span className="material-symbols-outlined">potted_plant</span>
            <span className="font-body-md text-body-md">Order History</span>
          </Link>

          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 hover:bg-surface-container-highest transition-colors" to="/artisan-credits">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span className="font-body-md text-body-md">Artisan Credits</span>
          </Link>
          <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 hover:bg-surface-container-highest transition-colors" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md text-body-md">Settings</span>
          </a>
        </nav>
        <div className="mt-auto px-4 flex flex-col gap-2 border-t border-outline-variant/20 pt-4">
          <Link className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors" to="/support">
            <span className="material-symbols-outlined">help</span>
            <span className="font-body-md text-[14px]">Support</span>
          </Link>
          <button className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors w-full text-left cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-md text-[14px]">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Canvas Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto py-8 px-margin-mobile md:px-margin-desktop min-h-[calc(100vh-88px)]">
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left relative">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Order History</h1>
          <div className="w-32 h-6 mx-auto md:mx-0 opacity-60" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' viewBox=\'0 0 100 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10 Q 25 20, 50 10 T 100 10\' fill=\'none\' stroke=\'%238e706b\' stroke-width=\'1\' stroke-dasharray=\'4,4\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat-x', backgroundPosition: 'center' }}></div>
        </div>
        
        {/* Orders List */}
        <div className="space-y-8">
          {/* Order Card 1: Delivered */}
          <div className="bg-surface-container-lowest ambient-shadow rounded-lg p-1 relative overflow-hidden border border-outline-variant/30">
            {/* Ornamental inner border */}
            <div className="border border-secondary-container/50 p-6 rounded relative h-full flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="w-full md:w-32 h-40 bg-surface-variant flex-shrink-0 relative overflow-hidden rounded">
                <img 
                  alt="Saree detail" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh82NHnEFRv9pkfrtXcQaTmAbbdH2PPackcneHgMGmFLM2czOUMzJibyPRaUCn4ShGIhYtNaDNqdroNDzXVzNI2DIAwnnh_gEFHkz_OFUs1TvCEZuoR4pfsaoDaORfChc9PE3S-VCK-9D0yLP999UVGSGyIsP1idhl0BFDdp1VlFeB9tBWthXJ7vgK8zy4ysYfcVgjIg3Lb8XsIM7xZ44NgoCEjRQW0p4yFPJmETfMjbBtf6HgUBkHtcp_fYj2Cz1s6h4c-OJ7c0zP"
                />
              </div>
              {/* Order Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 gap-4">
                  <div>
                    <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1">Order #BR-99021</h3>
                    <p className="font-body-md text-body-md text-on-surface">Placed on 12 Oct, 2023</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-tertiary-container/10 text-tertiary border border-tertiary/20 flex items-center">
                    <span className="material-symbols-outlined mr-2 text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
                    <span className="font-label-caps text-[10px]">Delivered</span>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-story-serif text-[18px] text-primary mb-1">Crimson Lotus Tussar Silk Saree</h4>
                  <p className="font-body-md text-[14px] text-on-surface-variant">Qty: 1 • Woven by Artisan Anjali Devi</p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between mt-auto pt-4 border-t border-outline-variant/30 gap-4">
                  <p className="font-story-serif text-story-serif text-on-surface font-semibold">Total: ₹14,500</p>
                  <div className="flex space-x-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 border border-outline text-primary font-label-caps text-label-caps hover:bg-surface-container-low transition-colors cursor-pointer">
                      <span className="material-symbols-outlined mr-2 text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
                      Invoice
                    </button>
                    <Link to="/order-tracking" className="flex-1 md:flex-none px-6 py-2 bg-primary text-on-primary font-label-caps text-label-caps hover:bg-primary-container transition-colors cursor-pointer text-center">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Card 2: Processing */}
          <div className="bg-surface-container-lowest ambient-shadow rounded-lg p-1 relative overflow-hidden border border-outline-variant/30">
            <div className="border border-secondary-container/50 p-6 rounded relative h-full flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="w-full md:w-32 h-40 bg-surface-variant flex-shrink-0 relative overflow-hidden rounded">
                <img 
                  alt="Saree detail" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWEGv-1LdExLei-1NElllalaE9KdF0QOYMmVZYBy7c5URP0wjI66zss5XwltKpOOpJVcXZJE0VdOU8dGL5zG9or_4sTfUpeJNu1mcKDgk00LJATx4URDl1Or8go_KPHlzSK4lKJWXR0lsmzG3H0SKXsfSchuLzvFeNjh4Texs5yXq-Fknx2AXy96n4lEGtCzZn2saJLcR56I290PPl3D-gLU3Xt-Dto2n3PMC1_DGuER9MWfbzFHjag_1CHr21ovdL8fNMqbb2ha66"
                />
              </div>
              {/* Order Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 gap-4">
                  <div>
                    <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1">Order #BR-99045</h3>
                    <p className="font-body-md text-body-md text-on-surface">Placed on 28 Nov, 2023</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container border border-secondary/20 flex items-center">
                    <span className="material-symbols-outlined mr-2 text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>sync</span>
                    <span className="font-label-caps text-[10px]">On the Loom</span>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-story-serif text-[18px] text-primary mb-1">Kosa Pure Heritage Weave</h4>
                  <p className="font-body-md text-[14px] text-on-surface-variant">Qty: 2 • Woven by Artisan Ramesh Kumar</p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between mt-auto pt-4 border-t border-outline-variant/30 gap-4">
                  <p className="font-story-serif text-story-serif text-on-surface font-semibold">Total: ₹28,000</p>
                  <div className="flex space-x-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 border border-outline text-primary font-label-caps text-label-caps hover:bg-surface-container-low transition-colors opacity-50 cursor-not-allowed">
                      <span className="material-symbols-outlined mr-2 text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
                      Invoice
                    </button>
                    <Link to="/order-tracking" className="flex-1 md:flex-none px-6 py-2 bg-primary text-on-primary font-label-caps text-label-caps hover:bg-primary-container transition-colors cursor-pointer text-center">
                      View Details
                    </Link>
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

export default OrderHistory;
