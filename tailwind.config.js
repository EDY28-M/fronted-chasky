/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#8B0000',
        'primary-light': '#A52A2A',
        'primary-dark': '#600000',
        surface: '#FFFFFF',
        'surface-alt': '#F9FAFB',
        'text-main': '#1F2937',
        'text-muted': '#6B7280',
        'border-subtle': '#E5E7EB',
        'background-light': '#F5F5F7',
        'background-dark': '#1A1A1A',
        'shoji-primary': '#B01E1E',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        shoji: '0px',
      },
    },
  },
  plugins: [],
}
