import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
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
          
          <form className="space-y-8 text-left">
            <div className="relative">
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="email">Email Address</label>
              <input className="w-full bg-transparent border-0 border-b border-primary focus:border-b-2 focus:ring-0 px-0 py-2 text-on-surface font-body-md placeholder:text-outline outline-none" id="email" name="email" placeholder="Enter your email" type="email" />
            </div>
            
            <div className="relative">
              <div className="flex justify-between items-end mb-2">
                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="password">Password</label>
                <Link className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors" to="/forgot-password">Forgot Password?</Link>
              </div>
              <input className="w-full bg-transparent border-0 border-b border-primary focus:border-b-2 focus:ring-0 px-0 py-2 text-on-surface font-body-md placeholder:text-outline outline-none" id="password" name="password" placeholder="Enter your password" type="password" />
            </div>
            
            <div className="pt-4 space-y-4">
              <Link className="w-full bg-primary-container hover:bg-tertiary text-on-primary font-label-caps text-label-caps py-4 rounded transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest shadow-md hover:shadow-lg cursor-pointer" to="/dashboard">
                Login <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_right_alt</span>
              </Link>
              
              <div className="flex items-center justify-center gap-4 py-2 opacity-60">
                <div className="flex-1 h-px bg-outline-variant"></div>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">or</span>
                <div className="flex-1 h-px bg-outline-variant"></div>
              </div>
              
              <button className="w-full bg-transparent border border-secondary-container hover:bg-surface-container-low text-primary font-label-caps text-label-caps py-4 rounded transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-widest cursor-pointer" type="button">
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.11c-.22-.67-.35-1.38-.35-2.11s.13-1.44.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.83c.87-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335"></path>
                </svg>
                Continue with Google
              </button>
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
