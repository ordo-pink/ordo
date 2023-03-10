/// <reference types="vitest" />
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import viteTsConfigPaths from "vite-tsconfig-paths"

const frontendPort = process.env.VITE_FRONTEND_PORT

export default defineConfig({
  cacheDir: "../../node_modules/.vite/web",

  preview: {
    port: Number(frontendPort),
    host: "localhost",
  },

  server: {
    port: Number(frontendPort),
    host: "localhost",
  },

  plugins: [
    react(),
    viteTsConfigPaths({
      root: "../../",
    }),
  ],

  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  test: {
    globals: true,
    setupFiles: "setup-tests.ts",
    cache: {
      dir: "../../node_modules/.vitest",
    },
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
})
