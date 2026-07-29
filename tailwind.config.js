/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9ff",
          100: "#d9f1ff",
          200: "#bce7ff",
          300: "#8ed8ff",
          400: "#59c0ff",
          500: "#33a1ff",
          600: "#1a7ff5",
          700: "#1368e1",
          800: "#1654b6",
          900: "#18498f",
          950: "#132d57",
        },
        surface: {
          DEFAULT: "#0a0e17",
          raised: "#111827",
          card: "rgba(17, 24, 39, 0.72)",
        },
      },
      fontFamily: {
        sans: ["\"Plus Jakarta Sans\"", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(51, 161, 255, 0.45)",
        card: "0 8px 32px rgba(0, 0, 0, 0.35)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
