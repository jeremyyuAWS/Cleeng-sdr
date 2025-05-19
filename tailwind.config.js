/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cleeng brand colors
        'cleeng-blue': {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c7ff',
          300: '#66abff', 
          400: '#338fff',
          500: '#0073e6',  // Primary blue
          600: '#005cb8',
          700: '#00448a',
          800: '#002d5c',
          900: '#00172e',
        },
        'cleeng-green': {
          50: '#e6fff9',
          100: '#ccfff3',
          200: '#99ffe7',
          300: '#66ffdb',
          400: '#33ffcf',
          500: '#00e6c3',  // Primary green
          600: '#00b89c',
          700: '#008a75',
          800: '#005c4e',
          900: '#002e27',
        },
        'cleeng-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      }
    },
  },
  plugins: [],
};