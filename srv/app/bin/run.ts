// PORT=3004 bun --watch run dev.tsx
// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { runCommand } from "#lib/binutil/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { getc } from "#lib/getc/mod.ts"

const { WEB_STATIC_ROOT, APP_PORT } = getc(["WEB_STATIC_ROOT", "APP_PORT"])

await Oath.all([
	runCommand("cp", ["-r", `srv/app/public/`, WEB_STATIC_ROOT]),
	runCommand("bun", ["--watch", "run", "dev.tsx"], "./srv/app", { PORT: APP_PORT }),
]).orElse(Deno.stdout.write)
