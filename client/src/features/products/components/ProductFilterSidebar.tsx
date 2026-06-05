import React, { useState } from 'react';

const COLOR_PALETTE = [
  { name: 'Red', bg: 'bg-[#FF0000]' },
  { name: 'Maroon', bg: 'bg-[#800000]' },
  { name: 'Pink', bg: 'bg-[#FFC0CB]' },
  { name: 'Peach', bg: 'bg-[#FFDAB9]' },
  { name: 'Orange', bg: 'bg-[#FFA500]' },
  { name: 'Mustard', bg: 'bg-[#FFDB58]' },
  { name: 'Yellow', bg: 'bg-[#FFFF00]' },
  { name: 'Gold', bg: 'bg-[#D4AF37]' },
  { name: 'Beige', bg: 'bg-[#F5F5DC]' },
  { name: 'Cream', bg: 'bg-[#FFFDD0]' },
  { name: 'Off White', bg: 'bg-[#FAF9F6]' },
  { name: 'White', bg: 'bg-[#FFFFFF]' },
  { name: 'Black', bg: 'bg-[#000000]' },
  { name: 'Grey', bg: 'bg-[#808080]' },
  { name: 'Silver', bg: 'bg-[#C0C0C0]' },
  { name: 'Brown', bg: 'bg-[#8B4513]' },
  { name: 'Green', bg: 'bg-[#008000]' },
  { name: 'Olive Green', bg: 'bg-[#808000]' },
  { name: 'Mehendi Green', bg: 'bg-[#A0A53A]' },
  { name: 'Mint Green', bg: 'bg-[#98FF98]' },
  { name: 'Sea Green', bg: 'bg-[#2E8B57]' },
  { name: 'Bottle Green', bg: 'bg-[#006A4E]' },
  { name: 'Emerald Green', bg: 'bg-[#50C878]' },
  { name: 'Blue', bg: 'bg-[#0000FF]' },
  { name: 'Navy Blue', bg: 'bg-[#000080]' },
  { name: 'Royal Blue', bg: 'bg-[#4169E1]' },
  { name: 'Sky Blue', bg: 'bg-[#87CEEB]' },
  { name: 'Turquoise Blue', bg: 'bg-[#00CED1]' },
  { name: 'Teal Blue', bg: 'bg-[#008080]' },
  { name: 'Purple', bg: 'bg-[#800080]' },
  { name: 'Lavender', bg: 'bg-[#E6E6FA]' },
  { name: 'Violet', bg: 'bg-[#EE82EE]' },
  { name: 'Magenta', bg: 'bg-[#FF00FF]' },
  { name: 'Wine', bg: 'bg-[#722F37]' },
  { name: 'Rust', bg: 'bg-[#B7410E]' },
  { name: 'Coral', bg: 'bg-[#FF7F50]' },
  { name: 'Multicolor', bg: 'bg-gradient-to-tr from-red-500 via-green-500 to-blue-500' }
];

const WEAVE_TYPES = [
  "Pure Tussar Silk Weave",
  "Ghicha Silk Weave",
  "Matka Silk Weave",
  "Dupion Silk Weave",
  "Cotton-Silk Bhagalpuri Weave",
  "Zari Bhagalpuri Weave"
];

interface ProductFilterSidebarProps {
  filters: {
    weaveType: string[];
    color: string[];
    occasion: string[];
  };
  onWeaveChange: (weave: string) => void;
  onColorChange: (color: string) => void;
  onOccasionChange: (occasion: string) => void;
}

const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  filters,
  onWeaveChange,
  onColorChange,
  onOccasionChange
}) => {
  const [showAllWeave, setShowAllWeave] = useState(false);
  const [showAllColor, setShowAllColor] = useState(false);

  return (
    <aside className="w-full lg:max-w-[280px] lg:w-[280px] flex-shrink-0 pr-8 hidden md:block">
      <div className="sticky top-32">
        <h2 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/50 pb-2 mb-6">Filters</h2>
        
        {/* Weave Type */}
        <div className="mb-8">
          <h3 className="font-body-lg text-body-lg text-on-surface mb-4">Weave Type</h3>
          <ul className="space-y-3">
            {(showAllWeave ? WEAVE_TYPES : WEAVE_TYPES.slice(0, 3)).map((weave) => (
              <li key={weave} className="flex items-center">
                <input 
                  checked={filters.weaveType.includes(weave)} 
                  onChange={() => onWeaveChange(weave)} 
                  className="custom-checkbox w-4 h-4 text-primary bg-surface border-outline rounded-sm focus:ring-secondary focus:ring-offset-surface" 
                  id={`weave-${weave.replace(/\s+/g, '-').toLowerCase()}`} 
                  type="checkbox" 
                />
                <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor={`weave-${weave.replace(/\s+/g, '-').toLowerCase()}`}>
                  {weave}
                </label>
              </li>
            ))}
          </ul>
          {WEAVE_TYPES.length > 3 && (
            <button 
              onClick={() => setShowAllWeave(!showAllWeave)} 
              className="mt-4 flex items-center text-sm font-label-caps text-primary hover:text-secondary transition-colors cursor-pointer"
            >
              {showAllWeave ? 'Show Less' : `+${WEAVE_TYPES.length - 3} More`}
              <span className="material-symbols-outlined text-sm ml-1">{showAllWeave ? 'expand_less' : 'expand_more'}</span>
            </button>
          )}
        </div>

        {/* Color */}
        <div className="mb-8">
          <h3 className="font-body-lg text-body-lg text-on-surface mb-4">Color</h3>
          <div className="flex flex-wrap gap-3">
            {(showAllColor ? COLOR_PALETTE : COLOR_PALETTE.slice(0, 15)).map((color) => (
              <div key={color.name} className="relative group flex items-center justify-center">
                <input 
                  className="peer sr-only" 
                  id={`color-${color.name.toLowerCase().replace(/\s+/g, '-')}`} 
                  type="checkbox" 
                  checked={filters.color.includes(color.name)}
                  onChange={() => onColorChange(color.name)}
                />
                <label 
                  htmlFor={`color-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`w-7 h-7 rounded-full cursor-pointer border border-outline-variant/30 ${color.bg} peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-primary peer-checked:ring-offset-surface transition-all`}
                  aria-label={color.name}
                ></label>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-[10px] font-label-caps px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10 border border-outline-variant/20 shadow-sm">
                  {color.name}
                </div>
              </div>
            ))}
          </div>
          {COLOR_PALETTE.length > 15 && (
            <button 
              onClick={() => setShowAllColor(!showAllColor)} 
              className="mt-4 flex items-center text-sm font-label-caps text-primary hover:text-secondary transition-colors cursor-pointer"
            >
              {showAllColor ? 'Show Less' : `+${COLOR_PALETTE.length - 15} More`}
              <span className="material-symbols-outlined text-sm ml-1">{showAllColor ? 'expand_less' : 'expand_more'}</span>
            </button>
          )}
        </div>

        {/* Occasion */}
        <div className="mb-8">
          <h3 className="font-body-lg text-body-lg text-on-surface mb-4">Occasion</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <input checked={filters.occasion.includes("Wedding")} onChange={() => onOccasionChange("Wedding")} className="custom-radio w-4 h-4 appearance-none border border-outline rounded-full cursor-pointer focus:outline-none" id="occ-wedding" name="occasion" type="radio" />
              <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="occ-wedding">Wedding</label>
            </li>
            <li className="flex items-center">
              <input checked={filters.occasion.includes("Festive")} onChange={() => onOccasionChange("Festive")} className="custom-radio w-4 h-4 appearance-none border border-outline rounded-full cursor-pointer focus:outline-none" id="occ-festive" name="occasion" type="radio" />
              <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="occ-festive">Festive</label>
            </li>
            <li className="flex items-center">
              <input checked={filters.occasion.includes("Casual")} onChange={() => onOccasionChange("Casual")} className="custom-radio w-4 h-4 appearance-none border border-outline rounded-full cursor-pointer focus:outline-none" id="occ-casual" name="occasion" type="radio" />
              <label className="ml-3 font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="occ-casual">Casual</label>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default ProductFilterSidebar;
