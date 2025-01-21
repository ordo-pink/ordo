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
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

import { FileEditorSidebarDirectory } from "./file-editor-sidebar-directory.component"
import { FileEditorSidebarFile } from "./file-editor-sidebar-file.component"

export const FileEditorSidebarItem = (fsid: Ordo.Metadata.FSID, depth = 0): TMaokaComponent =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("cursor-pointer"))

		const get_metadata = use(MaokaOrdo.Jabs.Metadata.get_by_fsid$(fsid))
		const get_metadata_has_children = use(MaokaOrdo.Jabs.Metadata.has_children$(fsid))

		return () => {
			const metadata = get_metadata()
			const has_children = get_metadata_has_children()

			return Switch.OfTrue()
				.case(!!metadata && has_children, () => FileEditorSidebarDirectory(metadata!, depth))
				.case(!!metadata && !has_children, () => FileEditorSidebarFile(metadata!, depth))
				.default(noop)
		}
	})
