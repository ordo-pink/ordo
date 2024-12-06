/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 *
 */

import { describe, expect, it } from "bun:test"

import { O, OptionNone } from "./option.impl"

describe("Option", () => {
	describe("of/some", () => {
		it("should return Some(T)", () => {
			const some1 = O.Some(1)
			const some2 = O.of(1)

			expect(some1.is_option).toBeTrue()
			expect(some1.is_some).toBeTrue()
			expect(some1.is_none).toBeFalse()
			expect(some1.unwrap()).toEqual(some2.unwrap() as number)
		})
	})

	describe("none", () => {
		it("should return None", () => {
			const none = O.None()

			expect(none.is_option).toBeTrue()
			expect(none.is_some).toBeFalse()
			expect(none.is_none).toBeTrue()
		})

		it("should always be the same None", () => {
			expect(O.None()).toEqual(OptionNone())
		})

		it("should be triple equal", () => {
			expect(O.None() === OptionNone()).toBeTrue()
		})
	})

	describe("fromNullable", () => {
		it("should return None if the value is nullish", () => {
			const nullOption = O.FromNullable(null)
			const undefinedOption = O.FromNullable()

			expect(nullOption).toEqual(O.None())
			expect(undefinedOption).toEqual(O.None())
		})

		it("should return Some(T) if the value is not nullish", () => {
			const option = O.FromNullable(0)

			expect(option.cata({ Some: x => x, None: () => 1 })).toEqual(0)
		})
	})

	describe("unwrap", () => {
		it("should unsafely extract underlying value", () => {
			const some = O.Some(1)
			const none = O.None()

			expect(some.unwrap()).toEqual(1)
			expect(none.unwrap()).toBeUndefined()
		})
	})

	describe("cata", () => {
		it("should safely extract underlying value", () => {
			const some = O.Some(1)
			const none = O.None()

			expect(some.cata({ Some: x => x, None: () => 2 })).toEqual(1)
			expect(none.cata({ Some: x => x, None: () => 2 })).toEqual(2)
		})
	})
})
