// eslint-disable-next-line @typescript-eslint/no-var-requires
const tailwindColors = require("tailwindcss/colors");

const colors = {
	inherit: tailwindColors.inherit,
	current: tailwindColors.current,
	transparent: tailwindColors.transparent,
	black: tailwindColors.black,
	white: tailwindColors.white,
	slate: tailwindColors.slate,
	gray: tailwindColors.gray,
	zinc: tailwindColors.zinc,
	neutral: tailwindColors.neutral,
	stone: tailwindColors.stone,
	red: tailwindColors.red,
	orange: tailwindColors.orange,
	amber: tailwindColors.amber,
	yellow: tailwindColors.yellow,
	lime: tailwindColors.lime,
	green: tailwindColors.green,
	emerald: tailwindColors.emerald,
	teal: tailwindColors.teal,
	cyan: tailwindColors.cyan,
	sky: tailwindColors.sky,
	blue: tailwindColors.blue,
	indigo: tailwindColors.indigo,
	violet: tailwindColors.violet,
	purple: tailwindColors.purple,
	fuchsia: tailwindColors.fuchsia,
	pink: tailwindColors.pink,
	rose: tailwindColors.rose,
};

module.exports = {
	darkMode: "media",
	content: ["./src/**/*.{ts,tsx,js,jsx,html}"],
	safelist: [{ pattern: /.*/ }],
	theme: {
		extend: {
			colors,
		},
	},
	plugins: [],
};
