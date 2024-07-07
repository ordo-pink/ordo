import { describe, expect, it } from "bun:test"
import { MetadataRepository } from "./metadata-repository.impl"
import { BehaviorSubject } from "rxjs"
import { TMetadata } from "./metadata.types"
import { RRR } from "./metadata.errors"
import { Metadata } from "./metadata.impl"

describe("metadata-repository", () => {
    const metadata$ = new BehaviorSubject<TMetadata[] | null>(null)
    const metadataRepository = MetadataRepository.of(metadata$)
    describe("get", () => {
        it("should return EAGAIN if metadata$ is empty", () => {
            metadata$.next(null)
            const result = metadataRepository.get().unwrap()
            expect(result).toEqual(RRR.MR_EAGAIN)
        })
        it("should return metadata", () => {
            const metadata = [
                Metadata.from({
                    name: "123",
                    parent: null,
                    user: "asdf-asdf-asdf-asdf-asdf"
                })
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
                    user: "asdf-asdf-asdf-asdf-asdf"
                })
            ]
            const result = metadataRepository.put(metadata).unwrap()
            expect(result).toEqual(undefined)
        })
        it("should return EPREM if metadata is wrong", () => {
            metadata$.next(null)
            const result = metadataRepository.put(null as any).unwrap()
            expect(result).toEqual(RRR.MR_EPERM)
        })
    })
})