import { describe, expect, it } from "bun:test"

import { O } from "@ordo-pink/option"
import { isUUID } from "@ordo-pink/tau"

import { Metadata } from "./metadata.impl"

const fsid = crypto.randomUUID()
const link = crypto.randomUUID()

const test1 = Metadata.from({ name: "test", parent: null, user: "test-test-test-test-test" })

const test2 = Metadata.from({
	name: "test",
	parent: null,
	user: "test-test-test-test-test",
	labels: ["test1", "test2"],
	links: [link],
	props: { hello: "world" },
	type: "application/test",
	size: 123,
} as any)
const dto = {
	name: "test",
	parent: link,
	createdBy: "asdf-asdf-asdf-asdf-asdf" as const,
	updatedBy: "asdf-asdf-asdf-asdf-asdf" as const,
	createdAt: Date.now(),
	updatedAt: Date.now(),
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
			expect(test1.getName()).toEqual("test")
		})

		it("getParent should return DTO parent", () => {
			expect(test1.getParent()).toEqual(null)
		})

		it("getCreatedBy should return DTO createdBy", () => {
			expect(test1.getCreatedBy()).toEqual("test-test-test-test-test")
		})

		it("getUpdatedBy should return DTO createdBy", () => {
			expect(test1.getUpdatedBy()).toEqual("test-test-test-test-test")
		})
	})

	describe("getType", () => {
		it("should return standard DTO type if it was not provided", () => {
			expect(test1.getType()).toEqual("text/ordo")
		})

		it("should return provided DTO type", () => {
			expect(test2.getType()).toEqual("application/test")
		})
	})

	describe("getCreatedAt", () => {
		it("should return DTO createdAt as a date", () => {
			const createdAt = test1.getCreatedAt()

			expect(createdAt).toBeDefined()
			expect(createdAt).toBeInstanceOf(Date)
			expect(createdAt <= new Date(Date.now())).toBeTrue()
		})
	})

	describe("getUpdatedAt", () => {
		it("should return DTO updatedAt as a date", () => {
			const updatedAt = test1.getUpdatedAt()

			expect(updatedAt).toBeDefined()
			expect(updatedAt).toBeValidDate()
			expect(updatedAt <= new Date(Date.now())).toBeTrue()
		})
	})

	describe("getLinks", () => {
		it("should return DTO links", () => {
			expect(test1.getLinks()).toEqual([])
			expect(test2.getLinks()).toEqual([link])
		})
	})

	describe("getLabels", () => {
		it("should return DTO labels", () => {
			expect(test1.getLabels()).toEqual([])
			expect(test2.getLabels()).toEqual(["test1", "test2"])
		})
	})

	describe("getProperty", () => {
		it("should return Some(property) if it exists", () => {
			expect(test2.getProperty("hello")).toBeDefined()
			expect(test2.getProperty("hello").unwrap()).toEqual("world")
		})

		it("should return None() if property does not exist", () => {
			expect(test1.getProperty("hello")).toBeDefined()
			expect(test1.getProperty("hello")).toEqual(O.none())
		})
	})

	describe("size", () => {
		it("getSize should return item size", () => {
			expect(test1.getSize()).toEqual(0)
			expect(test2.getSize()).toEqual(0)
			expect(test3.getSize()).toEqual(1280)
		})

		it("getReadableSize should return valid readable size", () => {
			expect(test1.getReadableSize()).toEqual("0B")
			expect(test3.getReadableSize()).toEqual("1.25KB")
		})
	})

	describe("getFSID", () => {
		it("should return DTO FSID", () => {
			expect(test1.getFSID()).toBeDefined()
			expect(isUUID(test1.getFSID())).toBeTrue()
			expect(test3.getFSID()).toEqual(fsid)
		})
	})

	describe("toDTO", () => {
		it("should return DTO stored enclosed in Metadata", () => {
			expect(test3.toDTO()).toEqual(dto)
		})
	})

	describe("hasLabel", () => {
		it("should return a boolean reflecting whether the DTO includes a label", () => {
			expect(test2.hasLabel("test1")).toBeTrue()
			expect(test2.hasLabel("asdf")).toBeFalse()
		})
	})

	describe("hasLabels", () => {
		it("should return a boolean reflecting whether the DTO has labels", () => {
			expect(test2.hasLabels()).toBeTrue()
			expect(test1.hasLabels()).toBeFalse()
		})
	})

	describe("hasLinkTo", () => {
		it("should return a boolean reflecting whether the DTO includes a link to", () => {
			expect(test2.hasLinkTo(link)).toBeTrue()
			expect(test1.hasLinkTo(link)).toBeFalse()
		})
	})

	describe("hasLinks", () => {
		it("should return a boolean reflecting whether the DTO has links", () => {
			expect(test2.hasLinks()).toBeTrue()
			expect(test1.hasLinks()).toBeFalse()
		})
	})

	describe("isRootChild", () => {
		it("should return a boolean reflecting whether the DTO parent is null", () => {
			expect(test1.isRootChild()).toBeTrue()
			expect(test3.isRootChild()).toBeFalse()
		})
	})

	describe("isChildOf", () => {
		it("should return a boolean reflecting whether the DTO parent is given FSID", () => {
			expect(test3.isChildOf(link)).toBeTrue()
			expect(test1.isChildOf(link)).toBeFalse()
		})
	})
})
