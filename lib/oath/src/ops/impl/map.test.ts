/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { describe, expect, it } from "bun:test"

import { oath } from "../../oath.impl"

describe("oath.ops", () => {
	describe("map", () => {
		it("should be defined", () => expect(oath.ops.map).toBeDefined())

		it("should map over resolved oath", () =>
			expect(
				oath
					.of(1)
					.pipe(oath.ops.map(x => x + 1))
					.cata(oath.catas.unwrap()),
			).toEqual(2))

		it("should not map over rejected oath", () =>
			expect(
				oath
					.reject(1)
					.pipe(oath.ops.map(() => 2))
					.cata(oath.catas.unwrap()),
			).toEqual(1))
	})

	describe("rejected_map", () => {
		it("should be defined", () => expect(oath.ops.rejected_map).toBeDefined())

		it("should map over rejected oath", () =>
			expect(
				oath
					.reject(1)
					.pipe(oath.ops.rejected_map(x => x + 1))
					.cata(oath.catas.unwrap()),
			).toEqual(2))

		it("should not map over rejected oath", () =>
			expect(
				oath
					.of(1)
					.pipe(oath.ops.rejected_map(() => 2))
					.cata(oath.catas.unwrap()),
			).toEqual(1))
	})
})
