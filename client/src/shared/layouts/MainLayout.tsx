import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import bhagalpurReshamBrandLogoAsset from '../../assets/bhagalpur_resham_brand_logo.png';


const Layout = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const accountLink = isAuthenticated
    ? user?.role === 'admin' || user?.role === 'superadmin' ? '/admin' : '/dashboard'
    : '/login';

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
            <Link aria-label="Wishlist" className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer active:scale-95" to="/wishlist">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
            </Link>
            <Link aria-label="Shopping Bag" className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer active:scale-95" to="/cart">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
            </Link>
            <Link aria-label="Account" className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer active:scale-95 hidden sm:block" to={accountLink}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>person</span>
            </Link>
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
            <a aria-label="Instagram" className="text-on-surface-variant/70 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>photo_camera</span>
            </a>
            <a aria-label="Facebook" className="text-on-surface-variant/70 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>public</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
