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

import { result } from "@ordo-pink/oss-result"
import { create } from "@ordo-pink/oss-zags"

import { rrr } from "../../../../core/src/rrr"

// TODO Move to frontend-app
export const MetadataRepository: Ordo.Metadata.RepositoryStatic = {
	Of: metadata$ => {
		const version_zags = create({ version: 0 })
		metadata$.marry((_, is_update) => void (is_update && version_zags.update("version", i => i + 1)))

		return {
			get: () =>
				result
					.Try(() => metadata$.select("items"))
					.pipe(result.ops.chain(result.FromNullable))
					.pipe(result.ops.err_map(() => rrr.codes.eagain("Loading"))),

			put: metadata =>
				result
					.FromNullable(metadata)
					.pipe(result.ops.chain(() => result.If(Array.isArray(metadata), { T: () => metadata }))) // TODO: Add validations
					.pipe(result.ops.map(metadata => metadata.map(i => i.to_dto())))
					.pipe(result.ops.chain(() => result.Try(() => metadata$.update("items", () => metadata), console.error)))
					.pipe(result.ops.err_map(() => rrr.codes.einval("MetadataRepository could not put metadata", metadata))),

			get $() {
				return version_zags
			},
		}
	},
}
