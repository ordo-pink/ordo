import { describe, expect, it } from "bun:test"
import { BehaviorSubject } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"

import { RRR, type TRrr } from "./metadata.errors"
import { type TMetadata, type TMetadataDTO } from "./metadata.types"
import { Metadata } from "./metadata.impl"
import { MetadataQuery } from "./metadata-query.impl"
import { MetadataRepository } from "./metadata-repository.impl"

describe("MetadataQuery", () => {
	const metadata$ = new BehaviorSubject<TMetadata[] | null>(null)
	const repo = MetadataRepository.of(metadata$)
	const query = MetadataQuery.of(repo)

	describe("get", () => {
		it("should return EAGAIN if metadata was not loaded", () => {
			metadata$.next(null)

			const { key, location } = query.get().unwrap() as TRrr

			expect(location).toEqual("MetadataRepository")
			expect(key).toEqual("EAGAIN")
		})

		it("should return all items if showHidden is on", () => {
			repo.put([
				Metadata.from({ name: ".asdf", parent: null, user: "asdf-asdf-asdf-asdf-asdf" }),
				Metadata.from({ name: "asdf", parent: null, user: "asdf-asdf-asdf-asdf-asdf" }),
			])

			const result = query.get({ showHidden: true }).unwrap() as TOption<TMetadata[]>

			expect(result.unwrap()!.length).toEqual(2)
		})

		it("should filter out hidden items if showHidden is off", () => {
			repo.put([
				Metadata.from({ name: ".asdf", parent: null, user: "asdf-asdf-asdf-asdf-asdf" }),
				Metadata.from({ name: "asdf", parent: null, user: "asdf-asdf-asdf-asdf-asdf" }),
			])

			const result = query.get().unwrap() as TOption<TMetadata[]>

			expect(result.unwrap()!.length).toEqual(1)
		})

		it("should return None if there are no items", () => {
			repo.put([])

			const result = query.get().unwrap() as TOption<TMetadata[]>

			expect(result).toEqual(O.none())
		})

		describe("total", () => {
			it("should return EAGAIN if metadata was not loaded", () => {
				metadata$.next(null)

				const { key, location } = query.total().unwrap() as TRrr

				expect(location).toEqual("MetadataRepository")
				expect(key).toEqual("EAGAIN")
			})

			it("should return 0 if there is no metadata", () => {
				repo.put([])

				const result = query.total().unwrap() as number

				expect(result).toEqual(0)
			})

			it("should return total number of metadata items", () => {
				repo.put([Metadata.from({ name: "a", parent: null, user: "a-a-a-a-a" })])

				const result = query.total().unwrap() as number

				expect(result).toEqual(1)
			})
		})

		describe("getByFSID", () => {
			const fsid = crypto.randomUUID()

			it("should return EAGAIN if metadata was not loaded", () => {
				metadata$.next(null)

				const { key, location } = query.getByFSID(fsid).unwrap() as TRrr

				expect(location).toEqual("MetadataRepository")
				expect(key).toEqual("EAGAIN")
			})

			it("should return EINVAL if provided fsid is invalid", () => {
				repo.put([])

				const { location, key } = query.getByFSID("asdf" as any).unwrap() as TRrr

				expect(location).toEqual("MetadataQuery")
				expect(key).toEqual("EINVAL")
			})

			it("should return None if no metadata was found with given FSID", () => {
				repo.put([])

				const result = query.getByFSID(fsid).unwrap() as unknown as TOption<TMetadata>

				expect(result.isOption && result.isNone).toBeTrue()
			})

			it("should return Some(Metadata) if metadata was found with given FSID", () => {
				const dto: TMetadataDTO = {
					createdAt: Date.now(),
					createdBy: "a-a-a-a-a",
					fsid,
					labels: [],
					links: [],
					name: "a",
					parent: null,
					size: 0,
					type: "text/ordo",
					updatedAt: Date.now(),
					updatedBy: "a-a-a-a-a",
				}

				repo.put([Metadata.of(dto)])

				const result = query.getByFSID(fsid).unwrap() as unknown as TOption<TMetadata>

				expect(result.isOption && result.isSome).toBeTrue()
				expect(result.unwrap()!.toDTO()).toEqual(dto)
			})
		})

		describe("getByLabels", () => {
			it("should return metadata with given labels", () => {
				repo.put([
					Metadata.from({ name: "a", parent: null, user: "a-a-a-a-a", labels: ["a"] }),
					Metadata.from({ name: "b", parent: null, user: "a-a-a-a-a", labels: ["b"] }),
					Metadata.from({ name: "c", parent: null, user: "a-a-a-a-a", labels: ["a", "b"] }),
				])

				const result = query.getByLabels(["a", "b"]).unwrap() as TOption<TMetadata[]>

				expect(result.unwrap()!.length).toEqual(1)
			})

			it("should return EAGAIN if metadata was not loaded", () => {
				metadata$.next(null)

				const { key, location } = query.getByLabels(["a"]).unwrap() as TRrr

				expect(location).toEqual("MetadataRepository")
				expect(key).toEqual("EAGAIN")
			})

			it("should return MQ_INVALID_LABEL if label is invalid", () => {
				repo.put([Metadata.from({ name: "123", parent: null, user: "a-a-a-a-a", labels: ["a"] })])

				const { location, key } = query.getByLabels([" "]).unwrap() as TRrr

				expect(location).toEqual("MetadataQuery")
				expect(key).toEqual("EINVAL")
			})
		})

		describe("getByNameAndParent", () => {
			it("should return metadata if it exists", () => {
				const metadata = Metadata.from({ name: "123", parent: null, user: "a-a-a-a-a" })

				repo.put([metadata])

				const option = query.getByNameAndParent("123", null).unwrap() as TOption<TMetadata>
				const result = option.unwrap()

				expect(result).toEqual(metadata)
			})

			it("should return none if metadata doesnt exist", () => {
				repo.put([Metadata.from({ name: "a", parent: null, user: "a-a-a-a-a" })])

				const option = query.getByNameAndParent("b", null).unwrap() as TOption<TMetadata>

				expect(option.unwrap()).toEqual(O.none().unwrap() as any) // TODO
			})

			it("should return EAGAIN if metadata was not loaded", () => {
				metadata$.next(null)

				const { key, location } = query.getByNameAndParent("a", null).unwrap() as TRrr

				expect(location).toEqual("MetadataRepository")
				expect(key).toEqual("EAGAIN")
			})

			it("should return EINVAL if name is invalid", () => {
				repo.put([Metadata.from({ name: "a", parent: null, user: "a-a-a-a-a" })])

				const { location, key } = query.getByNameAndParent("", null).unwrap() as TRrr

				expect(location).toEqual("MetadataQuery")
				expect(key).toEqual("EINVAL")
			})

			it("should return EINVAL if parent is invalid", () => {
				repo.put([Metadata.from({ name: "a", parent: null, user: "a-a-a-a-a" })])

				const { location, key } = query.getByNameAndParent("a", "" as any).unwrap() as TRrr

				expect(location).toEqual("MetadataQuery")
				expect(key).toEqual("EINVAL")
			})
		})

		describe("getChildren", () => {
			it("should return EAGAIN if metadata was not loaded", () => {
				metadata$.next(null)

				const { key, location } = query.getChildren(crypto.randomUUID()).unwrap() as TRrr

				expect(location).toEqual("MetadataRepository")
				expect(key).toEqual("EAGAIN")
			})

			it("should return item children", () => {
				const fsid = crypto.randomUUID()

				repo.put([
					Metadata.of({
						createdAt: Date.now(),
						createdBy: "asdf-asdf-asdasd-asfas-asfasf-asdasd",
						fsid,
						labels: [],
						links: [],
						name: "1223",
						parent: null,
						size: 0,
						type: "text",
						updatedAt: Date.now(),
						updatedBy: "asdf-asdf-asdasd-asfas-asfasf-asdasd",
					}),
					Metadata.from({
						name: "323-2343-23423-4324-23434",
						parent: fsid,
						user: "asdf-asdf-asdasd-asfas-asfasf-asdasd",
					}),
					Metadata.from({
						name: "44422-2343-23423-4324-23434",
						parent: fsid,
						user: "asdf-asdf-asdasd-asfas-asfasf-asdasd",
					}),
					Metadata.from({
						name: "444-2343-23423-4324-23434",
						parent: fsid,
						user: "asdf-asdf-asdasd-asfas-asfasf-asdasd",
					}),
				])

				const result = query.getChildren(fsid).unwrap() as TOption<TMetadata[]>

				expect(result.unwrap()!.length).toEqual(3)
			})

			it("should return ENOENT if metadata with this fsid does not exist", () => {
				const fsid = crypto.randomUUID()

				repo.put([])

				const { location, key } = query.getChildren(fsid).unwrap() as TRrr

				expect(location).toEqual("MetadataQuery")
				expect(key).toEqual("ENOENT")
			})

			it("should return EINVAL if fsid is invalid", () => {
				repo.put([])

				const { location, key } = query.getChildren("a" as any).unwrap() as TRrr

				expect(location).toEqual("MetadataQuery")
				expect(key).toEqual("EINVAL")
			})
		})
	})
})
