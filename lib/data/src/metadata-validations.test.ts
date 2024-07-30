// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { describe, expect, it } from "bun:test"

import { MetadataValidations } from "./metadata-validations"

describe("metadata-validations", () => {
	describe("isValidSize", () => {
		it("should return true if provided value is a valid non-negative integer", () => {
			expect(MetadataValidations.is_size(0)).toBe(true)
			expect(MetadataValidations.is_size(1)).toBe(true)
		})

		it("should return false if provided value is not a valid size", () => {
			expect(MetadataValidations.is_size(1.1)).toBe(false)
			expect(MetadataValidations.is_size(-2)).toBe(false)
			expect(MetadataValidations.is_size("hey" as any)).toBe(false)
			expect(MetadataValidations.is_size(undefined as any)).toBe(false)
		})
	})

	describe("isValidParent", () => {
		it("should return true if provided value is null", () => {
			expect(MetadataValidations.is_parent(null)).toBe(true)
		})

		it("should return true if provided value is a valid UUIDv4", () => {
			expect(MetadataValidations.is_parent(crypto.randomUUID())).toBe(true)
		})

		it("should return false if provided value is not a valid parent", () => {
			expect(MetadataValidations.is_parent("" as any)).toBe(false)
			expect(MetadataValidations.is_parent("asdf-asdf-asdf-asdf-asdf")).toBe(false)
			expect(MetadataValidations.is_parent(undefined as any)).toBe(false)
		})
	})

	describe("isType", () => {
		it("should return true if provided value is a non-empty string", () => {
			expect(MetadataValidations.is_type("asdf")).toBe(true)
		})

		it("should return false if provided value is not a valid content type", () => {
			expect(MetadataValidations.is_type("")).toBe(false)
		})
	})

	describe("isName", () => {
		it("should return true if provided value is a non-empty string", () => {
			expect(MetadataValidations.is_name("asdf")).toBe(true)
		})

		it("should return false if provided value is not a valid name", () => {
			expect(MetadataValidations.is_name("")).toBe(false)
		})
	})

	describe("areValidLabels", () => {
		it("should return true if provided labels are valid", () => {
			expect(MetadataValidations.are_labels(["asdf", "123123"])).toBe(true)
			expect(MetadataValidations.are_labels([])).toBe(true)
		})

		it("should return false if at least one label is invalid", () => {
			expect(MetadataValidations.are_labels([""])).toBe(false)
			expect(MetadataValidations.are_labels(["asdf", ""])).toBe(false)
			expect(MetadataValidations.are_labels([123 as any])).toBe(false)
		})
	})

	describe("areValidLinks", () => {
		it("should return true if provided links are valid", () => {
			expect(MetadataValidations.are_links([crypto.randomUUID(), crypto.randomUUID()])).toBe(true)
			expect(MetadataValidations.are_links([])).toBe(true)
		})

		it("should return false if at least one link is invalid", () => {
			expect(MetadataValidations.are_links(["" as any])).toBe(false)
			expect(MetadataValidations.are_links([crypto.randomUUID(), "" as any])).toBe(false)
			expect(MetadataValidations.are_links([undefined as any])).toBe(false)
			expect(MetadataValidations.are_links([123 as any, undefined])).toBe(false)
		})
	})
})
