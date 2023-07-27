// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { assert, assertEquals } from "#std/testing/asserts.ts"
import { main } from "./impl.ts"
import { isDirectory, isFile, readFile, rmdir } from "#lib/fs/mod.ts"
import { assertRejects } from "https://deno.land/std@0.192.0/testing/asserts.ts"
import { getLicense } from "#lib/binutil/mod.ts"

Deno.test("should create test boot src files", async () => {
	await main("test-mkbin", "MIT").toPromise()

	assert(await isDirectory("./boot/src/test-mkbin").toPromise())
	assert(await isFile("./boot/src/test-mkbin/mod.ts").toPromise())
	assert(await isFile("./boot/src/test-mkbin/license").toPromise())
	assert(await isFile("./boot/src/test-mkbin/src/impl.ts").toPromise())
	assert(await isFile("./boot/src/test-mkbin/src/impl.test.ts").toPromise())

	await rmdir("./boot/src/test-mkbin", { recursive: true }).toPromise()
})

Deno.test("should license the files with MIT", async () => {
	await main("test-mkbin", "MIT").toPromise()

	const decoder = new TextDecoder()
	const text = await readFile("./boot/src/test-mkbin/license").toPromise()

	assertEquals(decoder.decode(text), getLicense("MIT"))

	await rmdir("./boot/src/test-mkbin", { recursive: true }).toPromise()
})

Deno.test("should license the files with MPL-2.0", async () => {
	await main("test-mkbin", "MPL-2.0").toPromise()

	const decoder = new TextDecoder()
	const text = await readFile("./boot/src/test-mkbin/license").toPromise()

	assertEquals(decoder.decode(text), getLicense("MPL-2.0"))

	await rmdir("./boot/src/test-mkbin", { recursive: true }).toPromise()
})

Deno.test("should throw on attempt to create a bin that already exists", () => {
	assertRejects(() => main("test", "MIT").toPromise())
})
