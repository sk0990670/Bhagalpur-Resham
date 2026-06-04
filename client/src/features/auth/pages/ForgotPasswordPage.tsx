import { Link } from 'react-router-dom';
import bhagalpurReshamBrandLogoAsset from '../../../assets/bhagalpur_resham_brand_logo.png';


const ForgotPassword = () => {
  return (
    <main className="flex-grow flex items-center justify-center pt-[100px] pb-section-gap px-gutter relative overflow-hidden w-full">
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-secondary-container rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 translate-x-[-50%]"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-tertiary-container rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10 translate-x-[30%]"></div>
      <div className="relative w-full max-w-md">
        <div className="bg-surface-container-lowest ambient-shadow rounded-DEFAULT border border-secondary-fixed-dim/20 p-[1px] relative z-10 overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(theme('colors.primary') 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
          <div className="bg-surface-container-lowest border border-secondary-fixed-dim/40 px-8 py-12 md:px-12 md:py-16 relative flex flex-col items-center text-center">
            <img src={bhagalpurReshamBrandLogoAsset} alt="Brand Mark" className="w-12 h-12 rounded-full object-cover mb-6 opacity-80" />
            <h1 className="font-headline-md text-headline-md text-primary mb-4">Forgot Password</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-10 max-w-[280px]">
              Enter your registered email address to receive a password reset link.
            </p>
            <form className="w-full flex flex-col gap-8">
              <div className="relative w-full text-left">
                <input className="w-full bg-transparent border-0 border-b border-primary/30 text-on-surface font-body-md text-body-md px-0 py-2 focus:ring-0 focus:border-b-2 focus:border-primary transition-colors peer placeholder-transparent outline-none" id="email" name="email" placeholder="Email Address" required type="email" />
                <label className="absolute left-0 -top-4 font-label-caps text-label-caps text-primary/70 transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:font-label-caps peer-focus:text-label-caps peer-focus:text-primary cursor-text" htmlFor="email">
                  Email Address
                </label>
              </div>
              <button className="w-full bg-primary-container text-secondary-fixed font-label-caps text-label-caps py-4 rounded-DEFAULT hover:bg-primary hover:text-secondary-fixed-dim transition-all duration-300 flex items-center justify-center gap-2 group ambient-shadow cursor-pointer" type="submit">
                <span className="">Send Reset Link</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
              </button>
            </form>
            <div className="mt-8 flex items-center gap-4 w-full">
              <div className="h-px bg-secondary-fixed-dim/30 flex-grow"></div>
              <Link className="font-label-caps text-label-caps text-primary/70 hover:text-primary transition-colors underline decoration-secondary-fixed-dim/50 underline-offset-4" to="/login">Return to Login</Link>
              <div className="h-px bg-secondary-fixed-dim/30 flex-grow"></div>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -left-4 w-16 h-16 border-t border-l border-secondary-fixed-dim z-0"></div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b border-r border-secondary-fixed-dim z-0"></div>
      </div>
    </main>
  );
};

export default ForgotPassword;
