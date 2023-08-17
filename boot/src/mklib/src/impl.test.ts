// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { isDirectory0, isFile0, readFile0, rmdir0 } from "@ordo-pink/fs"
import { getLicense } from "@ordo-pink/binutil"
import { mklib } from "./impl"

test("should create test lib src files", async () => {
	await mklib("test-lib", "MIT")

	expect(await isDirectory0("./lib/test-lib").toPromise()).toBeTrue()
	expect(await isFile0("./lib/test-lib/license").toPromise()).toBeTrue()
	expect(await isFile0("./lib/test-lib/index.ts").toPromise()).toBeTrue()
	expect(await isFile0("./lib/test-lib/readme.md").toPromise()).toBeTrue()
	expect(await isFile0("./lib/test-lib/src/impl.ts").toPromise()).toBeTrue()
	expect(await isFile0("./lib/test-lib/src/types.ts").toPromise()).toBeTrue()
	expect(await isFile0("./lib/test-lib/src/impl.test.ts").toPromise()).toBeTrue()

	await rmdir0("./lib/test-lib", { recursive: true }).toPromise()
})

test("should license the files with MIT", async () => {
	await mklib("test-lib", "MIT")

	const text = await readFile0("./lib/test-lib/license", { encoding: "utf-8" }).toPromise()
	expect(text).toEqual(getLicense("MIT"))

	await rmdir0("./lib/test-lib", { recursive: true }).toPromise()
})

test("should license the files with MPL-2.0", async () => {
	await mklib("test-lib", "MPL-2.0")

	const text = await readFile0("./lib/test-lib/license", { encoding: "utf-8" }).toPromise()
	expect(text).toEqual(getLicense("MPL-2.0"))

	await rmdir0("./lib/test-lib", { recursive: true }).toPromise()
})

test("should throw on attempt to create a lib that already exists", async () => {
	expect(await mklib("oath", "MIT")).toBeFalse()
})
