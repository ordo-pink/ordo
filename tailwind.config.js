/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx,html,css}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
}
