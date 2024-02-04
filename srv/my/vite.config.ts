import { defineConfig } from "vite"
import { resolve } from "path"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: "../../var/out/my",
	},
	server: {
		port: Number(process.env.ORDO_WORKSPACE_PORT),
	},
	resolve: {
		alias: {
			"@ordo-pink": resolve(__dirname, "../../lib"),
		},
	},
	clearScreen: false,
})
