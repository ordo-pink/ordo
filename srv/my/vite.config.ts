// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { resolve } from "path"

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths()],

	define: {
		"process.env.IS_PREACT": JSON.stringify("false"),
	},

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
