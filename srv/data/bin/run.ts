// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { getDenoPath, runDenoCommand } from "#lib/binutil/mod.ts"

await runDenoCommand(getDenoPath(), [
	"run",
	"--allow-net",
	"--allow-env",
	"--allow-read",
	"--allow-write",
	"--allow-run",
	"--unstable",
	"--watch",
	"srv/data/mod.ts",
]).toPromise()
