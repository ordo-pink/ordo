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

import { Input, Label, MetadataIcon } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const FileMetadata = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("div", ({ use }) => {
		const fsid = metadata.get_fsid()
		const name = metadata.get_name()

		const commands = use(MaokaOrdo.Jabs.Commands)

		use(MaokaJabs.add_class("p-2"))

		return () => [
			TitleSection(() => [
				MetadataIcon({ metadata }),

				Input.Text({
					custom_class:
						"hover:dark:!bg-neutral-800 rounded-sm font-extrabold !text-2xl cursor-text !w-full !bg-transparent !shadow-none",
					initial_value: name,
					on_input: event => {
						const target = event.target as HTMLInputElement
						commands.emit("cmd.metadata.rename", { fsid, new_name: target.value })
					},
				}),
			]),
			LabelsSection(metadata.get_fsid()),
		]
	})

const LabelsSection = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("div", ({ use }) => {
		const label_section =
			"flex flex-wrap gap-1 cursor-pointer rounded-sm hover:dark:bg-neutral-800 py-1"

		use(MaokaJabs.set_class(label_section))
		use(MaokaJabs.listen("onclick", () => handle_click()))

		const commands = use(MaokaOrdo.Jabs.Commands)
		const get_metadata = use(MaokaOrdo.Jabs.Metadata.get_by_fsid(fsid))

		const handle_click = () => commands.emit("cmd.metadata.show_edit_labels_palette", fsid)

		return () =>
			get_metadata()
				?.get_labels()
				.map(label => Label(label, commands.emit))
	})

const TitleSection = Maoka.styled("div", { class: "flex w-full space-x-2 items-center text-2xl" })
