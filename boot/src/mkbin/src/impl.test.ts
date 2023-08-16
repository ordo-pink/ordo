// // SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// // SPDX-License-Identifier: MIT

// import { test, expect } from "bun:test"
// import { isDirectory0, isFile0, readFile0, rmdir0 } from "@ordo-pink/fs"
// import { getLicense } from "@ordo-pink/binutil"
// import { mkbin } from "./impl.ts"

// test("should create test boot src files", async () => {
// 	await mkbin("test-mkbin", "MIT").toPromise()

// 	expect(await isDirectory0("./boot/src/test-mkbin").toPromise()).toBeTrue()
// 	expect(await isFile0("./boot/src/test-mkbin/mod.ts").toPromise()).toBeTrue()
// 	expect(await isFile0("./boot/src/test-mkbin/license").toPromise()).toBeTrue()
// 	expect(await isFile0("./boot/src/test-mkbin/src/impl.ts").toPromise()).toBeTrue()
// 	expect(await isFile0("./boot/src/test-mkbin/src/impl.test.ts").toPromise()).toBeTrue()

// 	await rmdir0("./boot/src/test-mkbin", { recursive: true }).orNothing()
// })

// test("should license the files with MIT", async () => {
// 	await mkbin("test-mkbin", "MIT").toPromise()

// 	const text = await readFile0("./boot/src/test-mkbin/license", "utf-8").toPromise()
// 	expect(text).toEqual(getLicense("MIT"))

// 	await rmdir0("./boot/src/test-mkbin", { recursive: true }).orNothing()
// })

// test("should license the files with MPL-2.0", async () => {
// 	await mkbin("test-mkbin", "MPL-2.0").toPromise()

// 	const text = await readFile0("./boot/src/test-mkbin/license", "utf-8").toPromise()
// 	expect(text).toEqual(getLicense("MPL-2.0"))

// 	await rmdir0("./boot/src/test-mkbin", { recursive: true }).toPromise()
// })

// test("should throw on attempt to create a bin that already exists", () => {
// 	expect(() => mkbin("test", "MIT").toPromise()).toThrow()
// })
