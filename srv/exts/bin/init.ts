// // SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// // SPDX-License-Identifier: MIT

// import { cyan, green } from "#std/fmt/colors.ts"
// import { getc } from "@ordo-pink/getc/mod.ts"
// import { createDirectoryIfNotExists } from "@ordo-pink/fs/mod.ts"

// const { STATIC_ROOT } = getc(["STATIC_ROOT"])

// const main = async () => {
// 	const encoder = new TextEncoder()

// 	Deno.stdout.write(encoder.encode(`  ${cyan("→")} Creating exts directories...`))
// 	await createDirectoryIfNotExists(STATIC_ROOT).toPromise()
// 	Deno.stdout.write(encoder.encode(` ${green("✓")}\n`))
// }

// await main()
