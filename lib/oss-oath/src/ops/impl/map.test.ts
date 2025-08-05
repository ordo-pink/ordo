/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { describe, expect, it } from "bun:test"

import { oath } from "../../oath.impl"

describe("oath.ops", () => {
	describe("map", () => {
		it("should be defined", () => expect(oath.ops.map).toBeDefined())

		it("should map over resolved oath", async () => {
			const result = oath
				.of(1)
				.pipe(oath.ops.map(x => x + 1))
				.cata(oath.catas.unwrap())

			expect(await result).toEqual(2)
		})

		it("should not map over rejected oath", async () =>
			expect(
				await oath
					.reject(1)
					.pipe(oath.ops.map(() => 2))
					.cata(oath.catas.unwrap()),
			).toEqual(1))
	})

	describe("rejected_map", () => {
		it("should be defined", () => expect(oath.ops.rmap).toBeDefined())

		it("should map over rejected oath", async () =>
			expect(
				await oath
					.reject<number, number>(1)
					.pipe(oath.ops.rmap(x => x + 1))
					.cata(oath.catas.unwrap()),
			).toEqual(2))

		it("should not map over rejected oath", async () =>
			expect(
				await oath
					.of(1)
					.pipe(oath.ops.rmap(() => 2))
					.cata(oath.catas.unwrap()),
			).toEqual(1))
	})
})
