/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/tw-elements/dist/js/**/*.js",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
    },
  },
  darkMode: "class",
  plugins: [require('@tailwindcss/aspect-ratio'),
  require('flowbite/plugin'),
  require("tw-elements/dist/plugin.cjs"),
  require('@tailwindcss/forms'),
  require('@tailwindcss/aspect-ratio')]
}