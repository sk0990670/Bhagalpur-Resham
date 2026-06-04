import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../../../shared/services/auth.service';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../authSlice';
import bhagalpurReshamBrandLogoAsset from '../../../assets/bhagalpur_resham_brand_logo.png';
import { validateEmail, validateMobile, validateFullName, validatePassword } from '../../../shared/utils/validation';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const validateField = (field: string, value: string) => {
    let error = '';
    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validateMobile(value);
        break;
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Passwords do not match.';
        }
        break;
      default:
        break;
    }
    setFormErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name as keyof typeof formErrors]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const isFormValid = () => {
    const errors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      phone: validateMobile(formData.phone),
      password: validatePassword(formData.password),
      confirmPassword: formData.password !== formData.confirmPassword ? 'Passwords do not match.' : ''
    };
    
    setFormErrors(errors);
    return Object.values(errors).every(err => err === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      const data = await authService.register({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      dispatch(setCredentials({ user: data.data.user, token: data.data.accessToken }));
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed. Please check the details and try again.');
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
      console.error('Google signup failed', error);
      alert('Google authentication failed. Please try again.');
    }
  };

  const getInputStyle = (error: string, value: string) => {
    let base = "input-underline font-body-md text-body-md text-on-surface placeholder:text-outline-variant transition-colors w-full";
    if (error) {
      return `${base} border-b-red-500 focus:border-b-red-500 text-red-500`;
    }
    if (value && !error) {
      return `${base} border-b-green-500 focus:border-b-green-500`;
    }
    return base;
  };

  const isFormHasErrors = Object.values(formErrors).some(err => err !== '');
  const isFormIncomplete = !formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword;

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
            src={bhagalpurReshamBrandLogoAsset}
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
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="fullName">Full Name</label>
            <input value={formData.fullName} onChange={handleInputChange} onBlur={handleBlur} className={getInputStyle(formErrors.fullName, formData.fullName)} id="fullName" name="fullName" placeholder="Enter your full name" type="text" />
            {formErrors.fullName && <span className="text-red-500 text-xs mt-1">{formErrors.fullName}</span>}
          </div>
          
          {/* Email Address */}
          <div className="flex flex-col">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="email">Email Address</label>
            <input value={formData.email} onChange={handleInputChange} onBlur={handleBlur} className={getInputStyle(formErrors.email, formData.email)} id="email" name="email" placeholder="Enter your email" type="email" />
            {formErrors.email && <span className="text-red-500 text-xs mt-1">{formErrors.email}</span>}
          </div>
          
          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="phone">Phone Number</label>
            <input value={formData.phone} onChange={handleInputChange} onBlur={handleBlur} className={getInputStyle(formErrors.phone, formData.phone)} id="phone" name="phone" placeholder="Enter your phone number" type="tel" />
            {formErrors.phone && <span className="text-red-500 text-xs mt-1">{formErrors.phone}</span>}
          </div>
          
          {/* Password */}
          <div className="flex flex-col">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="password">Password</label>
            <input value={formData.password} onChange={handleInputChange} onBlur={handleBlur} className={getInputStyle(formErrors.password, formData.password)} id="password" name="password" placeholder="Create a password" type="password" />
            {formErrors.password && <span className="text-red-500 text-xs mt-1">{formErrors.password}</span>}
          </div>
          
          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-1" htmlFor="confirmPassword">Confirm Password</label>
            <input value={formData.confirmPassword} onChange={handleInputChange} onBlur={handleBlur} className={getInputStyle(formErrors.confirmPassword, formData.confirmPassword)} id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" type="password" />
            {formErrors.confirmPassword && <span className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</span>}
          </div>
          
          {/* Action Button */}
          <div className="pt-4">
            <button disabled={isFormHasErrors || isFormIncomplete} className="w-full bg-primary-container text-secondary-container hover:bg-tertiary transition-colors duration-300 font-label-caps text-label-caps py-4 rounded-sm flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
              <span>Sign Up</span>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-4 py-6 opacity-60">
          <div className="flex-1 h-px bg-outline-variant"></div>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">or</span>
          <div className="flex-1 h-px bg-outline-variant"></div>
        </div>
        
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.error('Google Signup Failed');
              alert('Google signup failed.');
            }}
            theme="outline"
            size="large"
            text="signup_with"
            shape="rectangular"
            width="100%"
          />
        </div>

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
