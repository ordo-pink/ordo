import { describe, expect, it } from "bun:test"
import { BehaviorSubject } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"

import { type TMetadata, type TMetadataDTO } from "./metadata.types"
import { M } from "./metadata.impl"
import { MQ } from "./metadata-query.impl"
import { MR } from "./metadata-repository.impl"
import { type TRrr } from "./metadata.errors"

describe("MetadataQuery", () => {
	const metadata$ = new BehaviorSubject<TMetadata[] | null>(null)
	const m_repo = MR.of(metadata$)
	const m_query = MQ.of(m_repo)

	describe("get", () => {
		it("should return EAGAIN if metadata was not loaded", () => {
			metadata$.next(null)

			const { key, location } = m_query.get().unwrap() as TRrr

			expect(location).toEqual("MetadataRepository")
			expect(key).toEqual("EAGAIN")
		})

		it("should return all items if showHidden is on", () => {
			m_repo.put([
				M.from({ name: ".asdf", parent: null, author_id: "asdf-asdf-asdf-asdf-asdf" }),
				M.from({ name: "asdf", parent: null, author_id: "asdf-asdf-asdf-asdf-asdf" }),
			])

			const result = m_query.get({ show_hidden: true }).unwrap() as TMetadata[]

			expect(result.length).toEqual(2)
		})

		it("should filter out hidden items if showHidden is off", () => {
			m_repo.put([
				M.from({ name: ".asdf", parent: null, author_id: "asdf-asdf-asdf-asdf-asdf" }),
				M.from({ name: "asdf", parent: null, author_id: "asdf-asdf-asdf-asdf-asdf" }),
			])

			const result = m_query.get().unwrap() as TMetadata[]

			expect(result.length).toEqual(1)
		})

		it("should return [] if there are no items", () => {
			m_repo.put([])

			const result = m_query.get().unwrap() as TMetadata[]

			expect(result).toEqual([])
		})

		describe("total", () => {
			it("should return EAGAIN if metadata was not loaded", () => {
				metadata$.next(null)

				const { key, location } = m_query.total().unwrap() as TRrr

				expect(location).toEqual("MetadataRepository")
				expect(key).toEqual("EAGAIN")
			})

			it("should return 0 if there is no metadata", () => {
				m_repo.put([])

				const result = m_query.total().unwrap() as number

				expect(result).toEqual(0)
			})

			it("should return total number of metadata items", () => {
				m_repo.put([M.from({ name: "a", parent: null, author_id: "a-a-a-a-a" })])

				const result = m_query.total().unwrap() as number

				expect(result).toEqual(1)
			})
		})

		describe("getByFSID", () => {
			const fsid = crypto.randomUUID()

			it("should return EAGAIN if metadata was not loaded", () => {
				metadata$.next(null)

				const { key, location } = m_query.get_by_fsid(fsid).unwrap() as TRrr

				expect(location).toEqual("MetadataRepository")
				expect(key).toEqual("EAGAIN")
			})

			it("should return EINVAL if provided fsid is invalid", () => {
				m_repo.put([])

				const { location, key } = m_query.get_by_fsid("asdf" as any).unwrap() as TRrr

				expect(location).toEqual("MetadataQuery")
				expect(key).toEqual("EINVAL")
			})

			it("should return None if no metadata was found with given FSID", () => {
				m_repo.put([])

				const result = m_query.get_by_fsid(fsid).unwrap() as unknown as TOption<TMetadata>

				expect(result.is_option && result.is_none).toBeTrue()
			})

			it("should return Some(Metadata) if metadata was found with given FSID", () => {
				const dto: TMetadataDTO = {
					created_at: Date.now(),
					created_by: "a-a-a-a-a",
					fsid,
					labels: [],
					links: [],
					name: "a",
					parent: null,
					size: 0,
					type: "text/ordo",
					updated_at: Date.now(),
					updated_by: "a-a-a-a-a",
				}

				m_repo.put([M.of(dto)])

				const result = m_query.get_by_fsid(fsid).unwrap() as unknown as TOption<TMetadata>

				expect(result.is_option && result.is_some).toBeTrue()
				expect(result.unwrap()!.to_dto()).toEqual(dto)
			})
		})

		describe("getByLabels", () => {
			it("should return metadata with given labels", () => {
				m_repo.put([
					M.from({ name: "a", parent: null, author_id: "a-a-a-a-a", labels: ["a"] }),
					M.from({ name: "b", parent: null, author_id: "a-a-a-a-a", labels: ["b"] }),
					M.from({ name: "c", parent: null, author_id: "a-a-a-a-a", labels: ["a", "b"] }),
				])

				const result = m_query.get_by_labels(["a", "b"]).unwrap() as TMetadata[]

				expect(result.length).toEqual(1)
			})

			it("should return EAGAIN if metadata was not loaded", () => {
				metadata$.next(null)

				const { key, location } = m_query.get_by_labels(["a"]).unwrap() as TRrr

				expect(location).toEqual("MetadataRepository")
				expect(key).toEqual("EAGAIN")
			})

			it("should return MQ_INVALID_LABEL if label is invalid", () => {
				m_repo.put([M.from({ name: "123", parent: null, author_id: "a-a-a-a-a", labels: ["a"] })])

				const { location, key } = m_query.get_by_labels([" "]).unwrap() as TRrr

				expect(location).toEqual("MetadataQuery")
				expect(key).toEqual("EINVAL")
			})
		})

		describe("getByNameAndParent", () => {
			it("should return metadata if it exists", () => {
				const metadata = M.from({ name: "123", parent: null, author_id: "a-a-a-a-a" })

				m_repo.put([metadata])

				const option = m_query.get_by_name_and_parent("123", null).unwrap() as TOption<TMetadata>
				const result = option.unwrap()

				expect(result).toEqual(metadata)
			})

			it("should return none if metadata doesnt exist", () => {
				m_repo.put([M.from({ name: "a", parent: null, author_id: "a-a-a-a-a" })])

				const option = m_query.get_by_name_and_parent("b", null).unwrap() as TOption<TMetadata>

				expect(option.unwrap()).toEqual(O.None().unwrap() as any) // TODO
			})

			it("should return EAGAIN if metadata was not loaded", () => {
				metadata$.next(null)

				const { key, location } = m_query.get_by_name_and_parent("a", null).unwrap() as TRrr

				expect(location).toEqual("MetadataRepository")
				expect(key).toEqual("EAGAIN")
			})

			it("should return EINVAL if name is invalid", () => {
				m_repo.put([M.from({ name: "a", parent: null, author_id: "a-a-a-a-a" })])

				const { location, key } = m_query.get_by_name_and_parent("", null).unwrap() as TRrr

				expect(location).toEqual("MetadataQuery")
				expect(key).toEqual("EINVAL")
			})

			it("should return EINVAL if parent is invalid", () => {
				m_repo.put([M.from({ name: "a", parent: null, author_id: "a-a-a-a-a" })])

				const { location, key } = m_query.get_by_name_and_parent("a", "" as any).unwrap() as TRrr

				expect(location).toEqual("MetadataQuery")
				expect(key).toEqual("EINVAL")
			})
		})

		describe("getChildren", () => {
			it("should return EAGAIN if metadata was not loaded", () => {
				metadata$.next(null)

				const { key, location } = m_query.get_children(crypto.randomUUID()).unwrap() as TRrr

				expect(location).toEqual("MetadataRepository")
				expect(key).toEqual("EAGAIN")
			})

			it("should return item children", () => {
				const fsid = crypto.randomUUID()

				m_repo.put([
					M.of({
						created_at: Date.now(),
						created_by: "asdf-asdf-asdasd-asfas-asfasf-asdasd",
						fsid,
						labels: [],
						links: [],
						name: "1223",
						parent: null,
						size: 0,
						type: "text",
						updated_at: Date.now(),
						updated_by: "asdf-asdf-asdasd-asfas-asfasf-asdasd",
					}),
					M.from({
						name: "323-2343-23423-4324-23434",
						parent: fsid,
						author_id: "asdf-asdf-asdasd-asfas-asfasf-asdasd",
					}),
					M.from({
						name: "44422-2343-23423-4324-23434",
						parent: fsid,
						author_id: "asdf-asdf-asdasd-asfas-asfasf-asdasd",
					}),
					M.from({
						name: "444-2343-23423-4324-23434",
						parent: fsid,
						author_id: "asdf-asdf-asdasd-asfas-asfasf-asdasd",
					}),
				])

				const result = m_query.get_children(fsid).unwrap() as TMetadata[]

				expect(result.length).toEqual(3)
			})

			it("should return ENOENT if metadata with this fsid does not exist", () => {
				const fsid = crypto.randomUUID()

				m_repo.put([])

				const { location, key } = m_query.get_children(fsid).unwrap() as TRrr

				expect(location).toEqual("MetadataQuery")
				expect(key).toEqual("ENOENT")
			})

			it("should return EINVAL if fsid is invalid", () => {
				m_repo.put([])

				const { location, key } = m_query.get_children("a" as any).unwrap() as TRrr

				expect(location).toEqual("MetadataQuery")
				expect(key).toEqual("EINVAL")
			})
		})
	})
})
