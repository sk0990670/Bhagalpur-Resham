import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../../shared/services/product.service';
import { useWishlist } from '../../wishlist/useWishlist';
import { useToast } from '../../../shared/hooks/useToast';
import { ToastContainer } from '../../../shared/components/Toast';

const COLOR_PALETTE = [
  { name: 'Red', bg: 'bg-[#FF0000]' },
  { name: 'Maroon', bg: 'bg-[#800000]' },
  { name: 'Pink', bg: 'bg-[#FFC0CB]' },
  { name: 'Peach', bg: 'bg-[#FFDAB9]' },
  { name: 'Orange', bg: 'bg-[#FFA500]' },
  { name: 'Mustard', bg: 'bg-[#FFDB58]' },
  { name: 'Yellow', bg: 'bg-[#FFFF00]' },
  { name: 'Gold', bg: 'bg-[#D4AF37]' },
  { name: 'Beige', bg: 'bg-[#F5F5DC]' },
  { name: 'Cream', bg: 'bg-[#FFFDD0]' },
  { name: 'Off White', bg: 'bg-[#FAF9F6]' },
  { name: 'White', bg: 'bg-[#FFFFFF]' },
  { name: 'Black', bg: 'bg-[#000000]' },
  { name: 'Grey', bg: 'bg-[#808080]' },
  { name: 'Silver', bg: 'bg-[#C0C0C0]' },
  { name: 'Brown', bg: 'bg-[#8B4513]' },
  { name: 'Green', bg: 'bg-[#008000]' },
  { name: 'Olive Green', bg: 'bg-[#808000]' },
  { name: 'Mehendi Green', bg: 'bg-[#A0A53A]' },
  { name: 'Mint Green', bg: 'bg-[#98FF98]' },
  { name: 'Sea Green', bg: 'bg-[#2E8B57]' },
  { name: 'Bottle Green', bg: 'bg-[#006A4E]' },
  { name: 'Emerald Green', bg: 'bg-[#50C878]' },
  { name: 'Blue', bg: 'bg-[#0000FF]' },
  { name: 'Navy Blue', bg: 'bg-[#000080]' },
  { name: 'Royal Blue', bg: 'bg-[#4169E1]' },
  { name: 'Sky Blue', bg: 'bg-[#87CEEB]' },
  { name: 'Turquoise Blue', bg: 'bg-[#00CED1]' },
  { name: 'Teal Blue', bg: 'bg-[#008080]' },
  { name: 'Purple', bg: 'bg-[#800080]' },
  { name: 'Lavender', bg: 'bg-[#E6E6FA]' },
  { name: 'Violet', bg: 'bg-[#EE82EE]' },
  { name: 'Magenta', bg: 'bg-[#FF00FF]' },
  { name: 'Wine', bg: 'bg-[#722F37]' },
  { name: 'Rust', bg: 'bg-[#B7410E]' },
  { name: 'Coral', bg: 'bg-[#FF7F50]' },
  { name: 'Multicolor', bg: 'bg-gradient-to-tr from-red-500 via-green-500 to-blue-500' }
];

const Collections = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    weaveType: [] as string[],
    color: [] as string[],
    occasion: [] as string[], // Using array for occasion too to allow multiple or deselection, though UI is currently radio
  });
  const [sort, setSort] = useState('newest');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const { toasts, showToast, removeToast } = useToast();
  const { isInWishlist, toggleItem } = useWishlist(showToast);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: any = {};
        if (filters.weaveType.length > 0) params.weaveType = filters.weaveType.join(',');
        if (filters.color.length > 0) params.color = filters.color.join(',');
        if (filters.occasion.length > 0) params.occasion = filters.occasion.join(',');
        if (sort !== 'newest') params.sort = sort;

        const res = await productService.getProducts(params);
        if (res.success && res.data) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [filters, sort]);

  const handleWeaveChange = (weave: string) => {
    setFilters(prev => ({
      ...prev,
      weaveType: prev.weaveType.includes(weave) 
        ? prev.weaveType.filter(w => w !== weave)
        : [...prev.weaveType, weave]
    }));
  };

  const handleColorChange = (color: string) => {
    setFilters(prev => ({
      ...prev,
      color: prev.color.includes(color)
        ? prev.color.filter(c => c !== color)
        : [...prev.color, color]
    }));
  };

  const handleOccasionChange = (occasion: string) => {
    setFilters(prev => ({
      ...prev,
      // Radio button behavior but stored in array for API format
      occasion: [occasion]
    }));
  };

  return (
    <>
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      {/* Hero Section */}
      <header className="mb-16 text-center">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">The Silk Route</h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant max-w-2xl mx-auto">Explore our curated collections of masterfully handwoven Tussar, Bhagalpuri, and Matka silks.</p>
        <div className="mt-8 flex justify-center">
          <svg fill="none" height="20" viewBox="0 0 200 20" width="200" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10H190" stroke="#735c00" strokeWidth="1"></path>
            <circle cx="100" cy="10" fill="#8B0000" r="4"></circle>
            <circle cx="90" cy="10" fill="#735c00" r="2"></circle>
            <circle cx="110" cy="10" fill="#735c00" r="2"></circle>
          </svg>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-1/4 pr-8 hidden md:block">
          <div className="sticky top-32">
            <h2 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/50 pb-2 mb-6">Filters</h2>
            
            {/* Weave Type */}
            <div className="mb-8">
              <h3 className="font-body-lg text-body-lg text-on-surface mb-4">Weave Type</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <input checked={filters.weaveType.includes("Pure Tussar Silk Weave")} onChange={() => handleWeaveChange("Pure Tussar Silk Weave")} className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" id="weave-pure-tussar" type="checkbox" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="weave-pure-tussar">Pure Tussar Silk Weave</label>
                </li>
                <li className="flex items-center">
                  <input checked={filters.weaveType.includes("Ghicha Silk Weave")} onChange={() => handleWeaveChange("Ghicha Silk Weave")} className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" id="weave-ghicha" type="checkbox" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="weave-ghicha">Ghicha Silk Weave</label>
                </li>
                <li className="flex items-center">
                  <input checked={filters.weaveType.includes("Matka Silk Weave")} onChange={() => handleWeaveChange("Matka Silk Weave")} className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" id="weave-matka" type="checkbox" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="weave-matka">Matka Silk Weave</label>
                </li>
                <li className="flex items-center">
                  <input checked={filters.weaveType.includes("Dupion Silk Weave")} onChange={() => handleWeaveChange("Dupion Silk Weave")} className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" id="weave-dupion" type="checkbox" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="weave-dupion">Dupion Silk Weave</label>
                </li>
                <li className="flex items-center">
                  <input checked={filters.weaveType.includes("Cotton-Silk Bhagalpuri Weave")} onChange={() => handleWeaveChange("Cotton-Silk Bhagalpuri Weave")} className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" id="weave-cotton-silk" type="checkbox" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="weave-cotton-silk">Cotton-Silk Bhagalpuri Weave</label>
                </li>
                <li className="flex items-center">
                  <input checked={filters.weaveType.includes("Zari Bhagalpuri Weave")} onChange={() => handleWeaveChange("Zari Bhagalpuri Weave")} className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" id="weave-zari" type="checkbox" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="weave-zari">Zari Bhagalpuri Weave</label>
                </li>
              </ul>
            </div>

            {/* Color */}
            <div className="mb-8">
              <h3 className="font-body-lg text-body-lg text-on-surface mb-4">Color</h3>
              <div className="flex flex-wrap gap-3">
                {COLOR_PALETTE.map((color) => (
                  <div key={color.name} className="relative group flex items-center justify-center">
                    <input 
                      className="peer sr-only" 
                      id={`color-${color.name.toLowerCase().replace(/\s+/g, '-')}`} 
                      type="checkbox" 
                      checked={filters.color.includes(color.name)}
                      onChange={() => handleColorChange(color.name)}
                    />
                    <label 
                      htmlFor={`color-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`w-7 h-7 rounded-full cursor-pointer border border-outline-variant/30 ${color.bg} peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-primary peer-checked:ring-offset-surface transition-all`}
                      aria-label={color.name}
                    ></label>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-[10px] font-label-caps px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10 border border-outline-variant/20 shadow-sm">
                      {color.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div className="mb-8">
              <h3 className="font-body-lg text-body-lg text-on-surface mb-4">Occasion</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <input checked={filters.occasion.includes("Wedding")} onChange={() => handleOccasionChange("Wedding")} className="custom-radio w-4 h-4 appearance-none border border-outline rounded-full cursor-pointer focus:outline-none" id="occ-wedding" name="occasion" type="radio" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="occ-wedding">Wedding</label>
                </li>
                <li className="flex items-center">
                  <input checked={filters.occasion.includes("Festive")} onChange={() => handleOccasionChange("Festive")} className="custom-radio w-4 h-4 appearance-none border border-outline rounded-full cursor-pointer focus:outline-none" id="occ-festive" name="occasion" type="radio" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="occ-festive">Festive</label>
                </li>
                <li className="flex items-center">
                  <input checked={filters.occasion.includes("Casual")} onChange={() => handleOccasionChange("Casual")} className="custom-radio w-4 h-4 appearance-none border border-outline rounded-full cursor-pointer focus:outline-none" id="occ-casual" name="occasion" type="radio" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="occ-casual">Casual</label>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <span className="font-body-md text-body-md text-on-surface-variant">Showing {products.length} items</span>
            <div className="relative flex items-center space-x-2 border-b border-primary/20 pb-1 z-20">
              <span className="font-label-caps text-label-caps text-on-surface">Sort By:</span>
              <div 
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              >
                <span className="font-body-md text-body-md text-primary">
                  {sort === 'authentic' && 'Authentic Collection'}
                  {sort === 'best_seller' && 'Best Sellers'}
                  {sort === 'newest' && 'New Arrivals'}
                  {sort === 'price_desc' && 'Price: High to Low'}
                  {sort === 'price_asc' && 'Price: Low to High'}
                </span>
                <svg className={`w-4 h-4 text-primary transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {isSortDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortDropdownOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-outline-variant/50 rounded shadow-lg z-20 overflow-hidden">
                    {[
                      { value: 'authentic', label: 'Authentic Collection' },
                      { value: 'best_seller', label: 'Best Sellers' },
                      { value: 'newest', label: 'New Arrivals' },
                      { value: 'price_desc', label: 'Price: High to Low' },
                      { value: 'price_asc', label: 'Price: Low to High' }
                    ].map(option => (
                      <div 
                        key={option.value}
                        className={`px-4 py-3 cursor-pointer hover:bg-surface-variant transition-colors font-body-md text-body-md ${sort === option.value ? 'bg-surface-container text-primary font-semibold' : 'text-on-surface'}`}
                        onClick={() => {
                          setSort(option.value);
                          setIsSortDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Changed gap from gap-8 to gap-6 to tighten the 3x3 grid slightly */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full py-12 text-center text-on-surface-variant font-body-lg">
                Loading collections...
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full py-12 text-center text-on-surface-variant font-body-lg">
                No products found in this collection.
              </div>
            ) : products.map((product) => {
              const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
              
              return (
                <Link key={product._id} to={`/product/${product.sku}`} className="block group relative border-ornamental ambient-shadow transition-transform duration-500 hover:-translate-y-1 bg-surface-container-lowest p-3">
                  <div className="relative overflow-hidden aspect-[4/5] mithila-border p-1 bg-surface-container-low mb-3">
                    {primaryImage ? (
                      <img 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        src={primaryImage.url}
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline">image</span>
                      </div>
                    )}
                    {/* Artisan Badge (Authentic) */}
                    {product.badge === 'Authentic Collection' && (
                      <div className="absolute top-3 right-3 bg-surface/90 rounded-full p-1.5 backdrop-blur-sm shadow-sm" title="Silk Mark Certified">
                        <span className="material-symbols-outlined text-secondary" style={{ fontSize: '14px' }}>verified</span>
                      </div>
                    )}
                    {/* Tag (New Arrival / Best Seller) */}
                    {(product.badge === 'New Arrival' || product.badge === 'Best Seller') && (
                      <div className="absolute top-3 left-3 bg-surface/90 text-primary font-label-caps text-[9px] px-2 py-1 border border-primary/20 uppercase">
                        {product.badge}
                      </div>
                    )}
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-surface/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <button className="bg-primary/90 text-on-primary font-label-caps text-label-caps px-4 py-2 text-xs tracking-widest hover:bg-primary transition-colors cursor-pointer">QUICK VIEW</button>
                    </div>
                  </div>
                  <div className="text-center px-1">
                    <h3 className="font-headline-md text-headline-md text-primary text-lg mb-1 truncate">{product.name}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-2 text-sm">{product.weaveType}</p>
                    <div className="flex justify-between items-center border-t border-outline-variant/30 pt-2 mt-2">
                      <span className="font-body-lg text-body-lg font-semibold text-on-surface text-base">₹ {product.price?.toLocaleString()}</span>
                      <button
                        aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        className="cursor-pointer transition-transform hover:scale-110 active:scale-125 focus:outline-none"
                        onClick={(e) => { e.preventDefault(); toggleItem(product._id, product.name); }}
                        style={{ lineHeight: 1 }}
                      >
                        <span
                          className="material-symbols-outlined transition-all duration-200"
                          style={{
                            fontSize: '22px',
                            fontVariationSettings: isInWishlist(product._id) ? "'FILL' 1" : "'FILL' 0",
                            color: isInWishlist(product._id) ? '#C41E3A' : '#6B7280',
                          }}
                        >
                          favorite
                        </span>
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center space-x-2">
            <button aria-label="Previous page" className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary font-label-caps cursor-pointer">1</button>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors font-label-caps cursor-pointer">2</button>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors font-label-caps cursor-pointer">3</button>
            <span className="text-on-surface-variant px-2">...</span>
            <button aria-label="Next page" className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </section>
      </div>
    </main>
    <ToastContainer toasts={toasts} onRemove={removeToast} />
  </>
  );
};

export default Collections;
