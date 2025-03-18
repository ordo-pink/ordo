/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { Button, MetadataIcon } from "@ordo-pink/maoka-components"
import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"

import LogoImage from "../../../../static/logo.png"

const StyledEmptyEditor = MaokaStyled.Tags.div("file-editor_empty")

export const EmptyEditor = StyledEmptyEditor(({ use }) => {
	const commands = use(MaokaOrdo.Jabs.get_commands)
	const metadata_query = use(MaokaOrdo.Jabs.get_metadata_query)

	return () => [
		StyledLogo(({ element }) => {
			if (MaokaDOM.is_maoka_dom_element(element))
				element.innerHTML = `<img class="file-editor_empty_logo" src="${LogoImage}" />`
		}),
		StyledHeader(() => () => "Quick Actions"),
		StyledButtonWrapper(() => () => [
			Button.Neutral({
				text: "Create File",
				hotkey: "mod+shift+c",
				on_click: () => commands.emit("cmd.metadata.show_create_modal", null),
			}),
			// TODO Extract to command
			Button.Neutral({
				on_click: () =>
					metadata_query.get().cata(
						R.catas.if_ok(metadata =>
							commands.emit("cmd.application.command_palette.show", {
								items: metadata.map((metadata: Ordo.Metadata.Instance): Ordo.CommandPalette.Item => {
									const path = metadata_query
										.get_ancestors(metadata.get_fsid())
										.pipe(R.ops.map(ancestors => get_path(ancestors)))
										.pipe(R.ops.map(path => `/ ${path}`))
										.cata(R.catas.or_else(() => "/"))

									return {
										value: metadata.get_fsid(),
										readable_name: metadata.get_name() as Ordo.I18N.TranslationKey,
										render_custom_info: () => FilePath(() => () => path),
										render_icon: () => MetadataIcon({ metadata }),
									}
								}),
								max_items: 50,
								on_select: item => commands.emit("cmd.file_editor.open_file", item.value),
							}),
						),
					),
				text: "Open File",
				hotkey: "mod+p",
			}),
		]),
	]
})

const StyledLogo = MaokaStyled.Tags.div()
const StyledHeader = MaokaStyled.Tags.h2("file-editor_empty_section_title")
const StyledButtonWrapper = MaokaStyled.Tags.div("file-editor_empty_buttons-section")

const get_path = (ancestors: Ordo.Metadata.Instance[]) =>
	Switch.OfTrue()
		.case(ancestors.length > 0, () => ancestors.map(ancestor => ancestor.get_name()).join(" / "))
		.default(() => "")

const FilePath = MaokaStyled.Tags.div("text-xs text-neutral-600 dark:text-neutral-400 w-fit whitespace-nowrap")
