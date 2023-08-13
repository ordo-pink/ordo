// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { cyan, green } from "#std/fmt/colors.ts"
import { getc } from "#lib/getc/mod.ts"
import { createDirectoryIfNotExists } from "#lib/fs/mod.ts"

const { EXTS_EXTENSIONS_ROOT } = getc(["EXTS_EXTENSIONS_ROOT"])

const main = async () => {
	const encoder = new TextEncoder()

	Deno.stdout.write(encoder.encode(`  ${cyan("→")} Creating exts directories...`))
	await createDirectoryIfNotExists(EXTS_EXTENSIONS_ROOT).toPromise()
	Deno.stdout.write(encoder.encode(` ${green("✓")}\n`))
}

await main()
