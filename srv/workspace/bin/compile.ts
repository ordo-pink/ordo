// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { die, runCommand0 } from "@ordo-pink/binutil"
import { getc } from "@ordo-pink/getc"

const { ORDO_STATIC_HOST, ORDO_WORKSPACE_PORT, ORDO_ID_HOST, ORDO_WEB_HOST, ORDO_DT_HOST } = getc([
	"ORDO_WORKSPACE_PORT",
	"ORDO_STATIC_HOST",
	"ORDO_ID_HOST",
	"ORDO_WEB_HOST",
	"ORDO_DT_HOST",
])

runCommand0("npm run build", {
	cwd: "./srv/workspace",
	stdin: "inherit",
	stderr: "inherit",
	env: {
		...process.env,
		BUILD_PATH: "../../var/out/workspace",
		PORT: ORDO_WORKSPACE_PORT,
		REACT_APP_ORDO_STATIC_HOST: ORDO_STATIC_HOST,
		REACT_APP_ORDO_ID_HOST: ORDO_ID_HOST,
		REACT_APP_ORDO_WEBSITE_HOST: ORDO_WEB_HOST,
		REACT_APP_ORDO_DT_HOST: ORDO_DT_HOST,
	},
}).orElse(die())
