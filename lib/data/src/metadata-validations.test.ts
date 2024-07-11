import { describe, expect, it } from "bun:test"

import { MetadataGuards } from "./metadata-validations"

describe("metadata-validations", () => {
	describe("isValidSize", () => {
		it("should return true if provided value is a valid non-negative integer", () => {
			expect(MetadataGuards.is_size(0)).toBe(true)
			expect(MetadataGuards.is_size(1)).toBe(true)
		})

		it("should return false if provided value is not a valid size", () => {
			expect(MetadataGuards.is_size(1.1)).toBe(false)
			expect(MetadataGuards.is_size(-2)).toBe(false)
			expect(MetadataGuards.is_size("hey" as any)).toBe(false)
			expect(MetadataGuards.is_size(undefined as any)).toBe(false)
		})
	})

	describe("isValidParent", () => {
		it("should return true if provided value is null", () => {
			expect(MetadataGuards.is_parent(null)).toBe(true)
		})

		it("should return true if provided value is a valid UUIDv4", () => {
			expect(MetadataGuards.is_parent(crypto.randomUUID())).toBe(true)
		})

		it("should return false if provided value is not a valid parent", () => {
			expect(MetadataGuards.is_parent("" as any)).toBe(false)
			expect(MetadataGuards.is_parent("asdf-asdf-asdf-asdf-asdf")).toBe(false)
			expect(MetadataGuards.is_parent(undefined as any)).toBe(false)
		})
	})

	describe("isType", () => {
		it("should return true if provided value is a non-empty string", () => {
			expect(MetadataGuards.is_type("asdf")).toBe(true)
		})

		it("should return false if provided value is not a valid content type", () => {
			expect(MetadataGuards.is_type("")).toBe(false)
		})
	})

	describe("isName", () => {
		it("should return true if provided value is a non-empty string", () => {
			expect(MetadataGuards.is_name("asdf")).toBe(true)
		})

		it("should return false if provided value is not a valid name", () => {
			expect(MetadataGuards.is_name("")).toBe(false)
		})
	})

	describe("areValidLabels", () => {
		it("should return true if provided labels are valid", () => {
			expect(MetadataGuards.are_labels(["asdf", "123123"])).toBe(true)
			expect(MetadataGuards.are_labels([])).toBe(true)
		})

		it("should return false if at least one label is invalid", () => {
			expect(MetadataGuards.are_labels([""])).toBe(false)
			expect(MetadataGuards.are_labels(["asdf", ""])).toBe(false)
			expect(MetadataGuards.are_labels([123 as any])).toBe(false)
		})
	})

	describe("areValidLinks", () => {
		it("should return true if provided links are valid", () => {
			expect(MetadataGuards.are_links([crypto.randomUUID(), crypto.randomUUID()])).toBe(true)
			expect(MetadataGuards.are_links([])).toBe(true)
		})

		it("should return false if at least one link is invalid", () => {
			expect(MetadataGuards.are_links(["" as any])).toBe(false)
			expect(MetadataGuards.are_links([crypto.randomUUID(), "" as any])).toBe(false)
			expect(MetadataGuards.are_links([undefined as any])).toBe(false)
			expect(MetadataGuards.are_links([123 as any, undefined])).toBe(false)
		})
	})
})
