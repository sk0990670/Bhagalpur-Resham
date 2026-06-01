/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
              "on-secondary-fixed-variant": "#574500",
              "on-surface": "#1e1c12",
              "on-tertiary-fixed": "#40000b",
              "secondary": "#735c00",
              "tertiary-fixed": "#ffdada",
              "primary-fixed": "#ffdad4",
              "primary": "#610000",
              "on-secondary": "#ffffff",
              "surface-container-highest": "#e9e2d2",
              "outline": "#8e706b",
              "secondary-container": "#fed65b",
              "on-primary-fixed-variant": "#920703",
              "tertiary-container": "#870724",
              "surface-dim": "#e0dac9",
              "outline-variant": "#e3beb8",
              "on-tertiary": "#ffffff",
              "surface-container-lowest": "#ffffff",
              "on-primary-container": "#ff907f",
              "primary-fixed-dim": "#ffb4a8",
              "on-error": "#ffffff",
              "surface-bright": "#fff9ec",
              "tertiary-fixed-dim": "#ffb3b5",
              "on-surface-variant": "#5a403c",
              "inverse-primary": "#ffb4a8",
              "surface": "#fff9ec",
              "surface-variant": "#e9e2d2",
              "on-secondary-container": "#745c00",
              "on-error-container": "#93000a",
              "on-background": "#1e1c12",
              "surface-tint": "#b52619",
              "inverse-surface": "#333025",
              "inverse-on-surface": "#f7f0df",
              "secondary-fixed-dim": "#e9c349",
              "background": "#fff9ec",
              "surface-container": "#f4eddd",
              "secondary-fixed": "#ffe088",
              "surface-container-high": "#eee8d7",
              "on-secondary-fixed": "#241a00",
              "on-tertiary-container": "#ff8e94",
              "on-tertiary-fixed-variant": "#8e0f28",
              "tertiary": "#600015",
              "on-primary-fixed": "#410000",
              "surface-container-low": "#faf3e2",
              "error": "#ba1a1a",
              "error-container": "#ffdad6",
              "primary-container": "#8b0000",
              "on-primary": "#ffffff"
      },
      "borderRadius": {
              "DEFAULT": "0.125rem",
              "lg": "0.25rem",
              "xl": "0.5rem",
              "full": "0.75rem"
      },
      "spacing": {
              "margin-desktop": "64px",
              "unit": "8px",
              "container-max": "1280px",
              "gutter": "24px",
              "margin-mobile": "20px",
              "section-gap": "120px"
      },
      "fontFamily": {
              "display-lg-mobile": ["Playfair Display"],
              "story-serif": ["Playfair Display"],
              "label-caps": ["Montserrat"],
              "display-lg": ["Playfair Display"],
              "headline-md": ["Playfair Display"],
              "headline-xl": ["Playfair Display"],
              "body-lg": ["Montserrat"],
              "body-md": ["Montserrat"]
      },
      "fontSize": {
              "display-lg-mobile": [
                      "40px",
                      {
                              "lineHeight": "48px",
                              "letterSpacing": "-0.01em",
                              "fontWeight": "700"
                      }
              ],
              "story-serif": [
                      "20px",
                      {
                              "lineHeight": "32px",
                              "fontWeight": "400"
                      }
              ],
              "label-caps": [
                      "12px",
                      {
                              "lineHeight": "16px",
                              "letterSpacing": "0.15em",
                              "fontWeight": "600"
                      }
              ],
              "display-lg": [
                      "64px",
                      {
                              "lineHeight": "72px",
                              "letterSpacing": "-0.02em",
                              "fontWeight": "700"
                      }
              ],
              "headline-md": [
                      "32px",
                      {
                              "lineHeight": "40px",
                              "fontWeight": "600"
                      }
              ],
              "headline-xl": [
                      "48px",
                      {
                              "lineHeight": "56px",
                              "fontWeight": "600"
                      }
              ],
              "body-lg": [
                      "18px",
                      {
                              "lineHeight": "28px",
                              "fontWeight": "400"
                      }
              ],
              "body-md": [
                      "16px",
                      {
                              "lineHeight": "24px",
                              "fontWeight": "400"
                      }
              ]
      }
    },
  },
  plugins: [],
}
