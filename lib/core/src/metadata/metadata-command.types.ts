/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { TResult } from "@ordo-pink/result"

export type TMetadatCommandConstructor = (
	metadata_repository: Ordo.Metadata.Repository,
	metadata_query: Ordo.Metadata.Query,
	user_query: Ordo.User.Query,
) => TMetadataCommand
export type TMetadataCommandStatic = { of: TMetadatCommandConstructor }

export type TMetadataCommand = {
	create: (
		params: Ordo.Metadata.CreateParams & { author_id: Ordo.User.ID },
	) => TResult<void, Ordo.Rrr<"EAGAIN" | "EEXIST" | "EINVAL" | "ENOENT">>

	replace: (value: Ordo.Metadata.Instance) => TResult<void, Ordo.Rrr<"EAGAIN" | "ENOENT" | "EINVAL">>

	remove: (fsid: Ordo.Metadata.FSID) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	append_child: (
		fsid: Ordo.Metadata.FSID,
		child: Ordo.Metadata.FSID,
	) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST" | "ENXIO">>

	add_labels: (
		fsid: Ordo.Metadata.FSID,
		...labels: Ordo.Metadata.Label[]
	) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	remove_labels: (
		fsid: Ordo.Metadata.FSID,
		...labels: Ordo.Metadata.Label[]
	) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	replace_labels: (
		fsid: Ordo.Metadata.FSID,
		labels: Ordo.Metadata.Label[],
	) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	set_size: (fsid: Ordo.Metadata.FSID, size: number) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	add_links: (
		fsid: Ordo.Metadata.FSID,
		...links: Ordo.Metadata.FSID[]
	) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	remove_links: (
		fsid: Ordo.Metadata.FSID,
		...links: Ordo.Metadata.FSID[]
	) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	replace_links: (
		fsid: Ordo.Metadata.FSID,
		links: Ordo.Metadata.FSID[],
	) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	set_parent: (
		fsid: Ordo.Metadata.FSID,
		parent: Ordo.Metadata.FSID | null,
	) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT" | "ENXIO" | "EEXIST">>

	set_name: (fsid: Ordo.Metadata.FSID, name: string) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST">>

	set_property: <$TProps extends Ordo.Metadata.Props, $TKey extends keyof $TProps>(
		fsid: Ordo.Metadata.FSID,
		key: $TKey,
		value: $TProps[$TKey],
	) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

	remove_property: <$TProps extends Ordo.Metadata.Props, $TKey extends keyof $TProps>(
		fsid: Ordo.Metadata.FSID,
		key: $TKey,
	) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>
}
