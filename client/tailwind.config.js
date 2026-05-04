/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ THIS LINE FIXES IT
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}