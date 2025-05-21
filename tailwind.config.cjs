/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'stripe': {
          text: '#1A1F36',
          'text-secondary': '#4F566B',
          'text-subtle': '#697386',
          primary: '#635BFF',
          'primary-dark': '#5851DF',
          surface: '#FFFFFF',
          'surface-dark': '#F7FAFC',
          border: '#E3E8EE',
          'border-dark': '#C1C9D2',
        },
      },
      boxShadow: {
        'stripe-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'stripe-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
        'stripe-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
} 