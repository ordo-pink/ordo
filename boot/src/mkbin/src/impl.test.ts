// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { expect, test } from "bun:test"
import { isDirectory0, isFile0, readFile0, rmdir0 } from "@ordo-pink/fs"
import { getLicense } from "@ordo-pink/binutil"

import { mkbin } from "./impl"

test("should create test boot src files", async () => {
	await mkbin("test-mkbin", "Unlicense")

	expect(await isDirectory0("./boot/src/test-mkbin").orNothing()).toBeTrue()
	expect(await isFile0("./boot/src/test-mkbin/license").orNothing()).toBeTrue()
	expect(await isFile0("./boot/src/test-mkbin/index.ts").orNothing()).toBeTrue()
	expect(await isFile0("./boot/src/test-mkbin/src/impl.ts").orNothing()).toBeTrue()
	expect(await isFile0("./boot/src/test-mkbin/src/impl.test.ts").orNothing()).toBeTrue()

	await rmdir0("./boot/src/test-mkbin", { recursive: true }).orNothing()
})

test("should license the files with Unlicense", async () => {
	await mkbin("test-mkbin", "Unlicense")

	const text = await readFile0("./boot/src/test-mkbin/license", "utf-8").orNothing()
	expect(text).toEqual(getLicense("Unlicense"))

	await rmdir0("./boot/src/test-mkbin", { recursive: true }).orNothing()
})

test("should license the files with AGPL-3.0-only", async () => {
	await mkbin("test-mkbin", "AGPL-3.0-only")

	const text = await readFile0("./boot/src/test-mkbin/license", "utf-8").orNothing()
	expect(text).toEqual(getLicense("AGPL-3.0-only"))

	await rmdir0("./boot/src/test-mkbin", { recursive: true }).orNothing()
})

test("should throw on attempt to create a bin that already exists", async () => {
	expect(await mkbin("test", "Unlicense")).toBeFalse()
})
