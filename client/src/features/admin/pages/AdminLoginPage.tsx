import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../auth/authSlice';
import { authService } from '../../../shared/services/auth.service';
import bhagalpurReshamBrandLogoAsset from '../../../assets/bhagalpur_resham_brand_logo.png';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email: email.trim(), password });
      
      // Safety check in case the response structure is different than expected
      const user = response?.data?.user || response?.user;
      const accessToken = response?.data?.accessToken || response?.accessToken;
      
      if (!user || !accessToken) {
        throw new Error(`Unexpected API response structure: ${JSON.stringify(response)}`);
      }

      // Ensure user has admin rights
      if (user.role !== 'admin' && user.role !== 'superadmin') {
        setError('Access denied. Administrator privileges required.');
        setIsLoading(false);
        return;
      }

      dispatch(setCredentials({ user, token: accessToken }));
      
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error', err);
      let errorMsg = 'An unknown error occurred';
      if (err.response) {
        errorMsg = err.response.data?.message || err.response.statusText;
      } else if (err.request) {
        errorMsg = 'Network Error - Could not connect to the server';
      } else {
        errorMsg = err.message;
      }
      setError(`Login Failed: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased selection:bg-primary selection:text-on-primary">
      {/* TopNavBar */}
      <nav className="bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-md full-width top-0 border-b border-outline-variant/30 shadow-sm sticky z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <Link className="flex items-center gap-3" to="/">
            <img 
              alt="Bhagalpur Resham Logo" 
              className="h-8 w-auto object-contain rounded-full border border-secondary" 
              src={bhagalpurReshamBrandLogoAsset} 
            />
            <span className="font-headline-md text-headline-md font-bold text-primary dark:text-inverse-primary uppercase tracking-wider hidden sm:block">Bhagalpur Resham</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 font-label-caps text-label-caps" to="/">Return to Main Site</Link>
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="Secure Lock" className="text-primary hover:text-primary transition-colors duration-300 cursor-default">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>lock</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-section-gap px-margin-mobile md:px-margin-desktop relative">
        {/* Subtle Background Ornamentation */}
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
          <svg fill="none" height="600" viewBox="0 0 600 600" width="600" xmlns="http://www.w3.org/2000/svg">
            <circle className="text-primary" cx="300" cy="300" r="280" stroke="currentColor" strokeDasharray="10 10" strokeWidth="2"></circle>
            <circle className="text-primary" cx="300" cy="300" r="260" stroke="currentColor" strokeWidth="1"></circle>
          </svg>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest p-1 rounded-DEFAULT shadow-[0_4px_40px_rgba(128,0,32,0.04)] relative z-10 w-full max-w-md">
          {/* Ornamental Border Wrapper */}
          <div className="border border-outline p-8 md:p-12 relative h-full w-full bg-surface-container-lowest">
            <div className="text-center mb-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>admin_panel_settings</span>
              <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Administrative Portal</h1>
              <p className="font-label-caps text-label-caps text-outline uppercase tracking-widest mt-4">Authorized Personnel Only</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container border-l-4 border-error text-sm font-body-md flex items-center gap-3">
                <span className="material-symbols-outlined text-error">error</span>
                {error}
              </div>
            )}
            
            <form className="space-y-8" onSubmit={handleLogin}>
              <div className="relative">
                <label className="block text-sm text-on-surface-variant font-label-caps uppercase mb-2" htmlFor="email">
                  Email Address
                </label>
                <input 
                  className="block w-full border-0 border-b border-primary bg-transparent py-2 px-0 text-on-surface focus:ring-0 focus:border-primary transition-colors placeholder:text-outline-variant/70" 
                  id="email" 
                  name="email" 
                  placeholder={import.meta.env.VITE_ADMIN_EMAIL || "admin@bhagalpurresham.com"} 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="relative mt-6">
                <label className="block text-sm text-on-surface-variant font-label-caps uppercase mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input 
                    className="block w-full border-0 border-b border-primary bg-transparent py-2 px-0 pr-10 text-on-surface focus:ring-0 focus:border-primary transition-colors placeholder:text-outline-variant/70" 
                    id="password" 
                    name="password" 
                    placeholder="admin" 
                    required 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors flex items-center justify-center p-2 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <input 
                    className="h-4 w-4 text-primary border-outline focus:ring-primary bg-transparent rounded-sm appearance-none checked:bg-primary checked:border-primary relative after:content-[''] after:absolute after:top-[2px] after:left-[5px] after:w-[5px] after:h-[10px] after:border-r-2 after:border-b-2 after:border-on-primary after:rotate-45 after:opacity-0 checked:after:opacity-100 transition-all cursor-pointer" 
                    id="remember-me" 
                    name="remember-me" 
                    type="checkbox" 
                  />
                  <label className="ml-2 block text-sm text-on-surface-variant font-body-md cursor-pointer" htmlFor="remember-me">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a className="font-body-md text-primary hover:text-primary-container underline-offset-4 hover:underline transition-all" href="#">
                    Forgot your password?
                  </a>
                </div>
              </div>
              
              <div className="pt-6">
                <button 
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent font-label-caps text-label-caps text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? 'Authenticating...' : 'Secure Login'}
                    {!isLoading && <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>}
                  </span>
                  <div className="absolute inset-0 h-full w-0 bg-white/10 group-hover:w-full transition-all duration-500 ease-out"></div>
                </button>
              </div>
            </form>
            
            <div className="mt-8 flex justify-center items-center gap-2 text-outline-variant">
              <svg className="text-outline-variant" fill="none" height="12" viewBox="0 0 40 12" width="40" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6H40M20 0C20 0 24 6 20 12C16 6 20 0 20 0Z" fill="currentColor" stroke="currentColor"></path>
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-surface-dim full-width bottom-0 border-t border-outline-variant/20 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-gutter max-w-container-max mx-auto gap-4">
          <div className="flex items-center gap-2 text-secondary dark:text-secondary-fixed">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>verified_user</span>
            <span className="font-label-caps text-label-caps uppercase">Secure Connection</span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md text-center">
            © 2024 Bhagalpur Resham. Handcrafted Heritage.
          </p>
          <nav className="flex flex-wrap justify-center gap-6">
            <a className="text-on-surface-variant font-body-md text-body-md hover:text-primary underline-offset-4 hover:underline transition-all duration-200" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant font-body-md text-body-md hover:text-primary underline-offset-4 hover:underline transition-all duration-200" href="#">Security Protocol</a>
            <a className="text-on-surface-variant font-body-md text-body-md hover:text-primary underline-offset-4 hover:underline transition-all duration-200" href="#">Contact Support</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
