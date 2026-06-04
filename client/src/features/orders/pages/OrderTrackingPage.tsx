import { Link } from 'react-router-dom';

const OrderTracking = () => {
  return (
    <main className="flex-grow pt-[40px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full madhubani-motif">
      {/* Header Section */}
      <header className="text-center mb-16 pt-12">
        <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Track Your Heritage Piece</h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant max-w-2xl mx-auto">
          Follow the journey of your authentic Bhagalpur silk masterpiece from the looms of our artisans to your doorstep.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Timeline Canvas */}
        <div className="lg:col-span-8 space-y-8">
          {/* Order Details Card */}
          <div className="ornamental-border textural-shadow bg-surface-bright rounded">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 mb-6">
              <div>
                <span className="font-label-caps text-label-caps text-secondary block mb-1">ORDER ID</span>
                <span className="font-headline-md text-headline-md text-primary">#BR-99021</span>
              </div>
              <div className="text-right">
                <span className="font-label-caps text-label-caps text-secondary block mb-1">DATE PLACED</span>
                <span className="font-body-md text-body-md text-on-surface-variant">12 Oct, 2023</span>
              </div>
            </div>

            {/* The Timeline */}
            <div className="relative pl-8 border-l-2 border-outline-variant ml-4 space-y-12 py-4">
              {/* Step 1: Placed */}
              <div className="relative">
                <div className="absolute -left-[43px] w-6 h-6 bg-surface-container-highest border-2 border-secondary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px] text-secondary">check</span>
                </div>
                <h3 className="font-body-lg text-body-lg text-on-surface mb-1">Order Placed</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">12 Oct, 10:30 AM</p>
              </div>

              {/* Step 2: Weaving */}
              <div className="relative">
                <div className="absolute -left-[45px] w-7 h-7 bg-primary-container border-2 border-primary-container rounded-full flex items-center justify-center ring-4 ring-surface">
                  <span className="material-symbols-outlined text-[16px] text-on-primary">spool</span>
                </div>
                <h3 className="font-body-lg text-body-lg text-primary font-bold mb-1">Weaving in Progress</h3>
                <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">brush</span> Artisan: Anjali Devi
                </p>
                <div className="mt-4 p-4 bg-surface-container-low border border-outline-variant/50 rounded-sm">
                  <p className="font-body-md text-body-md text-on-surface italic">"The warp is set, and the rhythmic clack of the loom begins to shape your Tussar silk."</p>
                </div>
              </div>

              {/* Step 3: Quality Check */}
              <div className="relative">
                <div className="absolute -left-[41px] w-5 h-5 bg-surface border-2 border-outline rounded-full"></div>
                <h3 className="font-body-lg text-body-lg text-on-surface-variant mb-1">Quality Check & Certification</h3>
                <p className="font-label-caps text-label-caps text-outline">PENDING</p>
              </div>

              {/* Step 4: Shipped */}
              <div className="relative">
                <div className="absolute -left-[41px] w-5 h-5 bg-surface border-2 border-outline rounded-full"></div>
                <h3 className="font-body-lg text-body-lg text-on-surface-variant mb-1">Shipped</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Carrier: BlueDart</p>
              </div>

              {/* Step 5: Delivered */}
              <div className="relative">
                <div className="absolute -left-[41px] w-5 h-5 bg-surface border-2 border-outline rounded-full"></div>
                <h3 className="font-body-lg text-body-lg text-on-surface-variant mb-1">Delivered</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Est. 24 Oct</p>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-surface-container-low p-8 rounded-sm text-center border border-outline-variant/30 textural-shadow">
            <h3 className="font-headline-md text-headline-md text-primary mb-2">Need Assistance?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">Our concierges are available to answer any questions about your order.</p>
            <button className="bg-primary-container text-secondary-fixed font-label-caps text-label-caps px-8 py-3 rounded hover:bg-primary transition-colors flex items-center justify-center mx-auto gap-2 group cursor-pointer">
              CONTACT US
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Sidebar / Summary */}
        <div className="lg:col-span-4">
          <div className="ornamental-border textural-shadow bg-surface-bright rounded sticky top-[120px]">
            <div className="mb-4">
              <img alt="Maroon Silk Saree" className="w-full h-64 object-cover rounded-sm border border-outline-variant/50" src="https://lh3.googleusercontent.com/aida/ADBb0ujvZ2gk9ZlWyI6cMg33QTOuFWUsn-MexVSiD55DTZfCUMqOG7TUmeRwdpbDmg7BmEfr5qQ9MXPRw4M8ui58zbl9ir_ZUuo0CJ2Kh3PMZNl5hWmESovzNNZ2SaI-tJalj1oTGveBBL6XUuKpQZq7GPgjuCL-l0OB3oTHCMQ_hU3GNGWVKh-qO6KjRV0w6PP7YfTTQxB4R_tbq4nbNzI9-AeukgmOZ3JjiopdSZP_0OogDU4-nubeYLatS-eB" />
            </div>
            <div className="text-center">
              <h4 className="font-headline-md text-headline-md text-on-surface mb-2">Royal Maroon Tussar</h4>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">Handwoven Silk Saree with Madhubani Borders</p>
              <p className="font-label-caps text-label-caps text-secondary mb-6">SILK MARK CERTIFIED</p>
              <Link className="font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors inline-block" to="/order-history">
                VIEW ORDER DETAILS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderTracking;
