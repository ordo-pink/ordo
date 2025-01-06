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

import { Maoka, type TMaokaComponent } from "@ordo-pink/maoka"
import { is_false, is_true, noop } from "@ordo-pink/tau"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"

import { FileEditorSidebarDirectory } from "./file-editor-sidebar-directory.component"
import { FileEditorSidebarFile } from "./file-editor-sidebar-file.component"

export const FileEditorSidebarItem = (initial_metadata: Ordo.Metadata.Instance, depth = 0): TMaokaComponent =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		let metadata = initial_metadata

		use(MaokaJabs.set_class("cursor-pointer"))

		const metadata_query = use(MaokaOrdo.Jabs.get_metadata_query)

		const divorce_metadata_query_version = metadata_query.$.marry(() => {
			metadata_query
				.get_by_fsid(initial_metadata.get_fsid())
				.pipe(R.ops.chain(R.FromNullable))
				.pipe(R.ops.chain(x => R.If(!initial_metadata.equals(x), { T: () => x })))
				.pipe(R.ops.map(x => void (metadata = x)))
				.cata(R.catas.if_ok(() => void refresh()))
		})

		on_unmount(divorce_metadata_query_version)

		return () =>
			Switch.Match(metadata_query.has_children(metadata.get_fsid()).unwrap())
				.case(is_true, () => FileEditorSidebarDirectory(metadata, depth))
				.case(is_false, () => FileEditorSidebarFile(metadata, depth))
				.default(noop)
	})
