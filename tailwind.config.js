// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

module.exports = {
	darkMode: "media",
	content: ["./src/**/*.{ts,tsx,js,jsx,html}"],
	theme: {
		extend: {
			colors,
		},
	},
	plugins: [],
};
