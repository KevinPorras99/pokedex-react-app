/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'game': ['"Press Start 2P"', 'cursive'],
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|from|to|text)-(red|blue|yellow|green|purple|gray|orange|cyan|pink|lime|pink)-(300|400|500|600|700|800)/,
    },
    {
      pattern: /bg-gradient-to-r/,
    }
  ]
}