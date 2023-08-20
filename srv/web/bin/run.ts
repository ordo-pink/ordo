// // SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// // SPDX-License-Identifier: MPL-2.0

// // This Source Code Form is subject to the terms of the Mozilla Public
// // License, v. 2.0. If a copy of the MPL was not distributed with this
// // file, You can obtain one at http://mozilla.org/MPL/2.0/.

// import { getDenoPath, runCommand, runDenoCommand } from "@ordo-pink/binutil/mod.ts"
// import { Oath } from "@ordo-pink/oath/mod.ts"
// import { getc } from "@ordo-pink/getc/mod.ts"

// const { STATIC_ROOT } = getc(["STATIC_ROOT"])

// await Oath.all([
// 	runCommand("cp", ["-a", `./srv/web/assets/.`, STATIC_ROOT]),
// 	runDenoCommand(getDenoPath(), [
// 		"run",
// 		"--allow-net",
// 		"--allow-env",
// 		"--allow-read",
// 		"--allow-write",
// 		"--allow-run",
// 		"--unstable",
// 		"--watch=srv/web/components,srv/web/islands,srv/web/routes/,var/srv/web/",
// 		"srv/web/dev.ts",
// 	]),
// 	runCommand("opt/tailwind", [
// 		"-i",
// 		"./lib/css/main.css",
// 		"-o",
// 		`${STATIC_ROOT}/main.css`,
// 		"--watch",
// 		"-c",
// 		"./tailwind.config.cjs",
// 	]),
// ]).orElse(Deno.stdout.write)
