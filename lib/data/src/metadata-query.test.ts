import { describe, expect, it } from "bun:test"
import { BehaviorSubject } from "rxjs"

import { type TOption } from "@ordo-pink/option"

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
})
