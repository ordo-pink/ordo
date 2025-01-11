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
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { FileEditorSidebarItem } from "./components/file-editor-sidebar-item.component"

export const FileEditorSidebar = Maoka.create("div", ({ use }) => {
	use(MaokaJabs.set_class("flex flex-col p-2 h-full overflow-y-auto", "file_editor_sidebar"))

	const get_metadata = use(MaokaOrdo.Jabs.Metadata.get$())

	return () =>
		get_metadata()
			.filter(i => i.is_root_child())
			.map(i => FileEditorSidebarItem(i.get_fsid()))
})
