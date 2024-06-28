import { describe, expect, it } from "bun:test"
import { BehaviorSubject } from "rxjs"

import { MetadataQuery } from "./metadata-query.impl"
import { RRR } from "./metadata.errors"
import { type TMetadata } from "./metadata.types"

const metadata$ = new BehaviorSubject<TMetadata[] | null>(null)

describe("MetadataQuery", () => {
	const query = MetadataQuery.of(metadata$)

	describe("get", () => {
		it("should return left of RRR if metadata was not loaded", () => {
			metadata$.next(null)

			const result = query.get().fold(
				x => x,
				x => x,
			)

			expect(result).toEqual(RRR.METADATA_NOT_LOADED)
		})

		it("should return all items if showHidden is on", () => {})
	})
})
