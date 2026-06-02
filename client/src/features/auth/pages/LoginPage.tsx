import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../../../shared/services/auth.service';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleDummyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      const dummyCustomer = {
        id: 'cust_123',
        name: 'Patron User',
        email: email,
        role: 'customer'
      };
      dispatch(setCredentials({ user: dummyCustomer, token: 'dummy_customer_token' }));
      
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      alert('Please enter an email and password to continue.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        const data = await authService.googleLogin({ credential: credentialResponse.credential });
        dispatch(setCredentials({ user: data.data.user, token: data.data.accessToken }));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google login failed', error);
      alert('Google authentication failed. Please try again.');
    }
  };
  return (
    <main className="flex-grow flex items-center justify-center pt-[100px] pb-section-gap px-margin-desktop relative overflow-hidden w-full">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 z-0" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, #fed65b 0%, transparent 40%), radial-gradient(circle at 90% 80%, #fed65b 0%, transparent 40%)' }}></div>
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-lg bg-surface-container-lowest ambient-shadow rounded-lg p-2 border border-outline-variant/50">
        {/* Inner Border for 'Masterpiece' feel */}
        <div className="border border-secondary-container p-10 rounded text-center relative overflow-hidden bg-surface-container-lowest">
          
          {/* Subtle corner motifs */}
          <div className="absolute top-4 left-4 text-secondary-container/30">
            <span className="material-symbols-outlined" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 0" }}>flare</span>
          </div>
          <div className="absolute top-4 right-4 text-secondary-container/30">
            <span className="material-symbols-outlined" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 0" }}>flare</span>
          </div>
          <div className="absolute bottom-4 left-4 text-secondary-container/30">
            <span className="material-symbols-outlined" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 0" }}>flare</span>
          </div>
          <div className="absolute bottom-4 right-4 text-secondary-container/30">
            <span className="material-symbols-outlined" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 0" }}>flare</span>
          </div>
          
          <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Patron Login</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-10">Welcome back to the heritage of silk.</p>
          
          <form className="space-y-8 text-left" onSubmit={handleDummyLogin}>
            <div className="relative">
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="email">Email Address</label>
              <input 
                className="w-full bg-transparent border-0 border-b border-primary focus:border-b-2 focus:ring-0 px-0 py-2 text-on-surface font-body-md placeholder:text-outline outline-none" 
                id="email" 
                name="email" 
                placeholder="Enter your email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="pt-4 space-y-4">
              <button 
                type="submit" 
                className="w-full bg-primary-container hover:bg-tertiary text-on-primary font-label-caps text-label-caps py-4 rounded transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest shadow-md hover:shadow-lg cursor-pointer"
              >
                Login <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_right_alt</span>
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
                    console.error('Google Login Failed');
                    alert('Google login failed.');
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
              New to Bhagalpur Resham? 
              <Link className="text-primary font-semibold hover:underline decoration-secondary-container underline-offset-4 transition-all ml-1" to="/signup">Create an Account</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
