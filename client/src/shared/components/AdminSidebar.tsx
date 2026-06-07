import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { clearWishlist } from '../../features/wishlist/wishlistSlice';
import { authService } from '../services/auth.service';
import { RootState } from '../../app/store';
import bhagalpurReshamBrandLogoAsset from '../../assets/bhagalpur_resham_brand_logo.png';

const NAV_ITEMS = [
  { to: '/admin/dashboard',   icon: 'dashboard',    label: 'Dashboard'       },
  { to: '/admin/inventory',   icon: 'inventory_2',  label: 'Inventory'       },
  { to: '/admin/orders',      icon: 'shopping_cart', label: 'Orders'         },
  { to: '/admin/artisans',    icon: 'groups',       label: 'Artisan Network' },
  { to: '/admin/analytics',   icon: 'monitoring',   label: 'Analytics'       },
  { to: '/admin/inquiries',   icon: 'contact_mail', label: 'Inquiries'       },
  { to: '/admin/customers',   icon: 'person',       label: 'Customers'       },
  { to: '/admin/coupons',     icon: 'local_offer',  label: 'Coupons'         },
  { to: '/admin/reviews',     icon: 'reviews',      label: 'Reviews'         },
  { to: '/admin/content',     icon: 'article',      label: 'Content'         },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (_) {
      // Ignore API errors — log out locally regardless
    }
    dispatch(logout());
    dispatch(clearWishlist());
    navigate('/admin/login', { replace: true });
  };

  return (
    <nav className="bg-surface-container-low border-r border-outline-variant h-full w-64 fixed left-0 top-0 flex flex-col py-8 px-4 gap-4 z-40">
      {/* Brand Header */}
      <div className="mb-6 px-4 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-surface-container-highest mb-4 overflow-hidden border border-outline-variant flex items-center justify-center">
          <img
            alt="Admin Avatar"
            className="w-full h-full object-cover"
            src={bhagalpurReshamBrandLogoAsset}
          />
        </div>
        <h2 className="font-headline-md text-[20px] leading-tight text-primary text-center font-bold">
          Bhagalpur Resham Admin
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
          Luxury Silk Management
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1 flex-grow overflow-y-auto min-h-0">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isActive && to !== '#'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`
            }
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {icon}
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom: Admin Info + Logout */}
      <div className="mt-auto pt-4 border-t border-outline-variant/40 flex flex-col gap-2 px-0">
        {/* Admin name chip */}
        <div className="flex items-center gap-3 px-4 py-2">
          <span
            className="material-symbols-outlined text-on-surface-variant"
            style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
          >
            account_circle
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-label-caps text-[11px] text-primary font-bold uppercase tracking-wider truncate">
              {user?.name || 'Admin'}
            </p>
            <p className="font-body-md text-[11px] text-on-surface-variant truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>

        {/* Settings */}
        <NavLink
          to="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings</span>
          <span className="font-semibold">Settings</span>
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left font-semibold transition-all duration-200 text-error hover:bg-error-container/30 cursor-pointer group"
        >
          <span
            className="material-symbols-outlined transition-transform duration-200 group-hover:translate-x-0.5"
            style={{ fontSize: '20px' }}
          >
            logout
          </span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminSidebar;
