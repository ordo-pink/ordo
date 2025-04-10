/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import test from "bun:test"

import { oath } from "../../oath.impl"

test.describe("oath.constructors", () => {
	test.describe("from_nullable", () => {
		test.it("should resolve with non-nullable value", () => {
			const result = oath.from_nullable(0).cata(oath.catas.unwrap())

			test.expect(result).toBe(0)
		})

		test.it("should reject with null if nullish handler is not provided", () => {
			const result = oath.from_nullable(null).cata(oath.catas.or_else(() => 1))

			test.expect(result).toBe(1)
		})

		test.it("should reject with handled value if nullish handler is not provided", () => {
			const result = oath.from_nullable(null, () => 1).cata(oath.catas.unwrap())

			test.expect(result).toBe(1)
		})
	})
})
