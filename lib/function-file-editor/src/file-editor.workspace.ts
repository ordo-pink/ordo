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

import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Metadata } from "@ordo-pink/core"
import { R } from "@ordo-pink/result"

import { FileMetadata } from "./components/file-editor-workspace-file-metadata.component"
import { RenderPicker } from "./components/file-editor-workspace-render-picker.component"
import { TitleSetter } from "./components/file-editor-workspace-title-setter.component"

const FileEditor = {
	FileMetadata,
	RenderPicker,
	TitleSetter,
}

export const FileEditorWorkspace = Maoka.create("div", ({ use }) => {
	const get_route_params = use(MaokaOrdo.Jabs.get_route_params$)
	const metadata_query = use(MaokaOrdo.Jabs.get_metadata_query)

	return () =>
		R.FromNullable(get_route_params())
			.pipe(R.ops.chain(({ fsid }) => R.FromNullable(fsid)))
			.pipe(R.ops.chain(validate_fsid))
			.pipe(R.ops.chain(metadata_query.get_by_fsid))
			.pipe(R.ops.chain(R.FromNullable))
			.cata({
				Ok: metadata => [
					FileEditor.TitleSetter(metadata),
					FileEditor.FileMetadata(metadata),
					FileEditor.RenderPicker(metadata),
				],
				Err: () => FileEditor.TitleSetter(null), // TODO No selected file component
			})
})

// --- Internal ---

const validate_fsid = (str: string) => R.If(Metadata.Validations.is_fsid(str), { T: () => str as Ordo.Metadata.FSID })
