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

			const { key, code, location } = metadataRepository.get().unwrap() as TRrr

			expect(key).toEqual("EAGAIN")
			expect(code).toEqual(RRR.enum.EAGAIN)
			expect(location).toEqual("MetadataRepository")
		})

		it("should return metadata", () => {
			const metadata = [Metadata.from({ name: "a", parent: null, author_id: "a-a-a-a-a" })]

			metadataRepository.put(metadata)

			const result = metadataRepository.get().unwrap()

			expect(result).toEqual(metadata)
		})
	})

	describe("put", () => {
		it("should return void if metadata is correct", () => {
			const metadata = [Metadata.from({ name: "a", parent: null, author_id: "a-a-a-a-a" })]
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
			expect(spec).toEqual(".put: null")
			expect(code).toEqual(RRR.enum.EINVAL)
			expect(location).toEqual("MetadataRepository")
		})
	})
})
