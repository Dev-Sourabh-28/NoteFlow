/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ THIS LINE FIXES IT
  ],
  theme: {
    extend: {
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(28px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}