/// <reference types="vitest" />
import { join } from "path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import viteTsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  cacheDir: "../../node_modules/.vite/backend-authorisation-stub",

  plugins: [
    dts({
      entryRoot: "src",
      tsConfigFilePath: join(__dirname, "tsconfig.lib.json"),
      skipDiagnostics: true,
    }),

    viteTsConfigPaths({
      root: "../../",
    }),
  ],

  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      entry: "src/index.ts",
      name: "backend-authorisation-stub",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [],
    },
  },

  test: {
    globals: true,
    cache: {
      dir: "../../node_modules/.vitest",
    },
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
})
