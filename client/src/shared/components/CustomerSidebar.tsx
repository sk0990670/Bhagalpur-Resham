import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { authService } from '../services/auth.service';

const CustomerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout failed:', e);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const linkClass = (path: string) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-colors ${
      isActive(path) 
        ? 'bg-secondary-container text-on-secondary-container font-semibold translate-x-1' 
        : 'text-on-surface-variant hover:bg-surface-container-high hover:bg-surface-container-highest'
    }`;

  return (
    <aside className="w-64 flex-shrink-0 bg-surface-container-low border-r border-outline-variant/20 hidden md:flex flex-col py-8">
      <div className="px-6 mb-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-lg bg-[#eaddd7] flex items-center justify-center mb-4 border border-[#d4af37]/30 shadow-sm">
          <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
        </div>
        <h2 className="font-headline-md text-[18px] font-semibold text-primary">Welcome, Patron</h2>
        <p className="font-body-md text-[13px] text-on-surface-variant">Custodian of Heritage</p>
        <button className="mt-6 px-4 py-2.5 bg-primary text-on-primary font-label-caps uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-colors w-full shadow-sm">
          View Loom Status
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        <Link className={linkClass('/dashboard')} to="/dashboard">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
          <span className="font-body-md text-sm">My Profile</span>
        </Link>
        <Link className={linkClass('/order-history')} to="/order-history">
          <span className="material-symbols-outlined">potted_plant</span>
          <span className="font-body-md text-sm">Order History</span>
        </Link>
        <Link className={linkClass('/artisan-credits')} to="/artisan-credits">
          <span className="material-symbols-outlined">auto_awesome</span>
          <span className="font-body-md text-sm">Artisan Credits</span>
        </Link>
        <Link className={linkClass('/support')} to="/support">
          <span className="material-symbols-outlined">help</span>
          <span className="font-body-md text-sm">Support</span>
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 transition-colors text-left cursor-pointer mt-4">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md text-sm">Log Out</span>
        </button>
      </nav>
    </aside>
  );
};

export default CustomerSidebar;
