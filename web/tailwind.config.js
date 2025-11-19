/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // 👈 NECESARIO para modo oscuro
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css,scss}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
