// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { runAsyncCommand0 } from "@ordo-pink/binutil"
import { getc } from "@ordo-pink/getc"

const { STATIC_HOST, WEB_PORT, ID_HOST, WORKSPACE_HOST, DATA_HOST, WEB_HOST, SUBS_HOST } = getc([
	"WEB_PORT",
	"WEB_HOST",
	"STATIC_HOST",
	"ID_HOST",
	"WORKSPACE_HOST",
	"DATA_HOST",
	"SUBS_HOST",
])

runAsyncCommand0("npm run dev", {
	cwd: "./srv/website",
	stdin: "pipe",
	stdout: "pipe",
	env: {
		...process.env,
		PORT: WEB_PORT,
		NEXT_PUBLIC_STATIC_HOST: STATIC_HOST,
		NEXT_PUBLIC_ID_HOST: ID_HOST,
		NEXT_PUBLIC_WORKSPACE_HOST: WORKSPACE_HOST,
		NEXT_PUBLIC_DATA_HOST: DATA_HOST,
		NEXT_PUBLIC_WEB_HOST: WEB_HOST,
		FORCE_COLOR: "1",
	},
}).orElse(console.error)
