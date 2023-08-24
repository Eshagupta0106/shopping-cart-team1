/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      screens: {
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  darkMode: "class",
  plugins: [require('@tailwindcss/aspect-ratio'),
  require("tw-elements/dist/plugin.cjs"),
  require('@tailwindcss/forms'),
  require('@tailwindcss/aspect-ratio')]
}