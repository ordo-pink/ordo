// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// // SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// // SPDX-License-Identifier: MPL-2.0

// // This Source Code Form is subject to the terms of the Mozilla Public
// // License, v. 2.0. If a copy of the MPL was not distributed with this
// // file, You can obtain one at http://mozilla.org/MPL/2.0/.

// import "#std/dotenv/load.ts"

// import { Oath } from "@ordo-pink/oath/mod.ts"
// import { createDirectoryIfNotExists } from "@ordo-pink/fs/mod.ts"
// import { getc } from "@ordo-pink/getc/mod.ts"
// import { cyan, green } from "#std/fmt/colors.ts"

// const { STATIC_ROOT } = getc(["STATIC_ROOT"])

// const main = async () => {
// 	const encoder = new TextEncoder()

// 	Deno.stdout.write(encoder.encode(`  ${cyan("→")} Creating static directory...`))
// 	await Oath.fromNullable(STATIC_ROOT).chain(createDirectoryIfNotExists).orElse(console.error)
// 	Deno.stdout.write(encoder.encode(` ${green("✓")}\n`))
// }

// await main()
