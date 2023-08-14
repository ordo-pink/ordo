// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import "#std/dotenv/load.ts"

import { Oath } from "#lib/oath/mod.ts"
import { createDirectoryIfNotExists } from "#lib/fs/mod.ts"
import { getc } from "#lib/getc/mod.ts"
import { cyan, green } from "#std/fmt/colors.ts"

const { STATIC_ROOT } = getc(["STATIC_ROOT"])

const main = async () => {
	const encoder = new TextEncoder()

	Deno.stdout.write(encoder.encode(`  ${cyan("→")} Creating static directory...`))
	await Oath.fromNullable(STATIC_ROOT).chain(createDirectoryIfNotExists).orElse(console.error)
	Deno.stdout.write(encoder.encode(` ${green("✓")}\n`))
}

await main()
