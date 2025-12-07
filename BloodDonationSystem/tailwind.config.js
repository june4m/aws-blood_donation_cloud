/** @type {import('tailwindcss').Config} */
export default {
  content: ["./App.jsx", "./main.jsx", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1272px",
      "2xl": "1272px",
    },
    extend: {
      colors: {
        primary: "#000000",
      },
      fontFamily: {
        beVietnam: ["Be Vietnam Pro", "sans-serif"],
      },
    },
  },
  plugins: [],
};
