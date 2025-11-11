/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { describe, expect, test } from "bun:test"
import { impl as uuid } from "./uuid.impl"
import { impl as user } from "./user.impl"

const a: any = ""

describe("user", () => {
	test("default_name", () => expect(user.default_name()).toBe(""))
	test("get_ref", () => expect(user.get_ref([a, "hey", a, a, a, a])).toBe("hey"))
	test("get_name", () => expect(user.get_name([a, a, "hey", a, a, a])).toBe("hey"))
	test("ref_guard", () => {
		expect(user.ref_guard("hello")).toBeTrue()
		expect(user.ref_guard("")).toBeFalse()
		expect(user.ref_guard("hellohellohellohellohello")).toBeFalse()
	})
	test("has_name", () => {
		expect(user.has_name([a, a, "hey", a, a, a])).toBeTrue()
		expect(user.has_name([a, a, a, a, a, a])).toBeFalse()
	})
	test("has_the_id", () => {
		const id = uuid.create()
		expect(user.has_the_id(id, [id, a, a, a, a, a])).toBeTrue()
	})
	test("has_the_ref", () => expect(user.has_the_ref("a", [a, "a", a, a, a, a])).toBeTrue())
	test("has_the_name", () => expect(user.has_the_name("a", [a, a, "a", a, a, a])).toBeTrue())
	test("name_guard", () => {
		expect(user.name_guard("")).toBeTrue()
		expect(user.name_guard("hello")).toBeTrue()
		expect(
			user.name_guard(
				"hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello",
			),
		).toBeFalse()
	})
})
