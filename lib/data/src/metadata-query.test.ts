import { describe, expect, it } from "bun:test"
import { BehaviorSubject } from "rxjs"

import { Metadata } from "./metadata.impl"
import { MetadataQuery } from "./metadata-query.impl"
import { MetadataRepository } from "./metadata-repository.impl"
import { RRR } from "./metadata.errors"
import { type TMetadata } from "./metadata.types"

describe("MetadataQuery", () => {
	const metadata$ = new BehaviorSubject<TMetadata[] | null>(null)
	const repo = MetadataRepository.of(metadata$)
	const query = MetadataQuery.of(repo)

	describe("get", () => {
		it("should return left of RRR if metadata was not loaded", () => {
			query.metadataRepository.put(null as any)

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
	})
})
