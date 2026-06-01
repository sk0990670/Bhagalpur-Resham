# Bhagalpur Resham

A premium, full-stack luxury e-commerce platform dedicated to the rich heritage of Bhagalpuri Silk. 

This repository houses a high-end web application built to showcase and sell handcrafted Tussar silk sarees. It is designed with a heavy emphasis on cinematic user experience (UX), bespoke UI elements, and a deep appreciation for the artisans of Bihar, India.

## ✨ Key Features

- **Cinematic Interactions:** Features a buttery-smooth video preloader, delayed hover-to-video transitions on hero images, and subtle micro-animations that elevate the luxury feel.
- **Bespoke Design System:** A meticulously crafted aesthetic featuring a color palette of Heritage Gold (`#D4AF37`) and Crimson Red (`#610000`), paired with elegant typography (Playfair Display and Montserrat).
- **Custom UI Components:** From bespoke scrollbars to dynamic FAQ sidebars powered by `IntersectionObserver`, every element avoids generic defaults.
- **Rich Content Pages:** Deep storytelling through dedicated "Heritage" and "Artisan Story" pages, highlighting the legacy of the Silk City.
- **Robust E-Commerce Front-End:** Comprehensive user journeys including Product Search (with a 3x3 dynamic grid), Collections, Checkout flows, and detailed Policy pages.

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS v4, React Router DOM
- **Backend Infrastructure (Planned/MERN):** Node.js, Express, MongoDB
- **Styling:** Vanilla CSS layered with Tailwind utility classes for absolute control over ambient shadows, glassmorphism, and custom scrollbars.
- **Icons & Fonts:** Google Material Symbols, Google Fonts.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd bhagalpur-resham
   ```

2. **Navigate to the client directory & Install Dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:5173`.

## 📁 Project Structure (Client)

```
client/
├── public/
│   └── assets/           # High-quality images, preloader videos, and SVGs
├── src/
│   ├── components/       # Reusable UI components (Layout, Preloader, etc.)
│   ├── pages/            # Page-level components (Home, Heritage, FAQ, Search, etc.)
│   ├── App.jsx           # Main application routing
│   └── index.css         # Global styles, bespoke scrollbars, and Tailwind configuration
├── tailwind.config.js    # Design system tokens (colors, typography)
└── package.json
```

## 🎨 Design Philosophy

"Bhagalpur Resham" is not just an online store; it is a digital gallery. The design explicitly avoids standard component libraries in favor of hand-crafted CSS rules to ensure a 100% unique, premium feel. Features like `ambient-shadow` and `delay-[5000ms]` video reveals are intentionally programmed to enforce a slow, luxurious browsing pace.

---
*Built to honor the master weavers of Bhagalpur.*
