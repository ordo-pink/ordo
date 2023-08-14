// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { runCommand } from "#lib/binutil/mod.ts"
import { cyan, green } from "#std/fmt/colors.ts"

const main = async () => {
	const encoder = new TextEncoder()

	Deno.stdout.write(encoder.encode(`  ${cyan("→")} Installing dependencies...`))
	await runCommand("npm", ["i"], "./srv/workspace").orElse(console.error)
	Deno.stdout.write(encoder.encode(` ${green("✓")}\n`))
}

await main()
