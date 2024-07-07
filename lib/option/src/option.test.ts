// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { describe, expect, it } from "bun:test"

import { O, noneO } from "./option.impl"

describe("Option", () => {
	describe("of/some", () => {
		it("should return Some(T)", () => {
			const some1 = O.some(1)
			const some2 = O.of(1)

			expect(some1.isOption).toBeTrue()
			expect(some1.isSome).toBeTrue()
			expect(some1.isNone).toBeFalse()
			expect(some1.unwrap()).toEqual(some2.unwrap() as number)
		})
	})

	describe("none", () => {
		it("should return None", () => {
			const none = O.none()

			expect(none.isOption).toBeTrue()
			expect(none.isSome).toBeFalse()
			expect(none.isNone).toBeTrue()
		})

		it("should always be the same None", () => {
			expect(O.none()).toEqual(noneO())
		})

		it("should be triple equal", () => {
			expect(O.none() === noneO()).toBeTrue()
		})
	})

	describe("fromNullable", () => {
		it("should return None if the value is nullish", () => {
			const nullOption = O.fromNullable(null)
			const undefinedOption = O.fromNullable()

			expect(nullOption).toEqual(O.none())
			expect(undefinedOption).toEqual(O.none())
		})

		it("should return Some(T) if the value is not nullish", () => {
			const option = O.fromNullable(0)

			expect(option.cata({ Some: x => x, None: () => 1 })).toEqual(0)
		})
	})

	describe("unwrap", () => {
		it("should unsafely extract underlying value", () => {
			const some = O.some(1)
			const none = O.none()

			expect(some.unwrap()).toEqual(1)
			expect(none.unwrap()).toBeUndefined()
		})
	})

	describe("cata", () => {
		it("should safely extract underlying value", () => {
			const some = O.some(1)
			const none = O.none()

			expect(some.cata({ Some: x => x, None: () => 2 })).toEqual(1)
			expect(none.cata({ Some: x => x, None: () => 2 })).toEqual(2)
		})
	})
})
