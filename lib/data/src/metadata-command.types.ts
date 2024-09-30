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

import type { TResult } from "@ordo-pink/result"

import type {
	TCreateMetadataParams,
	TMetadata,
	TMetadataLabel,
	TMetadataProps,
} from "./metadata.types"
import type { FSID } from "./data.types"
import type { TMetadataQuery } from "./metadata-query.types"
import type { TMetadataRepository } from "./metadata-repository.types"
import type { TRrr } from "./metadata.errors"
import type { TUserQuery } from "./user-query.types"

export type TMetadatCommandConstructor = (
	metadata_repository: TMetadataRepository,
	metadata_query: TMetadataQuery,
	user_query: TUserQuery,
) => TMetadataCommand
export type TMetadataCommandStatic = { of: TMetadatCommandConstructor }

export type TMetadataCommand = {
	create: (
		params: TCreateMetadataParams,
	) => TResult<void, TRrr<"EAGAIN" | "EEXIST" | "EINVAL" | "ENOENT">>

	replace: (value: TMetadata) => TResult<void, TRrr<"EAGAIN" | "ENOENT" | "EINVAL">>

	remove: (fsid: FSID) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	append_child: (
		fsid: FSID,
		child: FSID,
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST" | "ENXIO">>

	add_labels: (
		fsid: FSID,
		...labels: (TMetadataLabel | string)[]
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	remove_labels: (
		fsid: FSID,
		...labels: string[]
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	replace_labels: (
		fsid: FSID,
		labels: (TMetadataLabel | string)[],
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	set_size: (fsid: FSID, size: number) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	add_links: (fsid: FSID, ...links: FSID[]) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	remove_links: (
		fsid: FSID,
		...links: FSID[]
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	replace_links: (fsid: FSID, links: FSID[]) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	set_parent: (
		fsid: FSID,
		parent: FSID | null,
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT" | "ENXIO" | "EEXIST">>

	set_name: (
		fsid: FSID,
		name: string,
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST">>

	set_property: <$TProps extends TMetadataProps, $TKey extends keyof $TProps>(
		fsid: FSID,
		key: $TKey,
		value: $TProps[$TKey],
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	remove_property: <$TProps extends TMetadataProps, $TKey extends keyof $TProps>(
		fsid: FSID,
		key: $TKey,
	) => TResult<void, TRrr<"EAGAIN" | "EINVAL" | "ENOENT">>
}
