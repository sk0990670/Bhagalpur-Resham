import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../authSlice';
import { authService } from '../../../shared/services/auth.service';

const CustomerDashboard = () => {
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
          <button className="mt-4 px-4 py-2 bg-primary-container text-on-primary text-label-caps uppercase tracking-widest hover:bg-primary transition-colors w-full border border-secondary-fixed-dim">
            View Loom Status
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <Link className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container font-semibold rounded-lg mx-2 hover:bg-surface-container-highest transition-colors translate-x-1" to="/dashboard">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
            <span className="font-body-md text-body-md">My Profile</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 hover:bg-surface-container-highest transition-colors" to="/order-history">
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
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors w-full text-left cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-md text-[14px]">Log Out</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content Canvas */}
      <main className="flex-1 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-88px)] w-full max-w-container-max mx-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Welcome & Summary Section */}
          <section className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Namaste, Patron</h1>
              <p className="font-story-serif text-story-serif text-on-surface-variant italic mb-6">Heritage Member since 2023</p>
              
              <div className="bg-surface-container-low p-8 madhubani-border ambient-shadow">
                <h3 className="font-label-caps text-label-caps text-outline mb-4 border-b border-outline-variant/50 pb-2">Account Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[12px] text-on-surface-variant uppercase tracking-wider mb-1">Email</p>
                    <p className="font-body-md text-on-surface">patron@example.com</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-on-surface-variant uppercase tracking-wider mb-1">Phone</p>
                    <p className="font-body-md text-on-surface">+91 98765 43210</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[12px] text-on-surface-variant uppercase tracking-wider mb-1">Default Address</p>
                    <p className="font-body-md text-on-surface">123 Heritage Lane, Silk District<br/>New Delhi, 110001, India</p>
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <button className="px-6 py-2 bg-transparent border border-secondary-fixed-dim text-primary-container font-label-caps text-label-caps hover:bg-surface-variant transition-colors cursor-pointer">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
            
            {/* Loyalty Points Card */}
            <div className="w-full md:w-80 bg-primary-container text-on-primary p-8 text-center ambient-shadow relative overflow-hidden">
              {/* Decorative background texture */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffe088 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-secondary-fixed-dim rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                </div>
                <h3 className="font-headline-md text-[24px] text-secondary-container mb-1">Gold Tier</h3>
                <p className="font-body-md text-[14px] text-primary-fixed mb-6">Resham Points Balance</p>
                <p className="font-headline-xl text-[40px] font-bold text-on-primary mb-2">1,250</p>
                <button className="mt-4 px-6 py-2 bg-transparent border border-secondary-fixed-dim text-secondary-container font-label-caps text-label-caps hover:bg-primary transition-colors w-full cursor-pointer">
                  Redeem Points
                </button>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 py-8 opacity-50">
            <div className="h-[1px] bg-outline w-24"></div>
            <span className="material-symbols-outlined text-outline">spa</span>
            <div className="h-[1px] bg-outline w-24"></div>
          </div>

          {/* Recent Orders Section */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-headline-md text-headline-md text-primary">Recent Acquisitions</h2>
              <a className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors flex items-center gap-1" href="#">
                View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Card 1 */}
              <div className="bg-surface-container-low p-6 madhubani-border ambient-shadow flex gap-6">
                <div className="w-24 h-32 bg-surface-variant flex-shrink-0 relative">
                  <img 
                    alt="Red Saree" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgqZvoUdtsnTm7I2OGdlAmjCcuV7cAZGfPs6AwbugFdS9QQoM96-ugqThyE07sWs62q1L5oekG5odjI4fRlgDHB8YKwJMzT1GB2GsVQ6ntPG1SR6j9GSr9qR389M3weLgF_FPOZygO1TrpQLZPYRdIigcFcECOIW9Gvyjr4mDyudXVkJpCq048fqs2AkMclhSn3bRJ6yvEW8GTWrnLB_WwIqMLGjblM5yjUxQFJ4vWN7NeoS9i0vndmEu0L1ACXNoH41s70J2sqE1i"
                  />
                  <div className="absolute top-1 right-1 bg-surface/80 rounded-full p-0.5">
                    <span className="material-symbols-outlined text-[12px] text-secondary-container">verified</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-label-caps text-outline mb-1">Order #BR-9824</p>
                    <h4 className="font-headline-md text-[18px] text-on-surface mb-2 leading-tight">Crimson Madhubani Tussar</h4>
                    <p className="font-body-md text-[14px] text-on-surface-variant">Placed on Oct 12, 2023</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-variant text-primary font-label-caps text-[10px]">
                      <span className="material-symbols-outlined text-[12px]">local_shipping</span> Shipped
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Order Card 2 */}
              <div className="bg-surface-container-low p-6 madhubani-border ambient-shadow flex gap-6">
                <div className="w-24 h-32 bg-surface-variant flex-shrink-0 relative">
                  <img 
                    alt="Cream Saree" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHpUWFVptZcZBpxK1DBbuN4zPy6rlBg6bkygAPw4x0-h2EXrKpAcZN1jj3Gk281_reoZhF6tiNifJ-aWNN84xf8lLjvD5UrF2wdtJeYUlpd39pf820A-YB2lmLR58dgJQS4QWfv3kj7pWFiHE1Mvh14VIdJHiJPH_WregpGUrdGPpXn4v9oQb-MDFr1OXrjVmi6xBbL8PYxs_ni0bsnd_0DrxClcRXq94eCMeBQsoXpM27bVJUZQGTTXJNEUZwsk7oQRU1IN7D6KfZ"
                  />
                  <div className="absolute top-1 right-1 bg-surface/80 rounded-full p-0.5">
                    <span className="material-symbols-outlined text-[12px] text-secondary-container">verified</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-label-caps text-outline mb-1">Order #BR-8751</p>
                    <h4 className="font-headline-md text-[18px] text-on-surface mb-2 leading-tight">Ivory Heritage Weave</h4>
                    <p className="font-body-md text-[14px] text-on-surface-variant">Placed on Sep 05, 2023</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px]">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span> Delivered
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
