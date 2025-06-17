/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'quicksand': ['Quicksand', 'sans-serif'],
        'game': ['Quicksand', 'sans-serif'], 
      },
      fontSize: {
        'base': '1.25rem',      // 20px
        'lg': '1.5rem',         // 24px
        'xl': '1.875rem',       // 30px
        '2xl': '2.25rem',       // 36px
        '3xl': '2.75rem',       // 44px
        '4xl': '3.25rem',       // 52px
      },
      colors: {
        'wine': {
          600: '#722F37',
          700: '#5E262C',
        }
      },
      animation: {
        'gradient-slow': 'gradient 15s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': '0% 50%'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': '100% 50%'
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}