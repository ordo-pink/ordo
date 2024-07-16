// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { expect, test } from "bun:test"
import { is_dir0, is_file0, read_file0, rmdir0 } from "@ordo-pink/fs"
import { getLicense } from "@ordo-pink/binutil"

import { mklib } from "./impl"

test("should create test lib src files", async () => {
	await mklib("test-lib", "Unlicense")

	expect(await is_dir0("./lib/test-lib").toPromise()).toBeTrue()
	expect(await is_file0("./lib/test-lib/license").toPromise()).toBeTrue()
	expect(await is_file0("./lib/test-lib/index.ts").toPromise()).toBeTrue()
	expect(await is_file0("./lib/test-lib/readme.md").toPromise()).toBeTrue()
	expect(await is_file0("./lib/test-lib/src/impl.ts").toPromise()).toBeTrue()
	expect(await is_file0("./lib/test-lib/src/types.ts").toPromise()).toBeTrue()
	expect(await is_file0("./lib/test-lib/src/impl.test.ts").toPromise()).toBeTrue()

	await rmdir0("./lib/test-lib", { recursive: true }).toPromise()
})

test("should license the files with Unlicense", async () => {
	await mklib("test-lib", "Unlicense")

	const text = await read_file0("./lib/test-lib/license", { encoding: "utf-8" }).toPromise()
	expect(text).toEqual(getLicense("Unlicense"))

	await rmdir0("./lib/test-lib", { recursive: true }).toPromise()
})

test("should license the files with AGPL-3.0-only", async () => {
	await mklib("test-lib", "AGPL-3.0-only")

	const text = await read_file0("./lib/test-lib/license", { encoding: "utf-8" }).toPromise()
	expect(text).toEqual(getLicense("AGPL-3.0-only"))

	await rmdir0("./lib/test-lib", { recursive: true }).toPromise()
})

test("should throw on attempt to create a lib that already exists", async () => {
	expect(await mklib("oath", "Unlicense")).toBeFalse()
})
