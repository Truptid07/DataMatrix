/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0066FF",
        secondary: "#64748B",
        dark: "#0F172A",
        light: "#F8FAFC",
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
        'roboto': ['Roboto Flex', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'gendy': ['Gendy', 'sans-serif'],
      },
    },
  },
  plugins: [],
}