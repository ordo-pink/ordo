/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import test from "bun:test"

import { deep_equals } from "./deep-equals.impl"

test.describe("deep_equals", () => {
	test.it("deep-equals should pass", () => {
		test.expect(deep_equals).toBeDefined()
	})

	test.it("should return true if primitives are equal", () => {
		test.expect(deep_equals(1, 1)).toBeTrue()
		test.expect(deep_equals("test", "test")).toBeTrue()
		test.expect(deep_equals(null, null)).toBeTrue()
		test.expect(deep_equals(undefined, undefined)).toBeTrue()
		test.expect(deep_equals(true, true)).toBeTrue()
		test.expect(deep_equals(false, false)).toBeTrue()
		test.expect(deep_equals(1n, 1n)).toBeTrue()
	})

	test.it("should return false if primitives do not match", () => {
		test.expect(deep_equals(1, 2)).toBeFalse()
		test.expect(deep_equals(1, "1")).toBeFalse()
		test.expect(deep_equals(null, undefined)).toBeFalse()
		test.expect(deep_equals(1, 1n)).toBeFalse()
		test.expect(deep_equals(true, false)).toBeFalse()
		test.expect(deep_equals("", 0)).toBeFalse()
		test.expect(deep_equals(Symbol("1"), Symbol("1"))).toBeFalse()
	})

	test.it("should return true if objects are equal", () => {
		test.expect(deep_equals({ hello: "world" }, { hello: "world" })).toBeTrue()
		test.expect(deep_equals({ hello: { hello: "world" } }, { hello: { hello: "world" } })).toBeTrue()
		test.expect(deep_equals({ hello: [{ hello: "world" }] }, { hello: [{ hello: "world" }] })).toBeTrue()
	})

	test.it("should return false if objects are not equal", () => {
		test.expect(deep_equals({ hello: "world" }, { hello: "dlrow" })).toBeFalse()
		test.expect(deep_equals({ hello: { hello: "world" } }, { hello: { hello: "dlrow" } })).toBeFalse()
		test.expect(deep_equals({ hello: [{ hello: "world" }] }, { hello: [{ hello: "dlrow" }] })).toBeFalse()
	})

	test.it("should return true if arrays are equal", () => {
		test.expect(deep_equals(["world"], ["world"])).toBeTrue()
		test.expect(deep_equals([{ hello: "world" }], [{ hello: "world" }])).toBeTrue()
		test.expect(deep_equals([{ hello: [{ hello: "world" }] }], [{ hello: [{ hello: "world" }] }])).toBeTrue()
	})

	test.it("should return false if arrays are not equal", () => {
		test.expect(deep_equals(["world"], ["dlrow"])).toBeFalse()
		test.expect(deep_equals([{ hello: "world" }], [{ hello: "dlrow" }])).toBeFalse()
		test.expect(deep_equals([{ hello: [{ hello: "world" }] }], [{ hello: [{ hello: "dlrow" }] }])).toBeFalse()
	})
})
