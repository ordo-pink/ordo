// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { getDenoPath, runCommand, runDenoCommand } from "#lib/binutil/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { getc } from "#lib/getc/mod.ts"

const { STATIC_ROOT } = getc(["STATIC_ROOT"])

await Oath.all([
	runCommand("cp", ["-a", `./srv/web/assets/.`, STATIC_ROOT]),
	runDenoCommand(getDenoPath(), [
		"run",
		"--allow-net",
		"--allow-env",
		"--allow-read",
		"--allow-write",
		"--allow-run",
		"--unstable",
		"--watch=srv/web/components,srv/web/islands,srv/web/routes/,var/srv/web/",
		"srv/web/dev.ts",
	]),
	runCommand("opt/tailwind", [
		"-i",
		"./lib/css/main.css",
		"-o",
		`${STATIC_ROOT}/main.css`,
		"--watch",
		"-c",
		"./tailwind.config.cjs",
	]),
]).orElse(Deno.stdout.write)