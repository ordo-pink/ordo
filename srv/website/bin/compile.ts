// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { die, runCommand0 } from "@ordo-pink/binutil"
import { getc } from "@ordo-pink/getc"

const {
	ORDO_STATIC_HOST,
	ORDO_WEB_PORT,
	ORDO_ID_HOST,
	ORDO_WORKSPACE_HOST,
	ORDO_DT_HOST,
	ORDO_WEB_HOST,
} = getc([
	"ORDO_WEB_PORT",
	"ORDO_WEB_HOST",
	"ORDO_STATIC_HOST",
	"ORDO_ID_HOST",
	"ORDO_WORKSPACE_HOST",
	"ORDO_DT_HOST",
	"SUBS_HOST",
])

runCommand0("npm run build --compile", {
	cwd: "./srv/website",
	stdin: "inherit",
	stderr: "inherit",
	env: {
		...process.env,
		PORT: ORDO_WEB_PORT,
		NEXT_PUBLIC_ORDO_STATIC_HOST: ORDO_STATIC_HOST,
		NEXT_PUBLIC_ORDO_ID_HOST: ORDO_ID_HOST,
		NEXT_PUBLIC_ORDO_WORKSPACE_HOST: ORDO_WORKSPACE_HOST,
		NEXT_PUBLIC_ORDO_DT_HOST: ORDO_DT_HOST,
		NEXT_PUBLIC_ORDO_WEB_HOST: ORDO_WEB_HOST,
	},
}).orElse(die())
