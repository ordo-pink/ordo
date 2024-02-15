import { resolve } from "path"

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths()],

	build: {
		outDir: "../../var/out/my",
		cssMinify: true,
		minify: true,
	},
	server: {
		port: Number(process.env.ORDO_WORKSPACE_PORT),
	},
	resolve: {
		alias: {
			"@ordo-pink": resolve(__dirname, "../../lib"),
			react: resolve(__dirname, "../../node_modules/react"),
			"@types/react": resolve(__dirname, "../../node_modules/@types/react"),
			"react-dom": resolve(__dirname, "../../node_modules/react-dom"),
		},
	},
	clearScreen: false,
})
