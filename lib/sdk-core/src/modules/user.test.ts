/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { describe, expect, test } from "bun:test"
import * as uuid from "./uuid"
import * as user from "./user.impl"

const a: any = ""

describe("user", () => {
	test("default_name", () => expect(user.default_name()).toBe(""))
	test("default_subscription", () => expect(user.default_subscription()).toBe(0))
	test("get_ref", () => expect(user.get_ref([a, "hey", a, a])).toBe("hey"))
	test("get_name", () => expect(user.get_name([a, a, "hey", a])).toBe("hey"))
	test("get_subscription", () =>
		expect(user.get_subscription([a, a, a, user.SUBSCRIPTION.FAMILY])).toBe(user.SUBSCRIPTION.FAMILY))
	test("ref_guard", () => {
		expect(user.ref_guard("hello")).toBeTrue()
		expect(user.ref_guard("")).toBeFalse()
		expect(user.ref_guard("hellohellohellohellohello")).toBeFalse()
	})
	test("has_name", () => {
		expect(user.has_name([a, a, "hey", a])).toBeTrue()
		expect(user.has_name([a, a, a, a])).toBeFalse()
	})
	test("has_the_id", () => {
		const id = uuid.create()
		expect(user.has_the_id(id, [id, a, a, a])).toBeTrue()
	})
	test("has_the_ref", () => expect(user.has_the_ref("a", [a, "a", a, a])).toBeTrue())
	test("has_the_name", () => expect(user.has_the_name("a", [a, a, "a", a])).toBeTrue())
	test("has_the_subscription", () => expect(user.has_the_subscription(0, [a, a, a, 0])).toBeTrue())
	test("is_free", () => expect(user.is_free([a, a, a, 0])).toBeTrue())
	test("is_paid", () => expect(user.is_paid([a, a, a, 0])).toBeFalse())
	test("name_guard", () => {
		expect(user.name_guard("")).toBeTrue()
		expect(user.name_guard("hello")).toBeTrue()
		expect(
			user.name_guard(
				"hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello",
			),
		).toBeFalse()
	})
	test("subscription_guard", () => {
		expect(user.subscription_guard(0)).toBeTrue()
		expect(user.subscription_guard(-1)).toBeFalse()
		expect(user.subscription_guard(1.1)).toBeFalse()
		expect(user.subscription_guard(user.SUBSCRIPTION.length)).toBeFalse()
	})
})
