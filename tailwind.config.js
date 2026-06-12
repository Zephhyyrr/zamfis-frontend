export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
    "./app.vue", 
    "./error.vue"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#10b981',
        secondary: '#064e3b',
        'font-color': '#2a2a2a',
        white: '#ffffff',
        error: '#FF5656',
        success: '#4BB543',
        warning: '#FFB800',
        shadow: 'rgba(22, 22, 22, 0.1)',
      }
    },
  },
  plugins: [],
}