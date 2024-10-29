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

import { CurrentUserReference, Input, MetadataIcon } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const FileMetadata = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("div", ({ use }) => {
		const fsid = metadata.get_fsid()
		const name = metadata.get_name()
		const last_update = metadata.get_updated_at()

		const { emit } = use(MaokaOrdo.Jabs.Commands)

		use(MaokaJabs.add_class("p-2"))

		return () => [
			TitleSection(() => [
				MetadataIcon({ metadata }),

				Input.Text({
					custom_class: "font-extrabold !text-2xl cursor-text !w-full !bg-transparent !shadow-none",
					initial_value: name,
					on_input: event => {
						const target = event.target as HTMLInputElement

						emit("cmd.metadata.rename", { fsid, new_name: target.value })
					},
				}),
			]),
			AuthorSection(() => [CurrentUserReference, Timestamp(() => last_update.toLocaleString())]),
		]
	})

// TODO time?
const Timestamp = Maoka.styled("time")

const TitleSection = Maoka.styled("div", { class: "flex space-x-2 items-center text-2xl" })

const AuthorSection = Maoka.styled("div", { class: "p-1 flex space-x-2 items-center text-sm" })
