/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import test from "bun:test"

import { oath } from "../../oath.impl"

test.describe("oath.catas", () => {
	test.describe("noop", () => {
		test.it("should return undefined no matter what", async () => {
			const result1 = await oath.of(1).cata(oath.catas.noop())
			const result2 = await oath.reject(1).cata(oath.catas.noop())

			test.expect(result1).toBe(undefined)
			test.expect(result2).toBe(undefined)
		})

		test.it("should return a promise if there is a promise in oath pipeline", async () => {
			const result = oath.from_promise(() => Promise.resolve(1)).cata(oath.catas.noop())

			test.expect(result).toBeInstanceOf(Promise)
			test.expect(await result).toBe(undefined)
		})
	})
})
