/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      apercu: ["Apercu", "sans-serif"],
    },
    extend: {},
    colors: {
      'default': '#ffffff',
      'black': '#000000',
      'white': '#ffffff',
      'light-green': '#A1F651',
      'green': '#234801',
      'light-red': '#F46363',
      'red': '#8F0404',
      'primary': '#38023B',
      'secondary': '#FFDF00',
    },
    screens: {
      'xs': '574px',
      // => @media (min-width: 574px) { ... }
      
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  plugins: [],
}
