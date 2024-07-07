import { describe, expect, it } from "bun:test"

import {
	areLabels,
	areLinks,
	hasAllLabels,
	isHidden,
	isName,
	isSize,
	isType,
	isValidParent,
} from "./metadata-validations"
import { Metadata } from "./metadata.impl"

describe("metadata-validations", () => {
	describe("isValidSize", () => {
		it("should return true if provided value is a valid non-negative integer", () => {
			expect(isSize(0)).toBe(true)
			expect(isSize(1)).toBe(true)
		})

		it("should return false if provided value is not a valid size", () => {
			expect(isSize(1.1)).toBe(false)
			expect(isSize(-2)).toBe(false)
			expect(isSize("hey" as any)).toBe(false)
			expect(isSize(undefined as any)).toBe(false)
		})
	})

	describe("isValidParent", () => {
		it("should return true if provided value is null", () => {
			expect(isValidParent(null)).toBe(true)
		})

		it("should return true if provided value is a valid UUIDv4", () => {
			expect(isValidParent(crypto.randomUUID())).toBe(true)
		})

		it("should return false if provided value is not a valid parent", () => {
			expect(isValidParent("" as any)).toBe(false)
			expect(isValidParent("asdf-asdf-asdf-asdf-asdf")).toBe(false)
			expect(isValidParent(undefined as any)).toBe(false)
		})
	})

	describe("isType", () => {
		it("should return true if provided value is a non-empty string", () => {
			expect(isType("asdf")).toBe(true)
		})

		it("should return false if provided value is not a valid content type", () => {
			expect(isType("")).toBe(false)
		})
	})

	describe("isName", () => {
		it("should return true if provided value is a non-empty string", () => {
			expect(isName("asdf")).toBe(true)
		})

		it("should return false if provided value is not a valid name", () => {
			expect(isName("")).toBe(false)
		})
	})

	describe("isHidden", () => {
		it("should return true if provided metadata is a hidden file", () => {
			expect(
				isHidden(Metadata.from({ name: ".hey", parent: null, user: "asdf-asdf-asdf-asdf-asdf" })),
			).toBe(true)
		})

		it("should return false if provided metadata is a not hidden file", () => {
			expect(
				isHidden(Metadata.from({ name: "hey", parent: null, user: "asdf-asdf-asdf-asdf-asdf" })),
			).toBe(false)
		})
	})

	describe("hasAllLabels", () => {
		it("should return true if provided metadata has all provided values", () => {
			expect(
				hasAllLabels(["asdf", "123123"])(
					Metadata.from({
						name: ".hey",
						parent: null,
						user: "asdf-asdf-asdf-asdf-asdf",
						labels: ["asdf", "123123"],
					}),
				),
			).toBe(true)
		})

		it("should return false if provided metadata does not have all provided values", () => {
			expect(
				hasAllLabels(["asdf", "123123"])(
					Metadata.from({
						name: ".hey",
						parent: null,
						user: "asdf-asdf-asdf-asdf-asdf",
						labels: ["123123"],
					}),
				),
			).toBe(false)

			expect(
				hasAllLabels(["asdf", "123123"])(
					Metadata.from({
						name: ".hey",
						parent: null,
						user: "asdf-asdf-asdf-asdf-asdf",
						labels: ["asdf"],
					}),
				),
			).toBe(false)

			expect(
				hasAllLabels(["asdf", "123123"])(
					Metadata.from({
						name: ".hey",
						parent: null,
						user: "asdf-asdf-asdf-asdf-asdf",
						labels: [],
					}),
				),
			).toBe(false)
		})
	})

	describe("areValidLabels", () => {
		it("should return true if provided labels are valid", () => {
			expect(areLabels(["asdf", "123123"])).toBe(true)
			expect(areLabels([])).toBe(true)
		})

		it("should return false if at least one label is invalid", () => {
			expect(areLabels([""])).toBe(false)
			expect(areLabels(["asdf", ""])).toBe(false)
			expect(areLabels([123 as any])).toBe(false)
		})
	})

	describe("areValidLinks", () => {
		it("should return true if provided links are valid", () => {
			expect(areLinks([crypto.randomUUID(), crypto.randomUUID()])).toBe(true)
			expect(areLinks([])).toBe(true)
		})

		it("should return false if at least one link is invalid", () => {
			expect(areLinks(["" as any])).toBe(false)
			expect(areLinks([crypto.randomUUID(), "" as any])).toBe(false)
			expect(areLinks([undefined as any])).toBe(false)
			expect(areLinks([123 as any, undefined])).toBe(false)
		})
	})
})
