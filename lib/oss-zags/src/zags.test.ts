/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import test from "bun:test"
import { create } from "./zags.impl"

test.describe("zags", () => {
	test.it("zags should exist", () => {
		test.expect(create).toBeDefined()
	})

	test.describe("cheat", () => {
		test.it("should cheat with given partners", () => {
			let x = 0
			const zags = create({ x: { y: 0 } })
			const divorce = zags.cheat("x.y", y => (x = y))
			zags.update("x.y", () => 1)
			divorce()
			zags.update("x.y", () => 2)
			test.expect(x).toBe(1)
		})

		test.it("should not call partner if the state didn't change", () => {
			let x = 1
			const zags = create({ x: { y: 0 }, z: 0 })
			zags.cheat("x.y", y => (x += y))
			zags.update("z", () => 1)
			test.expect(x).toBe(1)
			zags.update("x.y", () => 1)
			test.expect(x).toBe(2)
		})
	})

	test.describe("each", () => {
		test.it("should apply multiple updates", () => {
			const mock = test.mock()
			const zags = create({ x: { y: 0 }, z: 0 })
			zags.marry((state, is_update) => is_update && mock(state))
			zags.each({ "x.y": _ => 1, z: _ => 1 })
			test.expect(mock).toBeCalledTimes(1)
			test.expect(zags.select("x.y")).toBe(1)
			test.expect(zags.select("z")).toBe(1)
		})
	})

	test.describe("replace", () => {
		test.it("should replace the whole state object", () => {
			const zags = create({ x: 0 })
			const divorce = zags.marry(() => void 0)
			zags.replace(state => ({ x: ++state.x }))
			zags.replace(state => ({ x: ++state.x }))
			divorce()
			test.expect(zags.select("x")).toBe(2)
		})

		test.it("should ignore changes if the state is the same", () => {
			const mock = test.mock()
			const zags = create({ x: 0 })
			zags.marry((state, is_update) => is_update && mock(state))
			zags.replace(state => ({ x: 0 }))
			test.expect(mock).toBeCalledTimes(1)
		})
	})

	test.describe("unwrap", () => {
		const zags = create({ x: 0 })
		test.expect(zags.unwrap().x).toBe(0)
	})

	test.describe("select", () => {
		test.it("should extract value under given path", () => {
			const zags = create({ x: 0 })
			test.expect(zags.select("x")).toBe(0)
			zags.update("x", () => 1)
			test.expect(zags.select("x")).toBe(1)
		})
	})

	test.describe("marry", () => {
		test.it("should marry given partners", () => {
			let y = 0
			const zags = create({ x: 0 })
			zags.marry(({ x }) => void (y = x))
			zags.update("x", () => 1)
			test.expect(y).toEqual(1)
		})

		test.it("should call partner with current state on marriage", () => {
			let x = 0
			const zags = create({ x })
			const inc = () => x++
			zags.marry(inc)
			test.expect(x).toEqual(1)
		})

		test.it("should apply partial updates", () => {
			const state = { x: 0, y: 0 }
			let result = state
			const zags = create(state)
			zags.marry(state => void (result = state))
			zags.update("x", () => 1)
			test.expect(result).toEqual({ x: 1, y: 0 })
		})
	})

	test.describe("divorce", () => {
		test.it("should divorce given partners", () => {
			let x = 0
			const zags = create({ x })
			const inc = () => x++
			zags.marry(inc)
			zags.update("x", () => 1)
			zags.update("x", () => 2)
			zags.divorce(inc)
			zags.update("x", () => 3)
			zags.update("x", () => 4)
			test.expect(x).toEqual(3)
		})

		test.it("should divorce given partners", () => {
			let x = 0
			const zags = create({ x })
			const inc = () => x++
			const divorce = zags.marry(inc)
			zags.update("x", () => 1)
			zags.update("x", () => 2)
			divorce()
			zags.update("x", () => 3)
			zags.update("x", () => 4)
			test.expect(x).toEqual(3)
		})
	})
})
