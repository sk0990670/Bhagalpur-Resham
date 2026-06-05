import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';
import { authService } from '../../../shared/services/auth.service';
import CustomerSidebar from '../../../shared/components/CustomerSidebar';

const CustomerSupportPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="flex flex-1 w-full mx-auto relative bg-surface">
      <CustomerSidebar />
      {/* Main Content Canvas */}
      <main className="flex-1 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-88px)] w-full max-w-container-max mx-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header Section */}
          <section className="flex flex-col md:flex-row gap-8 items-start border-b border-outline-variant/20 pb-8">
            <div className="flex-1">
              <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Customer Support</h1>
              <p className="font-story-serif text-story-serif text-on-surface-variant italic">How can we assist you today?</p>
            </div>
          </section>

          {/* Contact Options */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-lg ambient-shadow border border-outline-variant/30 flex flex-col h-full">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">mail</span>
              <h3 className="font-headline-sm text-primary mb-2">Email Us</h3>
              <p className="font-body-md text-on-surface-variant mb-6 flex-grow">
                Our support team is available to assist you with any inquiries regarding your orders, the heritage of our silk, or our artisans.
              </p>
              <a href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`} className="bg-primary text-on-primary font-label-caps text-center py-3 px-6 rounded hover:bg-primary-container transition-colors">
                {import.meta.env.VITE_SUPPORT_EMAIL}
              </a>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-lg ambient-shadow border border-outline-variant/30 flex flex-col h-full">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">call</span>
              <h3 className="font-headline-sm text-primary mb-2">Call Us</h3>
              <p className="font-body-md text-on-surface-variant mb-6 flex-grow">
                Speak directly with a patron concierge for immediate assistance with urgent matters or custom orders.
              </p>
              <a href={`tel:${import.meta.env.VITE_SUPPORT_PHONE}`} className="bg-primary text-on-primary font-label-caps text-center py-3 px-6 rounded hover:bg-primary-container transition-colors">
                {import.meta.env.VITE_SUPPORT_PHONE}
              </a>
            </div>
          </section>

          {/* Quick Form */}
          <section className="bg-surface-container-low p-8 madhubani-border ambient-shadow mt-8">
            <h3 className="font-headline-md text-primary mb-6">Send us a Message</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
              <div>
                <label className="block text-sm text-on-surface-variant font-label-caps uppercase mb-2">Subject</label>
                <select className="w-full bg-surface border border-outline-variant/50 focus:border-primary rounded px-4 py-3 text-on-surface font-body-md outline-none">
                  <option>Order Inquiry</option>
                  <option>Product Information</option>
                  <option>Artisan Details</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-on-surface-variant font-label-caps uppercase mb-2">Message</label>
                <textarea 
                  className="w-full bg-surface border border-outline-variant/50 focus:border-primary rounded px-4 py-3 text-on-surface font-body-md outline-none min-h-[150px]" 
                  placeholder="Describe your issue or question in detail..."
                  required
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  className="bg-secondary text-on-secondary font-label-caps px-8 py-3 rounded hover:bg-secondary-container transition-colors tracking-widest shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CustomerSupportPage;
