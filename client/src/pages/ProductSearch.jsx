import React from 'react';
import { Link } from 'react-router-dom';

const PRODUCTS = [
  {
    id: 1,
    name: 'Crimson Lotus Tussar Silk Saree',
    price: '₹18,500',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYr20mkYZKJlgwG_N96x7Zj8WrCeJpW9AXReQ0OZLWLV0ZE8QxfHPNO7lVqqi8FldKwwJ_HfHia4GJSzifbViNLIhh6fimMLiqhp4_Ez0Q89P96eoHBzSLOXEwJIs_z-7oApAfLWGOW_SB96OIvWCehmfaVQVZw8m_WH2CWN7YBEx2Cp2FyMnz8P7XuvOokFdPD2Gd6-f6s8R0BumljQATtBWcFF8LnVd950w8KAWytNSl18CuxVWDkxQ9LA63XWxebIewQwnOvYYf',
    badge: 'Silk Mark',
    icon: 'verified'
  },
  {
    id: 2,
    name: 'Midnight Indigo Handloom Saree',
    price: '₹15,200',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO1Uv8k0LnFuecRoecp2-hbDTD2AEn2J9cL4UZZNuiLClj3WovhhVv2IGk7yTbKkriv3DClR59IzfIm61ppbv3AKkVw8envNDVP-5rIsHwsJxhe3J4usQ431TJVqZLWQqgqhVPHk88lXyVy-raXQAZ5Ugk-yI9kXOwD8y7c5mgI5ueOGAfSWXbrwW-8260kjDZX89WAi-DlK_-V_gwQ2-oAap_xlkmvNf3PoogbQHAV-xIRffBJrxSnt3l7fQJxKjjuC-eJIKIkmuR',
    badge: 'Handloom',
    icon: 'handyman'
  },
  {
    id: 3,
    name: 'Ivory Zari Tussar Saree',
    price: '₹22,000',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBd1t0SXNRDFFA6uskI0T2WkiDyDeWjUYDTpdHvoJ4QZcaDlgI0v3diouVrzqp-LtAbRpcNS3cui9AK0qqMed6JOB75hOhqe8DLQRGQ1QXbDaIusHSn7rCoSZKN2g30GByqsHsi9iL16Fv_tvhjHoVZYgig9ls_p72QWCKUp0d6xmoaeqakSZBdPzUr8hExpAJBJWttlJT6vkoPd-1LF2PgPEk_QpzPNoUGdTLbZtkCpKWVgip80lSzI6a1bxX0df41qmyaBIRu8hhu',
    badge: 'Silk Mark',
    icon: 'verified'
  },
  {
    id: 4,
    name: 'Royal Maroon Bridal Silk',
    price: '₹28,500',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYr20mkYZKJlgwG_N96x7Zj8WrCeJpW9AXReQ0OZLWLV0ZE8QxfHPNO7lVqqi8FldKwwJ_HfHia4GJSzifbViNLIhh6fimMLiqhp4_Ez0Q89P96eoHBzSLOXEwJIs_z-7oApAfLWGOW_SB96OIvWCehmfaVQVZw8m_WH2CWN7YBEx2Cp2FyMnz8P7XuvOokFdPD2Gd6-f6s8R0BumljQATtBWcFF8LnVd950w8KAWytNSl18CuxVWDkxQ9LA63XWxebIewQwnOvYYf',
    badge: 'Silk Mark',
    icon: 'verified'
  },
  {
    id: 5,
    name: 'Deep Blue Handwoven Tussar',
    price: '₹14,800',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO1Uv8k0LnFuecRoecp2-hbDTD2AEn2J9cL4UZZNuiLClj3WovhhVv2IGk7yTbKkriv3DClR59IzfIm61ppbv3AKkVw8envNDVP-5rIsHwsJxhe3J4usQ431TJVqZLWQqgqhVPHk88lXyVy-raXQAZ5Ugk-yI9kXOwD8y7c5mgI5ueOGAfSWXbrwW-8260kjDZX89WAi-DlK_-V_gwQ2-oAap_xlkmvNf3PoogbQHAV-xIRffBJrxSnt3l7fQJxKjjuC-eJIKIkmuR',
    badge: 'Handloom',
    icon: 'handyman'
  },
  {
    id: 6,
    name: 'Classic Cream & Gold Zari',
    price: '₹25,000',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBd1t0SXNRDFFA6uskI0T2WkiDyDeWjUYDTpdHvoJ4QZcaDlgI0v3diouVrzqp-LtAbRpcNS3cui9AK0qqMed6JOB75hOhqe8DLQRGQ1QXbDaIusHSn7rCoSZKN2g30GByqsHsi9iL16Fv_tvhjHoVZYgig9ls_p72QWCKUp0d6xmoaeqakSZBdPzUr8hExpAJBJWttlJT6vkoPd-1LF2PgPEk_QpzPNoUGdTLbZtkCpKWVgip80lSzI6a1bxX0df41qmyaBIRu8hhu',
    badge: 'Silk Mark',
    icon: 'verified'
  },
  {
    id: 7,
    name: 'Ruby Red Festival Edition',
    price: '₹19,200',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYr20mkYZKJlgwG_N96x7Zj8WrCeJpW9AXReQ0OZLWLV0ZE8QxfHPNO7lVqqi8FldKwwJ_HfHia4GJSzifbViNLIhh6fimMLiqhp4_Ez0Q89P96eoHBzSLOXEwJIs_z-7oApAfLWGOW_SB96OIvWCehmfaVQVZw8m_WH2CWN7YBEx2Cp2FyMnz8P7XuvOokFdPD2Gd6-f6s8R0BumljQATtBWcFF8LnVd950w8KAWytNSl18CuxVWDkxQ9LA63XWxebIewQwnOvYYf',
    badge: 'Silk Mark',
    icon: 'verified'
  },
  {
    id: 8,
    name: 'Ocean Indigo Casual Drape',
    price: '₹12,500',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO1Uv8k0LnFuecRoecp2-hbDTD2AEn2J9cL4UZZNuiLClj3WovhhVv2IGk7yTbKkriv3DClR59IzfIm61ppbv3AKkVw8envNDVP-5rIsHwsJxhe3J4usQ431TJVqZLWQqgqhVPHk88lXyVy-raXQAZ5Ugk-yI9kXOwD8y7c5mgI5ueOGAfSWXbrwW-8260kjDZX89WAi-DlK_-V_gwQ2-oAap_xlkmvNf3PoogbQHAV-xIRffBJrxSnt3l7fQJxKjjuC-eJIKIkmuR',
    badge: 'Handloom',
    icon: 'handyman'
  },
  {
    id: 9,
    name: 'Golden Ivory Masterpiece',
    price: '₹32,000',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBd1t0SXNRDFFA6uskI0T2WkiDyDeWjUYDTpdHvoJ4QZcaDlgI0v3diouVrzqp-LtAbRpcNS3cui9AK0qqMed6JOB75hOhqe8DLQRGQ1QXbDaIusHSn7rCoSZKN2g30GByqsHsi9iL16Fv_tvhjHoVZYgig9ls_p72QWCKUp0d6xmoaeqakSZBdPzUr8hExpAJBJWttlJT6vkoPd-1LF2PgPEk_QpzPNoUGdTLbZtkCpKWVgip80lSzI6a1bxX0df41qmyaBIRu8hhu',
    badge: 'Silk Mark',
    icon: 'verified'
  }
];

const ProductSearch = () => {
  return (
    <main className="flex-grow pt-12 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      {/* Search/Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Discover Your Heritage</h1>
        <div className="max-w-2xl mx-auto relative group">
          <input 
            className="w-full bg-transparent border-0 border-b border-primary text-center font-story-serif text-story-serif py-4 focus:ring-0 focus:border-b-2 transition-all placeholder:text-on-surface-variant/50" 
            placeholder="Search for heritage silk..." 
            type="text" 
          />
          <span 
            className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" 
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            search
          </span>
        </div>
        <p className="font-label-caps text-label-caps text-on-surface-variant mt-4">Showing 124 Masterpieces</p>
      </section>
      
      <div className="flex flex-col md:flex-row gap-gutter">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div className="border-b border-outline-variant/30 pb-6">
            <h3 className="font-label-caps text-label-caps text-primary mb-4 flex justify-between items-center cursor-pointer">
              Fabric
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
            </h3>
            <div className="space-y-3 font-body-md text-body-md text-on-surface-variant">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="custom-checkbox w-4 h-4 text-primary border-primary rounded-sm focus:ring-primary focus:ring-offset-surface bg-transparent" defaultChecked type="checkbox" />
                <span className="group-hover:text-primary transition-colors">Tussar Silk (45)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="custom-checkbox w-4 h-4 text-primary border-primary rounded-sm focus:ring-primary focus:ring-offset-surface bg-transparent" type="checkbox" />
                <span className="group-hover:text-primary transition-colors">Mulberry Silk (32)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="custom-checkbox w-4 h-4 text-primary border-primary rounded-sm focus:ring-primary focus:ring-offset-surface bg-transparent" type="checkbox" />
                <span className="group-hover:text-primary transition-colors">Bhagalpuri Linen (47)</span>
              </label>
            </div>
          </div>
          
          <div className="border-b border-outline-variant/30 pb-6">
            <h3 className="font-label-caps text-label-caps text-primary mb-4 flex justify-between items-center cursor-pointer">
              Occasion
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
            </h3>
            <div className="space-y-3 font-body-md text-body-md text-on-surface-variant">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="custom-checkbox w-4 h-4 text-primary border-primary rounded-sm focus:ring-primary focus:ring-offset-surface bg-transparent" type="checkbox" />
                <span className="group-hover:text-primary transition-colors">Wedding (20)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="custom-checkbox w-4 h-4 text-primary border-primary rounded-sm focus:ring-primary focus:ring-offset-surface bg-transparent" defaultChecked type="checkbox" />
                <span className="group-hover:text-primary transition-colors">Festival (64)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="custom-checkbox w-4 h-4 text-primary border-primary rounded-sm focus:ring-primary focus:ring-offset-surface bg-transparent" type="checkbox" />
                <span className="group-hover:text-primary transition-colors">Casual (40)</span>
              </label>
            </div>
          </div>
          
          <div className="border-b border-outline-variant/30 pb-6">
            <h3 className="font-label-caps text-label-caps text-primary mb-4 flex justify-between items-center cursor-pointer">
              Color
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              <button aria-label="Maroon" className="w-8 h-8 rounded-full bg-primary border-2 border-surface ring-2 ring-primary-container"></button>
              <button aria-label="Gold" className="w-8 h-8 rounded-full bg-[#d4af37] border-2 border-surface hover:ring-2 ring-outline-variant transition-all"></button>
              <button aria-label="Cream" className="w-8 h-8 rounded-full bg-[#fffdd0] border-2 border-surface hover:ring-2 ring-outline-variant transition-all"></button>
              <button aria-label="Indigo" className="w-8 h-8 rounded-full bg-[#4b0082] border-2 border-surface hover:ring-2 ring-outline-variant transition-all"></button>
            </div>
          </div>
        </aside>
        
        {/* Product Grid */}
        <div className="flex-grow">
          {/* Sorting & Top Actions */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/30">
            <div className="flex gap-4">
              <button className="font-label-caps text-label-caps text-primary flex items-center gap-1 hover:opacity-80 transition-opacity">
                Sort By: Featured <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_drop_down</span>
              </button>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-primary bg-surface-variant rounded-sm">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>grid_view</span>
              </button>
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>view_agenda</span>
              </button>
            </div>
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {PRODUCTS.map(product => (
              <div key={product.id} className="group cursor-pointer">
                <div className="bg-[#FFF8E7] border border-secondary/20 p-2 shadow-sm mb-4 relative aspect-[3/4] overflow-hidden">
                  <div className="absolute inset-2 border border-secondary/20 pointer-events-none z-10"></div>
                  <img 
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                    src={product.image}
                  />
                  <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                    <span className="bg-surface/90 backdrop-blur-sm px-2 py-1 font-label-caps text-[10px] text-primary tracking-widest border border-outline-variant/30 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 0" }}>{product.icon}</span> {product.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-4/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-3 hover:bg-primary-container transition-colors shadow-lg">Quick Add</button>
                  </div>
                </div>
                <div className="text-center px-4">
                  <h4 className="font-story-serif text-story-serif text-primary mb-2 line-clamp-1">{product.name}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">{product.price}</p>
                </div>
              </div>
            ))}
            
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center items-center mt-12 gap-2 font-label-caps text-label-caps">
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-primary bg-primary text-on-primary">1</button>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors">2</button>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors">3</button>
            <span className="px-2 text-on-surface-variant">...</span>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
            </button>
          </div>
          
        </div>
      </div>
    </main>
  );
};

export default ProductSearch;
