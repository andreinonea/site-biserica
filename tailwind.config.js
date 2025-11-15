/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'font-[Byzantin]',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
      },
    },
  },

  plugins: [],
};
