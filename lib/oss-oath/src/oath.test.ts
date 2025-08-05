/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { describe, expect, it } from "bun:test"
import { oath } from "./oath.impl"

describe("oath", () => {
	it("should be defined", () => expect(oath).toBeDefined())
	describe("ops", () => it("should be defined", () => expect(oath.ops).toBeDefined()))
	describe("catas", () => it("should be defined", () => expect(oath.catas).toBeDefined()))

	describe("methods", () => {
		describe("cata", () => {})

		describe("cancel", () => {
			it("should prevent further piping", async () => {
				const o = oath.of(1).pipe(oath.ops.map(x => x + 1))

				o.cancel("test")

				expect(await o.pipe(oath.ops.map(x => x + 1)).cata(oath.catas.unwrap())).toEqual(2)
			})
		})
	})
})
