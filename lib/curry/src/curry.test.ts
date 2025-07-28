/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { describe, expect, it } from "bun:test"

import { curry } from "./curry.impl"

describe("curry", () => {
	it("should exist", () => {
		expect(curry).toBeDefined()
	})

	it("should apply to thunks", () => {
		const f = curry(() => 2)
		expect(f()).toEqual(2)
	})

	it("should curry", () => {
		const add = curry((a: number, b: number) => a + b)
		const add1 = add(1)
		expect(add1(2)).toEqual(3)
	})

	it("should partially apply", () => {
		const add = curry((a: number, b: number, c: number) => a + b + c)
		expect(add(1, 2)(3)).toEqual(add(1)(2)(3))
		expect(add(1)(2, 3)).toEqual(add(1)(2)(3))
	})
})
