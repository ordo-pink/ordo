// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { assert, assertEquals } from "#std/testing/asserts.ts"
import { main } from "./impl.ts"
import { isDirectory, isFile, readFile, rmdir } from "#lib/fs/mod.ts"
import { assertRejects } from "https://deno.land/std@0.192.0/testing/asserts.ts"
import { getLicense } from "#lib/binutil/mod.ts"

Deno.test("should create test lib src files", async () => {
	await main("test-lib", "MIT").toPromise()

	assert(await isDirectory("./lib/test-lib").toPromise())
	assert(await isFile("./lib/test-lib/mod.ts").toPromise())
	assert(await isFile("./lib/test-lib/license").toPromise())
	assert(await isFile("./lib/test-lib/readme.md").toPromise())
	assert(await isFile("./lib/test-lib/src/impl.ts").toPromise())
	assert(await isFile("./lib/test-lib/src/types.ts").toPromise())
	assert(await isFile("./lib/test-lib/src/impl.test.ts").toPromise())

	await rmdir("./lib/test-lib", { recursive: true }).toPromise()
})

Deno.test("should license the files with MIT", async () => {
	await main("test-lib", "MIT").toPromise()

	const decoder = new TextDecoder()
	const text = await readFile("./lib/test-lib/license").toPromise()

	assertEquals(decoder.decode(text), getLicense("MIT"))

	await rmdir("./lib/test-lib", { recursive: true }).toPromise()
})

Deno.test("should license the files with MPL-2.0", async () => {
	await main("test-lib", "MPL-2.0").toPromise()

	const decoder = new TextDecoder()
	const text = await readFile("./lib/test-lib/license").toPromise()

	assertEquals(decoder.decode(text), getLicense("MPL-2.0"))

	await rmdir("./lib/test-lib", { recursive: true }).toPromise()
})

Deno.test("should throw on attempt to create a lib that already exists", () => {
	assertRejects(() => main("oath", "MIT").toPromise())
})
