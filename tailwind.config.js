/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D2D2D",
        secondary: "#F8F4E3",
        "accent-gold": "#D4AF37",
        "accent-blue": "#2B3A67",
      },
      fontFamily: {
        heading: ["Cormorant Garamond", "serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "add-to-cart": "addToCart 0.3s forwards",
        "checkmark-appear": "checkmarkAppear 0.3s forwards",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        addToCart: {
          "0%": { transform: "translateY(0)", opacity: 1 },
          "100%": { transform: "translateY(30px)", opacity: 0 },
        },
        checkmarkAppear: {
          "0%": { transform: "translate(-50%, -50%) scale(0)", opacity: 0 },
          "100%": { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        },
      },
      boxShadow: {
        "product-hover": "0 10px 25px rgba(0, 0, 0, 0.1)",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
