import { expect, test } from "bun:test"
import { is_dir0, is_file0, read_file0, rmdir0 } from "@ordo-pink/fs"
import { get_license } from "@ordo-pink/binutil"

import { mksrv } from "./impl"

test("should create test srv src files", async () => {
	await mksrv("test-srv", "Unlicense")

	expect(await is_dir0("./srv/test-srv").toPromise()).toBeTrue()
	expect(await is_file0("./srv/test-srv/license").toPromise()).toBeTrue()
	expect(await is_file0("./srv/test-srv/index.ts").toPromise()).toBeTrue()
	expect(await is_file0("./srv/test-srv/readme.md").toPromise()).toBeTrue()
	expect(await is_file0("./srv/test-srv/src/impl.ts").toPromise()).toBeTrue()
	expect(await is_file0("./srv/test-srv/src/types.ts").toPromise()).toBeTrue()
	expect(await is_file0("./srv/test-srv/src/impl.test.ts").toPromise()).toBeTrue()

	await rmdir0("./srv/test-srv", { recursive: true }).toPromise()
})

test("should license the files with Unlicense", async () => {
	await mksrv("test-srv", "Unlicense")

	const text = await read_file0("./srv/test-srv/license", "utf-8").toPromise()
	expect(text).toEqual(get_license("Unlicense"))

	await rmdir0("./srv/test-srv", { recursive: true }).toPromise()
})

test("should license the files with AGPL-3.0-only", async () => {
	await mksrv("test-srv", "AGPL-3.0-only")

	const text = await read_file0("./srv/test-srv/license", "utf-8").toPromise()
	expect(text).toEqual(get_license("AGPL-3.0-only"))

	await rmdir0("./srv/test-srv", { recursive: true }).toPromise()
})

test("should throw on attempt to create a srv that already exists", async () => {
	expect(await mksrv("id", "Unlicense")).toBeFalse()
})
