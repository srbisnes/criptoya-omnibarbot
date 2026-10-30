/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        arb: {
          green: '#00ff9d',
          dark: '#0a0a0f',
          card: '#12121a',
        }
      }
    },
  },
  plugins: [],
};
