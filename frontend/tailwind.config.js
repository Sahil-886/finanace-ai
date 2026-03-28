/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#002753",
        "primary-dark": "#003d7a",
        background: "#f7f9fb",
        section: "#f2f4f6",
        surface: "#ffffff",
        "text-primary": "#0f172a",
        "text-secondary": "#334155",
        success: "#0f766e",
        accent: "#16a34a",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #002753 0%, #003d7a 100%)",
      },
      boxShadow: {
        "sm": "0 4px 24px -4px rgba(15, 23, 42, 0.06)",
        "md": "0 12px 32px -4px rgba(15, 23, 42, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
