import { describe, expect, it } from "bun:test"
import { BehaviorSubject } from "rxjs"

import { RRR, type TRrr } from "./metadata.errors"
import { Metadata } from "./metadata.impl"
import { MetadataRepository } from "./metadata-repository.impl"
import { type TMetadata } from "./metadata.types"

describe("metadata-repository", () => {
	const metadata$ = new BehaviorSubject<TMetadata[] | null>(null)
	const metadataRepository = MetadataRepository.of(metadata$)

	describe("get", () => {
		it("should return EAGAIN if metadata$ is empty", () => {
			metadata$.next(null)

			const { key, code, debug: spec, location } = metadataRepository.get().unwrap() as TRrr

			expect(key).toEqual("EAGAIN")
			expect(spec).toEqual(".get Metadata[] not initialised")
			expect(code).toEqual(RRR.EAGAIN)
			expect(location).toEqual("MetadataRepository")
		})

		it("should return metadata", () => {
			const metadata = [
				Metadata.from({
					name: "123",
					parent: null,
					user: "asdf-asdf-asdf-asdf-asdf",
				}),
			]
			metadata$.next(metadata)
			const result = metadataRepository.get().unwrap()
			expect(result).toEqual(metadata)
		})
	})
	describe("put", () => {
		it("should return void if metadata is correct", () => {
			metadata$.next(null)
			const metadata = [
				Metadata.from({
					name: "123",
					parent: null,
					user: "asdf-asdf-asdf-asdf-asdf",
				}),
			]
			const result = metadataRepository.put(metadata).unwrap()
			expect(result).toEqual(undefined)
		})

		it("should return EINVAL if metadata is wrong", () => {
			metadata$.next(null)
			const {
				key,
				code,
				debug: spec,
				location,
			} = metadataRepository.put(null as any).unwrap() as TRrr
			expect(key).toEqual("EINVAL")
			expect(spec).toEqual(".put expected Metadata[], got null")
			expect(code).toEqual(RRR.EINVAL)
			expect(location).toEqual("MetadataRepository")
		})
	})
})
