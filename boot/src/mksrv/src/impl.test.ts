// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { mksrv } from "./impl"
import { isDirectory0, isFile0, readFile0, rmdir0 } from "@ordo-pink/fs"
import { getLicense } from "@ordo-pink/binutil"

test("should create test srv src files", async () => {
	await mksrv("test-srv", "MIT").toPromise()

	expect(await isDirectory0("./srv/test-srv").toPromise()).toBeTrue()
	expect(await isFile0("./srv/test-srv/mod.ts").toPromise()).toBeTrue()
	expect(await isFile0("./srv/test-srv/license").toPromise()).toBeTrue()
	expect(await isFile0("./srv/test-srv/readme.md").toPromise()).toBeTrue()
	expect(await isFile0("./srv/test-srv/src/impl.ts").toPromise()).toBeTrue()
	expect(await isFile0("./srv/test-srv/src/types.ts").toPromise()).toBeTrue()
	expect(await isFile0("./srv/test-srv/src/impl.test.ts").toPromise()).toBeTrue()

	await rmdir0("./srv/test-srv", { recursive: true }).toPromise()
})

test("should license the files with MIT", async () => {
	await mksrv("test-srv", "MIT").toPromise()

	const text = await readFile0("./srv/test-srv/license", "utf-8").toPromise()
	expect(text).toEqual(getLicense("MIT"))

	await rmdir0("./srv/test-srv", { recursive: true }).toPromise()
})

test("should license the files with MPL-2.0", async () => {
	await mksrv("test-srv", "MPL-2.0").toPromise()

	const text = await readFile0("./srv/test-srv/license", "utf-8").toPromise()
	expect(text).toEqual(getLicense("MPL-2.0"))

	await rmdir0("./srv/test-srv", { recursive: true }).toPromise()
})

test("should throw on attempt to create a srv that already exists", () => {
	expect(() => mksrv("id", "MIT").toPromise()).toThrow()
})
