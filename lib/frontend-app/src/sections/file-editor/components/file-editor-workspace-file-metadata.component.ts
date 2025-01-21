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

import { Input, Label, Link, MetadataIcon } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

// TODO Refresh if metadata was changed from the outside
export const FileMetadata = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("div", ({ use }) => {
		const fsid = metadata.get_fsid()
		const name = metadata.get_name()

		const commands = use(MaokaOrdo.Jabs.get_commands)

		use(MaokaJabs.add_class("p-2 flex flex-col gap-y-1"))

		return () => [
			TitleSection(() => [
				MetadataIcon({ metadata }),

				Input.Text({
					transparent: true,
					custom_class:
						"hover:bg-gradient-to-br hover:from-neutral-100 hover:to-stone-100 hover:dark:from-neutral-700 hover:dark:to-stone-700 rounded-sm font-extrabold !text-2xl cursor-text !w-full !shadow-none",
					initial_value: name,
					on_input: event => {
						const target = event.target as HTMLInputElement
						commands.emit("cmd.metadata.rename", { fsid, new_name: target.value })
					},
				}),
			]),
			LabelsSection(fsid),
			OutgoingLinksSection(fsid),
			IncomingLinksSection(fsid),
		]
	})

// TODO Move to center, add info label
const LabelsSection = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("div", ({ use }) => {
		const label_section =
			"flex flex-wrap px-1 gap-1 cursor-pointer rounded-sm hover:bg-gradient-to-br hover:from-neutral-100 hover:to-stone-100 hover:dark:from-neutral-700 hover:dark:to-stone-700 py-1 min-h-7"

		use(MaokaJabs.set_class(label_section))
		use(MaokaJabs.listen("onclick", () => handle_click()))

		const commands = use(MaokaOrdo.Jabs.get_commands)
		const get_metadata = use(MaokaOrdo.Jabs.Metadata.get_by_fsid$(fsid))

		const handle_click = () => commands.emit("cmd.metadata.show_edit_labels_palette", fsid)

		return () => {
			const metadata = get_metadata()
			const labels = metadata?.get_labels() ?? []

			return labels.length > 0
				? metadata?.get_labels().map(label => Label(label, commands.emit, metadata))
				: ActionPlaceholder(() => "Add labels...") // TODO Translations
		}
	})

const ActionPlaceholder = Maoka.styled("div", { class: "text-sm text-neutral-400 dark:text-neutral-600" })
const TitleSection = Maoka.styled("div", { class: "flex w-full space-x-2 items-center text-2xl" })

const OutgoingLinksSection = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("div", ({ use }) => {
		const label_section =
			"flex px-1 flex-wrap gap-2 cursor-pointer rounded-sm hover:bg-gradient-to-br hover:from-neutral-100 hover:to-stone-100 hover:dark:from-neutral-700 hover:dark:to-stone-700 py-1 min-h-7"

		use(MaokaJabs.set_class(label_section))
		use(MaokaJabs.listen("onclick", () => handle_click()))

		const commands = use(MaokaOrdo.Jabs.get_commands)
		const get_links = use(MaokaOrdo.Jabs.Metadata.get_outgoing_links$(fsid))

		const handle_click = () => commands.emit("cmd.metadata.show_edit_links_palette", fsid)

		return () => {
			const links = get_links()

			return links.length > 0
				? links.map(metadata => Link({ href: `/editor/${metadata.get_fsid()}`, children: metadata.get_name() }))
				: ActionPlaceholder(() => "Add outgoing links...") // TODO Translations
		}
	})

const IncomingLinksSection = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("div", ({ use }) => {
		const links_section = "flex px-1 flex-wrap gap-2 rounded-sm py-1 min-h-7"

		use(MaokaJabs.set_class(links_section))

		const get_links = use(MaokaOrdo.Jabs.Metadata.get_incoming_links$(fsid))

		return () => {
			const links = get_links()

			return links.length > 0
				? links.map(metadata => Link({ href: `/editor/${metadata.get_fsid()}`, children: metadata.get_name() }))
				: ActionPlaceholder(() => "No incoming links.") // TODO Translations
		}
	})
