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

import { O } from "@ordo-pink/option"
import { is_uuid } from "@ordo-pink/tau"

import { Metadata } from "./metadata.impl"

const fsid = crypto.randomUUID()
const link = crypto.randomUUID()

const test1 = Metadata.from({ name: "test", parent: null, author_id: "test-test-test-test-test" })

const test2 = Metadata.from({
	name: "test",
	parent: null,
	author: "test-test-test-test-test",
	labels: ["test1", "test2"],
	links: [link],
	props: { hello: "world" },
	type: "application/test",
	size: 123,
} as any)
const dto = {
	name: "test",
	parent: link,
	created_by: "asdf-asdf-asdf-asdf-asdf" as const,
	updated_by: "asdf-asdf-asdf-asdf-asdf" as const,
	created_at: Date.now(),
	updated_at: Date.now(),
	fsid,
	labels: ["hey", "there"],
	links: [link],
	size: 1280,
	type: "application/test",
}
const test3 = Metadata.of(dto)

describe("Metadata", () => {
	describe("`Metadata.from` required properties", () => {
		it("getName should return DTO name", () => {
			expect(test1.get_name()).toEqual("test")
		})

		it("getParent should return DTO parent", () => {
			expect(test1.get_parent()).toEqual(null)
		})

		it("getCreatedBy should return DTO createdBy", () => {
			expect(test1.get_created_by()).toEqual("test-test-test-test-test")
		})

		it("getUpdatedBy should return DTO createdBy", () => {
			expect(test1.get_updated_by()).toEqual("test-test-test-test-test")
		})
	})

	describe("getType", () => {
		it("should return standard DTO type if it was not provided", () => {
			expect(test1.get_type()).toEqual("text/ordo")
		})

		it("should return provided DTO type", () => {
			expect(test2.get_type()).toEqual("application/test")
		})
	})

	describe("getCreatedAt", () => {
		it("should return DTO createdAt as a date", () => {
			const createdAt = test1.get_created_at()

			expect(createdAt).toBeDefined()
			expect(createdAt).toBeInstanceOf(Date)
			expect(createdAt <= new Date(Date.now())).toBeTrue()
		})
	})

	describe("getUpdatedAt", () => {
		it("should return DTO updatedAt as a date", () => {
			const updatedAt = test1.get_updated_at()

			expect(updatedAt).toBeDefined()
			expect(updatedAt).toBeInstanceOf(Date)
			expect(updatedAt <= new Date(Date.now())).toBeTrue()
		})
	})

	describe("getLinks", () => {
		it("should return DTO links", () => {
			expect(test1.get_links()).toEqual([])
			expect(test2.get_links()).toEqual([link])
		})
	})

	describe("getLabels", () => {
		it("should return DTO labels", () => {
			expect(test1.get_labels()).toEqual([])
			expect(test2.get_labels()).toEqual(["test1", "test2"])
		})
	})

	describe("getProperty", () => {
		it("should return Some(property) if it exists", () => {
			expect(test2.get_property("hello")).toBeDefined()
			expect(test2.get_property("hello").unwrap()).toEqual("world")
		})

		it("should return None() if property does not exist", () => {
			expect(test1.get_property("hello")).toBeDefined()
			expect(test1.get_property("hello").unwrap()).toEqual(O.None().unwrap()) //TODO
		})
	})

	describe("size", () => {
		it("getSize should return item size", () => {
			expect(test1.get_size()).toEqual(0)
			expect(test2.get_size()).toEqual(0)
			expect(test3.get_size()).toEqual(1280)
		})

		it("getReadableSize should return valid readable size", () => {
			expect(test1.get_readable_size()).toEqual("0B")
			expect(test3.get_readable_size()).toEqual("1.25KB")
		})
	})

	describe("getFSID", () => {
		it("should return DTO FSID", () => {
			expect(test1.get_fsid()).toBeDefined()
			expect(is_uuid(test1.get_fsid())).toBeTrue()
			expect(test3.get_fsid()).toEqual(fsid)
		})
	})

	describe("toDTO", () => {
		it("should return DTO stored enclosed in Metadata", () => {
			expect(test3.to_dto()).toEqual(dto)
		})
	})

	describe("hasLabel", () => {
		it("should return a boolean reflecting whether the DTO includes a label", () => {
			expect(test2.has_label("test1")).toBeTrue()
			expect(test2.has_label("asdf")).toBeFalse()
		})
	})

	describe("hasLabels", () => {
		it("should return a boolean reflecting whether the DTO has labels", () => {
			expect(test2.has_labels()).toBeTrue()
			expect(test1.has_labels()).toBeFalse()
		})
	})

	describe("hasLinkTo", () => {
		it("should return a boolean reflecting whether the DTO includes a link to", () => {
			expect(test2.has_link_to(link)).toBeTrue()
			expect(test1.has_link_to(link)).toBeFalse()
		})
	})

	describe("hasLinks", () => {
		it("should return a boolean reflecting whether the DTO has links", () => {
			expect(test2.has_links()).toBeTrue()
			expect(test1.has_links()).toBeFalse()
		})
	})

	describe("isRootChild", () => {
		it("should return a boolean reflecting whether the DTO parent is null", () => {
			expect(test1.is_root_child()).toBeTrue()
			expect(test3.is_root_child()).toBeFalse()
		})
	})

	describe("isChildOf", () => {
		it("should return a boolean reflecting whether the DTO parent is given FSID", () => {
			expect(test3.is_child_of(link)).toBeTrue()
			expect(test1.is_child_of(link)).toBeFalse()
		})
	})
})
