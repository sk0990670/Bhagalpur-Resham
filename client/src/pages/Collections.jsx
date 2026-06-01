import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    title: 'Rajwaada Crimson Silk',
    subtitle: 'Pure Bhagalpuri Tussar',
    price: '₹14,500',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX0UJAOT6kHZrLEyVtEUcwjzBLUMQJ4EwHmEaYn08S8PTNs4nE208sactDkWLqiuMFvhYN6UtCD9C1XH8fxtth3VHLfOLud8bpR96iOuT6CIEfin1mtRxbQhG6LzLQFj9xpw7PSJpq165Halanvvx3FrZt1lIYtEAJZP_uyH1u2Aygk0CLw0mtGfc6pPXBHFvZM_9zzRxkXRAmY1c0uFaJqH33VFFRv6r92o6-UqcIyQ4mm-XEI-PHRezsaBMQt86CVm2a9g6K64sO',
    badge: 'verified', // Silk Mark
  },
  {
    id: 2,
    title: 'Swarna Matka Weave',
    subtitle: 'Handloom Matka Silk',
    price: '₹11,200',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx5P2TjjBAtt9L-bNeMlJ7b2VVoFuINFmAWJVEixnUKSUNHXkBEx2RUQpt4VaNq4evbp0Z2faWKIb4XgRxjxQN6SHbj9pRiBUd31jeaJYGq27emxaqgPpzhB1ShtoeTKkSuSxGnpQyRe1x0vhgGx60xEjV4DN6qToHhkbJD1VZcXogrnOBIn7nTNlSqrwPsDVqqGIG6UsMUYzxDg1IhUlzjHCHm7Zw-u15Cxjwv9q8vPZPOoesot62XwVD1so6QLGouQLOYraD3wu6',
  },
  {
    id: 3,
    title: 'Neelam Indigo Drape',
    subtitle: 'Classic Bhagalpuri',
    price: '₹9,800',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD06HVnezZT4EFbE2ntWZ2HYpBi-3XycaV639oSnoeYBT0IPuDltI1iyhcjX7ReJNE78B8SDLW8-XPTVCpSmDCikrZW99mtZbZ__2N0O3uHGXDEYqUbSEFluD4Ol4cCqCmVFl6vZ4OMkXQmYWEyp4tZ1yrMzuqOe6pcQhBbiCoPC1bnrCqzNBsIe3q0U0PzOBRJEMGBFaFM6sqjhM2OBO0y1URIzp5AShw_SDNNQMb6BIK_7aufBGJLzJBc43OzkPJRp09X5yAzz9U',
    tag: 'NEW ARRIVAL'
  },
  {
    id: 4,
    title: 'Emerald Tussar Weave',
    subtitle: 'Pure Bhagalpuri Tussar',
    price: '₹13,500',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX0UJAOT6kHZrLEyVtEUcwjzBLUMQJ4EwHmEaYn08S8PTNs4nE208sactDkWLqiuMFvhYN6UtCD9C1XH8fxtth3VHLfOLud8bpR96iOuT6CIEfin1mtRxbQhG6LzLQFj9xpw7PSJpq165Halanvvx3FrZt1lIYtEAJZP_uyH1u2Aygk0CLw0mtGfc6pPXBHFvZM_9zzRxkXRAmY1c0uFaJqH33VFFRv6r92o6-UqcIyQ4mm-XEI-PHRezsaBMQt86CVm2a9g6K64sO',
  },
  {
    id: 5,
    title: 'Champagne Matka Silk',
    subtitle: 'Handloom Matka Silk',
    price: '₹12,400',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx5P2TjjBAtt9L-bNeMlJ7b2VVoFuINFmAWJVEixnUKSUNHXkBEx2RUQpt4VaNq4evbp0Z2faWKIb4XgRxjxQN6SHbj9pRiBUd31jeaJYGq27emxaqgPpzhB1ShtoeTKkSuSxGnpQyRe1x0vhgGx60xEjV4DN6qToHhkbJD1VZcXogrnOBIn7nTNlSqrwPsDVqqGIG6UsMUYzxDg1IhUlzjHCHm7Zw-u15Cxjwv9q8vPZPOoesot62XwVD1so6QLGouQLOYraD3wu6',
    badge: 'verified'
  },
  {
    id: 6,
    title: 'Midnight Blue Classic',
    subtitle: 'Classic Bhagalpuri',
    price: '₹10,500',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD06HVnezZT4EFbE2ntWZ2HYpBi-3XycaV639oSnoeYBT0IPuDltI1iyhcjX7ReJNE78B8SDLW8-XPTVCpSmDCikrZW99mtZbZ__2N0O3uHGXDEYqUbSEFluD4Ol4cCqCmVFl6vZ4OMkXQmYWEyp4tZ1yrMzuqOe6pcQhBbiCoPC1bnrCqzNBsIe3q0U0PzOBRJEMGBFaFM6sqjhM2OBO0y1URIzp5AShw_SDNNQMb6BIK_7aufBGJLzJBc43OzkPJRp09X5yAzz9U',
  },
  {
    id: 7,
    title: 'Ruby Red Traditional',
    subtitle: 'Pure Bhagalpuri Tussar',
    price: '₹15,200',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX0UJAOT6kHZrLEyVtEUcwjzBLUMQJ4EwHmEaYn08S8PTNs4nE208sactDkWLqiuMFvhYN6UtCD9C1XH8fxtth3VHLfOLud8bpR96iOuT6CIEfin1mtRxbQhG6LzLQFj9xpw7PSJpq165Halanvvx3FrZt1lIYtEAJZP_uyH1u2Aygk0CLw0mtGfc6pPXBHFvZM_9zzRxkXRAmY1c0uFaJqH33VFFRv6r92o6-UqcIyQ4mm-XEI-PHRezsaBMQt86CVm2a9g6K64sO',
    tag: 'BESTSELLER'
  },
  {
    id: 8,
    title: 'Ivory Gold Matka',
    subtitle: 'Handloom Matka Silk',
    price: '₹11,800',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx5P2TjjBAtt9L-bNeMlJ7b2VVoFuINFmAWJVEixnUKSUNHXkBEx2RUQpt4VaNq4evbp0Z2faWKIb4XgRxjxQN6SHbj9pRiBUd31jeaJYGq27emxaqgPpzhB1ShtoeTKkSuSxGnpQyRe1x0vhgGx60xEjV4DN6qToHhkbJD1VZcXogrnOBIn7nTNlSqrwPsDVqqGIG6UsMUYzxDg1IhUlzjHCHm7Zw-u15Cxjwv9q8vPZPOoesot62XwVD1so6QLGouQLOYraD3wu6',
  },
  {
    id: 9,
    title: 'Sapphire Blue Drape',
    subtitle: 'Classic Bhagalpuri',
    price: '₹9,500',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD06HVnezZT4EFbE2ntWZ2HYpBi-3XycaV639oSnoeYBT0IPuDltI1iyhcjX7ReJNE78B8SDLW8-XPTVCpSmDCikrZW99mtZbZ__2N0O3uHGXDEYqUbSEFluD4Ol4cCqCmVFl6vZ4OMkXQmYWEyp4tZ1yrMzuqOe6pcQhBbiCoPC1bnrCqzNBsIe3q0U0PzOBRJEMGBFaFM6sqjhM2OBO0y1URIzp5AShw_SDNNQMb6BIK_7aufBGJLzJBc43OzkPJRp09X5yAzz9U',
    badge: 'verified'
  }
];

const Collections = () => {
  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      {/* Hero Section */}
      <header className="mb-16 text-center">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">The Silk Route</h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant max-w-2xl mx-auto">Explore our curated collections of masterfully handwoven Tussar, Bhagalpuri, and Matka silks.</p>
        <div className="mt-8 flex justify-center">
          <svg fill="none" height="20" viewBox="0 0 200 20" width="200" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10H190" stroke="#735c00" strokeWidth="1"></path>
            <circle cx="100" cy="10" fill="#8B0000" r="4"></circle>
            <circle cx="90" cy="10" fill="#735c00" r="2"></circle>
            <circle cx="110" cy="10" fill="#735c00" r="2"></circle>
          </svg>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-1/4 pr-8 hidden md:block">
          <div className="sticky top-32">
            <h2 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/50 pb-2 mb-6">Filters</h2>
            
            {/* Weave Type */}
            <div className="mb-8">
              <h3 className="font-body-lg text-body-lg text-on-surface mb-4">Weave Type</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <input className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" id="weave-tussar" type="checkbox" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="weave-tussar">Tussar Silk</label>
                </li>
                <li className="flex items-center">
                  <input defaultChecked className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" id="weave-bhagalpuri" type="checkbox" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="weave-bhagalpuri">Bhagalpuri</label>
                </li>
                <li className="flex items-center">
                  <input className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" id="weave-matka" type="checkbox" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="weave-matka">Matka Silk</label>
                </li>
              </ul>
            </div>

            {/* Color */}
            <div className="mb-8">
              <h3 className="font-body-lg text-body-lg text-on-surface mb-4">Color</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <input className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" id="color-red" type="checkbox" />
                  <label className="ml-3 flex items-center font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="color-red">
                    <span className="w-3 h-3 rounded-full bg-[#8B0000] inline-block mr-2"></span> Red
                  </label>
                </li>
                <li className="flex items-center">
                  <input className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" id="color-gold" type="checkbox" />
                  <label className="ml-3 flex items-center font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="color-gold">
                    <span className="w-3 h-3 rounded-full bg-[#D4AF37] inline-block mr-2"></span> Gold
                  </label>
                </li>
                <li className="flex items-center">
                  <input className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" id="color-cream" type="checkbox" />
                  <label className="ml-3 flex items-center font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="color-cream">
                    <span className="w-3 h-3 rounded-full bg-[#FFF8E7] border border-outline-variant inline-block mr-2"></span> Cream
                  </label>
                </li>
                <li className="flex items-center">
                  <input className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" id="color-multi" type="checkbox" />
                  <label className="ml-3 flex items-center font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="color-multi">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 inline-block mr-2"></span> Multicolored
                  </label>
                </li>
              </ul>
            </div>

            {/* Occasion */}
            <div className="mb-8">
              <h3 className="font-body-lg text-body-lg text-on-surface mb-4">Occasion</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <input className="custom-radio w-4 h-4 appearance-none border border-outline rounded-full cursor-pointer focus:outline-none" id="occ-wedding" name="occasion" type="radio" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="occ-wedding">Wedding</label>
                </li>
                <li className="flex items-center">
                  <input defaultChecked className="custom-radio w-4 h-4 appearance-none border border-outline rounded-full cursor-pointer focus:outline-none" id="occ-festive" name="occasion" type="radio" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="occ-festive">Festive</label>
                </li>
                <li className="flex items-center">
                  <input className="custom-radio w-4 h-4 appearance-none border border-outline rounded-full cursor-pointer focus:outline-none" id="occ-casual" name="occasion" type="radio" />
                  <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="occ-casual">Casual</label>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <span className="font-body-md text-body-md text-on-surface-variant">Showing 9 of 48 items</span>
            <div className="flex items-center space-x-2 border-b border-primary/20 pb-1">
              <span className="font-label-caps text-label-caps text-on-surface">Sort By:</span>
              <select className="bg-transparent font-body-md text-body-md text-primary border-none focus:ring-0 p-0 pr-4 cursor-pointer outline-none">
                <option>New Arrivals</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Changed gap from gap-8 to gap-6 to tighten the 3x3 grid slightly */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="block group relative border-ornamental ambient-shadow transition-transform duration-500 hover:-translate-y-1 bg-surface-container-lowest p-3">
                {/* Changed aspect-[3/4] to aspect-[4/5] to make the image slightly less tall and overall smaller */}
                <div className="relative overflow-hidden aspect-[4/5] mithila-border p-1 bg-surface-container-low mb-3">
                  <img 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    src={product.image}
                  />
                  {/* Artisan Badge */}
                  {product.badge && (
                    <div className="absolute top-3 right-3 bg-surface/90 rounded-full p-1.5 backdrop-blur-sm shadow-sm" title="Silk Mark Certified">
                      <span className="material-symbols-outlined text-secondary" style={{ fontSize: '14px' }}>{product.badge}</span>
                    </div>
                  )}
                  {/* Tag */}
                  {product.tag && (
                    <div className="absolute top-3 left-3 bg-surface/90 text-primary font-label-caps text-[9px] px-2 py-1 border border-primary/20">
                      {product.tag}
                    </div>
                  )}
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-surface/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <button className="bg-primary/90 text-on-primary font-label-caps text-label-caps px-4 py-2 text-xs tracking-widest hover:bg-primary transition-colors cursor-pointer">QUICK VIEW</button>
                  </div>
                </div>
                <div className="text-center px-1">
                  {/* Reduced title text size from text-xl to text-lg */}
                  <h3 className="font-headline-md text-headline-md text-primary text-lg mb-1 truncate">{product.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-2 text-sm">{product.subtitle}</p>
                  <div className="flex justify-between items-center border-t border-outline-variant/30 pt-2 mt-2">
                    <span className="font-body-lg text-body-lg font-semibold text-on-surface text-base">{product.price}</span>
                    <button aria-label="Add to wishlist" className="text-primary hover:text-secondary transition-colors cursor-pointer">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>favorite_border</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center space-x-2">
            <button aria-label="Previous page" className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary font-label-caps cursor-pointer">1</button>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors font-label-caps cursor-pointer">2</button>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors font-label-caps cursor-pointer">3</button>
            <span className="text-on-surface-variant px-2">...</span>
            <button aria-label="Next page" className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Collections;
