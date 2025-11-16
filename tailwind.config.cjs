/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gunmetal: "#1f2428",
        "gunmetal-light": "#2b3137",
        neon: "#7bfd01",
        "text-light": "#e5e8ec",
        "text-muted": "#97a0ab",
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
      },
      dropShadow: {
        neon: "0 0 12px rgba(123, 253, 1, 0.45)",
      },
    },
  },
  plugins: [],
};
