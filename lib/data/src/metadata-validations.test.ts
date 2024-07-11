import { describe, expect, it } from "bun:test"

import {
	are_lbls,
	are_lnks,
	has_all_lbls,
	is_hidden,
	is_name,
	is_parent,
	is_size,
	is_type,
} from "./metadata-validations"
import { Metadata } from "./metadata.impl"

describe("metadata-validations", () => {
	describe("isValidSize", () => {
		it("should return true if provided value is a valid non-negative integer", () => {
			expect(is_size(0)).toBe(true)
			expect(is_size(1)).toBe(true)
		})

		it("should return false if provided value is not a valid size", () => {
			expect(is_size(1.1)).toBe(false)
			expect(is_size(-2)).toBe(false)
			expect(is_size("hey" as any)).toBe(false)
			expect(is_size(undefined as any)).toBe(false)
		})
	})

	describe("isValidParent", () => {
		it("should return true if provided value is null", () => {
			expect(is_parent(null)).toBe(true)
		})

		it("should return true if provided value is a valid UUIDv4", () => {
			expect(is_parent(crypto.randomUUID())).toBe(true)
		})

		it("should return false if provided value is not a valid parent", () => {
			expect(is_parent("" as any)).toBe(false)
			expect(is_parent("asdf-asdf-asdf-asdf-asdf")).toBe(false)
			expect(is_parent(undefined as any)).toBe(false)
		})
	})

	describe("isType", () => {
		it("should return true if provided value is a non-empty string", () => {
			expect(is_type("asdf")).toBe(true)
		})

		it("should return false if provided value is not a valid content type", () => {
			expect(is_type("")).toBe(false)
		})
	})

	describe("isName", () => {
		it("should return true if provided value is a non-empty string", () => {
			expect(is_name("asdf")).toBe(true)
		})

		it("should return false if provided value is not a valid name", () => {
			expect(is_name("")).toBe(false)
		})
	})

	describe("isHidden", () => {
		it("should return true if provided metadata is a hidden file", () => {
			expect(
				is_hidden(
					Metadata.from({ name: ".hey", parent: null, author_id: "asdf-asdf-asdf-asdf-asdf" }),
				),
			).toBe(true)
		})

		it("should return false if provided metadata is a not hidden file", () => {
			expect(
				is_hidden(
					Metadata.from({ name: "hey", parent: null, author_id: "asdf-asdf-asdf-asdf-asdf" }),
				),
			).toBe(false)
		})
	})

	describe("hasAllLabels", () => {
		it("should return true if provided metadata has all provided values", () => {
			expect(
				has_all_lbls(["asdf", "123123"])(
					Metadata.from({
						name: ".hey",
						parent: null,
						author_id: "asdf-asdf-asdf-asdf-asdf",
						labels: ["asdf", "123123"],
					}),
				),
			).toBe(true)
		})

		it("should return false if provided metadata does not have all provided values", () => {
			expect(
				has_all_lbls(["asdf", "123123"])(
					Metadata.from({
						name: ".hey",
						parent: null,
						author_id: "asdf-asdf-asdf-asdf-asdf",
						labels: ["123123"],
					}),
				),
			).toBe(false)

			expect(
				has_all_lbls(["asdf", "123123"])(
					Metadata.from({
						name: ".hey",
						parent: null,
						author_id: "asdf-asdf-asdf-asdf-asdf",
						labels: ["asdf"],
					}),
				),
			).toBe(false)

			expect(
				has_all_lbls(["asdf", "123123"])(
					Metadata.from({
						name: ".hey",
						parent: null,
						author_id: "asdf-asdf-asdf-asdf-asdf",
						labels: [],
					}),
				),
			).toBe(false)
		})
	})

	describe("areValidLabels", () => {
		it("should return true if provided labels are valid", () => {
			expect(are_lbls(["asdf", "123123"])).toBe(true)
			expect(are_lbls([])).toBe(true)
		})

		it("should return false if at least one label is invalid", () => {
			expect(are_lbls([""])).toBe(false)
			expect(are_lbls(["asdf", ""])).toBe(false)
			expect(are_lbls([123 as any])).toBe(false)
		})
	})

	describe("areValidLinks", () => {
		it("should return true if provided links are valid", () => {
			expect(are_lnks([crypto.randomUUID(), crypto.randomUUID()])).toBe(true)
			expect(are_lnks([])).toBe(true)
		})

		it("should return false if at least one link is invalid", () => {
			expect(are_lnks(["" as any])).toBe(false)
			expect(are_lnks([crypto.randomUUID(), "" as any])).toBe(false)
			expect(are_lnks([undefined as any])).toBe(false)
			expect(are_lnks([123 as any, undefined])).toBe(false)
		})
	})
})
