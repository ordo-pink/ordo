import { describe, expect, it } from "bun:test"
import { BehaviorSubject } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"

import { type TMetadata, type TMetadataDTO } from "./metadata.types"
import { Metadata } from "./metadata.impl"
import { MetadataQuery } from "./metadata-query.impl"
import { MetadataRepository } from "./metadata-repository.impl"
import { RRR } from "./metadata.errors"

describe("MetadataQuery", () => {
	const metadata$ = new BehaviorSubject<TMetadata[] | null>(null)
	const repo = MetadataRepository.of(metadata$)
	const query = MetadataQuery.of(repo)

	describe("get", () => {
		it("should return left of RRR if metadata was not loaded", () => {
			metadata$.next(null)

			const result = query.get().unwrap()

			expect(result).toEqual(RRR.MR_EAGAIN)
		})

		it("should return all items if showHidden is on", () => {
			query.metadataRepository.put([
				Metadata.from({ name: ".asdf", parent: null, user: "asdf-asdf-asdf-asdf-asdf" }),
				Metadata.from({ name: "asdf", parent: null, user: "asdf-asdf-asdf-asdf-asdf" }),
			])

			const result = query.get({ showHidden: true }).unwrap()

			expect((result as TMetadata[]).length).toEqual(2)
		})

		it("should filter out hidden items if showHidden is off", () => {
			query.metadataRepository.put([
				Metadata.from({ name: ".asdf", parent: null, user: "asdf-asdf-asdf-asdf-asdf" }),
				Metadata.from({ name: "asdf", parent: null, user: "asdf-asdf-asdf-asdf-asdf" }),
			])

			const result = query.get().unwrap()

			expect((result as TMetadata[]).length).toEqual(1)
		})

		it("should return empty array if there are no items", () => {
			query.metadataRepository.put([])

			const result = query.get().unwrap()

			expect(result).toEqual([])
		})

		it("should return EAGAIN if metadata is loading", () => {
			metadata$.next(null)

			const result = query.get().unwrap()

			expect(result).toEqual(RRR.MR_EAGAIN)
		})
	})

	describe("getByFSID", () => {
		const fsid = crypto.randomUUID()

		it("should return EAGAIN if metadata is loading", () => {
			metadata$.next(null)

			const result = query.getByFSID(fsid).unwrap()

			expect(result).toEqual(RRR.MR_EAGAIN)
		})

		it("should return EINVAL if provided fsid is invalid", () => {
			metadata$.next([])

			const result = query.getByFSID("asdf" as any).unwrap()

			expect(result).toEqual(RRR.MV_EINVAL_FSID)
		})

		it("should return None if no metadata was found with given FSID", () => {
			query.metadataRepository.put([])

			const result = query.getByFSID(fsid).unwrap() as unknown as TOption<TMetadata>

			expect(result.isOption && result.isNone).toBeTrue()
		})

		it("should return Some(Metadata) if metadata was found with given FSID", () => {
			const dto: TMetadataDTO = {
				createdAt: Date.now(),
				createdBy: "asdf-asdf-asdf-asdf-asdf",
				fsid,
				labels: [],
				links: [],
				name: "asdf",
				parent: null,
				size: 0,
				type: "text/ordo",
				updatedAt: Date.now(),
				updatedBy: "asdf-asdf-asdf-asdf-asdf",
			}

			query.metadataRepository.put([Metadata.of(dto)])

			const result = query.getByFSID(fsid).unwrap() as unknown as TOption<TMetadata>

			expect(result.isOption && result.isSome).toBeTrue()
			expect((result.unwrap() as TMetadata).toDTO()).toEqual(dto)
		})
	})

	describe("getByLabels", () => {
		it("should return metadata with given labels", () => {
			metadata$.next(null)
			repo.put([
				Metadata.from({
					name: "123",
					parent: null,
					user: "asdfg-asdf-asdf-asdfa-asdfas",
					labels: ["asdf"],
				}),
				Metadata.from({
					name: "12312",
					parent: null,
					user: "asdfg-asdf-asdf-asdfa-asdfas",
					labels: ["asfg"],
				}),
				Metadata.from({
					name: "423432",
					parent: null,
					user: "asdfg-asdf-asdf-asdfa-asdfas",
					labels: ["asfg", "asdf"],
				}),
			])

			const result = query.getByLabels(["asfg", "asdf"]).unwrap() as TMetadata[]
			expect(result.length).toEqual(1)
		})
		it("should return EAGAIN if metadata is null", () => {
			metadata$.next(null)
			const result = query.getByLabels(["asfg", "asdf"]).unwrap() as number
			expect(result).toEqual(RRR.MR_EAGAIN)
		})

		it("should return MQ_INVALID_LABEL if label is invalid", () => {
			metadata$.next(null)
			repo.put([
				Metadata.from({
					name: "123",
					parent: null,
					user: "asdfg-asdf-asdf-asdfa-asdfas",
					labels: ["asdf"],
				}),
			])
			const result = query.getByLabels([" "]).unwrap() as number
			expect(result).toEqual(RRR.MQ_INVALID_LABEL)
		})
	})

	describe("getByNameAndParent", () => {
		it("should return metadata if it exists", () => {
			const metadata = Metadata.from({
				name: "123",
				parent: null,
				user: "asdfg-asdf-asdf-asdfa-asdfas",
			})
			metadata$.next(null)
			repo.put([metadata])

			const option = query.getByNameAndParent("123", null).unwrap() as TOption<TMetadata>
			const result = option.unwrap()
			expect(result).toEqual(metadata)
		})
		it("should return none if metadata doesnt exist", () => {
			const metadata = Metadata.from({
				name: "123",
				parent: null,
				user: "asdfg-asdf-asdf-asdfa-asdfas",
			})
			metadata$.next(null)
			repo.put([metadata])

			const option = query.getByNameAndParent("12345", null).unwrap() as TOption<TMetadata>
			expect(option.unwrap()).toEqual(O.none().unwrap() as any) // TODO
		})
		it("should return EAGAIN if metadata is null", () => {
			metadata$.next(null)
			const result = query.getByNameAndParent("1111", null).unwrap() as number
			expect(result).toEqual(RRR.MR_EAGAIN)
		})
		it("should return EINVAL if name is invalid", () => {
			const metadata = Metadata.from({
				name: "123",
				parent: null,
				user: "asdfg-asdf-asdf-asdfa-asdfas",
			})
			metadata$.next(null)
			repo.put([metadata])
			const result = query.getByNameAndParent("", null).unwrap() as number
			expect(result).toEqual(RRR.MV_EINVAL_NAME)
		})
		it("should return EINVAL if parent is invalid", () => {
			const metadata = Metadata.from({
				name: "123",
				parent: null,
				user: "asdfg-asdf-asdf-asdfa-asdfas",
			})
			metadata$.next(null)
			repo.put([metadata])
			const result = query.getByNameAndParent("123", "" as any).unwrap() as number
			expect(result).toEqual(RRR.MV_EINVAL_PARENT)
		})
	})

	describe("getChildren", () => {
		it("should return item children", () => {
			const fsid = crypto.randomUUID()
			const metadata = [
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
			]
			repo.put(metadata)

			const result = query.getChildren(fsid).unwrap() as TMetadata[]
			expect(result.length).toEqual(3)
		})
		it("should return EAGAIN if metadata is null", () => {
			const fsid = crypto.randomUUID()
			metadata$.next(null)
			const result = query.getChildren(fsid).unwrap() as number
			expect(result).toEqual(RRR.MR_EAGAIN)
		})
		it("should return ENOENT if metadata with this fsid doesnt exist", () => {
			const fsid = crypto.randomUUID()
			repo.put([])
			const result = query.getChildren(fsid).unwrap() as number
			expect(result).toEqual(RRR.MQ_ENOENT)
		})
		it("should return EINVAL if fsid is invalid", () => {
			repo.put([])
			const result = query.getChildren("a" as any).unwrap() as number
			expect(result).toEqual(RRR.MV_EINVAL_FSID)
		})
	})
})
