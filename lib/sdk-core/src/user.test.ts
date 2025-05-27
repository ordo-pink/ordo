import { describe, expect, it } from "bun:test"

import { user } from "./user.impl"

describe("user", () => {
	describe("other", () => {
		describe("create_id", () => {
			it("should create an identifier", () => {
				expect(user.other.create_id()).toBeTypeOf("string")
				expect(user.other.validations.is_id(user.other.create_id())).toBeTrue()
			})
		})

		describe("create_timestamp", () => {
			it("should create a timestamp", () => {
				expect(user.other.create_timestamp()).toBeTypeOf("number")
				expect(user.other.validations.is_timestamp(user.other.create_timestamp())).toBeTrue()
			})
		})

		describe("validations", () => {
			const { is_dto, is_handle, is_id, is_name, is_subscription, is_timestamp } = user.other.validations

			it("is_id should verify UUID", () => {
				expect(is_id(crypto.randomUUID())).toBeTrue()
				expect(is_id("")).toBeFalse()
				expect(is_id(null)).toBeFalse()
				expect(is_id(undefined)).toBeFalse()
				expect(is_id("asdf-asdf-asdf-asdf-asdf")).toBeFalse()
			})

			it("is_handle should verify handle", () => {
				expect(is_handle("@a")).toBeTrue()
				expect(is_handle("aaa")).toBeFalse()
				expect(is_handle("@!")).toBeFalse()
				expect(is_handle("@way_too_long_to_be_a_valid_handle")).toBeFalse()
			})

			it("is_name should verify name", () => {
				expect(is_name("hello")).toBeTrue()
				expect(is_name("")).toBeTrue()
				expect(is_name(null)).toBeFalse()
			})

			it("is_subscription should verify subscription", () => {
				expect(is_subscription(0)).toBeTrue()
				expect(is_subscription(1)).toBeTrue()
				expect(is_subscription(2)).toBeTrue()
				expect(is_subscription(3)).toBeTrue()
				expect(is_subscription(4)).toBeTrue()
				expect(is_subscription(5)).toBeFalse()
			})

			it("is_timestamp should verify timestamp", () => {
				expect(is_timestamp(1000000)).toBeTrue()
				expect(is_timestamp(-1)).toBeFalse()
				expect(is_timestamp(1.1)).toBeFalse()
			})

			// TODO is_dto
		})

		// TODO instance
	})
})
