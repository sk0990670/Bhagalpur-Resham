import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <main className="flex-grow flex items-center justify-center py-section-gap px-margin-mobile md:px-margin-desktop bg-silk-texture relative">
      {/* Abstract Lotus Motif Background Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-center opacity-5">
        <svg className="w-[800px] h-[800px] text-primary" fill="currentColor" viewBox="0 0 200 200">
          <path d="M100 10C100 10 130 50 150 90C170 130 190 170 100 190C10 170 30 130 50 90C70 50 100 10 100 10Z"></path>
        </svg>
      </div>
      
      <div className="w-full max-w-md bg-surface-container-lowest p-8 md:p-12 madhubani-border ambient-shadow relative z-10">
        {/* Brand & Form Header */}
        <div className="text-center mb-10">
          <img 
            alt="Bhagalpur Resham Logo" 
            className="w-16 h-16 mx-auto mb-4 rounded-full object-cover border border-outline-variant" 
            src="/assets/bhagalpur_resham_brand_logo.png"
          />
          <h1 className="font-headline-md text-headline-md text-primary mb-2">Create Account</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Join our heritage of artisanal silk</p>
          <div className="mt-6 flex justify-center items-center gap-4">
            <div className="h-px bg-outline-variant w-12"></div>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
            <div className="h-px bg-outline-variant w-12"></div>
          </div>
        </div>

        {/* Registration Form */}
        <form className="space-y-6">
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="fullName">Full Name</label>
            <input className="input-underline font-body-md text-body-md text-on-surface placeholder:text-outline-variant transition-colors" id="fullName" name="fullName" placeholder="Enter your full name" required type="text" />
          </div>
          
          {/* Email Address */}
          <div className="flex flex-col">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="email">Email Address</label>
            <input className="input-underline font-body-md text-body-md text-on-surface placeholder:text-outline-variant transition-colors" id="email" name="email" placeholder="Enter your email" required type="email" />
          </div>
          
          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="phone">Phone Number</label>
            <input className="input-underline font-body-md text-body-md text-on-surface placeholder:text-outline-variant transition-colors" id="phone" name="phone" placeholder="Enter your phone number" type="tel" />
          </div>
          
          {/* Password */}
          <div className="flex flex-col">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="password">Password</label>
            <input className="input-underline font-body-md text-body-md text-on-surface placeholder:text-outline-variant transition-colors" id="password" name="password" placeholder="Create a password" required type="password" />
          </div>
          
          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="confirmPassword">Confirm Password</label>
            <input className="input-underline font-body-md text-body-md text-on-surface placeholder:text-outline-variant transition-colors" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required type="password" />
          </div>
          
          {/* Action Button */}
          <div className="pt-4">
            <button className="w-full bg-primary-container text-secondary-container hover:bg-tertiary transition-colors duration-300 font-label-caps text-label-caps py-4 rounded-sm flex justify-center items-center gap-2 cursor-pointer" type="submit">
              <span>Sign Up</span>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Already have an account? 
            <Link className="text-primary hover:text-secondary transition-colors border-b border-primary hover:border-secondary pb-0.5 ml-1" to="/login">Login</Link>
          </p>
        </div>

        {/* Bottom Motif */}
        <div className="absolute bottom-4 right-4 text-secondary opacity-20 pointer-events-none">
          <span className="material-symbols-outlined" style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}>eco</span>
        </div>
      </div>
    </main>
  );
};

export default Signup;
