module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	ignorePatterns: [".eslintrc.cjs", "*.config.js", "*.config.cjs"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended-type-checked",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
		"plugin:tailwindcss/recommended",
		"prettier",
	],
	overrides: [
		{
			env: { node: true },
			files: [".eslintrc.{js,cjs}"],
			parserOptions: { sourceType: "script" },
		},
		{
			files: ["*.ts", "*.tsx", "*.js"],
			parser: "@typescript-eslint/parser",
		},
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		jsx: true,
		project: ["./tsconfig.json"],
		tsconfigRootDir: __dirname,
	},
	plugins: ["@typescript-eslint", "react", "tailwindcss"],
	rules: {
		indent: "off",
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "never"],
		"sort-imports": ["error", { allowSeparatedGroups: true }],
		"@typescript-eslint/no-namespace": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-argument": "off",
		"@typescript-eslint/no-unsafe-return": "off",
		"@typescript-eslint/no-unsafe-member-access": "off",
		"@typescript-eslint/unbound-method": "off",
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"tailwindcss/no-custom-classname": "off",
	},
}

// /**
//  * @type {import("eslint").ESLint.ConfigData}
//  */
// module.exports = {
// 	root: true,
// 	env: { browser: true, es2020: true, node: true },
// 	extends: [
// 		"plugin:react/jsx-runtime",
// 		"eslint:recommended",
// 		"plugin:@typescript-eslint/recommended-type-checked",
// 		"plugin:react/recommended",
// 		"plugin:react-hooks/recommended",
// 		"prettier",
// 	],
// 	ignorePatterns: ["dist", ".eslintrc.cjs"],
// 	parser: "@typescript-eslint/parser",
// 	// parserOptions: {
// 	// 	ecmaVersion: "latest",
// 	// 	sourceType: "module",
// 	// 	project: ["./tsconfig.json", "./tsconfig.node.json"],
// 	// 	tsconfigRootDir: __dirname,
// 	// },
// 	plugins: ["react-refresh"],
// 	rules: {
// 		"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
// 		"sort-imports": "error",
// 	},
// }
