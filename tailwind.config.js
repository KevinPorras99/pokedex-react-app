/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'game': ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'base': '1.125rem',     // 18px
        'lg': '1.25rem',        // 20px
        'xl': '1.5rem',         // 24px
        '2xl': '1.875rem',      // 30px
        '3xl': '2.25rem',       // 36px
        '4xl': '3rem',          // 48px
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