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

import { BsFileEarmarkMinus } from "@ordo-pink/frontend-icons"
import { Dialog } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const RemoveFileModal = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("div", ({ use }) => {
		const { t } = use(MaokaOrdo.Jabs.Translations)
		const commands = use(MaokaOrdo.Jabs.Commands.get)

		const t_title = t("t.file_explorer.modals.remove_file.title")
		const t_message = t("t.file_explorer.modals.remove_file.message")

		return () =>
			Dialog({
				title: t_title,
				render_icon: div => void div.appendChild(BsFileEarmarkMinus() as SVGSVGElement),
				action: () => {
					commands.emit("cmd.metadata.remove", fsid)
					commands.emit("cmd.application.modal.hide")
				},
				action_text: "OK", // TODO Add translations
				body: () => t_message,
			})
	})
