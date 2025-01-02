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

import { BsCaretDown, BsCaretRight } from "@ordo-pink/frontend-icons"
import { Maoka, TMaokaElement, type TMaokaJab } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Metadata } from "@ordo-pink/core"
import { MetadataIcon } from "@ordo-pink/maoka-components"
import { R } from "@ordo-pink/result"
import { type TOption } from "@ordo-pink/option"

import { FileEditorSidebarItem } from "./file-editor-sidebar-item.component"
import { equals } from "ramda"

const expanded_state = {} as Record<Ordo.Metadata.FSID, boolean>

const is_fsid = Metadata.Validations.is_fsid

export const FileEditorSidebarDirectory = (metadata: Ordo.Metadata.Instance, depth = 0) =>
	Maoka.create("div", ({ use, refresh }) => {
		const fsid = metadata.get_fsid()

		const metadata_query = use(MaokaOrdo.Jabs.get_metadata_query)
		const get_route_params = use(MaokaOrdo.Jabs.RouteParams)

		const on_caret_click = (event: MouseEvent) => {
			event.stopPropagation()
			expanded_state[fsid] = !expanded_state[fsid]
			void refresh()
		}

		return () => {
			// Expand directory if it is an ancestor of the metadata that is identified by the fsid
			// provided in route params (opened in the FileEditor workspace). It should also cover
			// cases when user navigates to another file with a link.
			// TODO check if it actually expands directories when navigating via a link.
			R.Try(get_route_params)
				.pipe(R.ops.chain(({ fsid }) => R.FromNullable(fsid)))
				.pipe(R.ops.chain(x => R.If(is_fsid(x), { T: () => x as Ordo.Metadata.FSID })))
				.pipe(R.ops.chain(fsid => metadata_query.get_ancestors(fsid)))
				.cata(R.catas.if_ok(as => as.forEach(a => void (expanded_state[a.get_fsid()] = true))))

			return metadata_query
				.get_children(fsid)
				.pipe(
					// TODO Move to Metadata + add sorting from File Explorer (by name with numbers)
					R.ops.map(is =>
						is.sort((a, b) => {
							const a_dir = metadata_query.has_children(a.get_fsid()).cata(R.catas.or_else(() => false))

							const b_dir = metadata_query.has_children(b.get_fsid()).cata(R.catas.or_else(() => false))

							if (a_dir && !b_dir) return -1
							if (b_dir && !a_dir) return 1

							return a.get_name().localeCompare(b.get_name())
						}),
					),
				)
				.cata(
					R.catas.if_ok(is => [
						FileEditorDirectoryName(metadata, depth, on_caret_click),
						FileEditorDirectoryChildren(metadata, is, depth),
					]),
				)
		}
	})

// --- Internal ---

const FileEditorDirectoryChildren = (metadata: Ordo.Metadata.Instance, children: Ordo.Metadata.Instance[], depth: number) =>
	R.If(expanded_state[metadata.get_fsid()])
		.pipe(R.ops.map(() => depth + 1))
		.pipe(R.ops.map(depth => () => children.map(i => FileEditorSidebarItem(i, depth))))
		.cata(R.catas.if_ok(children => Maoka.create("div", () => children)))

const FileEditorDirectoryName = (
	metadata: Ordo.Metadata.Instance,
	depth: number,
	on_caret_click: (event: MouseEvent) => void,
) =>
	Maoka.create("div", ({ use, refresh }) => {
		const fsid = metadata.get_fsid()

		let route: Ordo.Router.Route | null = null
		const $ = use(MaokaOrdo.Jabs.CurrentRoute$)
		const handle_current_route_change = (value: TOption<Ordo.Router.Route>) =>
			R.FromOption(value, () => null)
				.pipe(R.ops.chain(r => R.If(r.path !== route?.path, { T: () => r, F: () => r })))
				.pipe(R.ops.chain(r => R.If(!equals(r, route), { T: () => r, F: () => r })))
				.cata({
					Ok: updated_route => {
						route = updated_route
						void refresh()
					},
					Err: null_or_same_route => {
						// Skip since routes are equal
						if (null_or_same_route || !route) return

						route = null_or_same_route
						void refresh()
					},
				})

		use(MaokaOrdo.Jabs.subscribe($, handle_current_route_change))

		const commands = use(MaokaOrdo.Jabs.get_commands.get)

		use(MaokaJabs.listen("onclick", () => commands.emit("cmd.file_editor.open_file", fsid)))
		use(MaokaJabs.set_style({ paddingLeft: `${depth + 0.5}rem`, paddingRight: "0.5rem" }))
		use(MaokaJabs.set_class(...file_editor_sidebar_directory_name_classes))

		return () => {
			if (route?.params?.fsid === fsid) use(MaokaJabs.add_class(directory_active))
			else use(MaokaJabs.remove_class(...directory_active.split(" ")))

			return [
				FileEditorDirectoryNameText(metadata),
				FileEditorDirectoryNameCaret(fsid, MaokaJabs.listen("onclick", on_caret_click)),
			]
		}
	})

const directory_active =
	"bg-gradient-to-tr from-pink-300 to-rose-300 dark:from-pink-900 from-pink-300 to-rose-300 dark:to-rose-900"

const file_editor_sidebar_directory_name_classes = [
	"flex justify-between items-center w-full rounded-sm",
	"hover:bg-gradient-to-r hover:from-neutral-300 hover:to-stone-300",
	"hover:dark:bg-gradient-to-r hover:dark:from-neutral-700 hover:dark:to-stone-700",
	"file_editor_sidebar_directory_name",
]

const file_editor_sidebar_directory_name_text_classes = [
	"flex space-x-2 items-center cursor-pointer",
	"file_editor_sidebar_directory_name_text",
]

const FileEditorDirectoryNameText = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class(...file_editor_sidebar_directory_name_text_classes))

		return () => [
			Maoka.create("div", () => () => MetadataIcon({ metadata, show_emoji_picker: false })),
			Maoka.create("div", ({ use }) => {
				use(MaokaJabs.set_class("text-ellipsis line-clamp-1"))
				return () => metadata.get_name()
			}),
		]
	})

const FileEditorDirectoryNameCaret = (fsid: Ordo.Metadata.FSID, click_listener: TMaokaJab) =>
	Maoka.create("div", ({ use }) => {
		use(click_listener)
		use(MaokaJabs.set_class("cursor-pointer hover:scale-150 transition-all"))

		return () =>
			expanded_state[fsid]
				? (BsCaretDown("p-1 shrink-0 size-5") as TMaokaElement)
				: (BsCaretRight("p-1 shrink-0 size-5 rotate-180") as TMaokaElement)
	})
