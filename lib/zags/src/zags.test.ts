/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { ZAGS } from "./zags.impl"

test("zags should exist", () => {
	expect(ZAGS).toBeDefined()
})

test("ZAGS should marry given handlers", () => {
	const zags = ZAGS.Of({ x: 0 })

	let y = 0

	zags.marry(({ x }) => void (y = x))
	zags.update({ x: 1 })

	expect(y).toEqual(1)
})

test("ZAGS should call handler with current state on marriage", () => {
	const zags = ZAGS.Of({ x: 0 })
	const inc = () => x++

	let x = 0

	zags.marry(inc)

	expect(x).toEqual(1)
})

test("ZAGS should apply partial updates", () => {
	const state = { x: 0, y: 0 }
	const zags = ZAGS.Of(state)

	let result = state

	zags.marry(state => void (result = state))
	zags.update({ x: 1 })

	expect(result).toEqual({ x: 1, y: 0 })
})

test("ZAGS should divorce given handlers", () => {
	const zags = ZAGS.Of({ x: 0 })
	const inc = () => x++

	let x = 0

	zags.marry(inc)

	zags.update({ x: 1 })
	zags.update({ x: 1 })

	zags.divorce(inc)

	zags.update({ x: 1 })
	zags.update({ x: 1 })

	expect(x).toEqual(3)
})
