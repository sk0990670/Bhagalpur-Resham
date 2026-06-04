import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import bhagalpurReshamBrandLogoAsset from '../../assets/bhagalpur_resham_brand_logo.png';


const Layout = () => {
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();

  // Only count wishlist/cart if user has a real JWT (3 segments), not a dummy token
  const hasValidToken = Boolean(token && token.split('.').length === 3);
  const wishlistCount = isAuthenticated && hasValidToken ? wishlistItems.length : 0;
  const cartCount = isAuthenticated && hasValidToken ? cartItems.length : 0;
  
  let accountLink = '/login';
  if (isAuthenticated) {
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      accountLink = '/admin/dashboard';
    } else {
      accountLink = '/dashboard';
    }
  }

  const handleNavWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: { pathname: '/wishlist' },
          message: 'Please login to view your saved sarees.',
        },
      });
    } else {
      navigate('/wishlist');
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased pt-[88px] min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-md shadow-sm dark:shadow-none transition-all duration-300 border-b border-outline-variant/30">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-unit max-w-container-max mx-auto h-[72px]">
          {/* Mobile Menu Button */}
          <button className="md:hidden text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-secondary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>menu</span>
          </button>
          
          {/* Brand Logo */}
          <Link className="flex items-center gap-3" to="/">
            <img 
              alt="Bhagalpur Resham Logo" 
              className="h-10 w-auto rounded-full border border-secondary" 
              src={bhagalpurReshamBrandLogoAsset} 
            />
            <span className="font-display-lg text-headline-md text-primary tracking-tight hidden lg:block">Bhagalpur Resham</span>
          </Link>
          
          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink 
              to="/heritage" 
              className={({ isActive }) => `font-label-caps text-label-caps px-3 py-2 ${isActive ? 'text-primary border-b-2 border-secondary font-bold pb-1' : 'text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low rounded duration-300'}`}
            >
              Heritage
            </NavLink>
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => `font-label-caps text-label-caps px-3 py-2 ${isActive ? 'text-primary border-b-2 border-secondary font-bold pb-1' : 'text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low rounded duration-300'}`}
            >
              The Silk Route
            </NavLink>
            <NavLink 
              to="/collections" 
              className={({ isActive }) => `font-label-caps text-label-caps px-3 py-2 ${isActive ? 'text-primary border-b-2 border-secondary font-bold pb-1' : 'text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low rounded duration-300'}`}
            >
              Collections
            </NavLink>
            <NavLink 
              to="/artisans" 
              className={({ isActive }) => `font-label-caps text-label-caps px-3 py-2 ${isActive ? 'text-primary border-b-2 border-secondary font-bold pb-1' : 'text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low rounded duration-300'}`}
            >
              Artisans
            </NavLink>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link aria-label="Search" className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer active:scale-95" to="/search">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
            </Link>
            <button
              aria-label="Wishlist"
              onClick={handleNavWishlistClick}
              className="relative focus:outline-none cursor-pointer active:scale-95 transition-transform"
            >
              <span
                className="material-symbols-outlined transition-all duration-200"
                style={{
                  fontVariationSettings: isAuthenticated && wishlistCount > 0 ? "'FILL' 1" : "'FILL' 0",
                  color: isAuthenticated && wishlistCount > 0 ? '#C41E3A' : undefined,
                }}
              >
                favorite
              </span>
              {isAuthenticated && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] flex items-center justify-center rounded-full text-[9px] font-bold leading-none"
                  style={{ backgroundColor: '#C41E3A', color: '#fff' }}>
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>
            <Link aria-label="Shopping Bag" className="relative text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer active:scale-95" to="/cart">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
              {isAuthenticated && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] flex items-center justify-center rounded-full text-[9px] font-bold leading-none bg-primary text-on-primary">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <Link aria-label="Account" className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer active:scale-95 hidden sm:block" to={accountLink}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>person</span>
              </Link>
            ) : (
              <div className="relative group hidden sm:block">
                <button aria-label="Account" className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer active:scale-95">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>person</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-md ambient-shadow py-1 border border-outline-variant/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <Link to="/login" className="block px-4 py-3 font-body-md text-body-md text-on-surface hover:bg-primary/5 hover:text-primary transition-colors">
                    Login as Patron
                  </Link>
                  <Link to="/admin/login" className="block px-4 py-3 font-body-md text-body-md text-on-surface hover:bg-primary/5 hover:text-primary transition-colors border-t border-outline-variant/20">
                    Login as Admin
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <Outlet />

      {/* Footer */}
      <footer className="bg-surface-container-highest dark:bg-inverse-surface mt-auto border-t border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto">
          <div className="col-span-1 md:col-span-2 flex flex-col items-start pr-0 md:pr-12">
            <Link className="font-display-lg text-headline-xl text-primary dark:text-primary-fixed-dim mb-4" to="/">Bhagalpur Resham</Link>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant mb-8 max-w-md">
              Curating the finest handcrafted silk sarees, merging ancestral weaving traditions with modern elegance.
            </p>
            <form className="w-full max-w-md mb-8">
              <label className="block font-label-caps text-label-caps text-on-surface mb-2" htmlFor="newsletter">JOIN OUR HERITAGE COMMUNITY</label>
              <div className="relative">
                <input 
                  className="w-full bg-transparent border-0 border-b border-primary/50 focus:border-primary focus:ring-0 px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-colors" 
                  id="newsletter" 
                  placeholder="Enter your email" 
                  type="email" 
                />
                <button className="absolute right-0 top-1/2 -translate-y-1/2 text-primary hover:text-tertiary-container transition-colors p-2 focus:outline-none focus:ring-1 focus:ring-secondary" type="submit">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
          <div className="col-span-1">
            <h3 className="font-label-caps text-label-caps text-on-surface mb-6">Explore</h3>
            <ul className="flex flex-col gap-4">
              <li><Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-primary hover:underline decoration-secondary transition-all focus:outline-none focus:ring-1 focus:ring-secondary" to="/history-of-tussar">The History of Tussar</Link></li>
              <li><Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-primary hover:underline decoration-secondary transition-all focus:outline-none focus:ring-1 focus:ring-secondary" to="/mithila-artistry">Mithila Artistry</Link></li>
              <li><Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-primary hover:underline decoration-secondary transition-all focus:outline-none focus:ring-1 focus:ring-secondary" to="/silk-mark">Silk Mark Certification</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-label-caps text-label-caps text-on-surface mb-6">Customer Care</h3>
            <ul className="flex flex-col gap-4">
              <li><Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-primary hover:underline decoration-secondary transition-all focus:outline-none focus:ring-1 focus:ring-secondary" to="/returns">Return & Refund Policy</Link></li>
              <li><Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-primary hover:underline decoration-secondary transition-all focus:outline-none focus:ring-1 focus:ring-secondary" to="/shipping">Shipping Policy</Link></li>
              <li><Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-primary hover:underline decoration-secondary transition-all focus:outline-none focus:ring-1 focus:ring-secondary" to="/faq">FAQ</Link></li>
              <li><Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-primary hover:underline decoration-secondary transition-all focus:outline-none focus:ring-1 focus:ring-secondary" to="/">Privacy Policy</Link></li>
              <li><Link className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant hover:text-primary hover:underline decoration-secondary transition-all focus:outline-none focus:ring-1 focus:ring-secondary" to="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-outline-variant/20 px-margin-mobile md:px-margin-desktop py-6 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-body-md text-body-md text-on-surface-variant/70 text-sm">© 2024 Bhagalpur Resham. Hand-woven in Bihar, India.</span>
          <div className="flex gap-4">
            <a aria-label="Instagram" className="text-on-surface-variant/70 hover:text-primary transition-colors" href="https://www.instagram.com/bhagalpurresham" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>photo_camera</span>
            </a>
            <a aria-label="Facebook" className="text-on-surface-variant/70 hover:text-primary transition-colors" href="https://www.facebook.com/profile.php?id=61590607709758" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>public</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
