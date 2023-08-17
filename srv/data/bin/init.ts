// // SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// // SPDX-License-Identifier: MPL-2.0

// // This Source Code Form is subject to the terms of the Mozilla Public
// // License, v. 2.0. If a copy of the MPL was not distributed with this
// // file, You can obtain one at http://mozilla.org/MPL/2.0/.

// import { cyan, green } from "#std/fmt/colors.ts"
// import { getc } from "@ordo-pink/getc/mod.ts"
// import { createDirectoryIfNotExists } from "@ordo-pink/fs/mod.ts"

// const { DATA_DATA_PATH, DATA_METADATA_PATH } = getc(["DATA_DATA_PATH", "DATA_METADATA_PATH"])

// const createStorageDirectory = (path: string) => createDirectoryIfNotExists(path)

// const main = async () => {
// 	const encoder = new TextEncoder()

// 	Deno.stdout.write(encoder.encode(`  ${cyan("→")} Creating directories...`))
// 	await createStorageDirectory(DATA_DATA_PATH).toPromise()
// 	await createStorageDirectory(DATA_METADATA_PATH).toPromise()
// 	Deno.stdout.write(encoder.encode(` ${green("✓")}\n`))
// }

// await main()
