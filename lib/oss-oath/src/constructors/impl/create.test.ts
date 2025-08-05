/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import test from "bun:test"

import { oath } from "../../oath.impl"

test.describe("oath.constructors", () => {
	test.describe("oath.create", () => {
		test.it("should create a resolved instance of oath if resolve is called", async () => {
			const result = await oath.new<number, number>(resolve => resolve(1)).cata(oath.catas.unwrap())

			test.expect(result).toBe(1)
		})

		test.it("should create a rejected instance of oath if reject is called", async () => {
			const result = oath.new<number, string>((_, reject) => reject("test")).cata(oath.catas.unwrap())

			test.expect(await result).toBe("test")
		})

		test.it("should be an oath", () => {
			const result = oath.new(resolve => resolve(1))

			test.expect(result.is_oath).toBeTrue()
		})

		test.it("should be cancellable", async () => {
			const result = oath.new<number, never>(resolve => resolve(1))
			const reason = "Cancelled"

			test.expect(result.is_cancelled).toBeFalse()
			test.expect(result.reason).toBeUndefined()

			result.cancel(reason)

			test.expect(result.reason).toBe(reason)
			test
				.expect(
					await result
						.pipe(oath.ops.map(x => x + 1))
						.pipe(oath.ops.map(x => x + 1))
						.cata(oath.catas.unwrap()),
				)
				.toBe(1)
		})
	})
})
