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

import type { Observable } from "rxjs"

import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"

import type { FSID } from "./data.types"
import type { TMetadata } from "./metadata.types"
import type { TMetadataRepository } from "./metadata-repository.types"
import type { TRrr } from "./metadata.errors"

export type TMetadataQueryOptions = { show_hidden?: boolean }

export type TMetadataQueryStatic = {
	of: (metadataRepository: TMetadataRepository) => TMetadataQuery
}

export type TMetadataQuery = {
	get $(): Observable<number>

	get: (options?: TMetadataQueryOptions) => TResult<TMetadata[], TRrr<"EAGAIN">>

	get_by_fsid: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TOption<TMetadata>, TRrr<"EAGAIN" | "EINVAL">>

	total: (options?: TMetadataQueryOptions) => TResult<number, TRrr<"EAGAIN">>

	get_by_name_and_parent: (
		name: string,
		parent: FSID | null,
		options?: TMetadataQueryOptions,
	) => TResult<TOption<TMetadata>, TRrr<"EAGAIN" | "EINVAL">>

	get_by_labels: (
		labels: string[],
		options?: TMetadataQueryOptions,
	) => TResult<TMetadata[], TRrr<"EAGAIN" | "EINVAL">>

	has_incoming_links: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	get_incoming_links: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TMetadata[], TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	get_parent: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TOption<TMetadata>, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	get_ancestors: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<TMetadata[], TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	has_ancestor: (
		fsid: FSID,
		ancestor: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	has_child: (
		fsid: FSID,
		child: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	has_children: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	get_children: (
		fsid: FSID | null,
		options?: TMetadataQueryOptions,
	) => TResult<TMetadata[], TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	has_descendent: (
		fsid: FSID,
		descendent: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	has_descendents: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
	) => TResult<boolean, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	get_descendents: (
		fsid: FSID,
		options?: TMetadataQueryOptions,
		accumulator?: TMetadata[],
	) => TResult<TMetadata[], TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	// TODO: toTree: (source: TFSID | null) => typeof source extends null ? TMetadataBranch[] : TMetadataBranch

	// TODO: toGraph: (
	// 	source: TFSID | null,
	// ) => typeof source extends null ? TMetadataBranchWithLinks[] : TMetadataBranchWithLinks
}

// export type TMetadataNode = TMetadataBranch | TMetadataLeaf

// export type TMetadataWithLinksNode = TMetadataBranchWithLinks | TMetadataLeafWithLinks

// export type TMetadataBranch = {
// 	isBranch: true
// 	isLeaf: false
// 	hasLinks: false
// 	depth: number
// 	parent: TMetadataBranch | null
// 	path: string
// 	data: TMetadata
// 	children: TMetadataNode[]
// }

// export type TMetadataBranchWithLinks = TMetadataBranch & {
// 	hasLinks: true
// 	links: TMetadata[]
// 	parent: TMetadataBranchWithLinks
// 	children: TMetadataWithLinksNode[]
// }

// export type TMetadataLeaf = {
// 	isBranch: false
// 	isLeaf: true
// 	hasLinks: false
// 	depth: number
// 	parent: TMetadataBranch | null
// 	path: string
// 	data: TMetadata
// }

// export type TMetadataLeafWithLinks = TMetadataLeaf & {
// 	hasLinks: true
// 	links: TMetadata[]
// 	parent: TMetadataBranchWithLinks | null
// }
