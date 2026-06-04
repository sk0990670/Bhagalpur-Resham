import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../authSlice';
import { authService } from '../../../shared/services/auth.service';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../../shared/services/api';
import { setCart } from '../../cart/cartSlice';
import { validateEmail } from '../../../shared/utils/validation';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';
  const sessionExpired = location.state?.sessionExpired || false;
  const redirectMessage = location.state?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Clear the location state so the message doesn't persist on refresh
    if (sessionExpired || redirectMessage) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePostLogin = async (redirectPath: string) => {
    // 1. Fetch user's cart from backend and put in Redux
    try {
      const cartRes = await api.get('/cart');
      if (cartRes.data && cartRes.data.data) {
        dispatch(setCart({
          items: cartRes.data.data.items,
          totalItems: cartRes.data.data.totalItems,
          subtotal: cartRes.data.data.subtotal
        }));
      }
    } catch (err) {
      console.warn("Could not fetch cart after login", err);
    }

    // 2. Navigate to intended page
    navigate(redirectPath, { replace: true });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setErrorMsg('');
    if (emailError) {
      setEmailError(validateEmail(val));
    }
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eErr = validateEmail(email);
    setEmailError(eErr);

    if (eErr || !password) {
      setErrorMsg('Please enter a valid email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await authService.login({ email, password });
      // Backend returns: { data: { user, accessToken } }
      const { user, accessToken } = data.data;
      dispatch(setCredentials({ user, token: accessToken }));
      await handlePostLogin(from);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please check your credentials.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        const data = await authService.googleLogin({ credential: credentialResponse.credential });
        const { user, accessToken } = data.data;
        dispatch(setCredentials({ user, token: accessToken }));
        await handlePostLogin(from);
      }
    } catch (error: any) {
      console.error('Google login failed', error);
      setErrorMsg('Google authentication failed. Please try again.');
    }
  };

  const isFormIncomplete = !email || !password || emailError !== '';

  return (
    <main className="flex-grow flex items-center justify-center pt-[100px] pb-section-gap px-margin-desktop relative overflow-hidden w-full">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 z-0" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, #fed65b 0%, transparent 40%), radial-gradient(circle at 90% 80%, #fed65b 0%, transparent 40%)' }}></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-lg bg-surface-container-lowest ambient-shadow rounded-lg p-2 border border-outline-variant/50">
        <div className="border border-secondary-container p-10 rounded text-center relative overflow-hidden bg-surface-container-lowest">

          {/* Corner motifs */}
          {(['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'] as const).map((pos) => (
            <div key={pos} className={`absolute ${pos} text-secondary-container/30`}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 0" }}>flare</span>
            </div>
          ))}

          <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Patron Login</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">Welcome back to the heritage of silk.</p>

          {/* Session expired message */}
          {sessionExpired && (
            <div className="flex items-center gap-2 bg-error-container/30 border border-error/30 rounded px-4 py-3 mb-4 text-left">
              <span className="material-symbols-outlined text-error" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>warning</span>
              <p className="font-body-md text-body-md text-on-surface text-sm">Session expired. Please login again.</p>
            </div>
          )}

          {/* Wishlist redirect message */}
          {!sessionExpired && redirectMessage && (
            <div className="flex items-center gap-2 bg-secondary-container/30 border border-secondary-container/50 rounded px-4 py-3 mb-4 text-left">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <p className="font-body-md text-body-md text-on-surface text-sm">{redirectMessage}</p>
            </div>
          )}

          {/* Error message */}
          {errorMsg && (
            <div className="flex items-center gap-2 bg-error-container/30 border border-error/30 rounded px-4 py-3 mb-4 text-left">
              <span className="material-symbols-outlined text-error" style={{ fontSize: '18px' }}>error</span>
              <p className="font-body-md text-body-md text-error text-sm">{errorMsg}</p>
            </div>
          )}

          <form className="space-y-8 text-left mt-2" onSubmit={handleLogin}>
            <div className="relative">
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="email">Email Address</label>
              <input
                className={`w-full bg-transparent border-0 border-b focus:border-b-2 focus:ring-0 px-0 py-2 text-on-surface font-body-md placeholder:text-outline outline-none transition-colors ${emailError ? 'border-red-500 focus:border-red-500 text-red-500' : (email && !emailError ? 'border-green-500 focus:border-green-500' : 'border-primary')}`}
                id="email"
                name="email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
              />
              {emailError && <span className="text-red-500 text-xs mt-1 block">{emailError}</span>}
            </div>

            <div className="relative">
              <div className="flex justify-between items-end mb-2">
                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="password">Password</label>
                <Link className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors" to="/forgot-password">Forgot Password?</Link>
              </div>
              <input
                className="w-full bg-transparent border-0 border-b border-primary focus:border-b-2 focus:ring-0 px-0 py-2 text-on-surface font-body-md placeholder:text-outline outline-none"
                id="password"
                name="password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
              />
            </div>

            <div className="pt-4 space-y-4">
              <button
                type="submit"
                disabled={isLoading || isFormIncomplete}
                className="w-full bg-primary-container hover:bg-tertiary text-on-primary font-label-caps text-label-caps py-4 rounded transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                ) : (
                  <>Login <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_right_alt</span></>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 py-2 opacity-60">
                <div className="flex-1 h-px bg-outline-variant"></div>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">or</span>
                <div className="flex-1 h-px bg-outline-variant"></div>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setErrorMsg('Google login failed. Please try again.');
                  }}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-outline-variant/30">
            <p className="font-body-md text-body-md text-on-surface-variant">
              New to Bhagalpur Resham?{' '}
              <Link className="text-primary font-semibold hover:underline decoration-secondary-container underline-offset-4 transition-all ml-1" to="/signup">Create an Account</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
