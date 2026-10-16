/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Outfit", "system-ui", "sans-serif"],
      serif: ["Fraunces", "Georgia", "serif"],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      ivory: '#FAF7F2',
      sand: '#F2EDE4',
      line: '#E4DCCF',
      ink: '#241626',
      muted: '#6E6170',
      plum: {
        50: '#F6EFF6',
        100: '#EADCEB',
        DEFAULT: '#38023B',
        600: '#4B1450',
        700: '#2A0130',
      },
      gold: {
        soft: '#F3E9D2',
        DEFAULT: '#B08A3E',
        dark: '#8C6C2C',
      },
      success: { soft: '#E7F0E6', DEFAULT: '#2F6B3A' },
      danger: { soft: '#F7E5E2', DEFAULT: '#A3302A' },
    },
    extend: {
      boxShadow: {
        card: '0 1px 2px rgba(56, 2, 59, 0.04), 0 8px 24px -12px rgba(56, 2, 59, 0.12)',
        lift: '0 2px 4px rgba(56, 2, 59, 0.06), 0 24px 48px -20px rgba(56, 2, 59, 0.28)',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
      },
    },
    screens: {
      'xs': '574px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  },
  plugins: [],
}
