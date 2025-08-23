/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import test from "bun:test"

import * as sweech from "./sweech.impl"
import * as sweech_helpers from "./helpers/helpers.impl"

test.describe("sweech", () => {
	test.it("should apply fall into case if the value matches", () => {
		const result = sweech
			.match(1)
			.case(1, () => true)
			.default(() => false)

		test.expect(result).toBeTrue()
	})

	test.it("should apply fall into case if the validation succeeded", () => {
		const on_true = () => true
		const result = sweech
			.match(1)
			.case(x => x === 1, on_true)
			.default(() => false)

		test.expect(result).toBeTrue()
	})

	test.it("should apply fall into default if none of the cases succeeded", () => {
		const result = sweech
			.match(2)
			.case(1, () => false)
			.case(3, () => false)
			.default(() => true)

		test.expect(result).toBeTrue()
	})

	test.it("should apply the first case where the value matched", () => {
		const result = sweech
			.match(1)
			.case(1, () => true)
			.case(1, () => false)
			.default(() => false)

		test.expect(result).toBeTrue()
	})

	test.it("should compare against true with of_true", () => {
		const result = sweech_helpers
			.of_true()
			.case(1 > 2, () => "no")
			.case(1 === 1, () => "yes")
			.default(() => "default")

		test.expect(result).toBe("yes")
	})

	test.it("should compare against false with of_false", () => {
		const result = sweech_helpers
			.of_false()
			.case(1 > 2, () => "no")
			.case(1 === 1, () => "yes")
			.default(() => "default")

		test.expect(result).toBe("no")
	})
})
