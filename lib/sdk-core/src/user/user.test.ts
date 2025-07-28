import { describe, expect, test } from "bun:test"
import * as uuid from "../uuid/uuid.impl"
import * as user from "./user.impl"
import * as USER from "./user.constants"

const a: any = ""

describe("user", () => {
	test("default_name", () => expect(user.default_name()).toBe(""))
	test("default_subscription", () => expect(user.default_subscription()).toBe(0))
	test("get_handle", () => expect(user.get_handle([a, "hey", a, a])).toBe("hey"))
	test("get_name", () => expect(user.get_name([a, a, "hey", a])).toBe("hey"))
	test("get_subscription", () =>
		expect(user.get_subscription([a, a, a, USER.SUBSCRIPTION.FAMILY])).toBe(USER.SUBSCRIPTION.FAMILY))
	test("handle_guard", () => {
		expect(user.handle_guard("hello")).toBeTrue()
		expect(user.handle_guard("")).toBeFalse()
		expect(user.handle_guard("hellohellohellohellohello")).toBeFalse()
	})
	test("has_name", () => {
		expect(user.has_name([a, a, "hey", a])).toBeTrue()
		expect(user.has_name([a, a, a, a])).toBeFalse()
	})
	test("has_the_id", () => {
		const id = uuid.create()
		expect(user.has_the_id(id, [id, a, a, a])).toBeTrue()
	})
	test("has_the_handle", () => expect(user.has_the_handle("a", [a, "a", a, a])).toBeTrue())
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
		expect(user.subscription_guard(SUBSCRIPTION.length)).toBeFalse()
	})
})
