/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FAF3E1',       // Light Cream (Background)
          card: '#F5E7C6',     // Sand (Cards/Secondary)
          accent: '#FF6D1F',   // Orange (Buttons/Highlights)
          dark: '#222222',     // Black (Text)
          // Dark Mode Palette
          'dark-bg': '#211832', // Deep Purple-Black
          'dark-card': '#2a1f3d', // Slightly lighter version for cards
          'dark-text': '#e5e5e5',
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Inter', 'sans-serif'], // Added sans for UI elements
      }
    },
  },
  plugins: [],
}