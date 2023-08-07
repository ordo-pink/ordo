// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { cyan, green } from "#std/fmt/colors.ts"
import { getc } from "#lib/getc/mod.ts"
import { createDirectoryIfNotExists } from "#lib/fs/mod.ts"

const { DATA_DATA_PATH, DATA_METADATA_PATH } = getc(["DATA_DATA_PATH", "DATA_METADATA_PATH"])

const createStorageDirectory = (path: string) => createDirectoryIfNotExists(path)

const main = async () => {
	const encoder = new TextEncoder()

	Deno.stdout.write(encoder.encode(`  ${cyan("→")} Creating directories...`))
	await createStorageDirectory(DATA_DATA_PATH).toPromise()
	await createStorageDirectory(DATA_METADATA_PATH).toPromise()
	Deno.stdout.write(encoder.encode(` ${green("✓")}\n`))
}

await main()
