/** @type {import('tailwindcss').Config} */
export default {
	content: ["../../lib/**/*.{css,ts,tsx}", "./index.html", "./src/**/*.{css,ts,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/forms")],
}
