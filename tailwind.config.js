/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        "dark-teal": "#003135",
        "pine-green": "#024950",
        "burnt-sienna": "#964734",
        "bright-cyan": "#0FA4AF",
        "powder-blue": "#AFDDE5",
      },
    },
  },
  plugins: [],
};
