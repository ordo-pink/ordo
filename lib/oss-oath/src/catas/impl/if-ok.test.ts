/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import test from "bun:test"

import { oath } from "../../oath.impl"

test.describe("oath.catas", () => {
	test.describe("if_ok", () => {
		test.it("should apply given operator before unwrapping if oath resolves", async () => {
			const result = await oath.of(1).cata(oath.catas.if_ok(x => x + 1))

			test.expect(result).toBe(2)
		})

		test.it("should return void on rejection", async () => {
			const result = await oath.reject(1).cata(oath.catas.if_ok(() => 2))

			test.expect(result).toBe(undefined)
		})
	})
})
