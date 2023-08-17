// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { runCommand } from "@ordo-pink/binutil/mod.ts"
import { getc } from "@ordo-pink/getc/mod.ts"

const { STATIC_HOST, WORKSPACE_PORT, ID_HOST, WEB_HOST, DATA_HOST } = getc([
	"STATIC_HOST",
	"WORKSPACE_PORT",
	"ID_HOST",
	"WEB_HOST",
	"DATA_HOST",
])

await runCommand("npm", ["run", "dev"], "./srv/workspace", {
	PORT: WORKSPACE_PORT,
	REACT_APP_STATIC_HOST: STATIC_HOST,
	REACT_APP_ID_HOST: ID_HOST,
	REACT_APP_WEB_HOST: WEB_HOST,
	REACT_APP_DATA_HOST: DATA_HOST,
}).orElse(console.error)
