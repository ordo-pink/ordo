// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { assert, assertEquals } from "#std/testing/asserts.ts"
import { main } from "./impl.ts"
import { isDirectory, isFile, readFile, rmdir } from "#lib/fs/mod.ts"
import { assertRejects } from "https://deno.land/std@0.192.0/testing/asserts.ts"
import { getLicense } from "#lib/binutil/mod.ts"

Deno.test("should create test srv src files", async () => {
	await main("test-srv", "MIT").toPromise()

	assert(await isDirectory("./srv/test-srv").toPromise())
	assert(await isFile("./srv/test-srv/mod.ts").toPromise())
	assert(await isFile("./srv/test-srv/license").toPromise())
	assert(await isFile("./srv/test-srv/readme.md").toPromise())
	assert(await isFile("./srv/test-srv/src/impl.ts").toPromise())
	assert(await isFile("./srv/test-srv/src/types.ts").toPromise())
	assert(await isFile("./srv/test-srv/src/impl.test.ts").toPromise())

	await rmdir("./srv/test-srv", { recursive: true }).toPromise()
})

Deno.test("should license the files with MIT", async () => {
	await main("test-srv", "MIT").toPromise()

	const decoder = new TextDecoder()
	const text = await readFile("./srv/test-srv/license").toPromise()

	assertEquals(decoder.decode(text), getLicense("MIT"))

	await rmdir("./srv/test-srv", { recursive: true }).toPromise()
})

Deno.test("should license the files with MPL-2.0", async () => {
	await main("test-srv", "MPL-2.0").toPromise()

	const decoder = new TextDecoder()
	const text = await readFile("./srv/test-srv/license").toPromise()

	assertEquals(decoder.decode(text), getLicense("MPL-2.0"))

	await rmdir("./srv/test-srv", { recursive: true }).toPromise()
})

Deno.test("should throw on attempt to create a srv that already exists", () => {
	assertRejects(() => main("id", "MIT").toPromise())
})
