// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { assert, assertEquals, assertInstanceOf, assertRejects } from "#std/testing/asserts.ts"
import { readFile, rmdir } from "#lib/fs/mod.ts"
import { BackendFSDataRepository } from "./impl.ts"
import { resolve } from "#std/path/mod.ts"
import { FSID } from "#lib/universal-data-service/mod.ts"

const root = "./var/test"
const sub = crypto.randomUUID()
const repository = BackendFSDataRepository.of({ root })

Deno.test("backend-fs-user-data-repository", async t => {
	await t.step("create file", async t => {
		await t.step("create file without predefined FSID", async () => {
			const fsid = await repository.create({ sub }).toPromise()

			const buffer = await readFile(
				resolve(root, ...sub.split("-"), ...fsid.split("-"))
			).toPromise()

			assertEquals(new TextDecoder().decode(buffer), "")

			await rmdir(resolve(root, sub.split("-")[0]), { recursive: true }).toPromise()
		})

		await t.step("create file with predefined FSID", async () => {
			const fsid = crypto.randomUUID() as FSID
			await repository.create({ sub, fsid }).toPromise()

			const buffer = await readFile(
				resolve(root, ...sub.split("-"), ...fsid.split("-"))
			).toPromise()

			assertEquals(new TextDecoder().decode(buffer), "")

			await rmdir(resolve(root, sub.split("-")[0]), { recursive: true }).toPromise()
		})
	})

	await t.step("delete file", async t => {
		await t.step("delete file that exists", async () => {
			const fsid = await repository.create({ sub }).toPromise()

			assertEquals(await repository.delete({ sub, fsid }).toPromise(), fsid)
			assertRejects(() =>
				readFile(resolve(root, ...sub.split("-"), ...fsid.split("-"))).toPromise()
			)

			await rmdir(resolve(root, sub.split("-")[0]), { recursive: true }).toPromise()
		})

		await t.step("delete file that does not exist", () => {
			const fsid = crypto.randomUUID() as FSID

			assertRejects(() => repository.delete({ sub, fsid }).toPromise())
		})
	})

	await t.step("check file exists", async t => {
		await t.step("check file that exists", async () => {
			const fsid = await repository.create({ sub }).toPromise()

			assertEquals(await repository.exists({ sub, fsid }).toPromise(), true)

			await rmdir(resolve(root, sub.split("-")[0]), { recursive: true }).toPromise()
		})

		await t.step("check file that does not exist", async () => {
			const fsid = crypto.randomUUID() as FSID

			assertEquals(await repository.exists({ sub, fsid }).toPromise(), false)
		})
	})

	await t.step("read file", async t => {
		await t.step("read file that exists", async () => {
			const fsid = await repository.create({ sub }).toPromise()
			const stream = await repository.read({ sub, fsid }).toPromise()

			assert(stream)
			assertInstanceOf(stream, ReadableStream)

			await rmdir(resolve(root, sub.split("-")[0]), { recursive: true }).toPromise()
		})

		await t.step("read file that does not exist", () => {
			const fsid = crypto.randomUUID() as FSID

			assertRejects(() => repository.read({ sub, fsid }).toPromise())
		})
	})

	await t.step("update file", async t => {
		await t.step("update file that exists", async () => {
			const fsid = await repository.create({ sub }).toPromise()
			const content = ReadableStream.from([new TextEncoder().encode("Hello")])

			const size = await repository.update({ sub, fsid, content }).toPromise()
			assertEquals(size, 5)

			await rmdir(resolve(root, sub.split("-")[0]), { recursive: true }).toPromise()
		})

		await t.step("update file that does not exist with upsert on", async () => {
			const fsid = crypto.randomUUID() as FSID

			const content = ReadableStream.from([new TextEncoder().encode("Hello")])

			const size = await repository.update({ sub, fsid, content, upsert: true }).toPromise()
			assertEquals(size, 5)

			await rmdir(resolve(root, sub.split("-")[0]), { recursive: true }).toPromise()
		})

		await t.step("update file that does not exist with upsert off", () => {
			const fsid = crypto.randomUUID() as FSID

			const content = ReadableStream.from([new TextEncoder().encode("Hello")])

			assertRejects(() => repository.update({ sub, fsid, content }).toPromise())
		})
	})
})
