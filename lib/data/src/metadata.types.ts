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

import type { TOption } from "@ordo-pink/option"

import type { FSID, UserID } from "./data.types"
import { MetadataValidations } from "./metadata-validations"

export type TMetadataProps = Readonly<Record<string, any>>

export type TCreateMetadataParams<_TProps extends TMetadataProps = TMetadataProps> = Partial<
	Omit<
		TMetadataDTO<_TProps>,
		"created_by" | "created_at" | "size" | "updated_at" | "updated_by" | "fsid"
	>
> &
	Pick<TMetadataDTO<_TProps>, "name" | "parent"> & { author_id: UserID }

export type TMetadataStatic = {
	from: <_TProps extends TMetadataProps = TMetadataProps>(
		params: TCreateMetadataParams<_TProps>,
	) => TMetadata<_TProps>
	of: <_TProps extends TMetadataProps = TMetadataProps>(
		dto: TMetadataDTO<_TProps>,
	) => TMetadata<_TProps>
	Validations: typeof MetadataValidations
}

export type TMetadataLabel = {
	name: string
	readable_name: string
	color: string
}

export type TMetadataDTO<_TProps extends TMetadataProps = TMetadataProps> = Readonly<{
	fsid: FSID
	name: string
	parent: FSID | null
	links: FSID[]
	labels: (TMetadataLabel | string)[]
	type: string
	created_at: number
	created_by: UserID
	updated_at: number
	updated_by: UserID
	size: number
	props?: _TProps
}>

export type TMetadata<_TProps extends TMetadataProps = TMetadataProps> = {
	get_fsid: () => FSID
	get_name: () => string
	get_parent: () => FSID | null
	is_root_child: () => boolean
	is_child_of: (parent: FSID) => boolean
	get_links: () => FSID[]
	has_links: () => boolean
	has_link_to: (link: FSID) => boolean
	get_labels: () => (TMetadataLabel | string)[]
	has_labels: () => boolean
	has_label: (label: string) => boolean
	get_type: () => string
	get_created_at: () => Date
	get_created_by: () => UserID
	get_updated_at: () => Date
	get_updated_by: () => UserID
	get_size: () => number
	get_readable_size: () => string
	get_property: <_TKey_ extends keyof _TProps>(key: _TKey_) => TOption<NonNullable<_TProps[_TKey_]>>
	to_dto: () => TMetadataDTO<_TProps>
	equals: (other_metadata?: TMetadata) => boolean
	is_hidden: () => boolean
}
