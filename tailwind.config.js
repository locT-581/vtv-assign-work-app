/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx', './src/**/*.ts', './src/**/*.tsx'],
  theme: {
    colors: {
      'vtv-red': '#D82428',
      'vtv-blue': '#2D3581',
      'vtv-green': '#0F9548',
      white: '#FFFFFF',
      red: '#f54242',
      black: '#000000',
    },

    screens: {
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },

    extend: {},
  },
  plugins: [],
};
