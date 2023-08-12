// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { runCommand } from "#lib/binutil/mod.ts"

await runCommand("bun", ["--watch", "run", "dev.tsx"], "./srv/app").orElse(console.error)
