// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// // SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// // SPDX-License-Identifier: MIT

// import { runCommand0 } from "@ordo-pink/binutil"
// import { getc } from "@ordo-pink/getc"

// const { STATIC_HOST, WORKSPACE_PORT, ID_HOST, WEB_HOST, DATA_HOST } = getc([
// 	"WORKSPACE_PORT",
// 	"STATIC_HOST",
// 	"ID_HOST",
// 	"WEB_HOST",
// 	"DATA_HOST",
// ])

// runCommand0("npm run dev", {
// 	cwd: "./srv/workspace",
// 	stdin: "inherit",
// 	stdout: "inherit",
// 	env: {
// 		PORT: WORKSPACE_PORT,
// 		REACT_APP_STATIC_HOST: STATIC_HOST,
// 		REACT_APP_ID_HOST: ID_HOST,
// 		REACT_APP_WEB_HOST: WEB_HOST,
// 		REACT_APP_DATA_HOST: DATA_HOST,
// 	},
// }).orElse(console.error)
