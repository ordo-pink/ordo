/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import test from "bun:test"

import { oath } from "../../oath.impl"

test.describe("oath.catas", () => {
	test.describe("unwrap", () => {
		test.it("should return whatever resolves", () => {
			const result = oath.of(1).cata(oath.catas.unwrap())

			test.expect(result).toBe(1)
		})

		test.it("should return a promise if there is a promise in oath pipeline", async () => {
			const result = oath.from_promise(() => Promise.resolve(1)).cata(oath.catas.unwrap())

			test.expect(result).toBeInstanceOf(Promise)
			test.expect(await result).toBe(1)
		})

		test.it("should return whatever rejects", () => {
			const result = oath.reject(1).cata(oath.catas.unwrap())

			test.expect(result).toBe(1)
		})
	})
})
